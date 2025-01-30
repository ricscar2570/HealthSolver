import React, { useState } from "react";

const PACSViewer = () => {
  const [studyId, setStudyId] = useState("");
  const [image, setImage] = useState(null);

  const fetchImage = async () => {
    const response = await fetch(`http://localhost:8000/pacs/instance/${studyId}`);
    if (response.ok) {
      const blob = await response.blob();
      setImage(URL.createObjectURL(blob));
    }
  };

  return (
    <div>
      <h2>PACS Viewer</h2>
      <input type="text" placeholder="Enter Study ID" value={studyId} onChange={(e) => setStudyId(e.target.value)} />
      <button onClick={fetchImage}>Load Image</button>
      {image && <img src={image} alt="DICOM" />}
    </div>
  );
};

export default PACSViewer;
