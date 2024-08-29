import logo from './logo.svg';
// import './App.css';
import SimpleForm from './pages/Forms';
import React, { useState } from 'react';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ textAlign: 'center' }}>LT3 + LT4 Dosage Calculator</h1>
        <SimpleForm />
      </header>
      
    </div>
  );
}

export default App;
