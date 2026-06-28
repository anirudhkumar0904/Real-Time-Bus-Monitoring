import EventEmitter from "events";

function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const phi1 = lat1 * Math.PI/180;
  const phi2 = lat2 * Math.PI/180;
  const dPhi = (lat2-lat1) * Math.PI/180;
  const dLambda = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(dPhi/2) * Math.sin(dPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(dLambda/2) * Math.sin(dLambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

class GPSSimulator extends EventEmitter {
  constructor() {
    super();

    this.stops = [
      { name: "Mambalasalai", lat: 10.8340, lng: 78.6960, time: "07:00 AM", status: "reached" },
      { name: "Palpannai", lat: 10.8109, lng: 78.6850, time: "07:15 AM", status: "current" },
      { name: "Thiruverumbur", lat: 10.7749, lng: 78.7047, time: "07:30 AM", status: "upcoming" },
      { name: "College Gate", lat: 10.7302, lng: 79.0177, time: "08:15 AM", status: "upcoming" },
    ];

    this.routePath = []; // Will hold polyline waypoints: [{lat, lng}, ...]
    this.currentPathIndex = 0; // Where are we on the road polyline
    
    this.currentPosition = { lat: 10.8340, lng: 78.6960 };
    this.targetStopIndex = 1; // Which official "Stop" are we heading to?
    this.speedKmh = 50; 
    
    this.speedMultiplier = 20; // 50km/h * 20 = 1000 km/h simulation for smooth testing
    
    this.interval = null;
    this.pauseTicks = 0;
  }

  async fetchRouteFromOSRM() {
    try {
      // Build coordinates string: lon,lat;lon,lat
      const coords = this.stops.map(s => `${s.lng},${s.lat}`).join(';');
      const url = `http://router.project-osrm.org/route/v1/driving/${coords}?geometries=geojson&overview=full`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.code === 'Ok' && data.routes.length > 0) {
        // Map geojson [lng, lat] to {lat, lng}
        this.routePath = data.routes[0].geometry.coordinates.map(coord => ({
          lat: coord[1],
          lng: coord[0]
        }));
        console.log(`✅ Loaded real road path from OSRM (${this.routePath.length} waypoints)`);
      } else {
        throw new Error("Invalid OSRM response");
      }
    } catch (err) {
      console.error("❌ Failed to fetch route from OSRM. Falling back to straight lines.", err);
      // Fallback: just use the stops themselves as the path
      this.routePath = this.stops.map(s => ({lat: s.lat, lng: s.lng}));
    }
  }

  async start(intervalMs = 1000) {
    if (this.interval) return;
    
    await this.fetchRouteFromOSRM();
    
    // Start at the exact first waypoint of the road
    if (this.routePath.length > 0) {
      this.currentPosition = { ...this.routePath[0] };
    }

    console.log(`📡 Realistic GPS Simulation Started (Speed: ${this.speedKmh} km/h, Multiplier: ${this.speedMultiplier}x)`);

    this.interval = setInterval(() => {
      // If paused at a stop (boarding)
      if (this.pauseTicks > 0) {
        this.pauseTicks--;
        this.emitUpdate();
        return;
      }

      // Check if we reached the end of the road
      if (this.currentPathIndex >= this.routePath.length - 1) {
        console.log("♻️ Route finished. Restarting simulation...");
        this.currentPathIndex = 0;
        this.currentPosition = { ...this.routePath[0] };
        this.targetStopIndex = 1;
        this.stops.forEach((s, i) => {
          if (i === 0) s.status = "reached";
          else if (i === 1) s.status = "current";
          else s.status = "upcoming";
        });
        this.pauseTicks = 5;
        this.emitUpdate();
        return;
      }

      // Target waypoint on the road
      const targetWaypoint = this.routePath[this.currentPathIndex + 1];
      const distanceToWaypoint = getDistanceInMeters(
        this.currentPosition.lat, this.currentPosition.lng,
        targetWaypoint.lat, targetWaypoint.lng
      );

      // Distance covered in this tick
      const realSpeedMs = (this.speedKmh * 1000) / 3600;
      const tickDurationSeconds = intervalMs / 1000;
      const moveDistanceMeters = realSpeedMs * tickDurationSeconds * this.speedMultiplier;

      // Move along the polyline
      if (distanceToWaypoint <= moveDistanceMeters) {
        // Reached this polyline waypoint
        this.currentPosition = { ...targetWaypoint };
        this.currentPathIndex++;
      } else {
        // Interpolate towards the waypoint
        const ratio = moveDistanceMeters / distanceToWaypoint;
        this.currentPosition.lat += (targetWaypoint.lat - this.currentPosition.lat) * ratio;
        this.currentPosition.lng += (targetWaypoint.lng - this.currentPosition.lng) * ratio;
      }

      // Check distance to the OFFICIAL stop to trigger UI status update
      if (this.targetStopIndex < this.stops.length) {
        const officialStop = this.stops[this.targetStopIndex];
        const distanceToOfficialStop = getDistanceInMeters(
          this.currentPosition.lat, this.currentPosition.lng,
          officialStop.lat, officialStop.lng
        );

        if (distanceToOfficialStop < 150) {
          this.stops[this.targetStopIndex].status = "reached";
          this.targetStopIndex++;
          if (this.targetStopIndex < this.stops.length) {
            this.stops[this.targetStopIndex].status = "current";
          }
          this.pauseTicks = 5;
        }
      }

      // --- DYNAMIC ETA CALCULATION ---
      const now = new Date();
      this.stops.forEach((stop) => {
        if (stop.status === "reached") {
          // Freeze time at the moment it was reached
          if (!stop.actualTime) stop.actualTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          stop.time = stop.actualTime;
          stop.etaMins = 0;
        } else {
          // Haversine distance * 1.2 (for road curvature approximation)
          const distMeters = getDistanceInMeters(this.currentPosition.lat, this.currentPosition.lng, stop.lat, stop.lng) * 1.2;
          const secondsToArrival = distMeters / realSpeedMs; // Real-world time
          
          stop.etaMins = Math.max(1, Math.ceil(secondsToArrival / 60));
          
          // Calculate the projected real-world arrival clock time
          const realEtaDate = new Date(now.getTime() + (secondsToArrival * 1000));
          stop.time = realEtaDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
      });

      this.emitUpdate();
    }, intervalMs);
  }

  emitUpdate() {
    this.emit("locationUpdate", {
      location: this.currentPosition,
      stops: this.stops,
      routePath: this.routePath
    });
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log("📡 GPS Simulation Stopped.");
    }
  }
}

export default GPSSimulator;
