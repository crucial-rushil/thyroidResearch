/**
 * initial conditions for new thyrosim model
 */
function initialize(
    dial = [1.0, 0.88, 1.0, 0.88],
    scale_Vp = true,
    height = 1.70,
    weight = 70,
    sex = true, // true = male, false = female
    fitting_index = [],         // needed in fitting
    p_being_optimized = [],     // needed in fitting
    fixed_parameters = [],      // array of [a, b] pairs means fix p[a] at b 
    scale_plasma_ode = true,
    scale_slow_ode = false,
    scale_fast_ode = false,
    scale_allometric_exponent = false,
    scale_clearance_by_gender = true
) {
    // initial conditions
    const ic = new Array(19).fill(0);
    ic[0] = 0.322114215761171;
    ic[1] = 0.201296960359917;
    ic[2] = 0.638967411907560;
    ic[3] = 0.00663104034826483;
    ic[4] = 0.0112595761822961;
    ic[5] = 0.0652960640300348;
    ic[6] = 1.78829584764370;
    ic[7] = 7.05727560072869;
    ic[8] = 7.05714474742141;
    ic[9] = 0;
    ic[10] = 0;
    ic[11] = 0;
    ic[12] = 0;
    ic[13] = 3.34289716182018;
    ic[14] = 3.69277248068433;
    ic[15] = 3.87942133769244;
    ic[16] = 3.90061903207543;
    ic[17] = 3.77875734283571;
    ic[18] = 3.55364471589659;

    // Parameter values
    const p = new Array(100).fill(0);
    p[0] = 0.0027785399344; //S4 (fitted)
    p[1] = 8;               //tau
    p[2] = 0.868;           //k12
    p[3] = 0.108;           //k13
    p[4] = 584;             //k31free
    p[5] = 1503;            //k21free
    p[6] = 0.000289;        //A
    p[7] = 0.000214;        //B
    p[8] = 0.000128;        //C
    p[9] = -8.83e-6;        //D
    p[10] = 0.88;           //k4absorb; originally 0.881
    p[11] = 0.0189;         //k02
    p[12] = 0.012101809339; //VmaxD1fast (fitted)
    p[13] = 2.85;           //KmD1fast
    p[14] = 6.63e-4;        //VmaxD1slow
    p[15] = 95;             //KmD1slow
    p[16] = 0.00074619;     //VmaxD2slow
    p[17] = 0.075;          //KmD2slow
    p[18] = 3.3572e-4;      //S3
    p[19] = 5.37;           //k45
    p[20] = 0.0689;         //k46
    p[21] = 127;            //k64free
    p[22] = 2043;           //k54free
    p[23] = 0.00395;        //a
    p[24] = 0.00185;        //b
    p[25] = 0.00061;        //c
    p[26] = -0.000505;      //d
    p[27] = 0.88;           //k3absorb
    p[28] = 0.184972339613; //k05 (fitted)
    p[29] = 450;            //Bzero (fixed so max TSH is about 1000)
    p[30] = 219.7085301388; //Azero (fitted)
    p[31] = 0;              //Amax (set to 0 because 1976 weeke says hypothyroid patients should have no oscillations)
    p[32] = -3.71;          //phi
    p[33] = 0.53;           //kdegTSH-HYPO
    p[34] = 0.226;          //VmaxTSH (originally it's 0.037 but this is probably a typo because eq4 of 2010 eigenberg it not a real hill function)
    p[35] = 23;             //K50TSH
    p[36] = 0.058786935033; //k3 (fitted)
    p[37] = 0.29;           //T4P-EU
    p[38] = 0.006;          //T3P-EU
    p[39] = 0.037;          //KdegT3B
    p[40] = 0.0034;         //KLAG-HYPO
    p[41] = 5;              //KLAG
    p[42] = 1.3;            //k4dissolve
    p[43] = 0.12;           //k4excrete; originally 0.119 (change with dial 2)
    p[44] = 1.78;           //k3dissolve
    p[45] = 0.12;           //k3excrete; originally 0.118 (change with dial 4)
    p[46] = 3.2;            //Vp
    p[47] = 5.2;            //VTSH 

    //parameters for hill functions in f_circ and SRtsh
    p[48] = 3.001011022378; //K_circ (fitted)
    p[49] = 3.094711690204; //K_SR_tsh (fitted)
    p[50] = 5.674773816316; //n, hill exponent in f_circ (fitted)
    p[51] = 6.290803221796; //m, hill exponent in SR_tsh (fitted)
    p[52] = 8.498343729591; //K_f4 for f4 (fitted)
    p[53] = 14.36664496926; //l, hill exponent for f4 (fitted)

    // p[54] = 0.0 // T4 oral dose
    // p[55] = 0.0 // T3 oral dose

    // dial parameters 
    p[56] = dial[0]; // controls T4 secretion rate
    p[57] = dial[1]; // controls T4 excretion rate
    p[58] = dial[2]; // controls T3 secretion rate
    p[59] = dial[3]; // controls T3 excretion rate

    // variance parameters for T4/T3/TSH and schneider error (these are used only for parameter estimation!)
    p[60] = 5.003761571969437;   // σ for T4 in Blakesley (fixed to reasonable value before fitting)
    p[61] = 0.11122955089297369; // σ for T3 Blakesley and Jonklaas (fixed to reasonable value before fitting)
    p[62] = 0.4;                 // σ for TSH in Blakesley and Jonklaas (fixed to reasonable value before fitting)
    p[63] = 0.1;                 // σ for FT4 in Jonklaas (fixed to reasonable value before fitting)

    // Blakesley reference BMI
    p[64] = 21.82854404275587; // (male, fitted)
    p[65] = 22.99050845201536; // w / h^2 (female, fitted)

    // Vtsh scaling factor
    p[66] = 1.0;

    // extra parameter
    // p[67] = 22.5 // w / h^2 (female)

    // Volume scaling ratio
    p[68] = 1.0;  // Plasma volume ratio
    p[69] = -1.0; // Plasma volume (forgot what this is supposed to represent)
    p[70] = 1.0;  // allometric exponent for plasma volume

    // slow compartment scaling ratio
    p[71] = 1.0; // fat-free constant
    p[72] = 0.0; // fat constant
    p[73] = 1.0; // scaling ratio for slow compartment

    // fast compartment scaling ratio
    p[74] = 1.0;

    // allometric exponent for k05 
    //p[75] = 0.75 // for male (fixed)
    //p[76] = 0.75 // for female (fixed, 0.75 works well)

    // ref height for male and female
    p[77] = 1.7608716659237555; // (fitted)
    p[78] = 1.6696106891941103; // (fitted)

    // clearance scale (male / female)
    p[79] = 1.0499391485135692; // male clearance (fitted)

    // infusion parameters
    p[80] = 0.0; // T4 infusion
    p[81] = 0.0; // T3 infusion

    // change fitting parameters
    if (fitting_index.length > 0) {
        for (let i = 0; i < fitting_index.length; i++) {
            p[fitting_index[i]] = p_being_optimized[i];
        }
    }

    // scale plasma parameters
    const ref_bmi = sex ? p[64] : p[65];
    if (scale_plasma_ode) {
        // for now, assume male and females have the same ref Vp (ie average male/female ref Vp)
        const ref_Vp = (reference_Vp(ref_bmi, true, p[77]) + reference_Vp(ref_bmi, false, p[78])) / 2;
        p[68] = predict_Vp(height, weight, sex) / ref_Vp;
    }
    if (scale_allometric_exponent) {
        p[70] = 0.75;
    }

    // scale slow compartment
    if (scale_slow_ode) {
        const ref_weight = sex ? p[64] * Math.pow(p[77], 2) : p[65] * Math.pow(p[78], 2);
        const ref_fat_free_mass = reference_fat_free_mass(sex, p[77], p[78]);
        const ref_fat_mass = ref_weight - ref_fat_free_mass;
        const slow_compartment_scale = (p[71] * fat_free_mass(sex, height) + p[72] * (weight - fat_free_mass(sex, height))) / 
            (p[71] * ref_fat_free_mass + p[72] * ref_fat_mass);
        p[73] = slow_compartment_scale;
    }

    // scale fast compartment
    if (scale_fast_ode) {
        p[74] = 1.0;
    }

    if (scale_Vp) {
        const [Vp, Vtsh] = plasma_volume(height, weight, sex, p[66], ref_bmi, p[77], p[78]);
        p[46] = Vp;
        p[47] = Vtsh;
    }

    // Making K05 a function of sex - Katarina
    const p29_original = p[28];

    if (sex) {  // male
        p[28] = p29_original * p[79];
    } else {    // female
        p[28] = p29_original;
    }

    // fix parameters declared by users
    for (const [a, b] of fixed_parameters) {
        p[a] = b;
    }

    return [ic, p, p[47]];  // return Vtsh explicitly
}

