import React, { useEffect, useState } from 'react';
import PatientForm from './components/PatientForm';
import Results from './components/Results';
import PatientHistory from './components/PatientHistory';
import AlternativeTherapies from './components/AlternativeTherapies';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { t, i18n } = useTranslation();
  const [results, setResults] = useState({});
  const [history, setHistory] = useState([]);
  const [alternatives, setAlternatives] = useState([]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch('http://localhost:8000/patients/history/');
      const data = await response.json();
      setHistory(data[0].history); // Mock: Mostra solo il primo paziente
    };
    fetchHistory();
  }, []);

  const handleFormSubmit = async (data) => {
    const response = await fetch('http://localhost:8000/recommendation/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setResults(result);

    const altResponse = await fetch('http://localhost:8000/alternative_therapies/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_therapy: result.recommendation }),
    });
    const altData = await altResponse.json();
    setAlternatives(altData.alternatives);
  };

  return (
    <div>
      <header>
        <h1>{t('title')}</h1>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('it')}>Italiano</button>
      </header>
      <PatientForm onSubmit={handleFormSubmit} />
      <Results recommendation={results.recommendation} />
      <PatientHistory history={history} />
      <AlternativeTherapies alternatives={alternatives} />
    </div>
  );
};

export default App;
