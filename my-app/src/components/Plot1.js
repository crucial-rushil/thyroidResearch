import { useEffect, useState } from "react";

export default function Hello() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:9090/hello", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Rushil" }) 
    })
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("Error: " + err.message));
  }, []);

  return (
    <div>
      <h2>Julia API says:</h2>
      <p>{message}</p>
    </div>
  );
}
