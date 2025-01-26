import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PatientForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    condition_severity: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {t('age')}:
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />
      </label>
      <label>
        {t('bmi')}:
        <input type="number" name="bmi" value={formData.bmi} onChange={handleChange} required />
      </label>
      <label>
        {t('severity')}:
        <input type="number" name="condition_severity" value={formData.condition_severity} onChange={handleChange} required />
      </label>
      <button type="submit">{t('submit')}</button>
    </form>
  );
};

export default PatientForm;
