import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

function sequentialInterpolation(x, y, x1, x2, y1, y2, Q11, Q21, Q12, Q22) {
  // x = weight, y = height
  // x1 = w1, x2 = w2, y1 = h1, y2 = h2
  // Q11 = RTF(w1, h1), Q21 = RTF(w2, h1)
  // Q12 = RTF(w1, h2), Q22 = RTF(w2, h2)
  
  // Step 1: Interpolate by weight at each height
  // RTF at h1 (y1)
  const RTF_at_h1 = Q11 + ((x - x1) / (x2 - x1)) * (Q21 - Q11);
  
  // RTF at h2 (y2)
  const RTF_at_h2 = Q12 + ((x - x1) / (x2 - x1)) * (Q22 - Q12);
  
  // Step 2: Interpolate by height using the two intermediate values
  const RTF_final = RTF_at_h1 + ((y - y1) / (y2 - y1)) * (RTF_at_h2 - RTF_at_h1);
  
  return RTF_final;
}

function parseRange(rangeStr) {
  const [min, max] = rangeStr.split('-').map(v => parseFloat(v));
  return { min, max };
}

function getApproxInterpolatedParameter(data, weight, height, param) {
  const heights = [...new Set(data.map(r => parseInt(r['height'])))].sort((a, b) => a - b);

  // Find bounding heights
  const y1 = Math.max(...heights.filter(h => h <= height));
  const y2 = Math.min(...heights.filter(h => h >= height));

  // Get exact data point lookup
  const getParam = (w, h) => {
    const row = data.find(r => parseInt(r['weight']) === w && parseInt(r['height']) === h);
    return row ? parseFloat(row[param]) : null;
  };

  // If exact height match (no height interpolation needed)
  if (y1 === y2) {
    const weightsAtHeight = [...new Set(data.filter(r => parseInt(r['height']) === y1).map(r => parseInt(r['weight'])))].sort((a, b) => a - b);
    const x1 = Math.max(...weightsAtHeight.filter(w => w <= weight));
    const x2 = Math.min(...weightsAtHeight.filter(w => w >= weight));
    
    if (x1 === x2) {
      return getParam(x1, y1);
    }
    
    const Q1 = getParam(x1, y1);
    const Q2 = getParam(x2, y1);
    if (Q1 === null || Q2 === null) return null;
    return Q1 + (Q2 - Q1) * (weight - x1) / (x2 - x1);
  }

  // Get weights available at each bounding height
  const weightsAtY1 = [...new Set(data.filter(r => parseInt(r['height']) === y1).map(r => parseInt(r['weight'])))].sort((a, b) => a - b);
  const weightsAtY2 = [...new Set(data.filter(r => parseInt(r['height']) === y2).map(r => parseInt(r['weight'])))].sort((a, b) => a - b);

  // Find bounding weights at each height separately
  const x1_y1 = Math.max(...weightsAtY1.filter(w => w <= weight));
  const x2_y1 = Math.min(...weightsAtY1.filter(w => w >= weight));
  const x1_y2 = Math.max(...weightsAtY2.filter(w => w <= weight));
  const x2_y2 = Math.min(...weightsAtY2.filter(w => w >= weight));

  // Check if we can find bounding weights at both heights
  const validBoundsY1 = isFinite(x1_y1) && isFinite(x2_y1);
  const validBoundsY2 = isFinite(x1_y2) && isFinite(x2_y2);

  if (!validBoundsY1 || !validBoundsY2) {
    return null; // Cannot interpolate
  }

  // Step 1: Interpolate by weight at y1 (height 1)
  let RTF_at_y1;
  if (x1_y1 === x2_y1) {
    RTF_at_y1 = getParam(x1_y1, y1);
  } else {
    const Q11 = getParam(x1_y1, y1);
    const Q21 = getParam(x2_y1, y1);
    if (Q11 === null || Q21 === null) return null;
    RTF_at_y1 = Q11 + ((weight - x1_y1) / (x2_y1 - x1_y1)) * (Q21 - Q11);
  }

  // Step 2: Interpolate by weight at y2 (height 2)
  let RTF_at_y2;
  if (x1_y2 === x2_y2) {
    RTF_at_y2 = getParam(x1_y2, y2);
  } else {
    const Q12 = getParam(x1_y2, y2);
    const Q22 = getParam(x2_y2, y2);
    if (Q12 === null || Q22 === null) return null;
    RTF_at_y2 = Q12 + ((weight - x1_y2) / (x2_y2 - x1_y2)) * (Q22 - Q12);
  }

  if (RTF_at_y1 === null || RTF_at_y2 === null) return null;

  // Step 3: Interpolate by height using the two intermediate RTF values
  const RTF_final = RTF_at_y1 + ((height - y1) / (y2 - y1)) * (RTF_at_y2 - RTF_at_y1);
  return RTF_final;
}

