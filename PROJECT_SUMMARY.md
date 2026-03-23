# Thyroid Dosing Web Application - Project Summary

## Overview
This project implements a web-based thyroid hormone dosing calculator that predicts optimal LT4 (Levothyroxine) and LT3 (Liothyronine) dosages based on patient lab values, biometric data, and estimated residual thyroid function (RTF). The application generates personalized dosing recommendations and visualizes predicted hormone responses over 30 days.

---

## Technical Architecture

### Frontend Stack
**Technology:** React.js (JavaScript)

**Key Components:**
- **Forms.js** - Patient data input form with real-time BMI calculation and unit conversion
  - Accepts hormone measurements (TSH, FT4, FT3, TT3) with multiple unit options
  - Handles weight (lbs/kg) and height (inches/cm) with automatic conversion to standard units
  - Validates input ranges and converts all measurements to standardized units before submission
  - Implements unit-agnostic input (user can enter values in any supported unit)

- **RTFresult.js** - Results display page
  - Shows calculated RTF percentage
  - Displays suggested LT4 and LT3 dosages with frequency recommendations
  - Renders patient information summary with selected hormones and measurements
  - Embeds dynamically generated hormone response plots from backend

- **calculate.js** - RTF calculation engine
  - Implements bilinear interpolation for parameter estimation
  - Calculates RTF from individual hormone measurements using fitted mathematical models
  - Averages multiple RTF estimates when multiple hormones are selected
  - Determines appropriate dosage from CSV lookup tables based on patient height, weight, RTF, and gender
  - Automatically converts all measurements to lbs/inches for consistent processing

- **ThyroidPlot.js** - Backend API integration component
  - Sends POST requests to Julia backend with patient data and dosing parameters
  - Receives and displays base64-encoded PNG plots
  - Conditionally renders FT3 or TT3 plots based on selected hormones

**Build System:** Create React App with standard webpack configuration

**Deployment Artifacts:** Static files generated in `/build` directory

---

### Backend Stack
**Technology:** Julia (running in Jupyter Notebook environment)

**Core Components:**

1. **Thyrosim Mathematical Model** (julia-api-2.ipynb)
   - Implements a 19-compartment ordinary differential equation (ODE) system modeling thyroid hormone dynamics
   - Simulates T4 and T3 metabolism, distribution, and clearance across plasma, fast, and slow compartments
   - Incorporates patient-specific parameters:
     - Plasma volume scaling based on height, weight, and sex
     - Allometric scaling for organ clearance
     - Gender-specific clearance adjustments
     - Residual thyroid function (RTF) integration via dial parameters

2. **HTTP Server Wrapper**
   - **Framework:** HTTP.jl library
   - **Endpoint:** `POST /simulate`
   - **CORS Configuration:** Enabled for cross-origin requests from frontend
   - **Request Processing:**
     1. Receives JSON payload with patient parameters (sex, height, weight, T4dose, T3dose, RTF)
     2. Converts imperial units (inches, pounds) to metric (meters, kg)
     3. Executes ODE simulation for 30-day period
     4. Generates two plot variants using Plots.jl:
        - FT4/FT3/TSH time-series plot
        - FT4/TT3/TSH time-series plot
     5. Encodes plots as base64 PNG images
     6. Returns JSON response with both plot variants

3. **Simulation Engine**
   - `simulate()` function runs warmup period to establish steady-state
   - Implements periodic dosing callbacks for LT4 (24-hour intervals) and LT3 (12-hour intervals)
   - Uses Rodas5 ODE solver for numerical integration
   - Outputs compartment concentrations converted to clinical units (ng/L, µg/L, mU/L)

**Server Execution:** Julia notebook runs as persistent script via `HTTP.serve!()` on port 9091

---

## Deployment Architecture

### Infrastructure
**Server:** Physical Linux server at UCLA Computer Science Department  
**Hostname:** `biocyb1.cs.ucla.edu`  
**User Account:** `rushil01`

### Deployment Process

#### Frontend Deployment
1. **Build Process:**
   ```bash
   npm run build
   ```
   - Generates optimized production bundle in `/build` directory
   - Minifies JavaScript/CSS and performs tree-shaking
   - Creates hashed filenames for cache-busting

2. **File Transfer:**
   ```bash
   scp -r build rushil01@biocyb1.cs.ucla.edu:/home/rushil01/frontend
   ```
   - Secure copy of entire build directory to server
   - Deployed to `/home/rushil01/frontend` path

3. **Web Server Configuration:**
   - Static files served via Apache/Nginx (configured on server)
   - DNS resolution points to server's public IP
   - Application accessible at configured domain/path

#### Backend Deployment
1. **Julia Environment Setup:**
   - Julia installed on server with required packages:
     - DifferentialEquations.jl
     - HTTP.jl
     - JSON3.jl
     - Plots.jl
     - CSV.jl
     - DataFrames.jl

2. **Notebook Transfer:**
   ```bash
   scp julia-api-2.ipynb rushil01@biocyb1.cs.ucla.edu:/home/rushil01/
   ```

3. **Service Initialization:**
   - Julia script launched as background process
   - Listens on `0.0.0.0:9091` for incoming HTTP requests
   - Configured to run persistently (likely via systemd service or screen/tmux session)

