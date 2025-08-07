import React from 'react';
import { useLocation } from 'react-router-dom';

const RTFResult = () => {
  const location = useLocation();
  const rtf = location.state?.rtf;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Residual Thyroid Function (RTF) Estimate ≈ {rtf}</h1>
      {/* {rtf ? (
        <p><strong>Estimated Tissue Factor (RTF):</strong> {rtf}</p>
      ) : (
        <p>No RTF value was provided.</p>
      )} */}
    </div>
  );
};

export default RTFResult;