function getLocalTrianglePoints(data, weight, height) {
  const heights = [...new Set(data.map(r => parseInt(r['height'])))].sort((a, b) => a - b);
  const y1 = Math.max(...heights.filter(h => h <= height));
  const y2 = Math.min(...heights.filter(h => h >= height));

  if (!isFinite(y1) || !isFinite(y2) || y1 === y2) {
    return null;
  }

  const weightsAtY1 = [...new Set(data.filter(r => parseInt(r['height']) === y1).map(r => parseInt(r['weight'])))].sort((a, b) => a - b);
  const weightsAtY2 = [...new Set(data.filter(r => parseInt(r['height']) === y2).map(r => parseInt(r['weight'])))].sort((a, b) => a - b);

  const x1_y1 = Math.max(...weightsAtY1.filter(w => w <= weight));
  const x2_y1 = Math.min(...weightsAtY1.filter(w => w >= weight));
  const x1_y2 = Math.max(...weightsAtY2.filter(w => w <= weight));
  const x2_y2 = Math.min(...weightsAtY2.filter(w => w >= weight));

  const rawPoints = [
    { weight: x1_y1, height: y1 },
    { weight: x2_y1, height: y1 },
    { weight: x1_y2, height: y2 },
    { weight: x2_y2, height: y2 },
  ].filter(point => isFinite(point.weight) && isFinite(point.height));

  const uniquePoints = rawPoints.filter((point, index, points) =>
    points.findIndex(candidate => candidate.weight === point.weight && candidate.height === point.height) === index
  );

  if (uniquePoints.length !== 3) {
    return null;
  }

  return uniquePoints.map(point => {
    const row = data.find(r =>
      parseInt(r['weight']) === point.weight && parseInt(r['height']) === point.height
    );
    return row ? { ...point, row } : null;
  }).filter(Boolean);
}

function getInverseDistanceWeightedRTF(points, weight, height, value, computePointRTF) {
  if (!points || points.length !== 3) {
    return null;
  }

  const evaluatedPoints = points.map(point => {
    const rtf = computePointRTF(point.row, value);
    const distance = Math.hypot(weight - point.weight, height - point.height);
    return { ...point, rtf, distance };
  });

  if (evaluatedPoints.some(point => !Number.isFinite(point.rtf))) {
    return null;
  }

  const exactMatch = evaluatedPoints.find(point => point.distance === 0);
  if (exactMatch) {
    console.log("Triangle edge case exact match:", exactMatch);
    return exactMatch.rtf;
  }

  const weightedPoints = evaluatedPoints.map(point => ({
    ...point,
    inverseWeight: 1 / point.distance,
  }));

  const totalInverseWeight = weightedPoints.reduce((sum, point) => sum + point.inverseWeight, 0);
  if (!Number.isFinite(totalInverseWeight) || totalInverseWeight === 0) {
    return null;
  }

  const finalEstimate = weightedPoints.reduce(
    (sum, point) => sum + point.rtf * (point.inverseWeight / totalInverseWeight),
    0
  );

  console.log("Triangle edge case RTF points:", weightedPoints.map(point => ({
    weight: point.weight,
    height: point.height,
    rtf: point.rtf,
    distance: point.distance,
    inverseWeight: point.inverseWeight,
  })));
  console.log("Triangle edge case final RTF estimate:", finalEstimate);

  return finalEstimate;
}

