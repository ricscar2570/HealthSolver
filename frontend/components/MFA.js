import React, { useState } from "react";

const MFA = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const verifyMFA = async () => {
    const response = await fetch("http://localhost:8000/mfa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ code }),
    });

    if (response.ok) {
      setMessage("MFA verified successfully!");
      window.location.href = "/admin";
    } else {
      setMessage("Invalid OTP. Try again.");
    }
  };

  return (
    <div>
      <h2>Multi-Factor Authentication</h2>
      <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter OTP" />
      <button onClick={verifyMFA}>Verify</button>
      <p>{message}</p>
    </div>
  );
};

export default MFA;
