import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function MyBusRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    }
  }, [navigate]);

  const busInfo = {
    id: '1',
    startTime: '07:00 AM',
    expectedArrival: '08:15 AM'
  };

  const [routeStops, setRouteStops] = useState([
    { name: 'Mambalasalai', time: '07:00 AM', status: 'completed' },
    { name: 'Palpannai', time: '07:15 AM', status: 'completed' },
    { name: 'Thiruverumbur', time: '07:30 AM', status: 'current' },
    { name: 'College Gate', time: '08:15 AM', status: 'upcoming' }
  ]);

  useEffect(() => {
    const fetchGPS = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/gps`);
        const data = await res.json();
        if (data.success && data.stops && data.stops.length > 0) {
          // Normalize 'reached' -> 'completed' for MyBusRoute styles
          const normalizedStops = data.stops.map(stop => ({
            ...stop,
            status: stop.status === 'reached' ? 'completed' : stop.status
          }));
          setRouteStops(normalizedStops);
        }
      } catch (err) {
        // Handle error silently
      }
    };

    fetchGPS();
    const interval = setInterval(fetchGPS, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      {/* Main Content */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-6 pt-28 pb-16"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            My Bus Route
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
            Transit {busInfo.id} &bull; Complete Route Timeline
          </p>
        </motion.div>

        {/* Bus Info Card */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800/85 mb-10">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Bus ID</p>
              <p className="text-slate-900 dark:text-white text-lg sm:text-2xl font-black">{busInfo.id}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Start Time</p>
              <p className="text-slate-900 dark:text-white text-lg sm:text-2xl font-black">{busInfo.startTime}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Arrival</p>
              <p className="text-slate-900 dark:text-white text-lg sm:text-2xl font-black">{busInfo.expectedArrival}</p>
            </div>
          </div>
        </motion.div>

        {/* Route Timeline */}
        <motion.div variants={itemVariants} className="space-y-0">
          {routeStops.map((stop, index) => (
            <motion.div variants={itemVariants} key={index} className="relative pl-14 pb-8 last:pb-0">
              
              {/* Connector Line */}
              {index < routeStops.length - 1 && (
                <div
                  className={`absolute left-[19px] top-[48px] bottom-0 w-0.5 transition-colors duration-300 ${
                    stop.status === 'completed'
                      ? 'bg-emerald-500'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                ></div>
              )}

              {/* Circle Stop Node */}
              <div className="absolute left-0 top-2 w-10 h-10 flex items-center justify-center z-10">
                {stop.status === 'completed' ? (
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                ) : stop.status === 'current' ? (
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-orange-400 opacity-75"></span>
                    <div className="w-10 h-10 rounded-2xl border-4 border-orange-500 bg-white dark:bg-slate-900 shadow-md shadow-orange-500/10 z-10"></div>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-sm"></div>
                )}
              </div>

              {/* Stop Card */}
              <div
                className={`rounded-2xl p-5 sm:p-6 flex items-center justify-between border transition-all duration-300 ${
                  stop.status === 'completed'
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850/80 shadow-sm'
                    : stop.status === 'current'
                    ? 'bg-gradient-to-r from-orange-500/5 to-amber-500/5 dark:from-orange-500/10 dark:to-amber-500/10 border-orange-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850/80 shadow-sm opacity-70'
                }`}
              >
                <div className="flex-1">
                  <h3 className="text-slate-900 dark:text-white text-base sm:text-lg font-bold mb-1">
                    {stop.name}
                  </h3>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${
                    stop.status === 'completed'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : stop.status === 'current'
                      ? 'text-orange-500'
                      : 'text-slate-400'
                  }`}>
                    {stop.status === 'completed'
                      ? 'Reached'
                      : stop.status === 'current'
                      ? 'Current Stop'
                      : 'Upcoming'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-slate-900 dark:text-white text-base sm:text-lg font-black">{stop.time}</p>
                  {stop.status === 'current' && (
                    <span className="inline-flex px-2 py-0.5 rounded bg-orange-500 text-[10px] font-bold text-white uppercase tracking-wider mt-1">Now</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
}
