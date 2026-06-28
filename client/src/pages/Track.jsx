import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import L from "leaflet";
import { motion } from "framer-motion";
import { MapPin, Navigation, Signal, Clock, Flag } from "lucide-react";
import busIcon from "../assets/bus.png";

export default function TrackMyBus() {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const markersDrawnRef = useRef(false);

  const [location, setLocation] = useState(null);
  const [stops, setStops] = useState([]);
  const [isLive, setIsLive] = useState(false);

  // Protect route
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/login");
  }, [navigate]);

  // Init Leaflet Map
  useEffect(() => {
    if (mapRef.current) return; // prevent multiple init

    const map = L.map(mapContainer.current, { zoomControl: false }).setView([10.7905, 78.7047], 13);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(map);

    mapRef.current = map;

    // --- Custom Bus Marker ---
    const busIconObj = L.icon({
      iconUrl: busIcon,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      className: "bus-marker-transition"
    });

    markerRef.current = L.marker([10.7905, 78.7047], { icon: busIconObj })
      .addTo(map);

  }, []);

  // Fetch Route Polyline once
  useEffect(() => {
    if (!mapRef.current) return;
    
    const fetchRoute = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/route");
        const data = await res.json();
        if (data.success && data.routePath && data.routePath.length > 0) {
          const latLngs = data.routePath.map(p => [p.lat, p.lng]);
          L.polyline(latLngs, {
            color: '#3b82f6', // blue-500
            weight: 6,
            opacity: 0.8,
            lineJoin: 'round'
          }).addTo(mapRef.current);
        }
      } catch (err) {
        console.error("Failed to fetch route polyline", err);
      }
    };
    
    fetchRoute();
  }, []);

  // Fetch GPS every 1 seconds
  useEffect(() => {
    if (!mapRef.current) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/gps");
        const data = await res.json();

        if (data.success && data.location.lat) {
          setIsLive(true);
          const newPos = [data.location.lat, data.location.lng];
          setLocation(data.location);
          setStops(data.stops || []);

          // Move marker
          markerRef.current.setLatLng(newPos);

          // Smooth camera follow without bouncing
          mapRef.current.panTo(newPos, {
            animate: true,
            duration: 1.0,
            easeLinearity: 1
          });

          // Draw Start/End points once we have stops data
          if (!markersDrawnRef.current && data.stops && data.stops.length > 0 && data.routePath && data.routePath.length > 0) {
             markersDrawnRef.current = true;
             
             // Snap markers perfectly to the exact ends of the blue polyline
             const pathStart = data.routePath[0];
             const pathEnd = data.routePath[data.routePath.length - 1];

             // Premium Start Marker (Swiggy Style)
             const startIcon = L.divIcon({
               className: '',
               html: `
                 <div class="relative flex items-center justify-center w-6 h-6">
                   <div class="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50">
                     Start
                     <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                   </div>
                   <div class="w-6 h-6 bg-emerald-500 border-[3px] border-white rounded-full shadow-md z-10"></div>
                 </div>
               `,
               iconSize: [24, 24],
               iconAnchor: [12, 12]
             });
             L.marker([pathStart.lat, pathStart.lng], { icon: startIcon }).addTo(mapRef.current);

             // Premium End Marker (Swiggy Style)
             const endIcon = L.divIcon({
               className: '',
               html: `
                 <div class="relative flex items-center justify-center w-6 h-6">
                   <div class="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50">
                     Destination
                     <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                   </div>
                   <div class="w-6 h-6 bg-orange-500 border-[3px] border-white rounded-full shadow-md z-10 flex items-center justify-center">
                     <div class="w-2 h-2 bg-white rounded-full"></div>
                   </div>
                 </div>
               `,
               iconSize: [24, 24],
               iconAnchor: [12, 12]
             });
             L.marker([pathEnd.lat, pathEnd.lng], { icon: endIcon }).addTo(mapRef.current);
          }
        }
      } catch (err) {
        console.log("GPS fetch error:", err);
        setIsLive(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full relative bg-slate-900 overflow-hidden font-sans">
      <Navbar />

      {/* Fullscreen Map */}
      <div ref={mapContainer} className="absolute inset-0 z-0 h-full w-full"></div>

      {/* Floating HUD Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 w-[90%] md:w-96 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-3xl shadow-2xl z-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-orange-500" /> Track My Bus
          </h2>
          {isLive ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> Connecting
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex flex-shrink-0 items-center justify-center text-orange-500">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-0.5">Coordinates</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white font-mono">
                {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Waiting for signal..."}
              </p>
            </div>
          </div>

          {(() => {
            if (!stops || stops.length === 0) return null;
            
            const currentStop = stops.find(s => s.status === 'current');
            const finalStop = stops[stops.length - 1];
            
            if (!currentStop) {
              return (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-800/50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex flex-shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Flag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-600/70 dark:text-emerald-400/70 mb-0.5">Journey Complete</p>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Arrived at {finalStop.name}</p>
                  </div>
                </div>
              );
            }

            return (
              <div className="flex gap-3">
                <div className="flex-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-center transition-all hover:border-orange-500/30">
                   <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><Clock className="w-3 h-3"/> Next Stop</p>
                   <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentStop.name}</p>
                   <p className="text-xs font-bold text-orange-500 mt-0.5">{currentStop.etaMins} min{currentStop.etaMins !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-center transition-all hover:border-blue-500/30">
                   <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><Flag className="w-3 h-3"/> Destination</p>
                   <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{finalStop.name}</p>
                   <p className="text-xs font-bold text-blue-500 mt-0.5">{finalStop.etaMins} min{finalStop.etaMins !== 1 ? 's' : ''} away</p>
                </div>
              </div>
            );
          })()}
        </div>
      </motion.div>
    </div>
  );
}
