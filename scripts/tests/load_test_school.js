import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
const schoolAdminReqDuration = new Trend('school_admin_req_duration', true);
const studentB2BReqDuration = new Trend('student_b2b_req_duration', true);
const failedRequests = new Rate('failed_requests_rate');
const successfulCreations = new Counter('successful_cv_creations');

export const options = {
  scenarios: {
    // 1. Dashboard Admin School : Surveillance et consultation des métriques / liste étudiants
    admin_monitoring: {
      executor: 'constant-vus',
      vus: 3,
      duration: '1m',
      exec: 'adminDashboardScenario',
      tags: { role: 'school_admin' },
    },

    // 2. Flux Étudiants B2B : Création concurrente de CVs (débit du SchoolCreditWallet)
    student_b2b_traffic: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 10 }, // Montée à 10 étudiants
        { duration: '30s', target: 25 }, // Montée à 25 étudiants
        { duration: '15s', target: 0 },  // Descente
      ],
      exec: 'studentB2BScenario',
      tags: { role: 'student' },
    },

    // 3. Import par lot (Bulk Invitations) : Test de pic ponctuel
    bulk_invitation_burst: {
      executor: 'per-vu-iterations',
      vus: 2,
      iterations: 1,
      startTime: '10s',
      exec: 'bulkInvitationScenario',
      tags: { role: 'bulk_import' },
    },
  },
  thresholds: {
    failed_requests_rate: ['rate<0.02'],       // Moins de 2% d'erreurs tolérées
    http_req_duration: ['p(95)<1500'],         // 95% des requêtes sous 1.5s
    school_admin_req_duration: ['p(95)<1000'], // Requêtes admin sous 1s
    student_b2b_req_duration: ['p(95)<2000'],  // Requêtes étudiant sous 2s
  },
};

const BASE_URL = __ENV.TARGET_URL || 'https://jobsira.com';
const ADMIN_COOKIE = __ENV.ADMIN_COOKIE || '';
const STUDENT_COOKIE = __ENV.STUDENT_COOKIE || '';

// Scénario A : Administrateur École (Stats & Liste des étudiants)
export function adminDashboardScenario() {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (ADMIN_COOKIE) {
    headers['Cookie'] = ADMIN_COOKIE;
  }

  group('School Admin - Dashboard', () => {
    // 1. Récupération des statistiques globales
    const resStats = http.get(`${BASE_URL}/api/b2b/school-admin/stats`, { headers });
    const statsOk = check(resStats, {
      'Admin Stats: status 200': (r) => r.status === 200,
      'Admin Stats: has school name': (r) => {
        try {
          return JSON.parse(r.body).school?.name !== undefined;
        } catch {
          return false;
        }
      },
    });

    failedRequests.add(!statsOk);
    schoolAdminReqDuration.add(resStats.timings.duration);

    sleep(1);

    // 2. Récupération de la liste des étudiants avec consommation
    const resStudents = http.get(`${BASE_URL}/api/b2b/school-admin/students`, { headers });
    const studentsOk = check(resStudents, {
      'Admin Students: status 200': (r) => r.status === 200,
      'Admin Students: contains list': (r) => {
        try {
          return Array.isArray(JSON.parse(r.body).students);
        } catch {
          return false;
        }
      },
    });

    failedRequests.add(!studentsOk);
    schoolAdminReqDuration.add(resStudents.timings.duration);

    if (studentsOk) {
      try {
        const studentsList = JSON.parse(resStudents.body).students;
        if (studentsList && studentsList.length > 0) {
          // Prendre un étudiant au hasard dans la liste
          const randomStudent = studentsList[Math.floor(Math.random() * studentsList.length)];
          
          sleep(1); // Simuler le temps de réflexion avant le clic

          // Simuler le clic sur "Voir les détails"
          const resDetails = http.get(`${BASE_URL}/api/b2b/school-admin/students/${randomStudent.id}`, { headers });
          const detailsOk = check(resDetails, {
            'Admin Student Details: status 200': (r) => r.status === 200,
          });
          failedRequests.add(!detailsOk);
          schoolAdminReqDuration.add(resDetails.timings.duration);
        }
      } catch (e) {
        // Ignorer les erreurs de parse
      }
    }

    sleep(2);
  });
}

// Scénario B : Étudiant B2B (Création de CV et débit du School Wallet)
export function studentB2BScenario() {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (STUDENT_COOKIE) {
    headers['Cookie'] = STUDENT_COOKIE;
  }

  group('Student - B2B CV Creation', () => {
    const timestamp = Date.now() + Math.floor(Math.random() * 10000);
    const payload = JSON.stringify({
      title: `CV Test Charge B2B ${timestamp}`,
      basics: {
        firstName: 'Student',
        lastName: `LoadTest-${__VU}`,
        email: `student-${__VU}-${timestamp}@school-test.com`,
        headline: 'Étudiant en informatique',
      },
      workExperience: [
        {
          company: 'Entreprise Test',
          position: 'Stagiaire Développeur',
          startDate: '2024-01',
          endDate: '2024-06',
          current: false,
          summary: 'Développement d fonctionnalités web et tests de charge.',
        },
      ],
      education: [
        {
          school: 'École Partenaire B2B',
          degree: 'Master Informatique',
          fieldOfStudy: 'Génie Logiciel',
          startDate: '2023-09',
          endDate: '2025-06',
        },
      ],
      skills: ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
      languages: ['Français', 'Anglais'],
      projects: [],
    });

    const resCV = http.post(`${BASE_URL}/api/cv`, payload, { headers });
    const cvOk = check(resCV, {
      'Student CV: status 200': (r) => r.status === 200,
      'Student CV: id returned': (r) => {
        try {
          return JSON.parse(r.body).id !== undefined;
        } catch {
          return false;
        }
      },
    });

    failedRequests.add(!cvOk);
    studentB2BReqDuration.add(resCV.timings.duration);

    if (cvOk) {
      successfulCreations.add(1);
    }

    sleep(1.5);
  });
}

// Scénario C : Import d'invitations en lot (Bulk Import)
export function bulkInvitationScenario() {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (ADMIN_COOKIE) {
    headers['Cookie'] = ADMIN_COOKIE;
  }

  group('School Admin - Bulk Import', () => {
    const batchSize = 10;
    const students = [];
    const batchTimestamp = Date.now();

    for (let i = 0; i < batchSize; i++) {
      students.push({
        email: `invite-${batchTimestamp}-${__VU}-${i}@testschool.org`,
        nom: `Nom${i}`,
        prenom: `Prenom${i}`,
      });
    }

    const payload = JSON.stringify({ students });
    const resBulk = http.post(`${BASE_URL}/api/b2b/school-admin/invitations/bulk`, payload, { headers });

    const bulkOk = check(resBulk, {
      'Bulk Import: status 200': (r) => r.status === 200,
      'Bulk Import: returns CSV': (r) => r.headers['Content-Type']?.includes('text/csv') || false,
    });

    failedRequests.add(!bulkOk);
    schoolAdminReqDuration.add(resBulk.timings.duration);

    sleep(3);
  });
}
