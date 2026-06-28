import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Bus, MapPin, QrCode, Clock, ArrowRight, Navigation, BellRing } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [routeStops, setRouteStops] = useState([
    { name: "Mambalasalai", time: "07:00 AM", status: "reached" },
    { name: "Palpannai", time: "07:15 AM", status: "reached" },
    { name: "Thiruverumbur", time: "07:30 AM", status: "current" },
    { name: "College Gate", time: "08:15 AM", status: "upcoming" },
  ]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) navigate("/login");
    else setUser(JSON.parse(userData));

    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    const fetchGPS = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/gps`);
        const data = await res.json();
        if (data.success && data.stops && data.stops.length > 0) {
          setRouteStops(data.stops);
        }
      } catch (err) {
        // Handle error silently
      }
    };

    fetchGPS();
    const gpsInterval = setInterval(fetchGPS, 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(gpsInterval);
    };
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        {/* Header / Greeting */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Hello, {user.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base font-medium">
              Your transit overview for today
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-sm tracking-wide">{currentTime || "--:--"}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Digital Transit Pass (Apple Wallet Style) */}
            <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-8 text-white shadow-xl shadow-orange-500/20 group">
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                <Bus className="w-64 h-64" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-1">Digital Pass</p>
                    <h2 className="text-3xl font-black tracking-tight">SASTRA Transit</h2>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                    <QrCode className="w-10 h-10 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 bg-black/10 rounded-2xl p-5 backdrop-blur-sm border border-white/10">
                  <div>
                    <p className="text-orange-200 text-xs font-semibold uppercase tracking-wider mb-1">Passenger</p>
                    <p className="font-bold text-lg">{user.name}</p>
                    <p className="text-orange-100 text-sm font-medium opacity-80">{user.registerNumber}</p>
                  </div>
                  <div>
                    <p className="text-orange-200 text-xs font-semibold uppercase tracking-wider mb-1">Assigned Route</p>
                    <p className="font-bold text-lg">{user.assignedBus.replace(/^BUS-0*/, '')}</p>
                    <p className="text-orange-100 text-sm font-medium opacity-80">Trichy Main</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Link to="/track" className="group">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-orange-500/30 transition-all duration-300 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-300">
                      <Navigation className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Live Tracking</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">View real-time GPS coordinates on the map.</p>
                  </div>
                </div>
              </Link>

              <Link to="/my-bus-route" className="group">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Route Details</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">View scheduled halts and full timeline.</p>
                  </div>
                </div>
              </Link>
            </motion.div>

          </div>

          {/* Right Column (Timeline) */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-orange-500" /> Live Status
                </h3>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> En Route
                </span>
              </div>

              <div className="relative flex-1">
                {/* Connecting Line */}
                <div className="absolute left-[11px] top-4 bottom-8 w-0.5 bg-gradient-to-b from-emerald-400 via-orange-400 to-slate-200 dark:to-slate-800"></div>

                <div className="space-y-6">
                  {routeStops.map((stop, idx) => (
                    <div key={idx} className="relative pl-8 flex justify-between items-start group">
                      {/* Indicator Node */}
                      <div className="absolute left-0 top-1.5 w-6 h-6 flex items-center justify-center -translate-x-1/2">
                        {stop.status === 'reached' && (
                          <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-sm"></div>
                        )}
                        {stop.status === 'current' && (
                          <div className="relative flex items-center justify-center w-5 h-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white dark:border-slate-900 relative z-10"></div>
                          </div>
                        )}
                        {stop.status === 'upcoming' && (
                          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-900"></div>
                        )}
                      </div>

                      <div>
                        <p className={`font-bold text-sm ${stop.status === 'current' ? 'text-orange-500' : stop.status === 'reached' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                          {stop.name}
                        </p>
                        {stop.status === 'current' && (
                          <p className="text-xs text-orange-500/80 font-medium mt-0.5">Bus is here</p>
                        )}
                      </div>
                      <p className={`text-xs font-semibold ${stop.status === 'upcoming' ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                        {stop.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <Link to="/my-bus-route" className="text-sm font-bold text-slate-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center justify-center gap-1">
                  View full schedule <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.main>
    </div>
  );
}
