
export const calculateDosage = (hormone, value, bmi, gender) => {
    
    let dosage = 0;
    
    if (hormone === 'TSH' && gender === 'Male' && bmi === "17") {
      dosage = 0.008349 + Math.pow((2.332 * value),-1.547)
    } 

    else if (hormone === 'TSH' && gender === 'Male' && bmi === "23") {
        dosage = 0.008363 + Math.pow((2.578 * value),-1.543)
    }

    else if (hormone === 'TSH' && gender === 'Male' && bmi === "35") {
        dosage = 0.008367 + Math.pow((2.949 * value),-1.538)
    }

    else if (hormone === 'TSH' && gender === 'Female' && bmi === "17") {
        dosage = 0.008312 + Math.pow((1.926 * value),-1.551)
    }

    else if (hormone === 'TSH' && gender === 'Female' && bmi === "23") {
        dosage = 0.008349 + Math.pow((2.168 * value),-1.547)
    }

    else if (hormone === 'TSH' && gender === 'Female' && bmi === "35") {
        dosage = 0.008364 + Math.pow((2.542 * value),-1.541)
    }

    return dosage
  };
  