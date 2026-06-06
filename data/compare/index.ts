import { canvaData } from './canva';
import { linkedinData } from './linkedin';
import { resumeioData } from './resumeio';
import { cvdesignrData } from './cvdesignr';
import { zetyData } from './zety';
import { novoresumeData } from './novoresume';
import { indeedData } from './indeed';
import { emploiburkinaData } from './emploiburkina';
import { jobgurusData } from './jobgurus';
import { africarecruitData } from './africarecruit';
import { jobbermanData } from './jobberman';
import { rekruteData } from './rekrute';
import { afrikjobData } from './afrikjob';
import { Competitor } from './types';

export const allCompetitors: Competitor[] = [
  canvaData,
  linkedinData,
  resumeioData,
  cvdesignrData,
  zetyData,
  novoresumeData,
  indeedData,
  emploiburkinaData,
  jobgurusData,
  africarecruitData,
  jobbermanData,
  rekruteData,
  afrikjobData,
];

export * from './types';
