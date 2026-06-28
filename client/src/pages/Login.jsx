import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus } from 'lucide-react';
import { mockLogin } from '../services/api';
import { motion } from 'framer-motion';

export default function Login() {
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await mockLogin(registerNumber, password);
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col justify-between font-sans selection:bg-orange-500 selection:text-white">
      {/* Dynamic blurred ambient background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none animate-pulse duration-[6s]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none animate-pulse duration-[8s]"></div>
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center px-8 py-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3 group">
          <div className="bg-gradient-to-tr from-orange-500 to-amber-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition duration-300">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">
              Bus<span className="text-orange-500">Track</span>
            </h1>
            <p className="text-gray-400 text-xs tracking-wider">SASTRA UNIVERSITY</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-16 py-12 max-w-7xl w-full mx-auto gap-12 lg:gap-8 my-auto">
        
        {/* Left Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 max-w-2xl text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span> Live Tracking Active
          </span>
          <h2 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            Track Your College <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent pb-1 inline-block">Bus Route</span>
          </h2>
          <h3 className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent text-4xl sm:text-5xl lg:text-6xl font-extrabold pb-2 sm:pb-3 leading-tight inline-block mb-4 sm:mb-6">
            Anytime, Anywhere.
          </h3>
          <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-xl leading-relaxed mx-auto lg:mx-0">
            Login to immediately access your assigned bus, real-time stops timeline, and live GPS map tracking.
          </p>
        </motion.div>

        {/* Right Section - Login Form with Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-10 w-full max-w-md border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <h3 className="text-white text-3xl font-bold tracking-tight mb-2">Student Login</h3>
          <p className="text-gray-400 text-sm mb-6">Access your bus tracking dashboard</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Register Number
              </label>
              <input
                type="text"
                placeholder="Enter register number"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/[0.08] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/50 transition duration-200 text-sm"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-slate-950/60 border border-white/[0.08] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/50 transition duration-200 text-sm"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/15"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-gray-500 text-xs mb-1">Demo Credentials</p>
            <p className="text-gray-300 text-xs font-semibold">
              Register No: <span className="text-orange-400 font-bold">123</span> &nbsp;|&nbsp; Password: <span className="text-orange-400 font-bold">123</span>
            </p>
            <p className="text-gray-400 text-[10px] mt-1.5">
              (Full ID demo: <span className="text-orange-400/80">126158006</span> / <span className="text-orange-400/80">126158006</span>)
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-gray-600 text-xs border-t border-white/[0.02]">
        &copy; {new Date().getFullYear()} BusTrack SASTRA. All rights reserved.
      </footer>
    </div>
  );
}
