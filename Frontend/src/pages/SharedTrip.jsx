import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { 
  Calendar, MapPin, DollarSign, Clock, ChevronDown, ChevronUp, Plane
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const SharedTrip = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState({});

  useEffect(() => {
    const fetchSharedTrip = async () => {
      try {
        const response = await api.get(`/share/${token}`);
        setTrip(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSharedTrip();
  }, [token]);

  if (loading) {
    return <div className="h-96 flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!trip) {
    return (
      <div className="glass-card py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Trip Not Found</h2>
        <p className="text-eggplant-muted mb-8">The link might be expired or the trip is no longer public.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  const toggleDay = (dayId) => {
    setExpandedDays(prev => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Plane className="w-12 h-12 text-salmon rotate-45" />
        </div>
        <h1 className="text-4xl font-bold">{trip.title}</h1>
        <p className="text-eggplant-muted max-w-lg mx-auto">{trip.description}</p>
        <div className="flex flex-wrap justify-center gap-6 text-eggplant-muted">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-salmon" />
            {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-salmon" />
            {differenceInDays(new Date(trip.endDate), new Date(trip.startDate))} Days
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-white pb-4">Full Itinerary</h2>
        <div className="space-y-4">
          {[...trip.stops]
            .sort((a, b) => new Date(a.arrivalDate) - new Date(b.arrivalDate))
            .map((stop) => {
              const dayNum = differenceInDays(new Date(stop.arrivalDate), new Date(trip.startDate)) + 1;
              return (
                <div key={stop.id} className="glass-card p-0 overflow-hidden">
                  <button 
                    onClick={() => toggleDay(stop.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-salmon/20 flex flex-col items-center justify-center text-salmon font-bold">
                        <span className="text-xs uppercase">Day</span>
                        <span>{dayNum > 0 ? dayNum : 1}</span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold">{stop.cityName}, {stop.country}</h3>
                      </div>
                    </div>
                    {expandedDays[stop.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  
                  {expandedDays[stop.id] && (
                    <div className="border-t border-white p-6 space-y-4 bg-white">
                      {stop.activities?.map((activity) => (
                        <div key={activity.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                            <div className="w-px h-full bg-sand/20 my-1" />
                          </div>
                          <div className="flex-1 pb-4">
                            <h4 className="font-bold">{activity.title}</h4>
                            <p className="text-sm text-eggplant-muted">{activity.startTime?.substring(0, 5) || 'Anytime'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <div className="glass-card text-center py-10 space-y-6">
        <h3 className="text-xl font-bold">Want to plan your own adventure?</h3>
        <p className="text-eggplant-muted">Join Traveloop and start planning with smart insights and budget tracking.</p>
        <Link to="/signup" className="btn-primary inline-flex">Get Started Free</Link>
      </div>
    </div>
  );
};

export default SharedTrip;
