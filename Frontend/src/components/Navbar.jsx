import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Plane, LogOut, User as UserIcon, PlusCircle, LayoutDashboard, CalendarDays, PieChart } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Trips', path: '/planned', icon: CalendarDays },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
  ];

  return (
    <header 
      className="sticky top-0 z-50 border-b border-white/10"
      style={{ 
        background: 'rgba(104, 83, 105, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="container mx-auto px-6 py-0 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 py-4">
          <div className="bg-salmon p-2.5 rounded-xl shadow-lg shadow-salmon/20">
            <Plane className="w-5 h-5 text-white rotate-45" />
          </div>
          <span className="hidden md:inline text-xl font-display font-bold text-white tracking-tight">
            Traveloop
          </span>
        </Link>

        {/* Center Nav */}
        {isAuthenticated && (
          <nav className="hidden sm:flex items-center gap-1 bg-white/[0.07] p-1.5 rounded-2xl border border-white/[0.08]">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/planned' && location.pathname.startsWith('/trip'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-salmon text-white shadow-md shadow-salmon/25' 
                      : 'text-white/60 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link 
                to="/create-trip" 
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-salmon text-white hover:bg-salmon-dark transition-all shadow-lg shadow-salmon/25 hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden md:inline">Plan Trip</span>
              </Link>
              
              <Link 
                to="/profile" 
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === '/profile' 
                    ? 'bg-white/15 text-white' 
                    : 'text-white/70 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-peach to-salmon text-white flex items-center justify-center font-bold uppercase text-xs shadow-sm">
                  {user?.name?.charAt(0) || <UserIcon className="w-4 h-4" />}
                </div>
                <span className="hidden lg:inline">{user?.name || 'Profile'}</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-white/40 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/[0.08] transition-all">
                Login
              </Link>
              <Link to="/signup" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-salmon text-white hover:bg-salmon-dark transition-all shadow-lg shadow-salmon/25 hover:-translate-y-0.5">
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