function calculateRTF(A, C, B, M, FT4) {
  console.log(`Calculating RTF with A: ${A}, C: ${C}, B: ${B}, M: ${M}, FT4: ${FT4}`);
  return A + (C - A) * Math.exp(-Math.exp(-B * (FT4 - M)));
}

// function calculateRtfTsh(A, C, B, D, TSH) {
//   return A * Math.pow(TSH, -B) + C * Math.pow(TSH, -D); 
// }

export async function getDosageData(rtf, weight, path) {
  rtf = Math.round(rtf);
  const response = await fetch(path);
  const text = await response.text();
  const parsed = Papa.parse(text, { header: true });
  const data = parsed.data;
  console.log("Raw parsed dosage data:", parsed.data.slice(0, 10));
  
  const row = data.find((r, idx) => {
    if (!r.Weight || !r.RTF) {
      console.log(`⚠️ Row ${idx} skipped: missing Weight/RTF`, r);
      return false;
    }

    const { min: wMin, max: wMax } = parseRange(r.Weight);
    const { min: rMin, max: rMax } = parseRange(r.RTF);

    console.log(
      `🔎 Checking row ${idx}:`,
      `Weight input=${weight}, Range=[${wMin}, ${wMax}]`,
      `RTF input=${rtf}, Range=[${rMin}, ${rMax}]`
    );

    const weightMatch = weight >= wMin && weight <= wMax;
    const rtfMatch = rtf >= rMin && rtf <= rMax;

    console.log(
      `➡️ Match status (row ${idx}):`,
      { weightMatch, rtfMatch }
    );

    return weightMatch && rtfMatch;
  });

  if (!row) {
    console.warn("No matching bucket found for:", { weight, rtf });
    return null;
  }

  let altValue = null;
  if (row.Alt && row.Alt !== "No") {
    // Strip "Alt = " prefix if present
    altValue = row.Alt.replace(/^Alt\s*=\s*/i, "").trim();
  }

  return {
    LT4: row.LT4 ? parseFloat(row.LT4) : null,
    LT3: row.LT3 ? parseFloat(row.LT3) : null,
    frequency: row.frequency,
    alt: altValue,
  };
}

export async function getRTFfromTT3(weight, height, TT3) {
  if (weight >= 100 && weight <= 360 && height >= 60 && height <= 80) {
    const A = -0.000585442;
    const C = 1.928262534;
    const B = 3.755689878;
    const M = 1.125885678;
    return calculateRTF(A, C, B, M, TT3);
  }
  return null;
}

export async function getFemaleRTFfromTT3(weight, height, TT3) {
  if (weight >= 90 && weight <= 320 && height >= 55 && height <= 75) {
    const A = -0.000615114;
    const C = 1.934728768;
    const B = 3.579018132;
    const M = 1.177086752;
    return calculateRTF(A, C, B, M, TT3);
  }
  return null;
}

export async function getRTFfromFTX(weight, height, FT4, path) {
  const response = await fetch(path); 
  const text = await response.text();
  const parsed = Papa.parse(text, { header: true });
  const data = parsed.data;
  console.log("Raw parsed data:", parsed.data.slice(0, 10));

  const trianglePoints = getLocalTrianglePoints(data, weight, height);
  const triangleEstimate = getInverseDistanceWeightedRTF(
    trianglePoints,
    weight,
    height,
    FT4,
    (row, hormoneValue) => calculateRTF(
      parseFloat(row.a),
      parseFloat(row.b),
      parseFloat(row.c),
      parseFloat(row.d),
      hormoneValue
    )
  );

  if (triangleEstimate !== null) {
    return triangleEstimate;
  }

  const A = getApproxInterpolatedParameter(data, weight, height, 'a');
  console.log("Interpolated A:", A);
  const C = getApproxInterpolatedParameter(data, weight, height, 'b');
  const B = getApproxInterpolatedParameter(data, weight, height, 'c');
  const M = getApproxInterpolatedParameter(data, weight, height, 'd');

  if ([A, B, C, M].some(v => v === null)) return null;

  return calculateRTF(A, C, B, M, FT4);
}

