import React, { useState } from 'react';

const PatientForm = () => {
  const [formData, setFormData] = useState({ age: '', bmi: '', condition_severity: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/recommendation/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      alert(`Recommended Therapy: ${result.recommendation}`);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Patient Form</h2>
      <label>
        Age:
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />
      </label>
      <label>
        BMI:
        <input type="number" name="bmi" value={formData.bmi} onChange={handleChange} required />
      </label>
      <label>
        Condition Severity:
        <input
          type="number"
          name="condition_severity"
          value={formData.condition_severity}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PatientForm;
