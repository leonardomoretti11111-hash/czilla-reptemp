import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Wheel = dynamic(() => import('react-custom-roulette').then(mod => ({ default: mod.Wheel })), {
  ssr: false,
  loading: () => <div className="w-64 h-64 rounded-full border-4 border-yellow-400 flex items-center justify-center"><span className="text-yellow-400">Loading Wheel...</span></div>
});

const ChaosWheel = () => {
  const [roarPoints, setRoarPoints] = useState(0);
  const [roarTarget] = useState(100);
  const [timeLeft, setTimeLeft] = useState(0);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState(null);

  const wheelData = [
    { option: '🎁 Airdrop', style: { backgroundColor: '#FFD700', textColor: '#000000' } },
    { option: '🔥 Buyback & Burn', style: { backgroundColor: '#000000', textColor: '#FFD700' } }
  ];

  // Set client flag after mounting
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      
      setTimeLeft(tomorrow.getTime() - now.getTime());
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle adding points (temporary function)
  const handleAddPoints = () => {
    if (roarPoints < roarTarget) {
      setRoarPoints(prev => Math.min(prev + 10, roarTarget));
    }
  };

  // Handle wheel spin
  const handleSpinClick = () => {
    if (roarPoints >= roarTarget && !mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * wheelData.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  // Handle wheel stop spinning
  const handleSpinComplete = async () => {
    setMustSpin(false);
    const spinResult = wheelData[prizeNumber].option;
    setResult(spinResult);
    
    // Reset points after spin
    setRoarPoints(0);

    // Optional: Send result to Netlify function
    try {
      await fetch('/.netlify/functions/saveSpin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          result: spinResult,
          timestamp: new Date().toISOString(),
          roarPoints: roarTarget
        }),
      });
    } catch (error) {
      console.log('Failed to save spin result:', error);
    }
  };

  const progressPercentage = (roarPoints / roarTarget) * 100;

  return (
    <>
      <Head>
        <title>🎡 The Chaos Wheel - CZILLA</title>
        <meta name="description" content="When the Roar Peaks, Fate Spins - The ultimate gamified crypto experience" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <style jsx global>{`
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            background: #000000;
            font-family: 'Roboto', sans-serif;
          }
          .orbitron {
            font-family: 'Orbitron', monospace;
          }
          .glow-text {
            text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700;
          }
          .glow-border {
            border: 2px solid #FFD700;
            box-shadow: 0 0 10px #FFD700, inset 0 0 10px rgba(255, 215, 0, 0.1);
          }
          .hover-glow {
            transition: all 0.3s ease;
          }
          .hover-glow:hover {
            box-shadow: 0 0 20px #FFD700, inset 0 0 20px rgba(255, 215, 0, 0.2);
            transform: translateY(-2px);
          }
          .pulse {
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% {
              box-shadow: 0 0 10px #FFD700;
            }
            50% {
              box-shadow: 0 0 20px #FFD700, 0 0 30px #FFD700;
            }
            100% {
              box-shadow: 0 0 10px #FFD700;
            }
          }
          .progress-bar {
            background: linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="orbitron text-4xl md:text-6xl font-black mb-4 glow-text">
              🎡 The Chaos Wheel
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 orbitron font-bold">
              When the Roar Peaks, Fate Spins
            </p>
          </div>

          {/* Countdown Section */}
          <div className="text-center mb-8">
            <div className="inline-block glow-border rounded-lg px-6 py-4 bg-gray-900">
              <p className="orbitron text-lg mb-2 text-yellow-400">Next Spin in:</p>
              <div className="text-3xl font-bold glow-text orbitron">
                {formatTime(timeLeft)} UTC
              </div>
            </div>
          </div>

          {/* Progress Bar Section */}
          <div className="mb-12">
            <div className="text-center mb-4">
              <p className="orbitron text-xl font-bold text-yellow-400">
                {roarPoints}/{roarTarget} Roar Points
              </p>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-6 glow-border">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${progressPercentage > 0 ? 'progress-bar' : ''}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Wheel and Controls Section */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-12">
            {/* Wheel */}
            <div className="flex flex-col items-center">
              <div className="mb-6 p-4 rounded-full glow-border bg-gray-900">
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={wheelData}
                  onStopSpinning={handleSpinComplete}
                  backgroundColors={['#FFD700', '#000000']}
                  textColors={['#000000', '#FFD700']}
                  outerBorderColor="#FFD700"
                  outerBorderWidth={5}
                  innerRadius={30}
                  innerBorderColor="#FFD700"
                  innerBorderWidth={10}
                  radiusLineColor="#FFD700"
                  radiusLineWidth={3}
                  fontSize={16}
                  textDistance={80}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSpinClick}
                  disabled={roarPoints < roarTarget || mustSpin}
                  className={`orbitron font-bold px-8 py-4 rounded-lg border-2 transition-all duration-300 ${
                    roarPoints >= roarTarget && !mustSpin
                      ? 'border-yellow-400 text-yellow-400 hover-glow pulse cursor-pointer'
                      : 'border-gray-600 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {mustSpin ? 'Spinning...' : 'Spin the Wheel'}
                </button>
                
                <button
                  onClick={handleAddPoints}
                  disabled={roarPoints >= roarTarget}
                  className={`orbitron font-bold px-8 py-4 rounded-lg border-2 transition-all duration-300 ${
                    roarPoints < roarTarget
                      ? 'border-yellow-400 text-yellow-400 hover-glow cursor-pointer'
                      : 'border-gray-600 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  +10 Points
                </button>
              </div>
            </div>

            {/* Result Display */}
            {result && (
              <div className="text-center lg:text-left">
                <div className="glow-border rounded-lg p-6 bg-gray-900">
                  <h3 className="orbitron text-2xl font-bold text-yellow-400 mb-4">
                    Latest Result
                  </h3>
                  <div className="text-4xl font-black glow-text">
                    {result}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reactor Core Section */}
          <div className="text-center">
            <div className="glow-border rounded-lg p-8 bg-gray-900 max-w-2xl mx-auto">
              <h2 className="orbitron text-3xl font-black text-yellow-400 mb-4 glow-text">
                ⚡ The Reactor Core
              </h2>
              <p className="text-lg mb-4 text-gray-300">
                Where every transaction fuels airdrops, buybacks, and liquidity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-black rounded-lg border border-yellow-400">
                  <div className="text-2xl font-bold text-yellow-400">50%</div>
                  <div className="text-sm text-gray-300">Airdrops</div>
                </div>
                <div className="p-4 bg-black rounded-lg border border-yellow-400">
                  <div className="text-2xl font-bold text-yellow-400">30%</div>
                  <div className="text-sm text-gray-300">Buybacks</div>
                </div>
                <div className="p-4 bg-black rounded-lg border border-yellow-400">
                  <div className="text-2xl font-bold text-yellow-400">20%</div>
                  <div className="text-sm text-gray-300">Liquidity</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center mt-12">
            <p className="text-gray-500 orbitron">
              When CZ tweets, CZILLA roars. 🦖⚡
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChaosWheel;