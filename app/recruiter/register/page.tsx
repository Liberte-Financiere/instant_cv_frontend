'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Gift,
  Shield,
  Loader2,
  CheckCircle2,
  Phone,
  Globe,
  MapPin,
  FileText,
  Users,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileCheck,
  Check,
  Edit2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  WEST_AFRICAN_COUNTRIES,
  DEFAULT_COUNTRY,
  DEFAULT_CITY,
  OTHER_LOCATION_OPTION,
  getCitiesForCountry,
} from '@/lib/data/west-africa-locations';

const SECTORS = [
  'Technologie & Informatique',
  'Banque & Assurance',
  'Santé & Médical',
  'BTP & Construction',
  'Commerce & Distribution',
  'Énergie & Mines',
  'Transport & Logistique',
  'Agriculture & Agroalimentaire',
  'Télécoms & Médias',
  'Éducation & Formation',
  'Services & Conseil',
  'Autre',
];

const COMPANY_SIZES = [
  { value: '1-10', label: '1 à 10 collaborateurs' },
  { value: '11-50', label: '11 à 50 collaborateurs' },
  { value: '51-200', label: '51 à 200 collaborateurs' },
  { value: '201+', label: 'Plus de 200 collaborateurs' },
];

export default function RecruiterRegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const errorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [maxStepReached, setMaxStepReached] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    companyName: '',
    companySector: 'Technologie & Informatique',
    companySize: '1-10',
    companyDescription: '',
    companyCountry: DEFAULT_COUNTRY,
    companyCity: DEFAULT_CITY,
    customCity: '',
    companyPhone: '',
    companyWebsite: '',
    companyTaxId: '',
  });

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [existingDocumentUrl, setExistingDocumentUrl] = useState<string | null>(null);
  const [rejectionNotice, setRejectionNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetch('/api/recruiter/status')
        .then((res) => res.json())
        .then(async (data) => {
          if (data.status === 'APPROVED' || data.role === 'RECRUITER') {
            await signOut({ callbackUrl: '/login?callbackUrl=/recruiter&message=recruiter_approved' });
            return;
          } else if (data.status === 'PENDING') {
            router.push('/recruiter/pending');
          } else if (data.status === 'REJECTED') {
            setRejectionNotice(
              data.rejectionReason || "Votre précédent dossier n'a pas été validé. Veuillez corriger vos informations."
            );
            if (data.company) {
              const country = data.company.country || DEFAULT_COUNTRY;
              const availableCities = getCitiesForCountry(country);
              const isKnownCity = availableCities.includes(data.company.city);

              setFormData((prev) => ({
                ...prev,
                companyName: data.company.name || '',
                companySector: data.company.sector || 'Technologie & Informatique',
                companyPhone: data.company.phone || '',
                companyCountry: country,
                companyCity: isKnownCity ? data.company.city : OTHER_LOCATION_OPTION,
                customCity: isKnownCity ? '' : (data.company.city || ''),
                companyWebsite: data.company.website || '',
                companyTaxId: data.company.taxId || '',
                companySize: data.company.size || '1-10',
                companyDescription: data.company.description || '',
              }));

              if (data.company.documentUrl) {
                setExistingDocumentUrl(data.company.documentUrl);
              }
            }
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingStatus(false));
    }
  }, [status, router]);

  const scrollToError = () => {
    setTimeout(() => {
      errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    const cities = getCitiesForCountry(country);
    const defaultCity = cities[0] || OTHER_LOCATION_OPTION;
    setFormData((prev) => ({
      ...prev,
      companyCountry: country,
      companyCity: defaultCity,
      customCity: '',
    }));
    if (error) setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

      if (!allowedMimes.includes(file.type)) {
        setError('Format de fichier non accepté. Veuillez choisir un document PDF ou une image (JPEG, PNG, WebP).');
        scrollToError();
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. La taille maximale autorisée est de 5 Mo.');
        scrollToError();
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setDocumentFile(file);
      setError('');
    }
  };

  const removeSelectedFile = () => {
    setDocumentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateStep1 = (): boolean => {
    if (!formData.companyName.trim() || formData.companyName.trim().length < 2) {
      setError("Le nom de l'entreprise doit comporter au moins 2 caractères.");
      scrollToError();
      return false;
    }
    if (!formData.companySector.trim()) {
      setError("Veuillez sélectionner un secteur d'activité.");
      scrollToError();
      return false;
    }
    if (formData.companyDescription.length > 500) {
      setError('La description ne doit pas dépasser 500 caractères.');
      scrollToError();
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!formData.companyCountry.trim()) {
      setError('Veuillez sélectionner votre pays.');
      scrollToError();
      return false;
    }

    const effectiveCity =
      formData.companyCity === OTHER_LOCATION_OPTION ? formData.customCity.trim() : formData.companyCity.trim();

    if (!effectiveCity || effectiveCity.length < 2) {
      setError('Veuillez préciser le nom de votre ville.');
      scrollToError();
      return false;
    }

    if (!formData.companyPhone.trim() || formData.companyPhone.trim().length < 6) {
      setError('Veuillez renseigner un numéro de téléphone professionnel valide (au moins 6 chiffres).');
      scrollToError();
      return false;
    }

    if (formData.companyWebsite.trim()) {
      const urlPattern = /^https?:\/\//i;
      if (!urlPattern.test(formData.companyWebsite.trim())) {
        setError("L'adresse du site web doit débuter par http:// ou https://");
        scrollToError();
        return false;
      }
    }

    if (!documentFile && !existingDocumentUrl) {
      setError('Veuillez joindre le document officiel de votre entreprise (RCCM ou IFU).');
      scrollToError();
      return false;
    }

    return true;
  };

  const goToStep = (step: 1 | 2 | 3) => {
    setError('');
    if (step === 2) {
      if (!validateStep1()) return;
    } else if (step === 3) {
      if (!validateStep1() || !validateStep2()) return;
    }
    setCurrentStep(step);
    if (step > maxStepReached) {
      setMaxStepReached(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep1() || !validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const effectiveCity =
        formData.companyCity === OTHER_LOCATION_OPTION ? formData.customCity.trim() : formData.companyCity.trim();

      const body = new FormData();
      body.append('companyName', formData.companyName.trim());
      body.append('companySector', formData.companySector.trim());
      body.append('companySize', formData.companySize);
      body.append('companyDescription', formData.companyDescription.trim());
      body.append('companyCountry', formData.companyCountry.trim());
      body.append('companyCity', effectiveCity);
      body.append('companyPhone', formData.companyPhone.trim());
      body.append('companyWebsite', formData.companyWebsite.trim());
      body.append('companyTaxId', formData.companyTaxId.trim());

      if (documentFile) {
        body.append('companyDocument', documentFile);
      }

      const res = await fetch('/api/recruiter/register', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'enregistrement de votre dossier.");
        scrollToError();
        return;
      }

      router.push('/recruiter/pending');
    } catch {
      setError('Erreur de connexion avec le serveur. Veuillez vérifier votre connexion et réessayer.');
      scrollToError();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoadingStatus) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const availableCities = getCitiesForCountry(formData.companyCountry);
  const effectiveCityDisplay =
    formData.companyCity === OTHER_LOCATION_OPTION
      ? formData.customCity.trim() || OTHER_LOCATION_OPTION
      : formData.companyCity;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto shadow-inner">
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Devenir Recruteur sur Jobsira
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Accédez aux profils qualifiés et publiez vos offres d'emploi. Chaque entreprise est vérifiée manuellement par notre équipe sous 24h ouvrées.
        </p>
      </div>

      {/* Notification de rejet précédent */}
      {rejectionNotice && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3.5 text-amber-950 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-amber-900">Motif de correction du dossier précédent :</p>
            <p className="text-xs text-amber-800 leading-relaxed">{rejectionNotice}</p>
          </div>
        </div>
      )}

      {/* Avantages plateforme */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Gift, title: '3 Déblocages offerts', text: 'Activés dès validation du compte', color: 'text-emerald-500' },
          { icon: Shield, title: 'Données protégées', text: 'Candidats réels et vérifiés', color: 'text-blue-500' },
          { icon: CheckCircle2, title: 'Validation sous 24h', text: 'Accompagnement dédié', color: 'text-purple-500' },
        ].map((item) => (
          <div key={item.title} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-center sm:text-left">
            <item.icon className={`w-6 h-6 ${item.color} mb-2 mx-auto sm:mx-0`} />
            <p className="font-bold text-slate-900 text-sm">{item.title}</p>
            <p className="text-slate-500 text-xs mt-0.5">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Stepper Navigation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          {[
            { step: 1 as const, label: 'Entreprise' },
            { step: 2 as const, label: 'Coordonnées & Justificatif' },
            { step: 3 as const, label: 'Récapitulatif' },
          ].map((item, idx, arr) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            const isClickable = item.step <= maxStepReached;

            return (
              <div key={item.step} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => isClickable && goToStep(item.step)}
                  disabled={!isClickable}
                  className={`flex items-center gap-2.5 text-left transition-all ${
                    isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isActive
                        ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : item.step}
                  </div>
                  <span
                    className={`hidden sm:inline text-xs font-semibold ${
                      isActive ? 'text-blue-600 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
                {idx < arr.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 transition-colors ${
                      currentStep > item.step ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Message d'erreur général */}
      {error && (
        <div
          ref={errorRef}
          role="alert"
          className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{error}</p>
        </div>
      )}

      {/* Étape 1 : Identité de l'entreprise */}
      {currentStep === 1 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Étape 1 : Identité de votre entreprise</h2>
            <p className="text-xs text-slate-500 mt-1">Présentez votre structure et votre domaine d'activité.</p>
          </div>

          <div className="space-y-5">
            {/* Nom de l'entreprise */}
            <div>
              <label htmlFor="companyName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nom de l'entreprise <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  autoComplete="organization"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Ex : Coris Bank International, FASOTECH SARL..."
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Secteur d'activité */}
              <div>
                <label htmlFor="companySector" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Secteur d'activité <span className="text-rose-500">*</span>
                </label>
                <select
                  id="companySector"
                  name="companySector"
                  value={formData.companySector}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  {SECTORS.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>

              {/* Taille de l'entreprise */}
              <div>
                <label htmlFor="companySize" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Taille salariale <span className="text-slate-400 font-normal">(Optionnel)</span>
                </label>
                <div className="relative">
                  <Users className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    {COMPANY_SIZES.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description courte */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="companyDescription" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Présentation courte de l'entreprise <span className="text-slate-400 font-normal">(Optionnel)</span>
                </label>
                <span className="text-xs text-slate-400">
                  {formData.companyDescription.length} / 500
                </span>
              </div>
              <textarea
                id="companyDescription"
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleInputChange}
                maxLength={500}
                rows={4}
                placeholder="Décrivez en quelques lignes les activités de votre entreprise, vos valeurs ou vos projets de recrutement..."
                className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="button"
              onClick={() => goToStep(2)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              Étape suivante : Coordonnées & Justificatif
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Étape 2 : Coordonnées & Justificatif légal */}
      {currentStep === 2 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Étape 2 : Coordonnées et Justificatif d'entreprise</h2>
            <p className="text-xs text-slate-500 mt-1">
              Renseignez vos coordonnées de contact et joignez votre justificatif officiel (RCCM ou IFU).
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Pays */}
              <div>
                <label htmlFor="companyCountry" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pays <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <select
                    id="companyCountry"
                    name="companyCountry"
                    value={formData.companyCountry}
                    onChange={handleCountryChange}
                    className="w-full h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    {WEST_AFRICAN_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ville */}
              <div>
                <label htmlFor="companyCity" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Ville <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  <select
                    id="companyCity"
                    name="companyCity"
                    value={formData.companyCity}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>

                  {formData.companyCity === OTHER_LOCATION_OPTION && (
                    <input
                      id="customCity"
                      type="text"
                      name="customCity"
                      value={formData.customCity}
                      onChange={handleInputChange}
                      placeholder="Précisez le nom de votre ville..."
                      required
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  )}
                </div>
              </div>

              {/* Téléphone professionnel */}
              <div>
                <label htmlFor="companyPhone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Téléphone professionnel <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    id="companyPhone"
                    type="tel"
                    name="companyPhone"
                    autoComplete="tel"
                    value={formData.companyPhone}
                    onChange={handleInputChange}
                    placeholder="Ex : +226 25 30 00 00"
                    required
                    minLength={6}
                    maxLength={30}
                    className="w-full h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Site Web */}
              <div>
                <label htmlFor="companyWebsite" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Site web ou lien LinkedIn <span className="text-slate-400 font-normal">(Optionnel)</span>
                </label>
                <div className="relative">
                  <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    id="companyWebsite"
                    type="url"
                    name="companyWebsite"
                    autoComplete="url"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    placeholder="https://votre-entreprise.com"
                    className="w-full h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Numéro RCCM / IFU optionnel */}
            <div>
              <label htmlFor="companyTaxId" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Numéro RCCM ou N° IFU <span className="text-slate-400 font-normal">(Optionnel)</span>
              </label>
              <div className="relative">
                <FileText className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="companyTaxId"
                  type="text"
                  name="companyTaxId"
                  value={formData.companyTaxId}
                  onChange={handleInputChange}
                  placeholder="Ex : BF-OUA-01-2023-B12-00000 ou IFU 00012345X"
                  className="w-full h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Téléversement du document justificatif */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Document justificatif officiel (RCCM / IFU) <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500">
                Fournissez une copie scannée de votre RCCM ou certificat IFU pour valider l'existence légale de votre entreprise.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                id="companyDocument"
                name="companyDocument"
                accept=".pdf,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {!documentFile && !existingDocumentUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Cliquez pour choisir votre document (PDF ou image)
                  </p>
                  <p className="text-xs text-slate-400">
                    Formats acceptés : PDF, JPEG, PNG, WebP (Maximum 5 Mo)
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 bg-slate-50 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {documentFile ? documentFile.name : 'Document déjà téléversé précédemment'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {documentFile
                          ? `${(documentFile.size / (1024 * 1024)).toFixed(2)} Mo`
                          : 'Prêt pour vérification'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      Remplacer
                    </button>
                    {documentFile && (
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Supprimer le fichier sélectionné"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => goToStep(1)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <Button
              type="button"
              onClick={() => goToStep(3)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              Étape suivante : Récapitulatif
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Étape 3 : Récapitulatif et Soumission finale */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Étape 3 : Récapitulatif de votre dossier</h2>
            <p className="text-xs text-slate-500 mt-1">
              Veuillez vérifier l'exactitude des informations avant de soumettre votre dossier pour validation.
            </p>
          </div>

          <div className="space-y-4">
            {/* Bloc 1 : Identité */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Identité de l'entreprise
                </h3>
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Modifier
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Nom légal</span>
                  <span className="font-bold text-slate-800">{formData.companyName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Secteur d'activité</span>
                  <span className="font-bold text-slate-800">{formData.companySector}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Taille salariale</span>
                  <span className="text-slate-700">
                    {COMPANY_SIZES.find((s) => s.value === formData.companySize)?.label || formData.companySize}
                  </span>
                </div>
                {formData.companyDescription && (
                  <div className="sm:col-span-2">
                    <span className="text-xs text-slate-400 block">Présentation</span>
                    <p className="text-xs text-slate-700 leading-relaxed mt-0.5 whitespace-pre-wrap">
                      {formData.companyDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bloc 2 : Coordonnées */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Localisation & Contact
                </h3>
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Modifier
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Pays & Ville</span>
                  <span className="font-bold text-slate-800">
                    {formData.companyCountry}, {effectiveCityDisplay}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Téléphone professionnel</span>
                  <span className="font-bold text-slate-800">{formData.companyPhone}</span>
                </div>
                {formData.companyWebsite && (
                  <div>
                    <span className="text-xs text-slate-400 block">Site internet</span>
                    <span className="text-blue-600 font-medium truncate block">{formData.companyWebsite}</span>
                  </div>
                )}
                {formData.companyTaxId && (
                  <div>
                    <span className="text-xs text-slate-400 block">Numéro RCCM / IFU</span>
                    <span className="font-bold text-slate-800">{formData.companyTaxId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bloc 3 : Justificatif légal */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  Document justificatif
                </h3>
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Modifier
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-800">
                    {documentFile ? documentFile.name : 'Document légal prêt pour vérification'}
                  </p>
                  <p className="text-slate-500">
                    {documentFile
                      ? `${(documentFile.size / (1024 * 1024)).toFixed(2)} Mo • Fichier sélectionné`
                      : 'Pièce justificative enregistrée'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              En soumettant ce dossier, vous certifiez l'exactitude des informations fournies. Notre équipe vérifie chaque dossier sous 24h ouvrées. Vous recevrez une notification par email dès l'activation de vos accès recruteur.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => goToStep(2)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi et téléversement du document en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Confirmer et soumettre mon dossier
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