/**
 * plasma_volume(height, weight, sex, p)
 *
 * Parameters used to get reference plasma volume (Vp) values:
 * MCL: NEED TO DOUBLE-CHECK HEIGHT/WEIGHT
 * Blakesley data: half male, half female all of "normal weight and height" (but no values given in paper).
 * height: Average height in USA.
 * weight: I think we used approximate values from back-transforming it from BMI = 22.5?
 *     male_height   = 1.70
 *     female_height = 1.63
 *     male_weight   = 70.0
 *     female_weight = 59.0
 *
 * The transform equation is `Vp_new = 3.2 * Vp_predicted / Vp_ref` where `Vp_ref` is 
 * the predicted Vp for the reference male/female patients. Thus, a reference
 * patient would have Vp_new = 3.2.
 *
 * Inputs
 * + `h`: height measured in meters
 * + `w`: weight measured in KG 
 * + `sex`: true = male, false = female
 *
 * Optional inputs
 * + `male_ref_vp`: male reference Vp
 * + `female_ref_vp`: female reference Vp
 *
 * Outputs 
 * + `Vp_new`: Scaled plasma volume (liters)
 * + `Vtsh_new`: Scaled TSH distribution volume (liters)
 */
function plasma_volume(h, w, sex, 
    Vtsh_scale = 1.0, ref_bmi = 22.5,
    male_ref_height = 1.7, female_ref_height = 1.63
) {
    // for now, assume male and females have the same ref Vp (ie average male/female ref Vp)
    const ref_Vp = (reference_Vp(ref_bmi, true, male_ref_height) + reference_Vp(ref_bmi, false, female_ref_height)) / 2;
    const Vp_new = predict_Vp(h, w, sex) * 3.2 / ref_Vp;

    // scale Vtsh according to Vtsh_new = Vtsh_old + c(Vp_new - Vp_old) 
    const Vtsh_new = 5.2 + Vtsh_scale * (Vp_new - 3.2);  // changed 5.2 to Vtsh= = p[47] - KATARINA 08/18/25

    return [Vp_new, Vtsh_new];
}

