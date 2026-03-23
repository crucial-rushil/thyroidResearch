import React from 'react';
import { useLocation } from 'react-router-dom';
import Response from "../components/Plot1";
import ThyroidPlot from "../components/ThyroidPlot";

const RTFResult = () => {
  const location = useLocation();
  const { rtf, dosageData, weight, weightUnit, height, heightUnit, gender, patientId, selectedHormones, hormoneValues } = location.state || {};
  const displayWeightUnit = weightUnit === 'lbs' ? 'lb' : weightUnit;
  const displayHeightUnit = heightUnit === 'inches' ? 'in' : heightUnit;

  // Convert weight to lbs and height to inches for ThyroidPlot
  const weightInLbs = weightUnit === 'kg' ? (parseFloat(weight) / 0.45359237) : parseFloat(weight);
  const heightInInches = heightUnit === 'cm' ? (parseFloat(height) / 2.54) : parseFloat(height);

  // Get list of selected hormones with their values
  const getSelectedHormonesList = () => {
    if (!selectedHormones || !hormoneValues) return 'None';
    const selected = Object.keys(selectedHormones)
      .filter(key => selectedHormones[key] && hormoneValues[key])
      .map(key => {
        const { value, unit } = hormoneValues[key];
        return `${key} = ${value} ${unit}`;
      });
    return selected.length > 0 ? selected.join(', ') : 'None';
  };

  // Parse alternate dosage string to extract LT4 and LT3 values
  const parseAlternateDosage = (altString) => {
    if (!altString) return null;
    
    // Example format: "100 µg LT4 + 5 µg LT3 2x/ day"
    const lt4Match = altString.match(/(\d+(?:\.\d+)?)\s*µg\s*LT4/i);
    const lt3Match = altString.match(/(\d+(?:\.\d+)?)\s*µg\s*LT3/i);
    
    if (lt4Match && lt3Match) {
      return {
        LT4: parseFloat(lt4Match[1]),
        LT3: parseFloat(lt3Match[1])
      };
    }
    return null;
  };

  const alternateDosage = parseAlternateDosage(dosageData?.alt);

  return (
    <>
      <h1 style={{ textAlign: 'center', marginTop: '12px', marginBottom: '0px', fontSize: '1.7rem' }}>
        <span style={{ fontWeight: 'bold' }}>Patient ID:</span> {patientId}
      </h1>
      <div style={{ textAlign: 'center', marginTop: '0px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', fontSize: '1em', marginBottom: '-20px' }}>
          <h2><strong>Weight:</strong> {weight} {displayWeightUnit}</h2>
          <h2><strong>Height:</strong> {height} {displayHeightUnit}</h2>
          <h2><strong>Sex:</strong> {gender}</h2>
        </div>
        <div style={{ fontSize: '1em', marginTop: '0px' }}>
          <h2><strong>Hormones:</strong> {getSelectedHormonesList()}</h2>
        </div>
        <h1 style={{ fontSize: '1.75rem' }}>Residual Thyroid Function (RTF) Estimate ≈ {rtf}{parseFloat(rtf) >= 100 ? ' *' : ''}</h1>
        {dosageData && !alternateDosage && (
          <div style={{ marginTop: '30px', fontSize: '1.22em' }}>
            <h2>
              <span style={{ color: "red", fontWeight: "bold" }}>
              SUGGESTED DOSAGES: {dosageData.LT4} µg LT4 +
              </span>
              {" "}
              <span style={{ color: "red", fontWeight: "bold" }}>
              {dosageData.LT3} µg LT3
              </span>
              {" "}
              <span style={{ color: "red", fontWeight: "bold" }}>
              {dosageData.frequency}x/day
              </span>
            </h2>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '64px', flexWrap: 'wrap', marginTop: '-15px', width: '100%', transform: 'translateX(-16px)' }}>
          <div
            style={{
              flex: alternateDosage ? '1 1 45%' : '1 1 100%',
              minWidth: '400px',
              width: '100%',
              maxWidth: alternateDosage ? '500px' : '720px'
            }}
          >
            {alternateDosage && dosageData && (
              <h2 style={{ marginTop: '30px', fontSize: '1.35em' }}>
                <span style={{ color: "red", fontWeight: "bold" }}>
                SUGGESTED DOSAGES: {dosageData.LT4} µg LT4 + {dosageData.LT3} µg LT3 {dosageData.frequency}x/day
                </span>
              </h2>
            )}
            <ThyroidPlot
              rtf={parseFloat(rtf) * 0.01}
              LT3={dosageData?.LT3}
              LT4={dosageData?.LT4}
              weight={weightInLbs}
              height={heightInInches}
              gender={gender}
              selectedHormones={location.state?.selectedHormones}
            />
          </div>

          {alternateDosage && (
            <div style={{ flex: '1 1 45%', minWidth: '400px', width: '100%', maxWidth: '500px' }}>
              <h2 style={{ marginTop: '30px', fontSize: '1.35em' }}>
                <span style={{ color: "red", fontWeight: "bold" }}>
                ALTERNATE DOSAGES: {dosageData.alt.replace(/\(2x\/day\)/g, '2x/day')}
                </span>
              </h2>
              <ThyroidPlot
                rtf={parseFloat(rtf) * 0.01}
                LT3={alternateDosage.LT3}
                LT4={alternateDosage.LT4}
                weight={weightInLbs}
                height={heightInInches}
                gender={gender}
                selectedHormones={location.state?.selectedHormones}
                useSplitDosing={true}
              />
            </div>
          )}
        </div>
        
        {parseFloat(rtf) >= 100 && (
          <div style={{ marginTop: '20px', paddingBottom: '30px', fontSize: '0.9em', fontStyle: 'italic', fontWeight: 'bold', color: '#555' }}>
            * RTF estimate fixed at 100% when normal data variations generate RTFs &gt; 100%
          </div>
        )}
      </div>
    </>
  );
};

export default RTFResult;
