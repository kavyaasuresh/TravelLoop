import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useTripStore } from '../store/tripStore';
import { Plane, Calendar, Globe, ChevronRight, ChevronLeft, Loader2, Compass } from 'lucide-react';

const CreateTrip = () => {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      visibility: 'PRIVATE',
      status: 'PLANNING'
    }
  });
  const createTrip = useTripStore((state) => state.createTrip);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const trip = await createTrip(data);
      if (trip && trip.id) {
        navigate(`/trip/${trip.id}`);
      }
    } catch (error) {
      console.error('Failed to create trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-2xl mx-auto py-10 relative z-10">
      <div className="mb-12 text-center">
        <p className="text-salmon font-semibold text-sm uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
          <Compass className="w-4 h-4" /> New Journey
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-eggplant mb-2">Plan Your Next Adventure</h1>
        <div className="flex justify-center gap-3 mt-8">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-12 bg-salmon' : i < step ? 'w-8 bg-salmon/40' : 'w-8 bg-eggplant/10'}`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card shadow-journal-lg border-2 border-white hover:border-salmon/40 transition-colors duration-500 bg-white/70 space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold flex items-center gap-3 text-eggplant border-b border-eggplant/10 pb-4">
                  <div className="p-2 bg-salmon/10 text-salmon rounded-lg shadow-inner border border-salmon/20"><Plane className="w-5 h-5" /></div>
                  Basic Details
                </h2>
                
                <div className="bg-white/50 rounded-2xl p-6 border border-white hover:border-salmon/30 transition-colors shadow-sm space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-eggplant-muted uppercase tracking-widest ml-1">Trip Title</label>
                    <input 
                      {...register('title', { required: true })}
                      className="input-field w-full text-lg shadow-inner"
                      placeholder="e.g. Summer in Santorini"
                    />
                    {errors.title && <span className="text-xs text-red-500 font-bold ml-1">Title is required</span>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-eggplant-muted uppercase tracking-widest ml-1">Cover Image URL (Optional)</label>
                    <input 
                      {...register('coverImage')}
                      className="input-field w-full shadow-inner"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-eggplant-muted uppercase tracking-widest ml-1">Description (Optional)</label>
                    <textarea 
                      {...register('description')}
                      className="input-field w-full h-24 resize-none shadow-inner"
                      placeholder="Tell us more about your trip..."
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-eggplant/10">
                <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2 px-8">
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card shadow-journal-lg border-2 border-white hover:border-peach-dark/40 transition-colors duration-500 bg-white/70 space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold flex items-center gap-3 text-eggplant border-b border-eggplant/10 pb-4">
                  <div className="p-2 bg-peach-dark/20 text-peach-dark rounded-lg shadow-inner border border-peach-dark/20"><Calendar className="w-5 h-5" /></div>
                  Timeline
                </h2>
                
                <div className="bg-white/50 rounded-2xl p-6 border border-white hover:border-peach-dark/30 transition-colors shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-eggplant-muted uppercase tracking-widest ml-1">Start Date</label>
                      <input 
                        type="date"
                        {...register('startDate', { required: true })}
                        className="input-field w-full text-eggplant font-medium shadow-inner"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-eggplant-muted uppercase tracking-widest ml-1">End Date</label>
                      <input 
                        type="date"
                        {...register('endDate', { required: true })}
                        className="input-field w-full text-eggplant font-medium shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-eggplant/10">
                <button type="button" onClick={prevStep} className="btn-secondary flex items-center gap-2">
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2 px-8">
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card shadow-journal-lg border-2 border-white hover:border-sage-dark/40 transition-colors duration-500 bg-white/70 space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold flex items-center gap-3 text-eggplant border-b border-eggplant/10 pb-4">
                  <div className="p-2 bg-sage-dark/20 text-sage-dark rounded-lg shadow-inner border border-sage-dark/20"><Globe className="w-5 h-5" /></div>
                  Preferences
                </h2>
                
                <div className="bg-white/50 rounded-2xl p-6 border border-white hover:border-sage-dark/30 transition-colors shadow-sm space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-eggplant-muted uppercase tracking-widest ml-1">Visibility</label>
                    <select {...register('visibility')} className="input-field w-full appearance-none font-medium bg-white/90 shadow-inner">
                      <option value="PRIVATE">Private (Only Me)</option>
                      <option value="SHARED">Shared (With Friends)</option>
                      <option value="PUBLIC">Public (Anyone with link)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-eggplant-muted uppercase tracking-widest ml-1">Initial Status</label>
                    <select {...register('status')} className="input-field w-full appearance-none font-medium bg-white/90 shadow-inner">
                      <option value="DRAFT">Draft</option>
                      <option value="PLANNING">Planning</option>
                      <option value="READY">Ready to Go</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-eggplant/10">
                <button type="button" onClick={prevStep} className="btn-secondary flex items-center gap-2">
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Trip <Plane className="w-5 h-5 ml-1" /></>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default CreateTrip;
