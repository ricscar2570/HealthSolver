import React from 'react';
import PatientForm from './components/PatientForm';
import Results from './components/Results';
import PredictiveAnalysis from './components/PredictiveAnalysis';
import PACSViewer from './components/PACSViewer';
import ReportViewer from './components/ReportViewer';
import Tutorial from './components/Tutorial';

const App = () => {
  return (
    <div>
      <header>
        <h1>HealthSolver</h1>
      </header>
      <Tutorial />
      <PatientForm />
      <Results />
      <PredictiveAnalysis />
      <PACSViewer />
      <ReportViewer />
    </div>
  );
};

export default App;
