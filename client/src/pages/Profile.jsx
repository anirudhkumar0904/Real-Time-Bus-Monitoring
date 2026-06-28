import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

import {
  User,
  BookOpen,
  Building2,
  GraduationCap,
  Bus,
  MapPin,
  Sun,
  Moon,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) navigate("/login");
    else setUser(JSON.parse(userData));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="pt-28 pb-16 max-w-2xl mx-auto px-4 sm:px-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent pb-1 inline-block">
            My Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-1">
            Your registered credentials & transit details
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/85 rounded-3xl overflow-hidden shadow-sm">
          
          {/* Header Banner Accent */}
          <div className="h-28 bg-gradient-to-r from-orange-500 to-amber-500 relative">
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="w-20 h-20 bg-white dark:bg-slate-900 p-1.5 rounded-3xl shadow-md border border-slate-100 dark:border-slate-800">
                <div className="w-full h-full bg-orange-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center">
                  <User className="w-9 h-9 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-14 pb-8 px-6 sm:px-8 text-center border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase mt-1">
              Reg No: {user.registerNumber}
            </p>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Name */}
            <ProfileItem
              iconBg="bg-blue-50 dark:bg-blue-500/10"
              icon={<User className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              label="Full Name"
              value={user.name}
            />

            {/* Register Number */}
            <ProfileItem
              iconBg="bg-purple-50 dark:bg-purple-500/10"
              icon={<BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
              label="Register Number"
              value={user.registerNumber}
            />

            {/* Department */}
            <ProfileItem
              iconBg="bg-emerald-50 dark:bg-emerald-500/10"
              icon={<Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              label="Department"
              value={user.department}
            />

            {/* Year */}
            <ProfileItem
              iconBg="bg-amber-50 dark:bg-amber-500/10"
              icon={<GraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              label="Year of Study"
              value={user.year}
            />

            {/* Bus ID */}
            <ProfileItem
              iconBg="bg-orange-50 dark:bg-orange-500/10"
              icon={<Bus className="w-5 h-5 text-orange-500" />}
              label="Assigned Bus Route ID"
              value={user.assignedBus}
            />

            {/* Pickup Point */}
            <ProfileItem
              iconBg="bg-rose-50 dark:bg-rose-500/10"
              icon={<MapPin className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
              label="Pickup Location"
              value={user.pickupPoint}
            />
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}

/* Reusable Profile Row Component */
function ProfileItem({ iconBg, icon, label, value }) {
  return (
    <div className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}
