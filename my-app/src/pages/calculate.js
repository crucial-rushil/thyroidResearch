
export const calculateDosage = (hormones, bmi, gender) => {
    
    let dosageTT4 = null;
    let dosageFT3 = null
    let dosageFT4 = null;
    
    if (hormones.has('TT4') && gender === 'Male' && bmi === "17") {
        const constant1 = -0.000233; 
        const constant2 = 1.583;
        const exponent = -0.05264 * (hormones.get('TT4') - 57.15);
        dosageTT4 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    } 

    else if (hormones.has('TT4') && gender === 'Male' && bmi === "23") {
        const constant1 = -0.002095;
        const constant2 = 1.676;
        const exponent = -0.04886 * (hormones.get('TT4') - 59.95);
        dosageTT4 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('TT4') && gender === 'Male' && bmi === "35") {
        const constant1 = -0.001712;
        const constant2 = 1.668;
        const exponent = -0.04831 * (hormones.get('TT4') - 61.84);
        dosageTT4 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('TT4') && gender === 'Female' && bmi === "17") {
        const constant1 = -0.003621;
        const constant2 = 1.789;
        const exponent = -0.04747 * (hormones.get('TT4') - 57.96);
        dosageTT4 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('TT4') && gender === 'Female' && bmi === "23") {
        const constant1 = -0.003232;
        const constant2 = 1.774;
        const exponent = -0.04696 * (hormones.get('TT4') - 59.70);
        dosageTT4 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('TT4') && gender === 'Female' && bmi === "35") {
        const constant1 = -0.000277;
        const constant2 = 1.759;
        const exponent = -0.04635 * (hormones.get('TT4') - 61.92);
        dosageTT4 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    if (hormones.has('FT4') && gender === 'Male' && bmi === "17") {
        const constant1 = -0.005008;
        const constant2 = 1.559;
        const exponent = -0.02929 * (hormones.get('FT4') - 8.839);
        dosageFT4 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('FT4') && gender === 'Male' && bmi === "23") {
        const constant1 = -0.004914;
        const constant2 = 1.532;
        const exponent = -0.02808 * (hormones.get('FT4') - 9.251);
        dosageFT4 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }
    
    else if (hormones.has('FT4') && gender === 'Male' && bmi === "35") {
        const constant1 = -0.004943;
        const constant2 = 1.493;
        const exponent = -0.02618 * (hormones.get('FT4') - 9.900);
        dosageFT4 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('FT4') && gender === 'Female' && bmi === "17") {
        const constant1 = -0.005006;
        const constant2 = 1.606;
        const exponent = -0.3116 * (hormones.get('FT4') - 8.314);
        dosageFT4 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('FT4') && gender === 'Female' && bmi === "23") {
        const constant1 = -0.004786;
        const constant2 = 1.578;
        const exponent = -0.3000 * (hormones.get('FT4') - 8.708);
        dosageFT4 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('FT4') && gender === 'Female' && bmi === "35") {
        const constant1 = -0.004633;
        const constant2 = 1.537;
        const exponent = -0.2823 * (hormones.get('FT4') - 9.309);
        dosageFT4 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    if (hormones.has('FT3') && gender === 'Male' && bmi === "17") {
        const constant1 = -0.001617;
        const constant2 = 1.746;
        const exponent = -1.384 * (hormones.get('FT3') - 2.78);
        dosageFT3 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('FT3') && gender === 'Male' && bmi === "23") {
        const constant1 = -0.001364;
        const constant2 = 1.707;
        const exponent = -1.666 * (hormones.get('FT3') - 2.326);
        dosageFT3 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
    }

    else if (hormones.has('FT3') && gender === 'Male' && bmi === "35") {
        const constant1 = -0.001575;
        const constant2 = 1.674;
        const exponent = -2.186 * (hormones.get('FT3') - 1.763);
        dosageFT3 = constant1 + (constant2 * Math.exp(-Math.exp(exponent)));
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

    let dosages = [dosageTT4,dosageFT3,dosageFT4]
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

    return (average / counter)
  };
  