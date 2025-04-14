// frontend/src/components/ReportViewer.js
import React, { useState, useEffect } from 'react';

const ReportViewer = () => {
  // Rinominiamo lo stato per chiarezza
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      setAlerts([]); // Pulisci alert precedenti
      try {
        // Chiama l'endpoint attivato per gli alert
        const response = await fetch('http://localhost:8000/admin/alerts'); // URL aggiornato

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch alerts (${response.status})`);
        }
        const data = await response.json();
        // Assumiamo che la risposta sia {"alerts": ["log line 1", "log line 2", ...]}
        setAlerts(data.alerts || []);

      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError(`Could not fetch alerts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    // Aggiungi un intervallo per aggiornare gli alert periodicamente (opzionale)
    // const intervalId = setInterval(fetchAlerts, 30000); // Aggiorna ogni 30 secondi
    // return () => clearInterval(intervalId); // Pulisci intervallo allo smontaggio
  }, []); // Esegui solo al montaggio (o periodicamente se si usa intervallo)

  // La funzione download non è più applicabile agli alert
  // const downloadReport = ... (rimuovere o commentare)

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      {/* Titolo aggiornato */}
      <h2>System Alerts Viewer</h2>

      <button onClick={() => window.location.reload()} style={{ marginBottom: '15px' }} disabled={loading}>
         {loading ? 'Loading...' : 'Refresh Alerts'}
      </button>

      {loading && <p>Loading alerts...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && alerts.length === 0 && <p>No system alerts recorded.</p>}

      {!loading && !error && alerts.length > 0 && (
        <div style={{ maxHeight: '400px', overflowY: 'scroll', border: '1px solid #eee', padding: '10px', background: '#f9f9f9' }}>
          {/* Mostra gli alert come lista o testo preformattato */}
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {alerts.join('\n')}
          </pre>
          {/* Alternativa: Mappare come lista */}
          {/* <ul>
            {alerts.map((alert, index) => (
              <li key={index} style={{ borderBottom: '1px dotted #ddd', padding: '5px 0' }}>
                <pre style={{ margin: 0 }}>{alert}</pre>
              </li>
            ))}
          </ul> */}
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
