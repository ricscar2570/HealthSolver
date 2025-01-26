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
      recommendation: 'Recommended Therapy',
      no_results: 'No results available.',
      history: 'Patient History',
      alternatives: 'Alternative Therapies',
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
      recommendation: 'Terapia Raccomandata',
      no_results: 'Nessun risultato disponibile.',
      history: 'Storico Paziente',
      alternatives: 'Terapie Alternative',
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
