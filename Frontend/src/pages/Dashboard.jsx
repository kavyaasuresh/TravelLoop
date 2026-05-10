import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTripStore } from '../store/tripStore';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Plus, Clock, ChevronRight, Plane, PieChart, Info, Activity, Compass } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { trips, loading, fetchTrips } = useTripStore();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (loading && trips.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card h-64 skeleton"></div>
        ))}
      </div>
    );
  }

  const upcomingTrips = trips.filter(t => new Date(t.startDate) > new Date());
  const activeOrPastTrips = trips.filter(t => new Date(t.startDate) <= new Date());

  return (
    <div className="space-y-14 max-w-7xl mx-auto pb-12">
      {/* Hero Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="text-salmon font-semibold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
            <Compass className="w-4 h-4" /> Your Travel Journal
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-eggplant leading-tight">
            Welcome to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-eggplant via-salmon to-peach">
              Traveloop
            </span>
          </h1>
          <p className="text-eggplant-muted mt-3 font-medium text-lg">Your next adventure is waiting for you.</p>
        </div>
        <Link to="/create-trip" className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-5 h-5" /> Plan New Trip
        </Link>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Planned', value: trips.length, icon: Plane, gradient: 'from-salmon/15 to-peach/10', iconBg: 'bg-salmon/20', iconColor: 'text-salmon-dark', border: 'border-l-salmon' },
          { label: 'Ready to Go', value: upcomingTrips.length, icon: Clock, gradient: 'from-peach/15 to-sand/10', iconBg: 'bg-peach/25', iconColor: 'text-peach-dark', border: 'border-l-peach' },
          { label: 'Completed', value: activeOrPastTrips.length, icon: MapPin, gradient: 'from-sage/15 to-sage/5', iconBg: 'bg-sage/30', iconColor: 'text-sage-dark', border: 'border-l-sage-dark' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card flex items-center gap-5 border-l-4 ${stat.border} bg-gradient-to-br ${stat.gradient}`}
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-eggplant-muted uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-bold text-eggplant">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Trips Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-display font-bold text-eggplant">Your Recent Plans</h2>
          <Link to="/planned" className="text-salmon font-semibold hover:underline text-sm flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {trips.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card py-16 text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-peach/20 to-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-eggplant/30" />
            </div>
            <h3 className="text-xl font-display font-bold text-eggplant">No adventures planned yet ✈️</h3>
            <p className="text-eggplant-muted max-w-sm mx-auto">
              Start your first journey by creating a trip. It only takes a minute to organize your dream vacation.
            </p>
            <Link to="/create-trip" className="btn-primary inline-flex mt-4">Start Planning</Link>
          </motion.div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 3).map((trip) => (
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
      </section>

      {/* Recommended Destinations */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-display font-bold text-eggplant">Inspiration for You</h2>
          <span className="bg-salmon/10 text-salmon text-xs font-bold px-3 py-1 rounded-full">✨ Trending</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { city: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400' },
            { city: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=400' },
            { city: 'Swiss Alps', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400' },
            { city: 'Cappadocia', country: 'Turkey', img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=400' }
          ].map((dest, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="group relative h-60 rounded-3xl overflow-hidden cursor-pointer border border-white/30"
              style={{ boxShadow: '0 10px 40px rgba(104,83,105,0.12)' }}
            >
              <img src={dest.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-eggplant/80 via-eggplant/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-display font-bold text-xl text-white">{dest.city}</p>
                <p className="text-xs text-white/70 font-semibold uppercase tracking-widest mt-1">{dest.country}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Budget & Activities Guide */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Budget Guide */}
        <div className="glass-card space-y-6" style={{ background: 'linear-gradient(135deg, rgba(252,200,178,0.08) 0%, rgba(255,255,255,0.75) 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-salmon/15 text-salmon rounded-xl"><PieChart className="w-6 h-6" /></div>
            <h3 className="text-xl font-display font-bold text-eggplant">Ideal Budget Split</h3>
          </div>
          <p className="text-eggplant-muted text-sm">Plan your finances like a pro. A standard 7-day international trip budget:</p>
          
          <div className="space-y-4">
            {[
              { label: 'Flights & Transport', pct: 40, color: 'bg-salmon' },
              { label: 'Accommodation', pct: 30, color: 'bg-peach-dark' },
              { label: 'Food & Dining', pct: 15, color: 'bg-sage-dark' },
              { label: 'Activities & Fun', pct: 15, color: 'bg-eggplant/30' }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-semibold text-eggplant mb-1.5">
                  <span>{item.label}</span>
                  <span className="text-eggplant-muted">{item.pct}%</span>
                </div>
                <div className="w-full bg-eggplant/[0.06] rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-sage/10 rounded-xl flex items-start gap-3 border border-sage/20">
            <Info className="w-5 h-5 text-sage-dark flex-shrink-0 mt-0.5" />
            <p className="text-xs text-eggplant/70 font-medium leading-relaxed">Tip: Always keep an emergency fund of at least 10% of your total budget for unexpected costs.</p>
          </div>
        </div>

        {/* Activities Guide */}
        <div className="glass-card space-y-6" style={{ background: 'linear-gradient(135deg, rgba(198,216,175,0.08) 0%, rgba(255,255,255,0.75) 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sage/25 text-sage-dark rounded-xl"><Activity className="w-6 h-6" /></div>
            <h3 className="text-xl font-display font-bold text-eggplant">Top Activity Ideas</h3>
          </div>
          <p className="text-eggplant-muted text-sm">Not sure what to do? Add these to your itinerary for a memorable experience:</p>
          
          <div className="space-y-3">
            {[
              { title: 'Local Food Tour', desc: 'Taste authentic street food with a local guide.', icon: '🌮' },
              { title: 'Sunset Cruise', desc: 'Relax on the water while watching the sun go down.', icon: '⛵' },
              { title: 'Historical Walking Tour', desc: 'Learn the secrets of the city\'s old town.', icon: '🏛️' },
              { title: 'Nature Hiking', desc: 'Explore the scenic trails and national parks nearby.', icon: '🥾' }
            ].map((act, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white/60 rounded-2xl border border-white/40 hover:bg-white/80 transition-all hover:shadow-journal cursor-default">
                <div className="w-11 h-11 rounded-xl bg-sand/40 flex items-center justify-center text-xl flex-shrink-0">
                  {act.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-eggplant text-sm">{act.title}</h4>
                  <p className="text-xs text-eggplant-muted mt-0.5">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
