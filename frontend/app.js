import React, { useState } from 'react';
import axios from 'axios';

function App() {
  // State elements: Think of these as dynamic variables that re-render the UI when updated
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentText, setDocumentText] = useState("");
  const [detectedSecrets, setDetectedSecrets] = useState([]);

  // Fires immediately when a user selects a file from their hard drive
  const handleFileSelection = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Fires immediately when the user clicks the "Scan Document" button action
  const sendDocumentToBackend = async () => {
    if (!selectedFile) return;

    // Package the raw file object into standard multi-part form data formatting
    const filePackage = new FormData();
    filePackage.append("file", selectedFile);

    try {
      // Direct a web request to our local FastAPI python engine running on port 8000
      const response = await axios.post("http://localhost:8000/scan", filePackage);
      
      // Feed the response data blocks back into our website's local memory states
      setDocumentText(response.data.text);
      setDetectedSecrets(response.data.secrets);
    } catch (error) {
      console.error("Communication error occurred targeting backend service:", error);
      alert("Could not connect to the local Python engine. Ensure it is running.");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Segoe UI, Helvetica, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Title Header Card */}
      <div style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ color: '#2f3542', margin: '0 0 8px 0' }}>Word Document PII Redactor</h1>
        <p style={{ color: '#747d8c', margin: 0 }}>An intelligent system built to identify and scrub personal tracking entities inside .docx files.</p>
      </div>

      {/* Upload and Interactive Control Bar */}
      <div style={{ backgroundColor: '#f1f2f6', padding: '20px', borderRadius: '6px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <input type="file" accept=".docx" onChange={handleFileSelection} style={{ fontSize: '14px' }} />
        <button 
          onClick={sendDocumentToBackend} 
          disabled={!selectedFile}
          style={{ padding: '10px 20px', backgroundColor: selectedFile ? '#1e90ff' : '#a4b0be', color: 'white', border: 'none', borderRadius: '4px', cursor: selectedFile ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '14px' }}
        >
          Scan Document
        </button>
      </div>

      {/* Main Column Workspace Splits */}
      <div style={{ display: 'flex', gap: '30px' }}>
        
        {/* Left Hand Work-surface View: Text Contents display layout box */}
        <div style={{ flex: 1, border: '1px solid #ced6e0', borderRadius: '6px', padding: '25px', minHeight: '400px', backgroundColor: '#ffffff' }}>
          <h3 style={{ marginTop: 0, color: '#2f3542', borderBottom: '1px solid #f1f2f6', paddingBottom: '12px' }}>Document Content Preview</h3>
          <p style={{ whiteSpace: 'pre-wrap', color: '#57606f', lineHeight: '1.6', fontSize: '15px' }}>
            {documentText || "No document scanned yet. Select a file above and click Scan Document to see structural analysis parsing."}
          </p>
        </div>

        {/* Right Hand Work-surface View: Management list of checked PII values */}
        <div style={{ width: '400px', border: '1px solid #ced6e0', borderRadius: '6px', padding: '25px', backgroundColor: '#ffa50205' }}>
          <h3 style={{ marginTop: 0, color: '#2f3542', borderBottom: '1px solid #ffa502', paddingBottom: '12px' }}>Detected PII Entities</h3>
          {detectedSecrets.length === 0 ? (
            <p style={{ color: '#747d8c', fontSize: '14px' }}>No private items detected or awaiting initial file transmission inputs.</p>
          ) : (
            <div>
              <p style={{ fontSize: '13px', color: '#747d8c', marginBottom: '20px' }}>Uncheck any specific elements you wish to shield from being processed by final file censorship algorithms.</p>
              {detectedSecrets.map((secret, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: '#fff', padding: '12px', borderRadius: '4px', border: '1px solid #ced6e0', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                  <input type="checkbox" defaultChecked style={{ marginTop: '4px', cursor: 'pointer' }} />
                  <div style={{ fontSize: '14px' }}>
                    <span style={{ display: 'inline-block', padding: '2px 6px', backgroundColor: '#ff4757', color: 'white', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold', marginRight: '8px', letterSpacing: '0.5px' }}>
                      {secret.category}
                    </span>
                    <span style={{ color: '#2f3542', fontWeight: '500' }}>"{secret.secret_word}"</span>
                  </div>
                </div>
              ))}
              <button style={{ width: '100%', padding: '14px', marginTop: '20px', backgroundColor: '#2ed573', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', boxShadow: '0 2px 5px rgba(46,213,115,0.2)' }}>
                Download Redacted Document
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
