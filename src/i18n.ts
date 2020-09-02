import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';

const i18next = i18n
  .use(LanguageDetector)
  .init({
    resources: {
      nl: {
        translation: {
          classes: 'Klassen',
          relatedClasses: 'Gerelateerde klasse',
          properties: 'Eigenschappen',
          propertyOf: 'Eigenschap van',
          subproperty: 'Subeigenschap van',
          hasSubproperty: 'Heeft subeigenschappen',
          broader: 'Breder',
          related: 'Gerelateerd',
          subclass: 'Subklasse van',
          hasSubclasses: 'Heeft subklassen',
          inherited: 'Geërfde Eigenschappen',
          loadData: 'Data aan het laden...',
          previous: 'Vorige',
          next: 'Volgende',
          first: 'Eerste',
          last: 'Laatste',
          search: 'Zoeken',
          loadSuggestions: 'Suggesties laden...',
          noSuggestions: 'Geen suggesties gevonden.',
          searchPlaceholder: 'Voer een zoekterm in',
        },
      },
      en: {
        translation: {
          classes: 'Classes',
          relatedClasses: 'Related classes',
          properties: 'Properties',
          propertyOf: 'Property of',
          subproperty: 'Subproperty of',
          hasSubproperty: 'Has subproperties',
          broader: 'Broader',
          related: 'Related',
          subclass: 'Subclass of',
          hasSubclasses: 'Has subclasses',
          inherited: 'Inherited properties',
          loadData: 'Loading data...',
          previous: 'Previous',
          next: 'Next',
          first: 'First',
          last: 'Last',
          search: 'Search',
          loadSuggestions: 'Loading suggestions...',
          noSuggestions: 'No suggestions found.',
          searchPlaceholder: 'Enter a search term',
        },
      },
    },
    fallbackLng: 'en',
    detection: {
      order: ['navigator', 'htmlTag'],
    },
  });

export default i18next;
