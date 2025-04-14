// frontend/src/components/PACSViewer.js
import React, { useState, useCallback } from 'react';
// Potresti voler usare una libreria come react-dropzone per un'esperienza di upload migliore
// import { useDropzone } from 'react-dropzone';

const PACSViewer = () => {
  // Stato per il file selezionato, risultato analisi, errore, loading
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null); // Per un'anteprima base (non DICOM)

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        setSelectedFile(file);
        setAnalysisResult(null); // Resetta risultato precedente
        setError(null); // Resetta errore precedente
        // Crea un URL oggetto per l'anteprima (funziona per immagini standard, non DICOM)
        setPreviewUrl(URL.createObjectURL(file));
    } else {
        setSelectedFile(null);
        setPreviewUrl(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a DICOM file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    // Crea un oggetto FormData per inviare il file
    const formData = new FormData();
    formData.append('file', selectedFile); // 'file' deve corrispondere al nome atteso dal backend FastAPI (File(...))

    try {
      // Chiama l'endpoint CNN attivato
      const response = await fetch('http://localhost:8000/cnn/analyze', { // URL aggiornato
        method: 'POST',
        body: formData, // Invia FormData, non JSON
        // Non impostare 'Content-Type', il browser lo farà automaticamente per FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Analysis failed (${response.status})`);
      }

      const result = await response.json();
      // Assumi che la risposta sia {"filename": "...", "analysis_result": "..."}
      setAnalysisResult(`Analysis for ${result.filename}: ${result.analysis_result}`);

    } catch (err) {
      console.error('Error analyzing DICOM file:', err);
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

   // Pulizia dell'URL oggetto quando il componente si smonta o il file cambia
   useEffect(() => {
       return () => {
           if (previewUrl) {
               URL.revokeObjectURL(previewUrl);
           }
       };
   }, [previewUrl]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      {/* Titolo Aggiornato */}
      <h2>DICOM Image Analyzer (CNN)</h2>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="dicomFile">Select DICOM File:</label>
        <input
          type="file"
          id="dicomFile"
          accept=".dcm, image/dicom-rle" // Specifica tipi MIME se conosciuti, o estensione .dcm
          onChange={handleFileChange}
          style={{ marginLeft: '10px' }}
        />
      </div>

      {/* Mostra un'anteprima se possibile (non sarà un rendering DICOM reale) */}
      {previewUrl && (
         <div style={{ margin: '10px 0' }}>
            <p>Selected file: {selectedFile?.name}</p>
            {/* <img src={previewUrl} alt="Preview (standard image)" style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid lightgray' }} /> */}
            {/* L'anteprima di un file DICOM come immagine standard non è significativa */}
         </div>
       )}


      <button onClick={handleAnalyze} disabled={!selectedFile || loading}>
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>

      {analysisResult && <p style={{ color: 'darkgreen', marginTop: '15px', fontWeight: 'bold' }}>{analysisResult}</p>}
      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

      {/* Rimuoviamo la vecchia logica di fetch/visualizzazione PACS */}
      {/* ... vecchio form e lista immagini ... */}
    </div>
  );
};

export default PACSViewer;
