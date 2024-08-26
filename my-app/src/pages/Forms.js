import React, { useState } from 'react';
import { calculateDosage } from './calculate';

const SimpleForm = () => {
  const [hormone, setHormone] = useState('');
  const [bmi, setBMI] = useState('');
  const [gender, setGender] = useState('');
  const [value, setValue] = useState('');
  const [RTF, setRTF] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ hormone, value, bmi, gender });
    // setHormone('')
    // setGender('')
    // setValue('')
    // setBMI('')

    const response = calculateDosage(hormone, value, bmi, gender)
    console.log(response)
    setRTF(response)
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Dosage Calculator</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Thyroid Hormone</label>
          <select
            value={hormone}
            onChange={(e) => setHormone(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          >
            <option value="" disabled>Choose Thyroid Hormone</option>
            <option value="TSH">TSH</option>
            <option value="TT3">TT3</option>
            <option value="FT3">FT3</option>
            <option value="FT4">FT4</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Thyroid Value</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter Thyroid Value"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>BMI</label>
          <input
            type="text"
            value={bmi}
            onChange={(e) => setBMI(e.target.value)}
            placeholder="Enter BMI"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Biological Sex</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          >
            <option value="" disabled>Select Biological Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
      <h3>Calculated RTF Value: {RTF}</h3>
    </div>
  );
};

export default SimpleForm;
