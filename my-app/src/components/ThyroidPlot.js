import { useEffect, useState } from "react";

export default function ThyroidPlot({ rtf, LT3, LT4, weight, height, gender, selectedHormones: _selectedHormones, useSplitDosing = false }) {
  const [imgSrc, setImgSrc] = useState(null);

  // Function to determine which plot to show based on selected hormones
  // const shouldShowTT3Plot = () => {
  //   console.log('Selected Hormones:', selectedHormones);
  //   if (!selectedHormones) return false;
  //   const showTT3 = selectedHormones.TSH && selectedHormones.FT4 && selectedHormones.TT3;
  //   console.log('Should show TT3 plot:', showTT3);
  //   return showTT3;
  // };
  const [imgSrcTt3, setImgSrcTt3] = useState(null);

  useEffect(() => {
    // Run only when all parameters are available
    if (
      rtf == null ||
      LT3 == null ||
      LT4 == null ||
      weight == null ||
      height == null ||
      gender == null
    ) {
      console.log("Waiting for all parameters...", { rtf, LT3, LT4, weight, height, gender });
      return;
    }

    console.log("Sending simulation request with:", {
      sex: gender === "Male",
      height: parseFloat(height),
      weight: parseFloat(weight),
      T4dose: parseFloat(LT4),
      T3dose: parseFloat(LT3),
      RTF: parseFloat(rtf*0.01)
    });
    // Production: use PUBLIC_URL + /api/simulate (Apache proxy). Local: hit Julia directly.
    const url = process.env.NODE_ENV === "development"
      ? "http://localhost:9091/simulate"
      : `${process.env.PUBLIC_URL}/api/simulate`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sex: gender === "Male",           // boolean
        height: parseFloat(height),
        weight: parseFloat(weight),
        T4dose: parseFloat(LT4),          // pulled directly from prop
        T3dose: parseFloat(LT3),
        RTF: parseFloat(rtf),
        use_split_dosing: useSplitDosing
      })
    })
            .then(res => res.json())
      .then(data => {
        console.log('Server response:', data);
        if (data.status === "OK") {
          // Choose which plot to display based on selected hormones
          // if (shouldShowTT3Plot() && data.image_base64_tt3) {
          //   setImgSrc(`data:image/png;base64,${data.image_base64_tt3}`);
          // } else if (data.image_base64_ft3) {
          //   setImgSrc(`data:image/png;base64,${data.image_base64_ft3}`);
          // } else {
          //   console.error("No plot data available");
          // }
          if (data.image_base64_ft3) {
            setImgSrc(`data:image/png;base64,${data.image_base64_ft3}`);
          } else {
            console.error("No plot data available");
          }
        } else {
          console.error("Simulation failed:", data);
        }
      })
      .catch(err => console.error("Request failed:", err));
  }, [rtf, LT3, LT4, weight, height, gender]); // ✅ dependencies

  return (
    <div style={{ textAlign: "center", marginTop: "40px", width: "100%" }}>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="FT3 Simulation Plot"
          style={{
            width: "100%",
            maxWidth: "100%",
            height: "auto",
            borderRadius: "8px",
            display: "block",
            margin: "0 auto",
          }}
        />
      ) : (
        <p>Running simulation...</p>
      )}
    </div>
  );
}
