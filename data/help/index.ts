import { cvBuilderArticles } from './cv-builder';
import { lettresArticles } from './lettres-motivation';
import { analyseArticles } from './analyse-ia';
import { simulationArticles } from './simulation-entretien';
import { recruiterArticles } from './espace-recruteur';
import { monCompteArticles } from './mon-compte';
import { signatureArticles } from './signature';
import { traductionArticles } from './traduction-cv';
import { partageArticles } from './partage-cv';
import { HelpArticle } from './types';

export const allArticles: HelpArticle[] = [
  ...cvBuilderArticles,
  ...lettresArticles,
  ...analyseArticles,
  ...simulationArticles,
  ...recruiterArticles,
  ...monCompteArticles,
  ...signatureArticles,
  ...traductionArticles,
  ...partageArticles,
];

export * from './types';
