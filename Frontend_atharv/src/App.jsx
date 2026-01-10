import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import AnalysisCard from './components/AnalysisCard'
import Home from './components/Home'
import Analyze from './components/Analyze'
import NewsFeed from './components/NewsFeed'
import ArticleDetail from './pages/ArticleDetail'
import About from './components/About'
import Settings from './components/Settings'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [authPage, setAuthPage] = useState('login'); // 'login' or 'register'

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setAuthPage('login');
  };

  if (!isAuthenticated) {
    return authPage === 'login' ? (
      <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthPage('register')} />
    ) : (
      <Register onRegister={handleLogin} onSwitchToLogin={() => setAuthPage('login')} />
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F9FAFB] selection:bg-primary/20 selection:text-primary animate-fade-in">
        <Routes>
          {/* Main Layout Routes */}
          <Route path="/" element={
            <>
              {/* Background Decorative Elements */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success/5 rounded-full blur-[120px]" />
              </div>
              <Header onLogout={handleLogout} />
              <main className="container mx-auto max-w-7xl">
                <Home onGetStarted={() => window.location.href = '/analyze'} />
              </main>
              <Footer />
            </>
          } />

          <Route path="/analyze" element={
            <>
              <Header onLogout={handleLogout} />
              <main className="w-full">
                <Analyze />
              </main>
              <Footer />
            </>
          } />

          <Route path="/news" element={
            <>
              <Header onLogout={handleLogout} />
              <main className="w-full">
                <div className="container mx-auto max-w-7xl px-4">
                  <NewsFeed />
                </div>
              </main>
              <Footer />
            </>
          } />

          <Route path="/article/:id" element={
            <>
              <ArticleDetail />
            </>
          } />

          <Route path="/about" element={
            <>
              <Header onLogout={handleLogout} />
              <main className="w-full">
                <About />
              </main>
              <Footer />
            </>
          } />

          <Route path="/settings" element={
            <>
              <Header onLogout={handleLogout} />
              <main className="w-full">
                <Settings />
              </main>
              <Footer />
            </>
          } />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="py-12 border-t border-gray-100 bg-white">
      <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white">
            <span className="text-[10px] font-bold">IP</span>
          </div>
          <span className="font-bold text-gray-900">InsightPoint</span>
        </div>
        <p className="text-gray-400 text-sm">© 2025 InsightPoint AI. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default App
