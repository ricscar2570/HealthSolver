import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: 'HealthSolver',
      submit: 'Submit',
      age: 'Age',
      bmi: 'BMI',
      severity: 'Condition Severity',
      results: 'Results',
      no_results: 'No results available.',
      report_viewer: 'Report Viewer',
      pacs_viewer: 'PACS Viewer',
      tutorial: 'Tutorial',
    },
  },
  it: {
    translation: {
      title: 'HealthSolver',
      submit: 'Invia',
      age: 'Età',
      bmi: 'BMI',
      severity: 'Gravità della Condizione',
      results: 'Risultati',
      no_results: 'Nessun risultato disponibile.',
      report_viewer: 'Visualizzatore Report',
      pacs_viewer: 'Visualizzatore PACS',
      tutorial: 'Tutorial',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
