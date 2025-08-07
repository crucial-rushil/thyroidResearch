import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

function bilinearInterpolation(x, y, x1, x2, y1, y2, Q11, Q21, Q12, Q22) {
  const denom = (x2 - x1) * (y2 - y1);
  return (
    Q11 * (x2 - x) * (y2 - y) / denom +
    Q21 * (x - x1) * (y2 - y) / denom +
    Q12 * (x2 - x) * (y - y1) / denom +
    Q22 * (x - x1) * (y - y1) / denom
  );
}

function getInterpolatedParameter(data, weight, height, param) {
  console.log(`Interpolating for weight: ${weight}, height: ${height}, parameter: ${param}`);
  const weights = [...new Set(data.map(row => parseInt(row['Weight'])))].sort((a, b) => a - b);
  const heights = [...new Set(data.map(row => parseInt(row['Height'])))].sort((a, b) => a - b);
  
  const x1 = Math.max(...weights.filter(w => w <= weight));
  const x2 = Math.min(...weights.filter(w => w >= weight));
  const y1 = Math.max(...heights.filter(h => h <= height));
  const y2 = Math.min(...heights.filter(h => h >= height));

  const findValue = (x, y) => {
  const row = data.find(r =>
    Math.round(Number(r['Weight'])) === Math.round(x) &&
    Math.round(Number(r['Height'])) === Math.round(y)
  );
  return row ? parseFloat(row[param]) : null;
  };

  const Q11 = findValue(x1, y1);
  const Q21 = findValue(x2, y1);
  const Q12 = findValue(x1, y2);
  const Q22 = findValue(x2, y2);

  if ([Q11, Q21, Q12, Q22].some(v => v === null)) {
    console.warn('Interpolation failed: missing Q values');
    return null;
  }

  return bilinearInterpolation(weight, height, x1, x2, y1, y2, Q11, Q21, Q12, Q22);
}

function calculateRTF(A, C, B, M, FT4) {
  console.log(`Calculating RTF with A: ${A}, C: ${C}, B: ${B}, M: ${M}, FT4: ${FT4}`);
  return A + (C - A) * Math.exp(-Math.exp(-B * (FT4 - M)));
}

function calculateRtfTsh(A, C, B, D, TSH) {
  return A * Math.pow(TSH, -B) + C * Math.pow(TSH, -D); 
}

export async function getRTFfromFT4(weight, height, FT4, path) {
  const response = await fetch(path); 
  const text = await response.text();
  const parsed = Papa.parse(text, { header: true });
  const data = parsed.data;
  console.log("Raw parsed data:", parsed.data.slice(0, 10));
  const A = getInterpolatedParameter(data, weight, height, 'lower_asymptote');
  console.log("Interpolated A:", A);
  const C = getInterpolatedParameter(data, weight, height, 'upper_asymptote');
  const B = getInterpolatedParameter(data, weight, height, 'growth_rate');
  const M = getInterpolatedParameter(data, weight, height, 'inflection_point');

  if ([A, B, C, M].some(v => v === null)) return null;

  return calculateRTF(A, C, B, M, FT4);
}

export async function getRTFfromTSH(weight, height, TSH, path) {
  const response = await fetch(path); 
  const text = await response.text();
  const parsed = Papa.parse(text, { header: true });
  const data = parsed.data;
  console.log("Raw parsed data:", parsed.data.slice(0, 10));
  const A = getInterpolatedParameter(data, weight, height, 'a');
  const C = getInterpolatedParameter(data, weight, height, 'c');
  const B = getInterpolatedParameter(data, weight, height, 'b');
  const D = getInterpolatedParameter(data, weight, height, 'd');

  if ([A, B, C, D].some(v => v === null)) return null;

  return calculateRtfTsh(A, C, B, D, TSH);
}



//MODIFY OLD CALCULATE DOSAGE FUNCTION
export const calculateDosage = async (hormones, bmi, gender) => {
    
    let dosageTT4 = null;
    let dosageFT3 = null
    let dosageFT4 = null;
    let dosageTT3 = null;
    let dosageTSH = null;
    
    //NEW LOGIC FOR TT3
    if (hormones.has('TT3')) {
        console.log(hormones.get("TT3"))
        console.log(hormones.get("weight"))
        const tt3 = parseFloat(hormones.get("TT3"));
        const weight = parseFloat(hormones.get("weight"));
        const height = parseFloat(hormones.get("height"));
        const path = '/data/maleTT3.csv';
        const rtfTT3 = await getRTFfromFT4(weight, height, tt3,path);
        console.log("HAS TT3")
        console.log("RTF TT3:", rtfTT3);
        dosageTT3 = rtfTT3
    }

    //NEW LOGIC FOR TSH
    else if (hormones.has('TSH')) {
        const TSH = parseFloat(hormones.get("TSH"));
        const weight = parseFloat(hormones.get("weight"));
        const height = parseFloat(hormones.get("height"));
        const path = '/data/tshlog.csv';
        const rtfTSH = await getRTFfromTSH(weight, height, TSH,path);
        dosageTSH = rtfTSH
    }

    //NEW LOGIC FOR FT4
    else if (hormones.has('FT4')) {
        console.log(hormones.get("FT4"))
        console.log(hormones.get("weight"))
        const ft4 = parseFloat(hormones.get("FT4"));
        const weight = parseFloat(hormones.get("weight"));
        const height = parseFloat(hormones.get("height"));
        const path = '/data/maleFT41.csv';
        const rtfFT4 = await getRTFfromFT4(weight, height, ft4,path);
        console.log("HAS FTR")
        console.log("RTF FT4:", rtfFT4);
        dosageFT4 = rtfFT4
    }

    //NEW LOGIC FOR FT3
    else if (hormones.has('FT3')){
        console.log(hormones.get("FT3"))
        console.log(hormones.get("weight"))
        const ft3 = parseFloat(hormones.get("FT3"));
        const weight = parseFloat(hormones.get("weight"));
        const height = parseFloat(hormones.get("height"));
        const path = '/data/maleFT3.csv'; 
        const rtfFT3 = await getRTFfromFT4(weight, height, ft3,path);
        console.log("HAS FTR")
        console.log("RTF FT3:", rtfFT3);
        dosageFT3 = rtfFT3
    }

    else if (hormones.has('FT3') && gender === 'Female' && bmi === "17") {
        const constant1 = -0.01591;
        const constant2 = 1.816;
        const exponent = -1.165 * (hormones.get('FT3') - 3.295);
        dosageFT3 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('FT3') && gender === 'Female' && bmi === "17") {
        const constant1 = -0.005008;
        const constant2 = 1.559;
        const exponent = -0.02929 * (hormones.get('FT3') - 8.839);
        dosageFT3 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('FT3') && gender === 'Female' && bmi === "23") {
        const constant1 = -0.001486;
        const constant2 = 1.764;
        const exponent = -1.412 * (hormones.get('FT3') - 2.751);
        dosageFT3 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('FT3') && gender === 'Female' && bmi === "35") {
        const constant1 = -0.001418;
        const constant2 = 1.710;
        const exponent = -1.1885 * (hormones.get('FT3') - 2.073);
        dosageFT3 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    //AVERAGE LOGIC
    let dosages = [dosageTSH,dosageFT3,dosageFT4,dosageTT3]
    console.log("Dosages:", dosages)
    let counter = 0
    let average = 0
    for (let i=0; i<dosages.length; i++)
        {
            if (dosages[i] != null)
                {
                    average += dosages[i]
                    counter += 1
                }
        }
    console.log("Calculation: ",average/counter)
    return (average / counter)
  };
  