import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import TopHeader     from './components/TopHeader';
import BottomNav     from './components/BottomNav';
import Home          from './pages/Home';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Disease       from './pages/Disease';
import Chatbot       from './pages/Chatbot';
import CropRecommend from './pages/CropRecommend';
import Weather       from './pages/Weather';
import MarketPrices  from './pages/MarketPrices';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <>
      <TopHeader />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/weather"  element={<Weather />} />
        <Route path="/market"   element={<MarketPrices />} />
        <Route path="/disease"  element={<PrivateRoute><Disease /></PrivateRoute>} />
        <Route path="/chat"     element={<PrivateRoute><Chatbot /></PrivateRoute>} />
        <Route path="/crops"    element={<PrivateRoute><CropRecommend /></PrivateRoute>} />
      </Routes>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;