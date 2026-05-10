import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import SharedTrip from './pages/SharedTrip';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Analytics from './pages/Analytics';
import PlannedTrips from './pages/PlannedTrips';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen relative">
        {/* Animated background blobs — always visible */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-peach/20 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-sage/25 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 right-1/4 w-[450px] h-[450px] bg-sand/30 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <Navbar />
        <main className="container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/share/:token" element={<SharedTrip />} />
            
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            <Route path="/planned" element={
              <PrivateRoute>
                <PlannedTrips />
              </PrivateRoute>
            } />

            <Route path="/analytics" element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            } />
            
            <Route path="/create-trip" element={
              <PrivateRoute>
                <CreateTrip />
              </PrivateRoute>
            } />
            
            <Route path="/trip/:id" element={
              <PrivateRoute>
                <TripDetails />
              </PrivateRoute>
            } />

            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="relative z-10 bg-eggplant/5 border-t border-eggplant/5 py-6 mt-16">
          <div className="container mx-auto px-4 text-center text-eggplant-muted text-sm font-medium">
            <p>✈️ Traveloop — Your personal travel journal</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
