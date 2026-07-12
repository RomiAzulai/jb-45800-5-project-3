import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Vacations</Link>
      </div>
      <div className="nav-links">
        <Link to="/about">About</Link>

        {!user && (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}

        {user && user.role === 'user' && (
          <>
            <Link to="/vacations">Vacations</Link>
            <Link to="/ai-recommendation">AI Recommendation</Link>
            <Link to="/mcp">MCP Query</Link>
            <span className="user-name">{user.firstName} {user.lastName}</span>
            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
          </>
        )}

        {user && user.role === 'admin' && (
          <>
            <Link to="/admin">Manage Vacations</Link>
            <Link to="/admin/add">Add Vacation</Link>
            <Link to="/admin/report">Reports</Link>
            <Link to="/ai-recommendation">AI Recommendation</Link>
            <Link to="/mcp">MCP Query</Link>
            <span className="user-name">{user.firstName} {user.lastName}</span>
            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