/**
 * reference_Vp(ref_BMI, sex)
 *
 * Calculates the "reference plasma volume" for Blakesleys patients with specified
 *
 * Since the predicted plasma volume from Feldschush's data is not 3.2, this
 * reference volume is used to scale the predicted volume to 3.2. 
 */
function reference_Vp(ref_BMI, sex, ref_height) {
    // calculate weight for specified ref_BMI. Ideal weight (iw) is fitted to Feldschush's data
    let iw;
    if (sex) {
        iw = 176.3 - 220.6 * ref_height + 93.5 * Math.pow(ref_height, 2);
    } else {
        iw = 145.8 - 182.7 * ref_height + 79.55 * Math.pow(ref_height, 2);
    }
    const w = ref_BMI * Math.pow(ref_height, 2);

    return predict_Vp(ref_height, w, sex);
}

/**
 * predict_Vp(h, w, sex)
 *
 * Computes the predicted plasma volume based on data fitted to Feldchush's data
 *
 * Inputs
 * + `h`: height measured in meters
 * + `w`: weight measured in KG 
 * + `sex`: true = male, false = female
 */
function predict_Vp(h, w, sex) {  // KATARINA 08/18/25
    // Hematocrit level: 0.45 for male, 0.40 for female
    const Hem = 0.40 + 0.05 * (sex ? 1 : 0);

    let iw;
    if (sex) {
        iw = 176.3 - 220.6 * h + 93.5 * Math.pow(h, 2);
    } else {
        iw = 145.8 - 182.7 * h + 79.55 * Math.pow(h, 2);
    }

    // Percent deviation from ideal weight
    const Δiw = (w - iw) / iw * 100;

    let Vb_per_kg;
    if (sex) {
        Vb_per_kg = 71.96 * Math.exp(-0.007516 * Δiw);
    } else {
        Vb_per_kg = 43.65 + 20.79 * Math.exp(-0.01545 * Δiw) + 2.043 * Math.exp(-0.08392 * Δiw);
    }

    // Compute total blood volume in liters
    const Vb = Vb_per_kg * w / 1000;

    // Return plasma volume (liters)
    return Vb * (1 - Hem);
}