export async function getRTFfromTSH(weight, height, TSH, path) {
  const response = await fetch(path); 
  const text = await response.text();
  const parsed = Papa.parse(text, { header: true });
  const data = parsed.data;
  console.log("Raw parsed data:", parsed.data.slice(0, 10));

  const trianglePoints = getLocalTrianglePoints(data, weight, height);
  const triangleEstimate = getInverseDistanceWeightedRTF(
    trianglePoints,
    weight,
    height,
    TSH,
    (row, hormoneValue) => calculateRtfTsh(
      parseFloat(row.a),
      parseFloat(row.c),
      parseFloat(row.b),
      parseFloat(row.d),
      hormoneValue
    )
  );

  if (triangleEstimate !== null) {
    return triangleEstimate;
  }

  const A = getApproxInterpolatedParameter(data, weight, height, 'a');
  console.log("Interpolated A:", A);
  const C = getApproxInterpolatedParameter(data, weight, height, 'c');
  const B = getApproxInterpolatedParameter(data, weight, height, 'b');
  const D = getApproxInterpolatedParameter(data, weight, height, 'd');

  if ([A, B, C, D].some(v => v === null)) return null;
  console.log("Parameters:", { A, B, C, D, TSH });
  let rtf =  calculateRtfTsh(A, C, B, D, TSH);
  return rtf;
}

function calculateRtfTsh(A, C, B, D, TSH) {
    return A * Math.exp(-B * Math.log10(TSH)) + C * Math.exp(-D * Math.log10(TSH));
  // return A * Math.pow(TSH, -B) + C * Math.pow(TSH, -D); 
}

