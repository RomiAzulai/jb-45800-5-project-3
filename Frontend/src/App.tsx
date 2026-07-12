import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute, UserOnlyRoute } from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Vacations from './pages/Vacations';
import Admin from './pages/Admin';
import AddVacation from './pages/AddVacation';
import EditVacation from './pages/EditVacation';
import Report from './pages/Report';
import AiRecommendation from './pages/AiRecommendation';
import McpQuery from './pages/McpQuery';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/about" replace />} />
              <Route path="/about" element={<About />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/ai-recommendation" element={<AiRecommendation />} />
                <Route path="/mcp" element={<McpQuery />} />

                <Route element={<UserOnlyRoute />}>
                  <Route path="/vacations" element={<Vacations />} />
                </Route>

                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/add" element={<AddVacation />} />
                  <Route path="/admin/edit/:id" element={<EditVacation />} />
                  <Route path="/admin/report" element={<Report />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/about" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
