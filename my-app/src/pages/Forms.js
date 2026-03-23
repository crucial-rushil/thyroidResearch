import React, { useState, useEffect } from 'react';
import { calculateDosage } from './calculate';
import { getRTFfromFT4 } from './calculate';
import { useNavigate } from 'react-router-dom';

const toKg = (w, unit) => (unit === 'lbs' ? parseFloat(w) * 0.45359237 : parseFloat(w));
const toMeters = (h, unit) =>
  unit === 'inches' ? parseFloat(h) * 0.0254 : unit === 'cm' ? parseFloat(h) / 100 : parseFloat(h);

// helpers for converting displayed values when the user flips the unit selector
const lbsToKg = (w) => (w === '' ? '' : (parseFloat(w) * 0.45359237).toFixed(2));
const kgToLbs = (w) => (w === '' ? '' : (parseFloat(w) / 0.45359237).toFixed(2));
const inchesToCm = (h) => (h === '' ? '' : (parseFloat(h) * 2.54).toFixed(2));
const cmToInches = (h) => (h === '' ? '' : (parseFloat(h) / 2.54).toFixed(2));

const SimpleForm = () => {
  const [bmi, setBMI] = useState('');
  const [calculatedBMI, setCalculatedBMI] = useState('');
  const [gender, setGender] = useState('');
  const [RTF, setRTF] = useState('');

  const [checkTSH, setTSH] = useState(false);
  const [valueTSH, valTSH] = useState('');
  const [unitsTSH, setUnitsTSH] = useState('');

  const [checkTT3, setTT3] = useState(false);
  const [valueTT3, valtt3] = useState('');
  const [unitsTT3, setUnitsTT3] = useState('');

  const [checkTT4, setTT4] = useState(false);
  const [valueTT4, valtt4] = useState('');

  const [checkFT3, setFT3] = useState(false);
  const [valueFT3, valFT3] = useState('');
   const [unitsFT3, setUnitsFT3] = useState('');

  const [checkFT4, setFT4] = useState(false);
  const [valueFT4, valFT4] = useState('');
  const [unitsFT4, setUnitsFT4] = useState('');

  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('lbs');

  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('inches');

  const navigate = useNavigate();

  // When user toggles the weight unit, just update the unit without modifying the input value
  const handleWeightUnitChange = (newUnit) => {
    setWeightUnit(newUnit);
  };

  // When user toggles the height unit, just update the unit without modifying the input value
  const handleHeightUnitChange = (newUnit) => {
    setHeightUnit(newUnit);
  };

  // BMI alys computed in kg/m^2, regardless of displayed units.
  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!isNaN(w) && !isNaN(h) && h > 0) {
      const weightInKg = toKg(w, weightUnit);
      const heightInM = toMeters(h, heightUnit);
      const bmiValue = weightInKg / (heightInM * heightInM);
      setCalculatedBMI(bmiValue.toFixed(1));
      setBMI(bmiValue.toFixed(1));
    } else {
      setCalculatedBMI('');
      setBMI('');
    }
  }, [weight, height, weightUnit, heightUnit]);

  const convertFT4toNgL = (value, unit) => {
    const num = parseFloat(value);
    if (isNaN(num)) return null;

    switch (unit) {
      case "ng/L":
        return num;
      case "ng/dL":
        return num * 10;
      case "pg/mL":
        return num * 1;
      case "pmol/L":
        return num * 0.77687;
      case "nmol/L":
        return num * 776.87;
      default:
        return null;
    }
  };

  const convertFT3toNgL = (value, unit) => {
    const num = parseFloat(value);
    if (isNaN(num)) return null;

    switch (unit) {
      case "ng/L":
        return num;
      case "pg/mL":
        return num * 1;
      case "pg/dL":
        return num * 10;
      case "pmol/L":
        return num * 0.65097;
      default:
        return null;
    }
  };

  const convertTT3toUgL = (value, unit) => {
    const num = parseFloat(value);
    if (isNaN(num)) return null;

    switch (unit) {
      case "μg/L":
        return num;
      case "ng/L":
        return num * 0.001;
      case "ng/dL":
        return num * 0.01;
      case "nmol/L":
        return num * 0.65097;
      case "μmol/L":
        return num * 650.97;
      default:
        return null;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate BMI is below 40
    const bmiValue = parseFloat(calculatedBMI);
    if (isNaN(bmiValue) || bmiValue >= 40) {
      alert('BMI too high (must be below 40)');
      return;
    }

    // Validate that either TSH or FT4 is selected
    if (!checkTSH && !checkFT4) {
      alert('TSH or FT4 required for any data input');
      return;
    }

    // Prevent running computation when all 4 major hormones are selected
    if (checkTSH && checkFT4 && checkFT3 && checkTT3) {
      alert('Cannot compute with all 4 hormones selected (TSH, FT4, FT3, TT3).');
      return;
    }

    // Validate hormone values are within range (convert to standard units first)
    let outOfRangeInputs = [];
    
    if (checkTSH) {
      // TSH: mU/L and µU/mL are equivalent, so no conversion needed
      const tshVal = parseFloat(valueTSH);
      if (tshVal <= 0 || tshVal >= 1000) {
        outOfRangeInputs.push('TSH');
      }
    }
    
    if (checkFT4) {
      const ft4Converted = convertFT4toNgL(valueFT4, unitsFT4);
      if (ft4Converted !== null && (ft4Converted <= 0 || ft4Converted >= 75)) {
        outOfRangeInputs.push('FT4');
      }
    }
    
    if (checkFT3) {
      const ft3Converted = convertFT3toNgL(valueFT3, unitsFT3);
      if (ft3Converted !== null && (ft3Converted <= 0 || ft3Converted >= 20)) {
        outOfRangeInputs.push('FT3');
      }
    }
    
    if (checkTT3) {
      const tt3Converted = convertTT3toUgL(valueTT3, unitsTT3);
      if (tt3Converted !== null && (tt3Converted <= 0 || tt3Converted >= 8)) {
        outOfRangeInputs.push('TT3');
      }
    }
    
    if (outOfRangeInputs.length > 0) {
      alert(`${outOfRangeInputs.join(', ')} out of range`);
      return;
    }

    let hormones = new Map();
    if (checkTSH) hormones.set('TSH', valueTSH);
    if (checkTT3) {
      const standardizedTT3 = convertTT3toUgL(valueTT3, unitsTT3);
      hormones.set('TT3', standardizedTT3);
      hormones.set("TT3Unit", "μg/L");
    }
    if (checkTT4) hormones.set('TT4', valueTT4);
    if (checkFT3) {
      const standardizedFT3 = convertFT3toNgL(valueFT3, unitsFT3);
      hormones.set('FT3', standardizedFT3);
      hormones.set("FT3Unit", "ng/L");
    }
    if (checkFT4) {
      const standardizedFT4 = convertFT4toNgL(valueFT4, unitsFT4);
      hormones.set("FT4", standardizedFT4);
      hormones.set("FT4Unit", "ng/L");
    }

    // Convert to lbs and inches before storing
    const weightInLbs = weightUnit === 'kg' ? kgToLbs(weight) : weight;
    const heightInInches = heightUnit === 'cm' ? cmToInches(height) : height;
    
    hormones.set('weight', weightInLbs);
    hormones.set('weightUnit', 'lbs');
    hormones.set('height', heightInInches);
    hormones.set('heightUnit', 'inches');

    calculateDosage(hormones, bmi, gender, height, weight).then(({ rtf, dosageData }) => {
      const rtfFormatted = (rtf * 100).toFixed(0) + '%';
      console.log('Calculated RTF:', rtfFormatted);
      console.log('Selected Hormones State:', {
        TSH: checkTSH,
        FT4: checkFT4,
        FT3: checkFT3,
        TT3: checkTT3,
        TT4: checkTT4
      });
      setRTF(rtfFormatted);

      navigate('/result', { 
        state: { 
          rtf: rtfFormatted,
          dosageData,      // pass dosage object too
          weight,
          weightUnit,
          height,
          heightUnit,
          gender,
          patientId,
          selectedHormones: {
            TSH: checkTSH,
            FT4: checkFT4,
            FT3: checkFT3,
            TT3: checkTT3,
            TT4: checkTT4
          },
          hormoneValues: {
            TSH: checkTSH ? { value: valueTSH, unit: unitsTSH } : null,
            FT4: checkFT4 ? { value: valueFT4, unit: unitsFT4 } : null,
            FT3: checkFT3 ? { value: valueFT3, unit: unitsFT3 } : null,
            TT3: checkTT3 ? { value: valueTT3, unit: unitsTT3 } : null,
            TT4: checkTT4 ? { value: valueTT4, unit: 'μg/dL' } : null
          }
        } 
      });
    });

  };

  const handleCheckboxChange = (name) => {
    if (name === 'TSH') {
      setTSH(!checkTSH);
      if (checkTSH) valTSH('');
    } else if (name === 'TT3') {
      setTT3(!checkTT3);
      if (checkTT3) {
        valtt3('');
        setUnitsTT3('');
      }
    } else if (name === 'TT4') {
      setTT4(!checkTT4);
      if (checkTT4) valtt4('');
    } else if (name === 'FT3') {
      setFT3(!checkFT3);
      if (checkFT3) { 
        valFT3('');
        setUnitsFT3('');
      }
    } else if (name === 'FT4') {
      setFT4(!checkFT4);
      if (checkFT4) {
        valFT4('');
        setUnitsFT4('');
      }
    }
  };

  const handleInputChange = (name, value) => {
    if (name === 'TSH') valTSH(value);
    else if (name === 'TT3') valtt3(value);
    else if (name === 'TT4') valtt4(value);
    else if (name === 'FT3') valFT3(value);
    else if (name === 'FT4') valFT4(value);
  };

  const [patientId, setPatientId] = useState('');

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '1.8em' }}>
        <span style={{ color: 'red', fontStyle: 'italic' }}>LT43DOSING:</span> LT4 + LT3 Dosing
      </h1>
      
      <div style={{ maxWidth: '400px', margin: '20px auto', marginBottom: '10px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Patient ID</label>
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          required
        />
      </div>

      <div style={{ maxWidth: '400px', margin: '10px auto 20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', marginTop: '0px', marginBottom: '16px' }}>Patient Lab Values</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ display: 'block', marginBottom: '10px' }}>Enter Measured Hormone Values</h4>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* TSH */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'grid', gridTemplateColumns: '24px 40px 30% 1fr', alignItems: 'center', columnGap: '10px' }}>
                    <input
                      type="checkbox"
                      value="TSH"
                      onChange={() => handleCheckboxChange('TSH')}
                      checked={checkTSH}
                      style={{ margin: '0' }}
                    />
                    <span style={{ width: '40px' }}>TSH</span>
                    <select
                      style={{ width: '100%', padding: '2px', boxSizing: 'border-box' }}
                      disabled={!checkTSH}
                      required
                      value={unitsTSH}
                      onChange={(e) => setUnitsTSH(e.target.value)}
                    >
                      <option value="" disabled>Units</option>
                      <option value="mU/L">mU/L</option>
                      <option value="µU/mL">µU/mL</option>
                    </select>

                    <input
                      type="text"
                      value={valueTSH}
                      onChange={(e) => handleInputChange('TSH', e.target.value)}
                      placeholder="Enter TSH"
                      style={{ width: '100%', padding: '2px', boxSizing: 'border-box' }}
                      disabled={!checkTSH}
                    />
                  </label>
                </div>

                {/* FT4 */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'grid', gridTemplateColumns: '24px 40px 30% 1fr', alignItems: 'center', columnGap: '10px' }}>
                    <input
                      type="checkbox"
                      value="FT4"
                      checked={checkFT4}
                      onChange={() => handleCheckboxChange('FT4')}
                      style={{ margin: '0' }}
                    />
                    <span style={{ width: '40px' }}>FT4</span>
                    <select
                      style={{ width: '100%', padding: '2px', boxSizing: 'border-box' }}
                      required
                      disabled={!checkFT4}
                      value={unitsFT4}
                      onChange={(e) => setUnitsFT4(e.target.value)}
                    >
                      <option value="" disabled>Units</option>
                      <option value="ng/L">ng/L</option>
                      <option value = "pg/mL">pg/mL</option>
                      <option value = "ng/dL">ng/dL</option>
                      <option value = "pmol/L">pmol/L</option>
                      <option value = "nmol/L">nmol/L</option>
                    </select>
                    <input
                      type="text"
                      value={valueFT4}
                      onChange={(e) => handleInputChange('FT4', e.target.value)}
                      placeholder="Enter FT4"
                      style={{ width: '100%', padding: '2px', boxSizing: 'border-box' }}
                      disabled={!checkFT4}
                    />
                  </label>
                </div>

                {/* FT3 */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'grid', gridTemplateColumns: '24px 40px 30% 1fr', alignItems: 'center', columnGap: '10px' }}>
                    <input
                      type="checkbox"
                      value="FT3"
                      checked={checkFT3}
                      onChange={() => handleCheckboxChange('FT3')}
                      style={{ margin: '0' }}
                    />
                    <span style={{ width: '40px' }}>FT3</span>
                    <select
                      style={{ width: '100%', padding: '2px', boxSizing: 'border-box' }}
                      disabled={!checkFT3}
                      value={unitsFT3}
                      onChange={(e) => setUnitsFT3(e.target.value)}
                      required
                    >
                      <option value="" disabled>Units</option>
                      <option value="ng/L">ng/L</option>
                      <option value="pg/mL">pg/mL</option>
                      <option value="pg/dL">pg/dL</option>
                      <option value="pmol/L">pmol/L</option>
                    </select>
                    <input
                      type="text"
                      value={valueFT3}
                      onChange={(e) => handleInputChange('FT3', e.target.value)}
                      placeholder="Enter FT3"
                      style={{ width: '100%', padding: '2px', boxSizing: 'border-box' }}
                      disabled={!checkFT3}
                    />
                  </label>
                </div>

                {/* TT3 */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'grid', gridTemplateColumns: '24px 40px 30% 1fr', alignItems: 'center', columnGap: '10px' }}>
                    <input
                      type="checkbox"
                      value="TT3"
                      onChange={() => handleCheckboxChange('TT3')}
                      checked={checkTT3}
                      style={{ margin: '0' }}
                    />
                    <span style={{ width: '40px' }}>TT3</span>
                    <select
                      style={{ width: '100%', padding: '2px', boxSizing: 'border-box' }}
                      disabled={!checkTT3}
                      value={unitsTT3}
                      onChange={(e) => setUnitsTT3(e.target.value)}
                      required
                    >
                      <option value="" disabled>Units</option>
                      <option value="μg/L">μg/L</option>
                      <option value="ng/L">ng/L</option>
                      <option value="ng/dL">ng/dL</option>
                      <option value="nmol/L">nmol/L</option>
                      <option value="μmol/L">μmol/L</option>
                    </select>
                    <input
                      type="text"
                      value={valueTT3}
                      onChange={(e) => handleInputChange('TT3', e.target.value)}
                      placeholder="Enter TT3"
                      style={{ width: '100%', padding: '2px', boxSizing: 'border-box' }}
                      disabled={!checkTT3}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Weight */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Weight (W)</label>
            <label style={{ display: 'flex' }}>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter Weight"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                required
              />
              <select
                style={{ width: '30%', padding: '2px', boxSizing: 'border-box', marginLeft: '10px', fontSize: '1.12em' }}
                value={weightUnit}
                onChange={(e) => handleWeightUnitChange(e.target.value)}
                required
              >
                <option value="" disabled>Units</option>
                <option value="lbs">pounds</option>
                <option value="kg">kg</option>
              </select>
            </label>
          </div>

          {/* Height */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Height (H)</label>
            <label style={{ display: 'flex' }}>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter Height"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                required
              />
              <select
                style={{ width: '30%', padding: '2px', boxSizing: 'border-box', marginLeft: '10px', fontSize: '1.12em' }}
                value={heightUnit}
                onChange={(e) => handleHeightUnitChange(e.target.value)}
                required
              >
                <option value="" disabled>Units</option>
                <option value="inches">inches</option>
                <option value="cm">cm</option>
              </select>
            </label>
          </div>

          <div style={{ paddingBottom: '12px' }}>
            <strong>
              Calculated BMI  =  W / H <sup> 2</sup>  =  {calculatedBMI ? calculatedBMI : '...'} kg / m<sup>2</sup>
            </strong>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Sex</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              required
            >
              <option value="" disabled>
                Select Sex
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Enter
          </button>
        </form>
        {/* <h3>Calculated RTF Value: {RTF}</h3> */}
      </div>
    </div>
  );
};

export default SimpleForm;