export const calculateDosage = async (hormones, bmi, gender, height, weight) => {
    // Defensive guard: do not allow all 4 major hormones at once.
    if (
      hormones.has('TSH') &&
      hormones.has('FT4') &&
      hormones.has('FT3') &&
      hormones.has('TT3')
    ) {
      throw new Error('Cannot compute with all 4 hormones selected (TSH, FT4, FT3, TT3).');
    }
    
    let dosageFT3 = null
    let dosageFT4 = null;
    let dosageTT3 = null;
    let dosageTSH = null;
    let dosageData = null;
    
    //NEW LOGIC FOR TT3
    if (hormones.has('TT3') && gender =="Male") {
        console.log(hormones.get("TT3"))
        console.log(hormones.get("weight"))
        const tt3 = parseFloat(hormones.get("TT3"));
        const weight = parseFloat(hormones.get("weight"));
        const height = parseFloat(hormones.get("height"));
        const path = `${process.env.PUBLIC_URL}/data/maleTT3.csv`;
        const rtfTT3 = await getRTFfromTT3(weight, height, tt3);
        console.log("HAS TT3")
        console.log("RTF TT3:", rtfTT3);
        dosageTT3 = rtfTT3
    }

    else if (hormones.has('TT3') && gender =="Female") {
        console.log(hormones.get("TT3"))
        console.log(hormones.get("weight"))
        const tt3 = parseFloat(hormones.get("TT3"));
        const weight = parseFloat(hormones.get("weight"));
        const height = parseFloat(hormones.get("height"));
        const rtfTT3 = await getFemaleRTFfromTT3(weight, height, tt3);
        console.log("HAS TT3")
        console.log("RTF TT3:", rtfTT3);
        dosageTT3 = rtfTT3
    }

    //NEW LOGIC FOR TSH
    if (hormones.has('TSH') && gender == "Male") {
        const TSH = parseFloat(hormones.get("TSH"));
        const weight = parseFloat(hormones.get("weight"));
        const height = parseFloat(hormones.get("height"));
        const path = `${process.env.PUBLIC_URL}/data/maleTSHNEW.csv`;
        const rtfTSH = await getRTFfromTSH(weight, height, TSH,path);
        console.log(rtfTSH)
        dosageTSH = rtfTSH
    }

    else if (hormones.has('TSH') && gender == "Female") {
        const TSH = parseFloat(hormones.get("TSH"));
        const weight = parseFloat(hormones.get("weight"));
        const height = parseFloat(hormones.get("height"));
        const path = `${process.env.PUBLIC_URL}/data/femaleTSH.csv`;
        const rtfTSH = await getRTFfromTSH(weight, height, TSH,path);
        console.log(rtfTSH)
        dosageTSH = rtfTSH
    }

    //NEW LOGIC FOR FT4
    if (hormones.has('FT4') && gender == "Male") {
        console.log(hormones.get("FT4"))
        console.log(hormones.get("weight"))
        const ft4 = parseFloat(hormones.get("FT4"));
        const weight = parseFloat(hormones.get("weight"));
        const height = parseFloat(hormones.get("height"));
        const path = `${process.env.PUBLIC_URL}/data/maleFT4NEW.csv`;
        const rtfFT4 = await getRTFfromFTX(weight, height, ft4,path);
        console.log("HAS FTR")
        console.log("RTF FT4:", rtfFT4);
        dosageFT4 = rtfFT4
    }

    else if (hormones.has('FT4') && gender == "Female") {
        console.log(hormones.get("FT4"))
        console.log(hormones.get("weight"))
        const ft4 = parseFloat(hormones.get("FT4"));
        const weight = parseFloat(hormones.get("weight"));
        const height = parseFloat(hormones.get("height"));
        const path = `${process.env.PUBLIC_URL}/data/femaleFT4.csv`;
        const rtfFT4 = await getRTFfromFTX(weight, height, ft4,path);
        console.log("HAS FTR")
        console.log("RTF FT4:", rtfFT4);
        dosageFT4 = rtfFT4
    }

    //NEW LOGIC FOR FT3
    if (hormones.has('FT3') && gender == "Male"){
        console.log(hormones.get("FT3"))
        console.log(hormones.get("weight"))
        const ft3 = parseFloat(hormones.get("FT3"));
        const weight = parseFloat(hormones.get("weight"));
        const height = parseFloat(hormones.get("height"));
        const path = `${process.env.PUBLIC_URL}/data/maleFT3NEW.csv`; 
        const rtfFT3 = await getRTFfromFTX(weight, height, ft3,path);
        console.log("HAS FTR")
        console.log("RTF FT3:", rtfFT3);
        dosageFT3 = rtfFT3
    }

    else if (hormones.has('FT3') && gender == "Female"){
        console.log(hormones.get("FT3"))
        console.log(hormones.get("weight"))
        const ft3 = parseFloat(hormones.get("FT3"));
        const weight = parseFloat(hormones.get("weight"));
        const height = parseFloat(hormones.get("height"));
        const path = `${process.env.PUBLIC_URL}/data/femaleFT3.csv`; 
        const rtfFT3 = await getRTFfromFTX(weight, height, ft3,path);
        console.log("HAS FTR")
        console.log("RTF FT3:", rtfFT3);
        dosageFT3 = rtfFT3
    }

    //AVERAGE LOGIC - WEIGHTED
    let dosages = [dosageTSH,dosageFT3,dosageFT4,dosageTT3]
    console.log("Dosages:", dosages)
    
    // Determine which hormones are present
    const hasTSH = dosageTSH !== null;
    const hasFT3 = dosageFT3 !== null;
    const hasFT4 = dosageFT4 !== null;
    const hasTT3 = dosageTT3 !== null;
    
    let average_rtf = 0;
    
    // Apply weighted averaging based on hormone combination
    if (hasFT4 && hasTSH && (hasFT3 || hasTT3)) {
        // FT4 & TSH & FT3/TT3 -> weight 40/40/20
        const ft3_or_tt3 = hasFT3 ? dosageFT3 : dosageTT3;
        average_rtf = 0.4 * dosageFT4 + 0.4 * dosageTSH + 0.2 * ft3_or_tt3;
        console.log("Weighted average (FT4 40%, TSH 40%, FT3/TT3 20%):", average_rtf);
    }
    else if (hasFT4 && hasTSH) {
        // FT4 & TSH -> weight 50/50
        average_rtf = 0.5 * dosageFT4 + 0.5 * dosageTSH;
        console.log("Weighted average (FT4 50%, TSH 50%):", average_rtf);
    }
    else if (hasFT4 && hasFT3) {
        // FT4 & FT3 -> weight 70/30
        average_rtf = 0.7 * dosageFT4 + 0.3 * dosageFT3;
        console.log("Weighted average (FT4 70%, FT3 30%):", average_rtf);
    }
    else if (hasFT4 && hasTT3) {
        // FT4 & TT3 -> weight 50/50
        average_rtf = 0.5 * dosageFT4 + 0.5 * dosageTT3;
        console.log("Weighted average (FT4 50%, TT3 50%):", average_rtf);
    }
    else if (hasTSH && hasFT3) {
        // TSH & FT3 -> weight 70/30
        average_rtf = 0.7 * dosageTSH + 0.3 * dosageFT3;
        console.log("Weighted average (TSH 70%, FT3 30%):", average_rtf);
    }
    else if (hasTSH && hasTT3) {
        // TSH & TT3 -> weight 50/50
        average_rtf = 0.5 * dosageTSH + 0.5 * dosageTT3;
        console.log("Weighted average (TSH 50%, TT3 50%):", average_rtf);
    }
    else if (hasFT4) {
        // FT4 alone: 100%
        average_rtf = dosageFT4;
        console.log("Single hormone (FT4 100%):", average_rtf);
    }
    else if (hasTSH) {
        // TSH alone: 100%
        average_rtf = dosageTSH;
        console.log("Single hormone (TSH 100%):", average_rtf);
    }
    
    console.log("Average RTF: ", average_rtf)
    
    // Use converted weight and height from hormones Map (already in lbs and inches)
    const weightInLbs = parseFloat(hormones.get("weight"));
    const heightInInches = parseFloat(hormones.get("height"));
    console.log("Weight (lbs): ", weightInLbs)
    console.log("Height (inches): ", heightInInches)
    
    if (average_rtf > 1) {
      average_rtf = 1;
    }
    if (heightInInches <= 59 && heightInInches >= 55 && gender == "Female")
    {
      dosageData = await getDosageData(average_rtf*100, weightInLbs, `${process.env.PUBLIC_URL}/dosing/Female55-59Alts.csv`);
    }
    if (heightInInches <= 64 && heightInInches >= 60)
    {
      if (gender == "Male") {
        dosageData = await getDosageData(average_rtf*100, weightInLbs, `${process.env.PUBLIC_URL}/dosing/Male60-64Alts.csv`);
      }
      else {
        dosageData = await getDosageData(average_rtf*100, weightInLbs, `${process.env.PUBLIC_URL}/dosing/Female60-64Alts.csv`);
      }
    }
    else if (heightInInches <= 69 && heightInInches > 64)
    {
      if (gender == "Male"){
        dosageData = await getDosageData(average_rtf*100, weightInLbs, `${process.env.PUBLIC_URL}/dosing/Male65-69Alts.csv`);
      }
      else {
        dosageData = await getDosageData(average_rtf*100, weightInLbs, `${process.env.PUBLIC_URL}/dosing/Female65-69Alts.csv`);
      }
    }
    else if (heightInInches <= 74 && heightInInches > 69 && gender == "Male") {
      dosageData = await getDosageData(average_rtf*100, weightInLbs, `${process.env.PUBLIC_URL}/dosing/Male70-74Alts.csv`);
    }
    else if (heightInInches > 69 && heightInInches <= 75 && gender == "Female") {
      dosageData = await getDosageData(average_rtf*100, weightInLbs, `${process.env.PUBLIC_URL}/dosing/Female70-75Alts.csv`);
    }
    else if (heightInInches <= 80 && heightInInches > 74 && gender == "Male") {
      dosageData = await getDosageData(average_rtf*100, weightInLbs, `${process.env.PUBLIC_URL}/dosing/Male75-80Alts.csv`);
    }
    return { rtf: average_rtf, dosageData };
  };
  
