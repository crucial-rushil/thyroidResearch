import React, { useState, useEffect } from 'react';
import { calculateDosage } from './calculate';
import { getRTFfromFT4 } from './calculate';
import { useNavigate } from 'react-router-dom';

const SimpleForm = () => {
  const [bmi, setBMI] = useState('');
  const [calculatedBMI, setCalculatedBMI] = useState('');
  const [gender, setGender] = useState('');
  // const [value, setValue] = useState('');
  const [RTF, setRTF] = useState('');

  const [checkTSH,setTSH] = useState(false);
  const [valueTSH, valTSH] = useState('');
  const [unitsTSH, setUnitsTSH] = useState("");

  const [checkTT3,setTT3] = useState(false);
  const [valueTT3, valtt3] = useState('');

  const [checkTT4,setTT4] = useState(false);
  const [valueTT4, valtt4] = useState('');

  const [checkFT3,setFT3] = useState(false);
  const [valueFT3, valFT3] = useState('');

  const [checkFT4,setFT4] = useState(false);
  const [valueFT4, valFT4] = useState('');

  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('lbs');
  
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('inches');

  const navigate = useNavigate();


useEffect(() => {
  const w = parseFloat(weight);
  const h = parseFloat(height);

  if (!isNaN(w) && !isNaN(h) && h > 0) {
    const weightInKg = w * 0.453592;
    const heightInM = h * 0.0254;

    const bmiValue = weightInKg / (heightInM * heightInM);
    setCalculatedBMI(bmiValue.toFixed(2));
    setBMI(bmiValue.toFixed(2));
  } else {
    setCalculatedBMI('');
    setBMI('');
  }
}, [weight, height]);
  

  console.log(valTSH)
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ valueTSH, checkTSH, valueTT3, checkTT3, bmi, gender,checkTT4,valueTT4, checkFT3, valueFT3, checkFT4, valueFT4});
    
    let hormones = new Map();
    if (checkTSH)
      {
        hormones.set('TSH',valueTSH)
      }
    if (checkTT3)
      {
        hormones.set('TT3',valueTT3)
      }
    if (checkTT4)
      {
        hormones.set('TT4',valueTT4)
      }
    if (checkFT3)
      {
        hormones.set('FT3',valueFT3)
      }
    if (checkFT4)
      {
        hormones.set('FT4',valueFT4)
      }

    hormones.set('weight', weight);
    hormones.set('weightUnit', weightUnit);
    hormones.set('height', height);
    hormones.set('heightUnit', heightUnit);

    calculateDosage(hormones, bmi, gender).then(response => {
      const rtfFormatted = (response * 100).toFixed(0) + "%";  // ✅ declare it
      console.log("Response:", response);
      setRTF(rtfFormatted);
      navigate('/result', { state: { rtf: rtfFormatted } });  // ✅ now it exists
    });

    // calculateDosage(hormones, bmi, gender).then(response => {
    //   console.log("Response:", response);
    //   setRTF((response * 100).toFixed(3) + "%");
    //   navigate('/result', { state: { rtf: rtfFormatted } });
    // });

    // let response = calculateDosage(hormones, bmi, gender)
    
    // console.log("Response:",response)
    // response = (response * 100).toFixed(3) + "%"
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
  <div>
    <h1 style={{ textAlign: 'center', fontSize: '1.8em' }}>
          <span style={{ color: 'red', fontStyle: 'italic' }}>LT43DOSING:</span> LT4 + LT3 Dosing
        </h1>
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Patient Lab Values</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ display: 'block', marginBottom: '10px' }}>Enter Measured Hormone Values</h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '10px'}}>
                <label style={{display:'flex'}}>
                  <input
                    type="checkbox"
                    value="TSH"
                    onChange={() => handleCheckboxChange('TSH')}
                    checked={checkTSH} // Bind checkbox state
                    style={{ marginRight: '10px' }}
                  />
                  TSH
                  <select
                    // value={valueTSH}
                    style={{ width: '30%', padding: '2px', boxSizing: 'border-box', marginLeft: '10px' }}
                    // onChange={(e) => handleInputChange('TSH', e.target.value)}
                    disabled={!checkTSH}
                    required
                  >
                    <option value="" disabled>Units</option>
                    <option value="TSH">mU/L</option>
                    <option>µU/mL</option>
                   </select>
                  
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
                <label style={{display:'flex'}}>
                  <input
                    type="checkbox"
                    value="FT4"
                    checked={checkFT4}
                    onChange={() => handleCheckboxChange('FT4')}
                    style={{ marginRight: '10px' }}
                  />
                  FT4
                  <select
                    // value={valueTSH}
                    style={{ width: '30%', padding: '2px', boxSizing: 'border-box', marginLeft: '10px' }}
                    // onChange={(e) => handleInputChange('TSH', e.target.value)}
                    required
                    disabled={!checkFT4}
                  >
                    <option value="" disabled>Units</option>
                    <option >ng/L</option>
                    <option>pg/mL</option>                  
                    <option >ng/dL</option>
                    <option >pmol/L</option>
                    <option >nmol/L</option>
                   </select>
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
              
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{display:'flex'}}>
                  <input
                    type="checkbox"
                    value="FT3"
                    checked={checkFT3}
                    onChange={() => handleCheckboxChange('FT3')}
                    style={{ marginRight: '10px' }}
                  />
                  FT3
                  <select
                    // value={valueTSH}
                    style={{ width: '30%', padding: '2px', boxSizing: 'border-box', marginLeft: '10px' }}
                    // onChange={(e) => handleInputChange('TSH', e.target.value)}
                    disabled={!checkFT3}
                    required
                  >
                    <option value="" disabled>Units</option>
                    <option value="TT3">ng/L</option>
                    <option value="TSH">pg/mL</option>
                    <option value="FT3">pg/dL</option>
                    <option value="FT4">pmol/L</option>
                   </select>
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
                <label style={{display:'flex'}}>
                  <input
                    type="checkbox"
                    value="TT3"
                    onChange={() => handleCheckboxChange('TT3')}
                    checked={checkTT3}
                    style={{ marginRight: '10px' }}
                  />
                  TT3
                  <select
                    // value={valueTSH}
                    style={{ width: '30%', padding: '2px', boxSizing: 'border-box', marginLeft: '10px' }}
                    // onChange={(e) => handleInputChange('TSH', e.target.value)}
                    disabled={!checkTT3}
                    required
                  >
                    <option value="" disabled>Units</option>
                    <option value="TT3">μg/L</option>
                    <option value="TSH">ng/L</option>
                    <option value="TSH">ng/dL</option>
                    <option value="FT3">nmol/L</option>
                    <option value="FT3">μmol/L</option>
                    
                   </select>
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
              
            </div>
          </div>
        </div>
        
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' , fontWeight: "bold"}}>Weight (W)</label>
            <label style={{display:'flex'}}>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter Weight"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                required
              />
              <select
                // value={valueTSH}
                style={{ width: '30%', padding: '2px', boxSizing: 'border-box', marginLeft: '10px' }}
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                required
              >
                <option value="" disabled>Units</option>
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
              </select>
            </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight:"bold" }}>Height (H)</label>
          <label style={{display:'flex'}}>
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter Height"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              required
            />
            <select
              // value={valueTSH}
              style={{ width: '30%', padding: '2px', boxSizing: 'border-box', marginLeft: '10px' }}
              value={heightUnit}
              onChange={(e) => setHeightUnit(e.target.value)}
              required
            >
              <option value="" disabled>Units</option>
              <option value="inch">inches</option>
              <option value="cm">cm</option>
            </select>
          </label>
        </div>
        <div style={{
           paddingBottom: '12px'
        }}>
        <strong>Calculated BMI = W / H<sup>2</sup> = {calculatedBMI ? calculatedBMI : '...'}</strong>
        {/* <strong>Calculated BMI = W / H<sup>2</sup> = </strong> */}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' , fontWeight:"bold"}}>Biological Gender</label>
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
          Enter
        </button>
      </form>
      {/* <h3>Calculated RTF Value: {RTF}</h3> */}
    </div>
    </div>
  );
  
};

export default SimpleForm;