### Network Architecture
```
User Browser
    ↓
    → Frontend (React SPA) served from biocyb1.cs.ucla.edu
    ↓
    → User submits patient data via form
    ↓
    → Frontend calculates RTF and dosages from CSV lookup tables
    ↓
    → POST request to http://biocyb1.cs.ucla.edu:9091/simulate
    ↓
    → Julia HTTP server receives request, runs ODE simulation
    ↓
    → Returns base64-encoded plots as JSON
    ↓
    → Frontend renders plots inline in results page
```

---

## Data Flow

### Input Processing
1. User enters patient data (hormones, height, weight, sex, age) in **Forms.js**
2. Frontend performs input validation:
   - TSH: 0 < value < 1000 mU/L
   - FT4: 0 < value < 75 ng/L
   - FT3: 0 < value < 20 ng/L
   - TT3: 0 < value < 8 µg/L
3. All hormone values converted to standard units (ng/L for FT3/FT4, µg/L for TT3)
4. Weight and height converted to lbs/inches for RTF calculation

### RTF Calculation (calculate.js)
1. For each selected hormone, fetch fitted parameters from CSV files:
   - Gender-specific files: `maleFT4NEW.csv`, `femaleTSH.csv`, etc.
   - Parameters interpolated based on patient weight/height using bilinear interpolation
2. Calculate individual RTF estimates using empirical equations:
   - **FT4/FT3:** RTF = A + (C - A) × exp(-exp(-B × (hormone - M)))
   - **TSH:** RTF = A × exp(-B × log₁₀(TSH)) + C × exp(-D × log₁₀(TSH))
3. Average all RTF estimates and cap at 100%

### Dosage Determination
1. Select appropriate dosing CSV based on patient height range and gender:
   - `Male_60-64.csv`, `Female_65-69.csv`, etc.
2. Match patient weight and RTF to dosing bucket using range matching
3. Return LT4 dose (µg), LT3 dose (µg), and frequency (1x or 2x daily)

### Visualization
1. Frontend sends final parameters to Julia backend:
   ```json
   {
     "sex": true,
     "height": 68.0,
     "weight": 160.0,
     "T4dose": 75.0,
     "T3dose": 5.0,
     "RTF": 0.35
   }
   ```
2. Julia simulates 30-day hormone kinetics
3. Two plots generated showing predicted steady-state responses
4. Base64-encoded images returned to frontend and displayed

---

## Key Features Implemented

### Unit Flexibility
- Supports multiple measurement units for all inputs
- Automatic conversion to standard units without modifying user input
- Real-time BMI calculation in metric units regardless of input units

### Range Validation
- Prevents submission of out-of-range values after unit conversion
- Provides clear error messages indicating which measurements are invalid

### Multi-Hormone RTF Estimation
- Averages RTF from multiple biomarkers when available
- Improves accuracy over single-hormone methods
- Falls back gracefully when only one hormone is measured

### Gender and Anthropometric Scaling
- Patient-specific plasma volume calculations
- Allometric scaling of clearance rates
- Gender-specific parameter adjustments

### Dynamic Plot Selection
- Shows TT3 plot when TSH, FT4, and TT3 are all measured
- Otherwise defaults to FT3 plot
- Provides comprehensive view of predicted hormone trajectories

---

## File Structure

```
thyroidResearch/
├── my-app/                           # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Forms.js              # Patient input form
│   │   │   ├── RTFresult.js          # Results display
│   │   │   └── calculate.js          # RTF calculation logic
│   │   └── components/
│   │       └── ThyroidPlot.js        # Backend API integration
│   ├── public/
│   │   ├── data/                     # RTF parameter CSVs
│   │   └── dosing/                   # Dosing recommendation CSVs
│   ├── build/                        # Production build output
│   └── package.json
└── my-app/src/backend/
    └── julia-api-2.ipynb             # Julia simulation server
```

---

## Technologies Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React.js | UI components and state management |
| **Frontend Build** | Create React App | Webpack-based build system |
| **Backend Language** | Julia | High-performance numerical computing |
| **Backend Server** | HTTP.jl | REST API endpoint handling |
| **ODE Solver** | DifferentialEquations.jl | Thyroid model simulation |
| **Plotting** | Plots.jl | Hormone trajectory visualization |
| **Data Processing** | CSV.jl, DataFrames.jl | Parameter and dosing data management |
| **Deployment** | SCP, Linux server | Production hosting at UCLA |

---

## Performance Characteristics

- **Frontend:** Sub-second RTF calculation and dosage lookup
- **Backend:** 2-5 second simulation time per request (30-day ODE integration)
- **Network:** Minimal latency within UCLA network
- **Scalability:** Single-threaded Julia server suitable for clinical research use

---

## Future Enhancements

- Implement server-side caching for common parameter combinations
- Add authentication for patient data privacy
- Expand dosing CSV coverage for edge cases (very tall/short patients)
- Implement error recovery and retry logic in ThyroidPlot component
- Add download functionality for generated plots
- Store patient records in database for longitudinal tracking

---

**Project Completed:** December 2025  
**Developer:** Rushil Shah  
**Institution:** UCLA Computer Science Department
