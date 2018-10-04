import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';

const i18next = i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
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
        },
      },
    },
    fallbackLng: 'nl',
    detection: {
      order: ['navigator', 'htmlTag'],
    },
  });

export default i18next;
