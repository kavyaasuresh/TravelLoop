import { useTripStore } from '../store/tripStore';
import { User, Mail, Shield, Settings, LogOut, Camera, Compass } from 'lucide-react';

const Profile = () => {
  const { trips } = useTripStore();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Traveler', email: 'traveler@example.com' };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 relative z-10">
      <header className="text-center mb-12">
        <p className="text-salmon font-semibold text-sm uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
          <Compass className="w-4 h-4" /> Personal Journal
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-eggplant">Account Settings</h1>
        <p className="text-eggplant-muted mt-3 font-medium">Manage your personal information and preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card text-center py-10 shadow-journal-lg border border-white/50">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-peach to-salmon flex items-center justify-center border-[6px] border-white shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full border border-white/60 shadow-md hover:bg-peach/10 transition-colors group">
                <Camera className="w-4 h-4 text-salmon group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <h2 className="text-2xl font-display font-bold text-eggplant">{user.name}</h2>
            <p className="text-sm text-eggplant-muted mt-1 font-medium">{user.email}</p>
          </div>

          <nav className="glass-card p-3 space-y-1 shadow-journal border border-white/40">
            {[
              { label: 'General', icon: User, active: true },
              { label: 'Security', icon: Shield },
              { label: 'Preferences', icon: Settings }
            ].map((item, i) => (
              <button 
                key={i} 
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  item.active ? 'bg-salmon text-white shadow-md shadow-salmon/20' : 'hover:bg-eggplant/5 text-eggplant/80'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <div className="h-px bg-eggplant/10 my-2 mx-2"></div>
            <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-salmon hover:bg-salmon/10 transition-all">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </nav>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="glass-card p-8 shadow-journal border border-white/40">
            <h3 className="text-xl font-display font-bold mb-6 text-eggplant border-b border-eggplant/5 pb-4">Personal Information</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-eggplant-muted uppercase font-bold tracking-widest ml-1">Full Name</label>
                  <input className="input-field w-full font-medium" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-eggplant-muted uppercase font-bold tracking-widest ml-1">Email Address</label>
                  <input className="input-field w-full font-medium" defaultValue={user.email} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-eggplant-muted uppercase font-bold tracking-widest ml-1">Bio</label>
                <textarea className="input-field w-full min-h-[120px] resize-none font-medium" placeholder="Tell the world about your travel style..." />
              </div>
              <div className="flex justify-end pt-4 border-t border-eggplant/5">
                <button className="btn-primary py-2.5 px-8">Save Changes</button>
              </div>
            </form>
          </div>

          <div className="glass-card p-8 shadow-journal border border-white/40">
            <h3 className="text-xl font-display font-bold mb-6 text-eggplant border-b border-eggplant/5 pb-4">Travel Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-6 rounded-2xl bg-salmon/10 border border-salmon/20">
                <p className="text-4xl font-display font-bold text-salmon">{trips.length}</p>
                <p className="text-[10px] text-eggplant/60 uppercase font-bold tracking-widest mt-2">Trips</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-peach-dark/10 border border-peach-dark/20">
                <p className="text-4xl font-display font-bold text-peach-dark">12</p>
                <p className="text-[10px] text-eggplant/60 uppercase font-bold tracking-widest mt-2">Countries</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-sage-dark/10 border border-sage-dark/20">
                <p className="text-4xl font-display font-bold text-sage-dark">84</p>
                <p className="text-[10px] text-eggplant/60 uppercase font-bold tracking-widest mt-2">Cities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
