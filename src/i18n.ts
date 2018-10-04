import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      nl: {
        translation: {
          bag: 'BAG',
          bagextended: 'Basisregistratie Adressen en Gebouwen',
          documentschema: 'Documentschema',
          specificatieschema: 'Specificatieschema',
          imbor: 'IMBOR',
          thesaurus: 'Thesaurus',
          pilot: 'Pilot Specificatie',
          klassen: 'Klassen',
          gerelateerdeklassen: 'Gerelateerde klasse',
          eigenschappen: 'Eigenschappen',
          eigenschapvan: 'Eigenschap van',
          subeigenschap: 'Subeigenschap van',
          heeftsubeigenschap: 'Heeft subeigenschappen',
          breder: 'Breder',
          gerelateerd: 'Gerelateerd',
          subklasse: 'Subklasse van',
          heeftsubklassen: 'Heeft subklassen',
          geerfde: 'Geërfde Eigenschappen',
          dataladen: 'Data aan het laden...',
        },
      },
      en: {
        translation: {
          bag: 'BAG',
          bagextended: 'Basic registration Addresses and Buildings',
          documentschema: 'Document scheme',
          specificatieschema: 'Specification scheme',
          imbor: 'IMBOR',
          thesaurus: 'Thesaurus',
          pilot: 'Pilot Specificatie',
          klassen: 'Classes',
          gerelateerdeklassen: 'Related classes',
          eigenschappen: 'Properties',
          eigenschapvan: 'Property of',
          subeigenschap: 'Sub property of',
          heeftsubeigenschap: 'Has sub properties',
          breder: 'Wider',
          gerelateerd: 'Related',
          subklasse: 'Sub class of',
          heeftsubklassen: 'Has sub classes',
          geerfde: 'Inherited properties',
          dataladen: 'Loading data...',
        },
      },
    },
    fallbackLng: 'nl',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'localStorage', 'cookie', 'querystring', 'htmlTag', 'path', 'subdomain'],
    },
  });

export default i18n;
