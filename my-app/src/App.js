import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SimpleForm from './pages/Forms';       // adjust path if needed
import RTFResult from './pages/RTFresult';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* 🧭 Let router control what's rendered */}
        <Routes>
          <Route path="/" element={<SimpleForm />} />
          <Route path="/result" element={<RTFResult />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;

// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const RTFResult = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const rtf = location.state?.rtf;

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>RTF Result</h1>
//       <p><strong>Recommended Tissue Factor (RTF):</strong> {rtf ?? 'N/A'}</p>
//       <button onClick={() => navigate('/')}>Go Back</button>
//     </div>
//   );
// };

// export default RTFResult;

// import logo from './logo.svg';
// // import './App.css';
// import SimpleForm from './pages/Forms';
// import React, { useState } from 'react';



// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1 style={{ textAlign: 'center', fontSize: '1.8em' }}>
//           <span style={{ color: 'red' , fontStyle: 'italic'}}>LT43DOSING:</span> LT4 + LT3 Dosing
//         </h1>
//         <SimpleForm />
//       </header>
      
//     </div>
//   );
// }

// export default App;
