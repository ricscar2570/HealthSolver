import React, { useState } from 'react';

/**
 * Tutorial Component
 * This component provides a step-by-step guide to help users understand how to use the application.
 * Users can navigate between steps using "Next" and "Previous" buttons.
 */
const Tutorial = () => {
  // The current step of the tutorial (initialized to 0, the first step).
  const [step, setStep] = useState(0);

  // Array containing all the steps of the tutorial.
  const steps = [
    "Welcome to HealthSolver! This tutorial will guide you through the main features of the application. Press 'Next' to begin.",
    "Step 1: Start by filling out the patient form. Enter the patient's age, BMI, and the severity of their condition. This data is essential for generating personalized therapy recommendations.",
    "Step 2: Submit the form by clicking the 'Submit' button. The system will analyze the input data and provide a recommended therapy based on advanced machine learning models.",
    "Step 3: After receiving the recommendation, you can analyze the associated risk using interactive charts. These charts visualize the risk level and other important metrics related to the therapy.",
    "Step 4: View detailed reports of the recommendations and risk analysis. You can download these reports in CSV format for further review or sharing with other healthcare professionals.",
    "Step 5: Use the PACS Viewer to access and explore diagnostic images for the patient. You can filter images by modality (e.g., CT, MRI) or by a specific date range.",
    "Final Step: That’s it! You’re now ready to use HealthSolver to assist in medical decision-making. If you need help, revisit this tutorial anytime."
  ];

  // Function to go to the next step of the tutorial.
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  // Function to go to the previous step of the tutorial.
  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Tutorial</h2>
      {/* Display the current tutorial step */}
      <p style={{ fontSize: "18px", lineHeight: "1.6" }}>{steps[step]}</p>

      <div style={{ marginTop: "20px" }}>
        {/* Button to go to the previous step */}
        <button
          onClick={handlePrevious}
          disabled={step === 0}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: step === 0 ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: step === 0 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>

        {/* Button to go to the next step */}
        <button
          onClick={handleNext}
          disabled={step === steps.length - 1}
          style={{
            padding: "10px 20px",
            backgroundColor: step === steps.length - 1 ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: step === steps.length - 1 ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>

      {/* Progress indicator (e.g., Step 3 of 6) */}
      <div style={{ marginTop: "10px", fontStyle: "italic", fontSize: "14px" }}>
        Step {step + 1} of {steps.length}
      </div>
    </div>
  );
};

export default Tutorial;
