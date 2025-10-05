import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import Head from "next/head";

const wheelData = [
  { option: "🎁 Airdrop" },
  { option: "🔥 Buyback & Burn" }
];

export default function ChaosWheel() {
  const [roarPoints, setRoarPoints] = useState(0);
  const roarTarget = 100; // 100 punti = 1 Roar
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Countdown giornaliero
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setUTCHours(24, 0, 0, 0);
      setTimeLeft(midnight - now);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const spin = () => {
    if (roarPoints < roarTarget || mustSpin) return;
    const rand = Math.floor(Math.random() * wheelData.length);
    setPrizeNumber(rand);
    setMustSpin(true);
    setTimeout(() => {
      setMustSpin(false);
      const outcome = wheelData[rand].option;
      setResult(outcome);
      setRoarPoints(0); // reset punti dopo spin
    }, 5000);
  };

  // Simula punti accumulati (in futuro collegati ai tweet)
  const addPoints = () => setRoarPoints((prev) => Math.min(prev + 10, roarTarget));

  return (
    <>
      <Head>
        <title>CZILLA | Chaos Wheel</title>
      </Head>
      <main
        style={{
          background: "#000",
          color: "#FFD700",
          minHeight: "100vh",
          textAlign: "center",
          fontFamily: "Orbitron, sans-serif",
          padding: "2rem"
        }}
      >
        <h1>🎡 The Chaos Wheel</h1>
        <p style={{ color: "#ccc" }}>Next spin in: {formatTime(timeLeft)}</p>

        <div
          style={{
            margin: "2rem auto",
            width: "80%",
            maxWidth: "400px",
            background: "#111",
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid #FFD700"
          }}
        >
          <div
            style={{
              width: `${(roarPoints / roarTarget) * 100}%`,
              height: "20px",
              background: "#FFD700",
              transition: "width 0.3s ease"
            }}
          ></div>
        </div>
        <p>{roarPoints}/{roarTarget} Roar Points</p>

        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          backgroundColors={["#FFD700", "#000"]}
          textColors={["#000"]}
        />
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={spin}
            style={{
              background: "#FFD700",
              color: "#000",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Spin the Wheel
          </button>
          <button
            onClick={addPoints}
            style={{
              marginLeft: "10px",
              background: "transparent",
              border: "1px solid #FFD700",
              color: "#FFD700",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            +10 Points
          </button>
        </div>

        {result && (
          <div style={{ marginTop: "30px", fontSize: "1.5rem" }}>
            <strong>Result:</strong> {result}
          </div>
        )}

        <div style={{ marginTop: "3rem" }}>
          <h2>⚡ The Reactor Core</h2>
          <p style={{ maxWidth: "600px", margin: "0 auto", color: "#ccc" }}>
            Every transaction on CZILLA contributes to the Reactor Core — our Treasury that powers Airdrops, Buybacks, and Liquidity.
            <br />
            <br />
            <strong>50%</strong> Airdrops • <strong>30%</strong> Buybacks • <strong>20%</strong> Liquidity
          </p>
        </div>
      </main>
    </>
  );
}
