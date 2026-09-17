/**
 * Référentiel géographique pour les pays d'Afrique de l'Ouest (UEMOA / CEDEAO)
 * et pays partenaires majeurs avec leurs principaux centres économiques.
 */

export const OTHER_LOCATION_OPTION = 'Autre';

export const DEFAULT_COUNTRY = 'Burkina Faso';
export const DEFAULT_CITY = 'Ouagadougou';

export const WEST_AFRICA_LOCATIONS: Record<string, string[]> = {
  'Burkina Faso': [
    'Ouagadougou',
    'Bobo-Dioulasso',
    'Koudougou',
    'Fada N\'Gourma',
    'Banfora',
    'Ouahigouya',
    'Kaya',
    'Tenkodogo',
    OTHER_LOCATION_OPTION,
  ],
  'Côte d\'Ivoire': [
    'Abidjan',
    'Bouaké',
    'Yamoussoukro',
    'San-Pédro',
    'Korhogo',
    'Daloa',
    'Man',
    'Gagnoa',
    OTHER_LOCATION_OPTION,
  ],
  'Sénégal': [
    'Dakar',
    'Thiès',
    'Saint-Louis',
    'Kaolack',
    'Ziguinchor',
    'Touba',
    'Mbour',
    'Rufisque',
    OTHER_LOCATION_OPTION,
  ],
  'Bénin': [
    'Cotonou',
    'Porto-Novo',
    'Parakou',
    'Abomey-Calavi',
    'Djougou',
    'Bohicon',
    OTHER_LOCATION_OPTION,
  ],
  'Togo': [
    'Lomé',
    'Sokodé',
    'Kara',
    'Kpalimé',
    'Atakpamé',
    'Dapaong',
    OTHER_LOCATION_OPTION,
  ],
  'Mali': [
    'Bamako',
    'Sikasso',
    'Ségou',
    'Mopti',
    'Kayes',
    'Koutiala',
    OTHER_LOCATION_OPTION,
  ],
  'Niger': [
    'Niamey',
    'Maradi',
    'Zinder',
    'Tahoua',
    'Agadez',
    'Dosso',
    OTHER_LOCATION_OPTION,
  ],
  'Guinée': [
    'Conakry',
    'Kankan',
    'Kindia',
    'Nzérékoré',
    'Labé',
    'Mamou',
    'Boké',
    OTHER_LOCATION_OPTION,
  ],
  'Ghana': [
    'Accra',
    'Kumasi',
    'Tamale',
    'Takoradi',
    'Sunyani',
    'Cape Coast',
    OTHER_LOCATION_OPTION,
  ],
  'Nigeria': [
    'Lagos',
    'Abuja',
    'Port Harcourt',
    'Ibadan',
    'Kano',
    'Enugu',
    OTHER_LOCATION_OPTION,
  ],
  'Cameroun': [
    'Douala',
    'Yaoundé',
    'Bafoussam',
    'Garoua',
    'Bamenda',
    'Maroua',
    OTHER_LOCATION_OPTION,
  ],
  [OTHER_LOCATION_OPTION]: [
    OTHER_LOCATION_OPTION,
  ],
};

export const WEST_AFRICAN_COUNTRIES = Object.keys(WEST_AFRICA_LOCATIONS);

/**
 * Retourne la liste des villes pour un pays donné.
 * Si le pays n'est pas dans la liste ou est inconnu, renvoie une liste avec 'Autre'.
 */
export function getCitiesForCountry(country: string): string[] {
  if (!country || !WEST_AFRICA_LOCATIONS[country]) {
    return [OTHER_LOCATION_OPTION];
  }
  return WEST_AFRICA_LOCATIONS[country];
}
