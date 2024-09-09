
export const calculateDosage = (hormone, value, bmi, gender) => {
    
    let dosage = 0;
    
    
    if (hormone && gender === 'Male' && bmi === "17") {
        const constant1 = -0.000233; 
        const constant2 = 1.583;
        const exponent = -0.05264 * (value - 57.15);
        dosage = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    } 

    else if (hormone && gender === 'Male' && bmi === "23") {
        const constant1 = -0.002095;
        const constant2 = 1.676;
        const exponent = -0.04886 * (value - 59.95);
        dosage = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormone && gender === 'Male' && bmi === "35") {
        const constant1 = -0.001712;
        const constant2 = 1.668;
        const exponent = -0.04831 * (value - 61.84);
        dosage = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormone && gender === 'Female' && bmi === "17") {
        const constant1 = -0.003621;
        const constant2 = 1.789;
        const exponent = -0.04747 * (value - 57.96);
        dosage = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormone && gender === 'Female' && bmi === "23") {
        const constant1 = -0.003232;
        const constant2 = 1.774;
        const exponent = -0.04696 * (value - 59.70);
        dosage = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormone && gender === 'Female' && bmi === "35") {
        const constant1 = -0.000277;
        const constant2 = 1.759;
        const exponent = -0.04635 * (value - 61.92);
        dosage = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    return dosage
  };
  