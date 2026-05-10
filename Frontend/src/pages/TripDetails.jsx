import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTripStore } from '../store/tripStore';
import api from '../api';
import { 
  Calendar, MapPin, DollarSign, Package, Share2, Plus, 
  ChevronDown, ChevronUp, Clock, CheckCircle2, Circle,
  AlertCircle, MoreVertical, FileText, Sparkles, Camera, Trophy
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-eggplant/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-eggplant-muted hover:text-eggplant">✕</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

const TripDetails = () => {
  const { id } = useParams();
  const { 
    currentTrip, fetchTripById, addStop, addActivity, 
    togglePackingItem, addPackingItem, addBudgetCategory, 
    markComplete, updateCoverImage, loading 
  } = useTripStore();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [expandedDays, setExpandedDays] = useState({});
  
  // Modals state
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState(null);

  // Form states
  const [stopForm, setStopForm] = useState({ cityName: '', country: '', arrivalDate: '', departureDate: '' });
  const [activityForm, setActivityForm] = useState({ title: '', category: 'SIGHTSEEING', cost: 0, startTime: '10:00' });
  const [newItemName, setNewItemName] = useState('');
  const [newBudgetCategory, setNewBudgetCategory] = useState({ category: '', estimatedCost: 0 });
  const [newNote, setNewNote] = useState('');
  const [citySearchResults, setCitySearchResults] = useState([]);
  const [activitySearchResults, setActivitySearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchTripById(id);
  }, [id, fetchTripById]);

  const handleAddStop = async (e) => {
    e.preventDefault();
    await addStop(id, { ...stopForm, stopOrder: (currentTrip.stops?.length || 0) + 1 });
    setIsStopModalOpen(false);
    setStopForm({ cityName: '', country: '', arrivalDate: '', departureDate: '' });
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    const payload = {
      ...activityForm,
      cost: parseFloat(activityForm.cost) || 0,
    };
    await addActivity(selectedStopId, payload);
    setIsActivityModalOpen(false);
    setActivityForm({ title: '', category: 'SIGHTSEEING', cost: 0, startTime: '10:00' });
  };

  const handleTogglePacking = async (itemId) => {
    await togglePackingItem(itemId);
  };

  const handleAddPackingItem = async () => {
    if (!newItemName) return;
    await addPackingItem(id, { itemName: newItemName, category: 'General', packed: false, suggested: false });
    setNewItemName('');
  };

  const handleAddBudgetCategory = async (e) => {
    e.preventDefault();
    await addBudgetCategory(id, newBudgetCategory);
    setNewBudgetCategory({ category: '', estimatedCost: 0 });
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote) return;
    await useTripStore.getState().addNote(id, { content: newNote });
    setNewNote('');
  };

  const searchCities = async (query) => {
    if (query.length < 3) return;
    setIsSearching(true);
    try {
      const res = await api.get(`/discovery/cities?q=${query}`);
      setCitySearchResults(res.data);
    } catch (e) {}
    setIsSearching(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Compress image before upload
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        await updateCoverImage(id, compressedBase64);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleMarkComplete = async () => {
    if (window.confirm('Mark this trip as completed?')) {
      await markComplete(id);
    }
  };

  const searchActivities = async (city) => {
    setIsSearching(true);
    try {
      const res = await api.get(`/discovery/activities?city=${city}`);
      setActivitySearchResults(res.data);
    } catch (e) {}
    setIsSearching(false);
  };

  if (loading || !currentTrip) {
    return <div className="h-96 flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const toggleDay = (dayId) => {
    setExpandedDays(prev => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const budgetData = [
    { name: 'Estimated', value: currentTrip.totalEstimatedCost || 0 },
    { name: 'Spent', value: currentTrip.totalActualCost || 0 }
  ];

  const COLORS = ['#6366f1', '#06b6d4'];

  const budgetUsagePercent = currentTrip.totalEstimatedCost > 0 
    ? (currentTrip.totalActualCost / currentTrip.totalEstimatedCost) * 100 
    : 0;

  const budgetStatus = budgetUsagePercent > 100 ? 'over' : budgetUsagePercent > 80 ? 'warning' : 'safe';

  const handleUpdateBudgetActual = async (categoryId, actualCost) => {
    const category = currentTrip.budgetCategories.find(c => c.id === categoryId);
    await useTripStore.getState().updateBudgetCategory(categoryId, { ...category, actualCost });
  };

  const shareUrl = `${window.location.origin}/share/${currentTrip.shareToken}`;

  const budgetChartData = currentTrip.budgetCategories?.map(cat => ({
    name: cat.category,
    planned: cat.estimatedCost,
    actual: cat.actualCost || 0
  })) || [];

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Header */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden glass">
        {currentTrip.coverImage ? (
          <img src={currentTrip.coverImage} className="w-full h-full object-cover opacity-50" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30" />
        )}
        <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-slate-950 to-transparent">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="glass px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-salmon">
              {currentTrip.status}
            </span>
            <span className="glass px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-accent">
              {currentTrip.visibility}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentTrip.title}</h1>
          <div className="flex flex-wrap gap-6 text-eggplant-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-salmon" />
              {format(new Date(currentTrip.startDate), 'MMM d')} - {format(new Date(currentTrip.endDate), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-salmon" />
              {differenceInDays(new Date(currentTrip.endDate), new Date(currentTrip.startDate))} Days
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-salmon" />
              {currentTrip.stops?.length || 0} Cities
            </div>
          </div>
        </div>
        {/* Cover image upload */}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-sm text-slate-700 text-sm font-semibold shadow hover:bg-white transition-all"
          >
            <Camera className="w-4 h-4" /> {currentTrip.coverImage ? 'Change Photo' : 'Add Photo'}
          </button>
          <button
            onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Link copied!'); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-sm text-slate-700 text-sm font-semibold shadow hover:bg-white transition-all"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          {currentTrip.status !== 'COMPLETED' && (
            <button
              onClick={handleMarkComplete}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold shadow hover:bg-emerald-600 transition-all"
            >
              <Trophy className="w-4 h-4" /> Mark Complete
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white gap-8 overflow-x-auto pb-px">
        {[
          { id: 'itinerary', label: 'Itinerary', icon: Calendar },
          { id: 'budget', label: 'Budget Hub', icon: DollarSign },
          { id: 'packing', label: 'Packing List', icon: Package },
          { id: 'notes', label: 'Trip Notes', icon: FileText }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
              activeTab === tab.id ? 'text-salmon' : 'text-eggplant-muted hover:text-eggplant'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'itinerary' && (
              <motion.div 
                key="itinerary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Trip Timeline</h2>
                  <button 
                    onClick={() => setIsStopModalOpen(true)}
                    className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Stop
                  </button>
                </div>

                {currentTrip.stops?.length === 0 ? (
                  <div className="glass-card py-12 text-center text-eggplant-muted">
                    Your itinerary is empty. Start by adding your first destination!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...currentTrip.stops]
                      .sort((a, b) => new Date(a.arrivalDate) - new Date(b.arrivalDate))
                      .map((stop) => {
                        const dayNum = differenceInDays(new Date(stop.arrivalDate), new Date(currentTrip.startDate)) + 1;
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
                                  <p className="text-sm text-eggplant-muted">{format(new Date(stop.arrivalDate), 'MMM d')}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-eggplant-muted">
                                <span className="text-xs font-bold uppercase tracking-widest">{stop.activities?.length || 0} Activities</span>
                                {expandedDays[stop.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </div>
                            </button>
                            
                            <AnimatePresence>
                              {expandedDays[stop.id] && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-white p-6 space-y-4"
                                >
                                  {stop.activities?.map((activity) => (
                                    <div key={activity.id} className="flex gap-4 group">
                                      <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full bg-salmon mt-1.5 shadow-sm" />
                                        <div className="w-px h-full bg-salmon/20 my-1" />
                                      </div>
                                      <div className="flex-1 pb-6">
                                        <div className="bg-white/60 p-4 rounded-2xl border border-white/50 hover:bg-white hover:border-salmon/30 transition-all shadow-sm">
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <h4 className="font-bold text-eggplant group-hover:text-salmon transition-colors flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-salmon" />
                                                {activity.title}
                                              </h4>
                                              <p className="text-sm text-eggplant-muted flex items-center gap-2 mt-1">
                                                <Clock className="w-3 h-3 text-eggplant/40" /> {activity.startTime?.substring(0, 5) || 'Anytime'}
                                              </p>
                                            </div>
                                            <span className="text-sm font-bold text-salmon bg-salmon/10 px-3 py-1 rounded-xl">${activity.cost}</span>
                                          </div>
                                          {activity.notes && <p className="text-sm text-eggplant-muted mt-3 italic bg-eggplant/5 p-3 rounded-xl">{activity.notes}</p>}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  <button 
                                    onClick={() => {
                                      setSelectedStopId(stop.id);
                                      setIsActivityModalOpen(true);
                                    }}
                                    className="w-full py-3 border-2 border-dashed border-white rounded-xl text-sm text-eggplant-muted hover:text-eggplant hover:border-white/20 transition-all flex items-center justify-center gap-2"
                                  >
                                    <Plus className="w-4 h-4" /> Add Activity
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'budget' && (
              <motion.div 
                key="budget"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Budget Command Center</h2>
                  <div className="flex gap-6">
                    <div className="text-right">
                      <p className="text-xs text-eggplant-muted uppercase font-bold">Planned</p>
                      <p className="text-xl font-bold text-salmon">${currentTrip.totalEstimatedCost}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-eggplant-muted uppercase font-bold">Actual Spent</p>
                      <p className="text-xl font-bold text-accent">${currentTrip.totalActualCost}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-card p-6 min-h-[350px]">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-eggplant-muted mb-6">Planned vs Actual</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="99%" height={250}>
                        <BarChart data={budgetChartData}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                          <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          />
                          <Bar dataKey="planned" fill="#6366f1" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="actual" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card p-6 flex flex-col min-h-[350px]">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-eggplant-muted mb-6">Spending Health</h3>
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="w-48 h-48 relative">
                        <ResponsiveContainer width="99%" height={200}>
                          <PieChart>
                            <Pie
                              data={budgetData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {budgetData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-3xl font-bold">{Math.round(budgetUsagePercent)}%</span>
                          <span className="text-[10px] text-eggplant-muted uppercase tracking-widest font-bold">Of Budget</span>
                        </div>
                      </div>
                      <div className={`mt-6 w-full flex items-center gap-3 p-3 rounded-xl border ${
                        budgetStatus === 'over' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        budgetStatus === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        {budgetStatus === 'safe' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {budgetStatus === 'over' ? 'Budget Exceeded' : 
                           budgetStatus === 'warning' ? 'Budget Warning' : 
                           'On Track'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-0 overflow-hidden">
                  <div className="p-4 border-b border-white bg-white flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-eggplant-muted">Manage Expenses</h3>
                  </div>
                  <div className="divide-y divide-white/5">
                    {currentTrip.budgetCategories?.map(cat => (
                      <div key={cat.id} className="p-4 flex flex-wrap gap-4 justify-between items-center group hover:bg-white transition-colors">
                        <span className="font-bold min-w-[120px]">{cat.category}</span>
                        <div className="flex gap-8 items-center">
                          <div className="text-right">
                            <p className="text-[10px] text-eggplant-muted uppercase font-bold">Planned</p>
                            <p className="font-bold text-salmon">${cat.estimatedCost}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-eggplant-muted uppercase font-bold">Spent</p>
                            <input 
                              type="number"
                              className="bg-transparent text-right font-bold text-accent w-20 outline-none border-b border-white hover:border-accent transition-colors"
                              defaultValue={cat.actualCost || 0}
                              onBlur={(e) => handleUpdateBudgetActual(cat.id, parseFloat(e.target.value))}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <form onSubmit={handleAddBudgetCategory} className="p-4 flex gap-3 bg-slate-900/40">
                      <input 
                        required placeholder="e.g. Shopping" 
                        className="input-field py-2 flex-1 text-sm"
                        value={newBudgetCategory.category}
                        onChange={e => setNewBudgetCategory({...newBudgetCategory, category: e.target.value})}
                      />
                      <input 
                        required type="number" placeholder="Planned $" 
                        className="input-field py-2 w-32 text-sm"
                        value={newBudgetCategory.estimatedCost || ''}
                        onChange={e => setNewBudgetCategory({...newBudgetCategory, estimatedCost: parseFloat(e.target.value)})}
                      />
                      <button type="submit" className="btn-primary py-2 px-6 flex items-center gap-2 text-sm">
                        <Plus className="w-4 h-4" /> Add Category
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'packing' && (
              <motion.div 
                key="packing"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Packing Essentials</h2>
                <div className="bg-[#fdfbf7] rounded-xl p-6 shadow-journal border border-sand/40 relative overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 35px, #e2e8f0 35px, #e2e8f0 36px)', backgroundAttachment: 'local' }}>
                  {/* Notebook red margin line */}
                  <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-red-300/40 z-0"></div>
                  
                  <div className="relative z-10 pl-6 space-y-0">
                  {currentTrip.packingItems?.length === 0 ? (
                    <div className="py-2 text-eggplant/50 text-base font-display italic">Your packing list is empty.</div>
                  ) : (
                    currentTrip.packingItems?.map(item => (
                      <div key={item.id} className="flex items-center justify-between group h-[36px]">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleTogglePacking(item.id)}
                            className={`p-0.5 rounded transition-colors flex items-center ${item.packed ? 'text-salmon' : 'text-eggplant/30 hover:text-salmon/50'}`}
                          >
                            {item.packed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                          </button>
                          <div className="flex items-center gap-3">
                            <span className={`font-display text-lg tracking-wide ${item.packed ? 'line-through text-eggplant/40' : 'text-eggplant'}`}>{item.itemName}</span>
                            <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[9px] bg-white/50 px-1.5 rounded text-eggplant-muted uppercase font-bold">{item.category}</span>
                              {item.suggested && <span className="text-[9px] bg-salmon/10 text-salmon px-1.5 rounded uppercase font-bold">Suggested</span>}
                            </div>
                          </div>
                        </div>
                        <MoreVertical className="w-4 h-4 text-eggplant/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                      </div>
                    ))
                  )}
                  <div className="h-[36px] flex items-center gap-2 mt-2">
                    <input 
                      className="bg-transparent py-1 flex-1 outline-none font-display text-lg text-eggplant placeholder-eggplant/30" 
                      placeholder="Add new item..." 
                      value={newItemName}
                      onChange={e => setNewItemName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddPackingItem()}
                    />
                    <button onClick={handleAddPackingItem} className="text-salmon hover:text-salmon-dark p-1 bg-white/50 rounded-lg shadow-sm border border-white"><Plus className="w-4 h-4" /></button>
                  </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div 
                key="notes"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Trip Journal</h2>
                  <p className="text-sm text-eggplant-muted">{currentTrip.notes?.length || 0} Entries</p>
                </div>

                <div className="glass-card p-6">
                  <form onSubmit={handleAddNote} className="space-y-4">
                    <textarea 
                      className="input-field min-h-[120px] resize-none" 
                      placeholder="Jot down important details, local contacts, or memories..."
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button type="submit" className="btn-primary py-2 px-6 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Save Note
                      </button>
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                  {currentTrip.notes?.map((note, idx) => {
                    const colors = [
                      'bg-[#fef08a] border-[#fde047] text-slate-800', 
                      'bg-[#fbcfe8] border-[#f9a8d4] text-slate-800', 
                      'bg-[#bbf7d0] border-[#86efac] text-slate-800', 
                      'bg-[#fed7aa] border-[#fdba74] text-slate-800'
                    ];
                    const colorClasses = colors[idx % 4];
                    // Alternate rotations for sticky notes
                    const rotateClass = idx % 2 === 0 ? '-rotate-2' : 'rotate-2';

                    return (
                      <div key={note.id} className={`relative p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border ${colorClasses} ${rotateClass}`}>
                        {/* Sticky note pin */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-sm bg-red-400 border border-red-500 flex items-center justify-center">
                          <div className="w-1 h-1 bg-white/50 rounded-full absolute top-1 left-1"></div>
                        </div>
                        
                        <p className="font-display text-lg leading-relaxed whitespace-pre-wrap mb-6">{note.content}</p>
                        <div className="absolute bottom-3 right-4 text-[10px] opacity-60 uppercase font-bold tracking-widest">
                          <span>{format(new Date(note.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-salmon" /> Smart Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-salmon/5 border border-primary/10">
                <p className="text-sm text-eggplant-muted">
                  <span className="text-salmon font-bold">Pro-tip:</span> Travelers visiting <strong>{currentTrip.stops?.[0]?.cityName || 'your destination'}</strong> usually recommend carrying comfortable walking shoes.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                <p className="text-sm text-eggplant-muted">
                  <span className="text-accent font-bold">Budget Insight:</span> You have ${currentTrip.totalEstimatedCost - currentTrip.totalActualCost} remaining in your planned budget.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-lg font-bold mb-4">Sharing</h3>
            <div className="space-y-4">
              <p className="text-sm text-eggplant-muted">Share your itinerary with friends via this secure link:</p>
              <div className="flex gap-2 p-2 rounded-xl bg-white border border-white overflow-hidden">
                <input 
                  readOnly 
                  value={shareUrl} 
                  className="bg-transparent text-xs text-eggplant-muted flex-1 outline-none px-2"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    alert('Copied!');
                  }}
                  className="p-2 bg-salmon/20 hover:bg-salmon/30 rounded-lg text-salmon transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isStopModalOpen} onClose={() => setIsStopModalOpen(false)} title="Add Trip Stop">
        <form onSubmit={handleAddStop} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-eggplant-muted uppercase font-bold">City & Country Search</label>
            <div className="flex gap-2">
              <input 
                required className="input-field w-full py-2" 
                placeholder="Search city (e.g. London)"
                value={stopForm.cityName} 
                onChange={e => {
                  setStopForm({...stopForm, cityName: e.target.value});
                  searchCities(e.target.value);
                }}
              />
            </div>
            {citySearchResults.length > 0 && (
              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                {citySearchResults.map((city, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setStopForm({...stopForm, cityName: city.name, country: city.country});
                      setCitySearchResults([]);
                    }}
                    className="w-full p-2 text-left bg-white hover:bg-salmon/20 rounded-lg text-xs flex justify-between"
                  >
                    <span>{city.name}, {city.country}</span>
                    <span className="text-eggplant-muted italic">Score: {city.popularity}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-eggplant-muted uppercase font-bold">Arrival</label>
              <input 
                type="date" required className="input-field w-full py-2" 
                value={stopForm.arrivalDate} 
                onChange={e => setStopForm({...stopForm, arrivalDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-eggplant-muted uppercase font-bold">Departure</label>
              <input 
                type="date" required className="input-field w-full py-2" 
                value={stopForm.departureDate} 
                onChange={e => setStopForm({...stopForm, departureDate: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full py-2">Confirm Stop</button>
        </form>
      </Modal>

      <Modal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} title="Add Activity">
        <form onSubmit={handleAddActivity} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs text-eggplant-muted uppercase font-bold tracking-widest">What's the plan?</label>
              <button 
                type="button" 
                disabled={isSearching}
                onClick={() => searchActivities(currentTrip.stops.find(s => s.id === selectedStopId)?.cityName)}
                className="text-[10px] text-salmon hover:text-eggplant flex items-center gap-1 font-bold uppercase tracking-widest bg-salmon/10 px-2 py-1 rounded-md transition-colors"
              >
                <Sparkles className={`w-3 h-3 ${isSearching ? 'animate-spin' : ''}`} />
                {isSearching ? 'Exploring...' : 'Discover Activities'}
              </button>
            </div>
            <input 
              required className="input-field w-full py-2" 
              placeholder="e.g. Visit Eiffel Tower"
              value={activityForm.title} 
              onChange={e => setActivityForm({...activityForm, title: e.target.value})}
            />
            {activitySearchResults.length > 0 && (
              <div className="mt-2 space-y-2 border border-primary/20 p-2 rounded-xl bg-salmon/5">
                <p className="text-[10px] text-salmon font-bold uppercase tracking-widest mb-2 px-1">Recommended for you</p>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
                  {activitySearchResults.map((act, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setActivityForm({
                          ...activityForm, 
                          title: act.title, 
                          cost: act.cost,
                          category: act.category
                        });
                        setActivitySearchResults([]);
                      }}
                      className="p-3 text-left bg-white/60 hover:bg-white border border-white hover:border-salmon/30 rounded-xl text-xs flex justify-between items-center transition-all group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-salmon/10 border border-salmon/20 flex items-center justify-center text-salmon group-hover:bg-salmon group-hover:text-white transition-colors">
                          <Plus className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold">{act.title}</p>
                          <p className="text-[10px] text-eggplant-muted uppercase tracking-tighter">{act.duration} · {act.category}</p>
                        </div>
                      </div>
                      <span className="text-salmon font-bold bg-salmon/10 px-2 py-1 rounded-md border border-salmon/20">${act.cost}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-eggplant-muted uppercase font-bold">Cost ($)</label>
              <input 
                type="number" required className="input-field w-full py-2" 
                placeholder="0"
                value={activityForm.cost}
                onChange={e => setActivityForm({...activityForm, cost: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-eggplant-muted uppercase font-bold">Time</label>
              <input 
                type="time" className="input-field w-full py-2" 
                value={activityForm.startTime} 
                onChange={e => setActivityForm({...activityForm, startTime: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full py-2">Add to Itinerary</button>
        </form>
      </Modal>
    </div>
  );
};

export default TripDetails;
