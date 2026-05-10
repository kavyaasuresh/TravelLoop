import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTripStore } from '../store/tripStore';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Plus, ChevronRight, Plane, Compass } from 'lucide-react';
import { format } from 'date-fns';

const PlannedTrips = () => {
  const { trips, loading, fetchTrips } = useTripStore();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (loading && trips.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card h-64 skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-eggplant/5 pb-8">
        <div>
          <p className="text-salmon font-semibold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
            <Compass className="w-4 h-4" /> Travel Archive
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-eggplant">
            My Trips
          </h1>
          <p className="text-eggplant-muted mt-3 font-medium text-lg">All your past, present, and future adventures.</p>
        </div>
        <Link to="/create-trip" className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-5 h-5" /> Plan New Trip
        </Link>
      </header>

      {trips.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-peach/20 to-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="w-10 h-10 text-eggplant/30" />
          </div>
          <h3 className="text-xl font-display font-bold text-eggplant">No trips found ✈️</h3>
          <p className="text-eggplant-muted max-w-sm mx-auto">
            You haven't planned any trips yet. Start your journey by creating one.
          </p>
          <Link to="/create-trip" className="btn-primary inline-flex mt-4">Start Planning</Link>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <motion.div key={trip.id} variants={item}>
              <Link to={`/trip/${trip.id}`} className="group block h-full">
                <div className="glass-card h-full p-0 overflow-hidden">
                  <div className="h-44 relative overflow-hidden">
                    {trip.coverImage ? (
                      <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-peach/40 via-salmon/20 to-sage/30 flex items-center justify-center">
                        <Plane className="w-12 h-12 text-white/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-eggplant/40 to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-eggplant shadow-sm uppercase tracking-wider">
                      {trip.status}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-eggplant mb-2 group-hover:text-salmon transition-colors">{trip.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-eggplant-muted font-medium">
                      <Calendar className="w-4 h-4 text-salmon" />
                      {format(new Date(trip.startDate), 'MMM d')} — {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </div>
                    <div className="mt-4 pt-4 border-t border-eggplant/5 flex justify-between items-center">
                      <span className="text-xs text-salmon font-bold tracking-widest uppercase">
                        {trip.stops?.length || 0} STOPS
                      </span>
                      <ChevronRight className="w-4 h-4 text-eggplant/20 group-hover:text-salmon transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PlannedTrips;
