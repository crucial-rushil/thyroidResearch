# LT4/LT3 Dosing Research Supplement

This repository contains the code and supporting data for a web-based thyroid hormone dosing calculator developed as a supplement to an associated research paper. The application estimates residual thyroid function (RTF) from patient laboratory values and anthropometric inputs, recommends LT4 and LT3 dosing combinations, and presents simulated hormone-response plots for the proposed regimen.

Live website: http://biocyb.cs.ucla.edu/LT43DOSING

## Project Overview

The web application is designed to support research workflows around thyroid hormone replacement modeling. In its current form, the project:

- accepts patient inputs including sex, height, weight, and selected thyroid laboratory measurements;
- estimates residual thyroid function using fitted parameter tables and interpolation-based calculations;
- recommends LT4/LT3 dosing combinations from curated lookup tables; and
- renders predicted hormone trajectories using the connected simulation backend.

## Repository Structure

- `my-app/` contains the React frontend used for data entry, dose calculation, and results display.
- `my-app/public/data/` stores hormone-specific parameter tables used in the RTF estimation workflow.
- `my-app/public/dosing/` stores dosing lookup tables used to map patient characteristics to recommended regimens.
- `my-app/src/backend/` contains backend notebooks and generated plot assets related to the simulation workflow.

## Local Development

To run the frontend locally:

```bash
cd my-app
npm install
npm start
```

The development server will be available at `http://localhost:3000`. The React app is configured with a proxy for a local backend service at `http://localhost:9091`.

## Notes

This repository is intended to document and distribute the software supplement associated with the research project. The public deployment above is the primary live version referenced for demonstration and review.
