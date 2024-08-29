import React, { useState } from 'react';
import { calculateDosage } from './calculate';

const SimpleForm = () => {
  const [bmi, setBMI] = useState('');
  const [gender, setGender] = useState('');
  // const [value, setValue] = useState('');
  const [RTF, setRTF] = useState('');

  const [checkTSH,setTSH] = useState(false);
  const [valueTSH, valTSH] = useState('');

  const [checkTT3,setTT3] = useState(false);
  const [valueTT3, valtt3] = useState('');

  const [checkTT4,setTT4] = useState(false);
  const [valueTT4, valtt4] = useState('');

  const [checkFT3,setFT3] = useState(false);
  const [valueFT3, valFT3] = useState('');

  const [checkFT4,setFT4] = useState(false);
  const [valueFT4, valFT4] = useState('');
  

  console.log(valTSH)
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ valueTSH, checkTSH, valueTT3, checkTT3, bmi, gender,checkTT4,valueTT4, checkFT3, valueFT3, checkFT4, valueFT4});
    // setHormone('')
    // setGender('')
    // setValue('')
    // setBMI('')

    // const response = calculateDosage(hormone, value, bmi, gender)
    // console.log(response)
    // setRTF(response)
  };

  const handleCheckboxChange = (name) => {
    if (name === 'TSH') {
      if (checkTSH) {
        // If checkbox is already checked, uncheck it and reset value
        setTSH(false);
        // setValue(''); // Reset text input value
        valTSH('');
      } 
      else {
        // If checkbox is not checked, check it
        setTSH(true);
      }
    }

    else if (name === 'TT3') {
      if (checkTT3) {
        // If checkbox is already checked, uncheck it and reset value
        setTT3(false);
        // setValue(''); // Reset text input value
        valtt3('');
      } 
      else {
        // If checkbox is not checked, check it
        setTT3(true);
      }
    }

    else if (name === 'TT4') {
      if (checkTT4) {
        // If checkbox is already checked, uncheck it and reset value
        setTT4(false);
        // setValue(''); // Reset text input value
        valtt4('');
      } 
      else {
        // If checkbox is not checked, check it
        setTT4(true);
      }
    }

    else if (name === 'FT3') {
      if (checkFT3) {
        // If checkbox is already checked, uncheck it and reset value
        setFT3(false);
        // setValue(''); // Reset text input value
        valFT3('');
      } 
      else {
        // If checkbox is not checked, check it
        setFT3(true);
      }
    }

    else if (name === 'FT4') {
      if (checkFT4) {
        // If checkbox is already checked, uncheck it and reset value
        setFT4(false);
        // setValue(''); // Reset text input value
        valFT4('');
      } 
      else {
        // If checkbox is not checked, check it
        setFT4(true);
      }
    }

  };

  const handleInputChange = (name, value) => {
    if (name === 'TSH') {
      valTSH(value); // Update the text input value
      console.log(valTSH)
    }

    else if (name === 'TT3') {
      valtt3(value); // Update the text input value
      console.log(valtt3)
    }

    else if (name === 'TT4') {
      valtt4(value); // Update the text input value
      console.log(valtt4)
    }

    else if (name === 'FT3') {
      valFT3(value); // Update the text input value
      console.log(valtt4)
    }

    else if (name === 'FT4') {
      valFT4(value); // Update the text input value
      console.log(valtt4)
    }
    // Add similar handling for other hormone inputs if needed
  };

  
  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Paitent Lab Hormone Values</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ display: 'block', marginBottom: '10px' }}>Enter Measured Hormone Values</h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <input
                    type="checkbox"
                    value="TSH"
                    onChange={() => handleCheckboxChange('TSH')}
                    checked={checkTSH} // Bind checkbox state
                    style={{ marginRight: '10px' }}
                  />
                  TSH
                  <input
                    type="text"
                    value={valueTSH}
                    onChange={(e) => handleInputChange('TSH', e.target.value)}
                    placeholder="Enter TSH"
                    style={{ width: '70%', padding: '2px', boxSizing: 'border-box', marginLeft: '20px' }}
                    disabled={!checkTSH}
                  />
                </label>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <input
                    type="checkbox"
                    value="TT3"
                    onChange={() => handleCheckboxChange('TT3')}
                    checked={checkTT3}
                    style={{ marginRight: '10px' }}
                  />
                  TT3
                  <input
                    type="text"
                    value={valueTT3}
                    onChange={(e) => handleInputChange('TT3', e.target.value)}
                    placeholder="Enter TT3 "
                    style={{ width: '70%', padding: '2px', boxSizing: 'border-box', marginLeft: '22px' }}
                    disabled={!checkTT3}
                  />
                </label>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <input
                    type="checkbox"
                    value="TT4"
                    checked={checkTT4}
                    onChange={() => handleCheckboxChange('TT4')}
                    style={{ marginRight: '10px' }}
                  />
                  TT4
                  <input
                    type="text"
                    value={valueTT4}
                    onChange={(e) => handleInputChange('TT4', e.target.value)}
                    placeholder="Enter TT4 "
                    style={{ width: '70%', padding: '2px', boxSizing: 'border-box', marginLeft: '22px' }}
                    disabled={!checkTT4}
                  />
                </label>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <input
                    type="checkbox"
                    value="FT3"
                    checked={checkFT3}
                    onChange={() => handleCheckboxChange('FT3')}
                    style={{ marginRight: '10px' }}
                  />
                  FT3
                  <input
                    type="text"
                    value={valueFT3}
                    onChange={(e) => handleInputChange('FT3', e.target.value)}
                    placeholder="Enter FT3"
                    style={{ width: '70%', padding: '2px', boxSizing: 'border-box', marginLeft: '22px' }}
                    disabled={!checkFT3}
                    />
                </label>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <input
                    type="checkbox"
                    value="FT4"
                    checked={checkFT4}
                    onChange={() => handleCheckboxChange('FT4')}
                    style={{ marginRight: '10px' }}
                  />
                  FT4
                  <input
                    type="text"
                    value={valueFT4}
                    onChange={(e) => handleInputChange('FT4', e.target.value)}
                    placeholder="Enter FT4"
                    style={{ width: '70%', padding: '2px', boxSizing: 'border-box', marginLeft: '22px' }}
                    disabled={!checkFT4}
                    />
                </label>
              </div>
            </div>
          </div>
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
          <label style={{ display: 'block', marginBottom: '5px' }}>Biological Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          >
            <option value="" disabled>Select Biological Gender</option>
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
