import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Phone } from 'lucide-react';
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

export default function Contact() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const driverInfo = {
    name: 'Rajesh Kumar',
    mobile: '+91 98765 43210',
    busNumber: '1',
    vehicleId: 'TN-07-AB-1234'
  };

  if (!user) return null;

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
            Contact & Support
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
            Assigned Transit Info ({driverInfo.busNumber}) & Admin Contacts
          </p>
        </motion.div>

        {/* Driver Information Card */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/20 dark:hover:border-orange-500/20 transition-all duration-300 relative group">
          {/* Icon Badge */}
          <div className="absolute top-6 right-6 bg-orange-100 dark:bg-orange-500/10 p-3 rounded-2xl transition-transform duration-200 group-hover:scale-105">
            <Bus className="w-6 h-6 text-orange-500" />
          </div>

          <h3 className="text-slate-850 dark:text-white text-xl font-bold mb-6">Driver Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-x-12 sm:gap-y-6">
            {/* Driver Name */}
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3 sm:border-b-0 sm:pb-0">
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Driver Name</p>
              <p className="text-slate-800 dark:text-slate-100 text-lg font-bold">{driverInfo.name}</p>
            </div>

            {/* Driver Mobile */}
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3 sm:border-b-0 sm:pb-0">
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Driver Mobile</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Phone className="w-4 h-4 text-orange-500" />
                <a 
                  href={`tel:${driverInfo.mobile}`}
                  className="text-orange-500 text-lg font-bold hover:text-orange-600 hover:underline transition duration-200"
                >
                  {driverInfo.mobile}
                </a>
              </div>
            </div>

            {/* Bus Number */}
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3 sm:border-b-0 sm:pb-0">
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Bus ID</p>
              <p className="text-slate-800 dark:text-slate-100 text-lg font-bold">{driverInfo.busNumber}</p>
            </div>

            {/* Vehicle ID */}
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Vehicle Registration ID</p>
              <p className="text-slate-800 dark:text-slate-100 text-lg font-bold">{driverInfo.vehicleId}</p>
            </div>
          </div>
        </motion.div>

        {/* Additional Support Information */}
        <motion.div variants={itemVariants} className="mt-8 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-900/30 rounded-3xl p-6 sm:p-8">
          <h4 className="text-blue-700 dark:text-blue-300 text-lg font-bold mb-2">Need Assistance?</h4>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
            For routing alterations, feedback, or scheduling questions, please contact the transport department.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
            <div className="space-y-3">
              <p className="flex justify-between sm:justify-start gap-4">
                <span className="text-slate-400 dark:text-slate-500 w-32 shrink-0">Transport Office:</span> 
                <span className="text-slate-800 dark:text-slate-200 font-bold">+91 98765 00000</span>
              </p>
              <p className="flex justify-between sm:justify-start gap-4">
                <span className="text-slate-400 dark:text-slate-500 w-32 shrink-0">Emergency Helpline:</span> 
                <span className="text-red-500 dark:text-red-400 font-black">+91 98765 11111</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex justify-between sm:justify-start gap-4">
                <span className="text-slate-400 dark:text-slate-500 w-32 shrink-0">Email Support:</span> 
                <a href="mailto:transport@sastra.edu" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">transport@sastra.edu</a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}