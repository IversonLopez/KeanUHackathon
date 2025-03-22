import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSatelliteDish, 
  faShieldHalved,
  faLocationDot,
  faTriangleExclamation,
  faTowerBroadcast,
  faMagnifyingGlass,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import ScamDashboard from './components/ScamDashboard';
import './App.css';

const App = () => {
  const [county, setCounty] = useState('');
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleCountyInput = (e) => {
    setCounty(e.target.value);
    setError('');
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && county.toLowerCase() === 'union') {
      setIsRedirecting(true);
      setTimeout(() => {
        setShowDashboard(true);
      }, 1000);
    } else if (e.key === 'Enter') {
      setError('Please enter "Union" - this tool only works for Union County');
    }
  };

  if (showDashboard) {
    return <ScamDashboard />;
  }

  return (
    <div className={`
      flex flex-col items-center justify-center w-full h-screen relative overflow-hidden
      transition-opacity duration-1000 ease-in-out
      ${isRedirecting ? 'opacity-0' : 'opacity-100'}
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#003366] to-[#001A33]"></div>
      
      <div className={`
        absolute inset-0 overflow-hidden
        transition-transform duration-1000 ease-in-out
        ${isRedirecting ? 'scale-150' : 'scale-100'}
      `}>
        <div className="absolute h-16 w-16 top-[10%] left-[20%]" style={{
          animation: 'float 8s ease-in-out infinite'
        }}>
          <div className="relative h-full w-full rounded-full bg-white/5 flex items-center justify-center">
            <FontAwesomeIcon 
              icon={faSatelliteDish} 
              className="text-white/20 text-xl"
              style={{ animation: 'spin 8s linear infinite' }}
            />
          </div>
        </div>

        <div className="absolute h-14 w-14 top-[15%] left-[60%]" style={{
          animation: 'floatAlt 9s ease-in-out infinite',
          animationDelay: '-2s'
        }}>
          <div className="relative h-full w-full rounded-full bg-white/5 flex items-center justify-center">
            <FontAwesomeIcon icon={faShieldHalved} className="text-white/20 text-lg" />
          </div>
        </div>

        <div className="absolute h-12 w-12 top-[30%] left-[40%]" style={{
          animation: 'floatDiagonal 10s ease-in-out infinite',
          animationDelay: '-3s'
        }}>
          <div className="relative h-full w-full rounded-full bg-white/5 flex items-center justify-center">
            <FontAwesomeIcon icon={faLocationDot} className="text-white/20 text-lg" />
          </div>
        </div>

        <div className="absolute h-16 w-16 top-[35%] left-[80%]" style={{
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '-4s'
        }}>
          <div className="relative h-full w-full rounded-full bg-white/5 flex items-center justify-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-white/20 text-xl" />
          </div>
        </div>

        <div className="absolute h-14 w-14 top-[50%] left-[25%]" style={{
          animation: 'floatAlt 9s ease-in-out infinite',
          animationDelay: '-1s'
        }}>
          <div className="relative h-full w-full rounded-full bg-white/5 flex items-center justify-center">
            <FontAwesomeIcon icon={faTowerBroadcast} className="text-white/20 text-lg" />
          </div>
        </div>

        <div className="absolute h-12 w-12 top-[55%] left-[65%]" style={{
          animation: 'floatDiagonal 10s ease-in-out infinite',
          animationDelay: '-5s'
        }}>
          <div className="relative h-full w-full rounded-full bg-white/5 flex items-center justify-center">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white/20 text-lg" />
          </div>
        </div>

        <div className="absolute h-16 w-16 top-[70%] left-[15%]" style={{
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '-2s'
        }}>
          <div className="relative h-full w-full rounded-full bg-white/5 flex items-center justify-center">
            <FontAwesomeIcon icon={faBell} className="text-white/20 text-xl" />
          </div>
        </div>

        <div className="absolute h-14 w-14 top-[75%] left-[55%]" style={{
          animation: 'floatAlt 9s ease-in-out infinite',
          animationDelay: '-3s'
        }}>
          <div className="relative h-full w-full rounded-full bg-white/5 flex items-center justify-center">
            <FontAwesomeIcon 
              icon={faSatelliteDish} 
              className="text-white/20 text-lg"
              style={{ animation: 'spin 8s linear infinite' }}
            />
          </div>
        </div>
      </div>
      
      <div className={`
        relative z-10 mb-16 -mt-20 animate-title-float group
        transition-transform duration-1000 ease-in-out
        ${isRedirecting ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}
      `}>
        <h1 className="text-6xl font-serif text-white text-center tracking-wide relative">
          <span className="absolute -inset-8 blur-2xl bg-white/5 rounded-full group-hover:bg-white/10 transition-all duration-1000"></span>
          <span className="relative">Welcome to Fraud Prevention Inc</span>
        </h1>
        <p className="text-center text-xl text-white/90 mt-4 font-medium tracking-wider animate-pulse-slow">
          One Step Closer To a Safer County
        </p>
      </div>
      
      <div className={`
        flex flex-col items-center p-8 max-w-md w-full
        bg-white/20 backdrop-blur-xl rounded-2xl border border-white/40
        shadow-2xl relative overflow-hidden z-10
        animate-container-float
        hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]
        transition-all duration-1000
        group
        ${isRedirecting ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}
      `}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="h-16 w-16 rounded-full bg-white/5 absolute -top-8 -left-8 animate-float-slow"></div>
          <div className="h-12 w-12 rounded-full bg-white/5 absolute -bottom-6 -right-6 animate-float-delayed"></div>
        </div>

        <div className="relative z-10 w-full space-y-6">
          <div className="w-full p-4 rounded-lg bg-white/10">
            <input
              type="text"
              value={county}
              onChange={handleCountyInput}
              onKeyPress={handleKeyPress}
              placeholder="Enter your county (hint: Union)"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-lg text-center"
              disabled={isRedirecting}
            />
          </div>

          {error && (
            <div className="text-red-500 text-center p-4 bg-red-100/20 rounded-lg">
              {error}
            </div>
          )}

          <div className="text-white/70 text-center text-sm">
            Press Enter after typing "Union" to access the scam analysis tool
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;