function blood_volume(h, w, sex) { // KATARINA 08/18/25
    const Hem = 0.40 + 0.05 * (sex ? 1 : 0);  // 0.45 for males, 0.40 for females by default
    const BMI = w / Math.pow(h, 2);

    let iw;
    if (sex) {
        iw = 176.3 - 220.6 * h + 93.5 * Math.pow(h, 2);
    } else {
        iw = 145.8 - 182.7 * h + 79.55 * Math.pow(h, 2);
    }

    // % deviation from ideal weight
    const Δiw = (w - iw) / iw * 100;

    // Use refit sex-specific blood volume per kg
    let Vb_per_kg;
    if (sex) {
        Vb_per_kg = 71.96 * Math.exp(-0.007516 * Δiw);
    } else {
        Vb_per_kg = 43.65 + 20.79 * Math.exp(-0.01545 * Δiw) + 2.043 * Math.exp(-0.08392 * Δiw);
    }

    console.log("Ideal Weight (iw): ", Math.round(iw * 100) / 100, " kg");  
    
    // Return blood volume in liters
    return Vb_per_kg * w / 1000;
}

/**
 * ODEs for latest thyrosim model. 
 */
function thyrosim(dq, q, p, t) {
    const kdelay = 5/8;

    // scaling the mass/concentration of compartments
    const plasma_volume_ratio = Math.pow(p[68], p[70]);
    const slow_volume_ratio = Math.pow(p[73], p[70]);
    const fast_volume_ratio = Math.pow(p[74], p[70]);

    // scale compartment sizes
    const q1 = q[0] * 1 / p[68];
    const q2 = q[1] * 1 / p[74];
    const q3 = q[2] * 1 / p[73];
    const q4 = q[3] * 1 / p[68];
    const q5 = q[4] * 1 / p[74];
    const q6 = q[5] * 1 / p[73];
    const q7 = q[6] * 1 / p[68];

    // adhoc fix for https://github.com/biona001/Thyrosim.jl/issues/1
    for (let i = 0; i < q.length; i++) {
        if (q[i] < 0) {
            q[i] = 0;
        }
    }

    // Auxiliary equations
    const q4F = (p[23] + p[24] * q1 + p[25] * Math.pow(q1, 2) + p[26] * Math.pow(q1, 3)) * q4; //FT3p
    const q1F = (p[6] + p[7] * q1 + p[8] * Math.pow(q1, 2) + p[9] * Math.pow(q1, 3)) * q1;  //FT4p
    const SR3 = (p[18] * p[58] * q[18]);                                        //Brain delay (dial 3)
    const SR4 = (p[0] * p[56] * q[18]);                                         //Brain delay (dial 1)
    const fCIRC = Math.pow(q[8], p[50]) / (Math.pow(q[8], p[50]) + Math.pow(p[48], p[50]));
    const SRTSH = (p[29] + p[30] * fCIRC * Math.sin(Math.PI/12 * t - p[32])) * (Math.pow(p[49], p[51]) / (Math.pow(p[49], p[51]) + Math.pow(q[8], p[51])));
    const fdegTSH = p[33] + p[34] / (p[35] + q7);
    const fLAG = p[40] + 2 * Math.pow(q[7], 11) / (Math.pow(p[41], 11) + Math.pow(q[7], 11));
    const f4 = p[36] * (1 + 5 * Math.pow(p[52], p[53]) / (Math.pow(p[52], p[53]) + Math.pow(q[7], p[53])));
    const NL = p[12] / (p[13] + q2);

    // ODEs
    dq[0] = p[80] + (SR4 + p[2] * q2 + p[3] * q3 - (p[4] + p[5]) * q1F) * plasma_volume_ratio + p[10] * q[10]; //T4dot (need to remove u1)
    dq[1] = (p[5] * q1F - (p[2] + p[11] + NL) * q2) * fast_volume_ratio;                                    //T4fast
    dq[2] = (p[4] * q1F - (p[3] + p[14] / (p[15] + q3) + p[16] / (p[17] + q3)) * q3) * slow_volume_ratio;  //T4slow
    dq[3] = p[81] + (SR3 + p[19] * q5 + p[20] * q6 - (p[21] + p[22]) * q4F) * plasma_volume_ratio + p[27] * q[12]; //T3pdot
    dq[4] = (p[22] * q4F + NL * q2 - (p[19] + p[28]) * q5) * fast_volume_ratio;                         //T3fast
    dq[5] = (p[21] * q4F + p[14] * q3 / (p[15] + q3) + p[16] * q3 / (p[17] + q3) - (p[20]) * q6) * slow_volume_ratio; //T3slow
    dq[6] = (SRTSH - fdegTSH * q7) * plasma_volume_ratio;                                           //TSHp
    dq[7] = f4 / p[37] * q1 + p[36] / p[38] * q4 - p[39] * q[7];          //T3B
    dq[8] = fLAG * (q[7] - q[8]);                                             //T3B LAG
    dq[9] = -p[42] * q[9];                                                   //T4PILLdot
    dq[10] = p[42] * q[9] - (p[43] * p[57] + p[10]) * q[10];                  //T4GUTdot: note p[43] * p[57] = p[43] * dial[1] = k4excrete
    dq[11] = -p[44] * q[11];                                                   //T3PILLdot
    dq[12] = p[44] * q[11] - (p[45] * p[59] + p[27]) * q[12];                 //T3GUTdot: note p[45] * p[59] = p[45] * dial[3] = k3excrete

    // Delay ODEs
    dq[13] = kdelay * (q7 - q[13]);
    dq[14] = kdelay * (q[13] - q[14]);                                         //delay2
    dq[15] = kdelay * (q[14] - q[15]);                                         //delay3
    dq[16] = kdelay * (q[15] - q[16]);                                         //delay4
    dq[17] = kdelay * (q[16] - q[17]);                                         //delay5
    dq[18] = kdelay * (q[17] - q[18]);                                         //delay6
}

function output_equations(sol, p) {
    const result = [];
    const numTimePoints = sol[0].length;
    
    result[0] = new Array(numTimePoints); // T4
    result[1] = new Array(numTimePoints); // T3
    result[2] = new Array(numTimePoints); // TSH
    
    for (let i = 0; i < numTimePoints; i++) {
        result[0][i] = 777.0 * sol[0][i] / p[46]; //T4
        result[1][i] = 651.0 * sol[3][i] / p[46]; //T3
        result[2][i] = 5.6 * sol[6][i] / p[47];   //TSH
    }
    
    return result;
}

/**
 * Set initial conditions from data. Options to set other compartments to steady state,
 * optionally including the TSH lag compartments.
 */
function set_patient_ic(ic, p, t4, t3, tsh, steady_state = false, set_tsh_lag = false) {
    // Set IC for observed compartments. 
    ic[0] = (p[46] * t4) / 777.0;
    ic[3] = (p[46] * t3) / 651.0;
    ic[6] = (p[47] * tsh) / 5.6;
    
    if (steady_state) {
        const q4F = (p[23] + p[24] * ic[0] + p[25] * Math.pow(ic[0], 2) + p[26] * Math.pow(ic[0], 3)) * ic[3]; //FT3p
        const q1F = (p[6] + p[7] * ic[0] + p[8] * Math.pow(ic[0], 2) + p[9] * Math.pow(ic[0], 3)) * ic[0];  //FT4p
        
        let B = p[5] * q1F - p[13] * (p[2] + p[11]) - p[12];
        let A = -(p[2] + p[11]);
        let C = p[5] * p[13] * q1F;
        ic[1] = (-B - Math.sqrt(Math.pow(B, 2) - 4.0 * A * C)) / (2.0 * A);
        
        B = p[4] * q1F - (p[3] + p[14] / p[15]) * p[17] - p[16];
        A = -(p[3] + p[14] / p[15]);
        C = p[4] * p[17] * q1F;
        ic[2] = (-B - Math.sqrt(Math.pow(B, 2) - 4.0 * A * C)) / (2.0 * A);
        
        ic[4] = (p[22] * q4F + (p[12] / (p[13] + ic[1])) * ic[1]) / (p[19] + p[28]);
        ic[5] = (p[21] * q4F + p[14] * (ic[2] / (p[15] + ic[2]))
            + p[16] * (ic[2] / (p[17] + ic[2]))) / p[20];
    }
    
    if (set_tsh_lag) {
        // Probably not 100% correct since they're supposed to be lagged, but probably better than the default.
        for (let i = 13; i < 19; i++) {
            ic[i] = ic[6];
        }
    }
}

//END OF FIRST BLOCK TRANSLATION!!!!

