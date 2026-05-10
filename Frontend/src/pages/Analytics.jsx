import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTripStore } from '../store/tripStore';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Plane, MapPin, DollarSign, Users, Award, TrendingUp, Compass } from 'lucide-react';

const Analytics = () => {
  const { trips, loading, fetchTrips } = useTripStore();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const stats = useMemo(() => {
    let totalCities = 0;
    let totalCost = 0;
    let totalShared = 0;
    const categoryCosts = {};

    trips.forEach(trip => {
      totalCities += trip.stops?.length || 0;
      if (trip.shareToken) totalShared += 1;

      trip.budgetCategories?.forEach(cat => {
        totalCost += cat.actualCost || 0;
        categoryCosts[cat.category] = (categoryCosts[cat.category] || 0) + (cat.actualCost || 0);
      });
    });

    const costData = Object.keys(categoryCosts).map(key => ({
      name: key,
      value: categoryCosts[key]
    })).filter(item => item.value > 0);

    return { totalCities, totalCost, totalShared, costData };
  }, [trips]);

  // Using the new sunset travel journal palette for charts
  const COLORS = ['#EFA48B', '#FCC8B2', '#C6D8AF', '#DBD8B3', '#685369', '#a8c18c'];

  if (loading && trips.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => <div key={i} className="glass-card h-32"></div>)}
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto relative z-10">
      <header className="text-center mb-12">
        <p className="text-salmon font-semibold text-sm uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
          <TrendingUp className="w-4 h-4" /> Travel Insights
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-eggplant">Your Travel Analytics</h1>
        <p className="text-eggplant-muted mt-3 font-medium">Discover insights from all your adventures around the globe.</p>
      </header>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card flex flex-col items-center justify-center p-6 text-center border-t-4 border-t-salmon">
          <Plane className="w-8 h-8 text-salmon mb-2" />
          <p className="text-3xl font-bold text-eggplant">{trips.length}</p>
          <p className="text-xs uppercase font-bold text-eggplant-muted tracking-wider mt-1">Total Trips</p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-6 text-center border-t-4 border-t-peach-dark">
          <MapPin className="w-8 h-8 text-peach-dark mb-2" />
          <p className="text-3xl font-bold text-eggplant">{stats.totalCities}</p>
          <p className="text-xs uppercase font-bold text-eggplant-muted tracking-wider mt-1">Cities Explored</p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-6 text-center border-t-4 border-t-sage-dark">
          <DollarSign className="w-8 h-8 text-sage-dark mb-2" />
          <p className="text-3xl font-bold text-eggplant">${stats.totalCost.toLocaleString()}</p>
          <p className="text-xs uppercase font-bold text-eggplant-muted tracking-wider mt-1">Total Spent</p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center p-6 text-center border-t-4 border-t-sand-dark">
          <Users className="w-8 h-8 text-sand-dark mb-2" />
          <p className="text-3xl font-bold text-eggplant">{stats.totalShared}</p>
          <p className="text-xs uppercase font-bold text-eggplant-muted tracking-wider mt-1">Shared Trips</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cost Breakdown Chart */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-display font-bold text-eggplant mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-salmon" /> Spending Breakdown
          </h3>
          {stats.costData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.costData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth={2}
                  >
                    {stats.costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `$${value}`}
                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(104,83,105,0.1)' }}
                    itemStyle={{ color: '#685369', fontWeight: '600' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {stats.costData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-sm">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-eggplant-muted font-medium">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-eggplant/30">
              <DollarSign className="w-12 h-12 mb-2 opacity-30" />
              <p className="font-medium">No spending data available yet.</p>
            </div>
          )}
        </div>

        {/* Travel Achievements */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-display font-bold text-eggplant mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-peach-dark" /> Travel Achievements
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/40 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-salmon/20 to-peach/20 text-salmon flex items-center justify-center text-xl shadow-inner border border-white/50">🌍</div>
                <div>
                  <p className="font-bold text-eggplant">World Traveler</p>
                  <p className="text-xs text-eggplant-muted mt-0.5">Visited {stats.totalCities} cities</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-salmon bg-salmon/10 px-3 py-1.5 rounded-full uppercase tracking-widest">Level {Math.floor(stats.totalCities / 5) + 1}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/40 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage/30 to-sand/30 text-sage-dark flex items-center justify-center text-xl shadow-inner border border-white/50">🤝</div>
                <div>
                  <p className="font-bold text-eggplant">Social Butterfly</p>
                  <p className="text-xs text-eggplant-muted mt-0.5">Shared {stats.totalShared} trips</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-sage-dark bg-sage/20 px-3 py-1.5 rounded-full uppercase tracking-widest">Level {Math.floor(stats.totalShared / 2) + 1}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/20 rounded-2xl border border-white/20 opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-eggplant/5 text-eggplant/40 flex items-center justify-center text-xl shadow-inner border border-white/20">🔒</div>
                <div>
                  <p className="font-bold text-eggplant">High Roller</p>
                  <p className="text-xs text-eggplant-muted mt-0.5">Spend over $10,000</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-eggplant/50 bg-eggplant/5 px-3 py-1.5 rounded-full uppercase tracking-widest">Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
