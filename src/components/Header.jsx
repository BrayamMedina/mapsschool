import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { LogOut, Map } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderBottom: '1px solid var(--border-color)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <Map className="text-purple-600" />
          MAPS<span style={{ color: 'var(--purple-500)' }}>School</span>
        </Link>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{ fontWeight: 500 }}>Dashboard</Link>
              <Link to="/history" style={{ fontWeight: 500 }}>Historial</Link>
              
              <div style={{ padding: '0 1rem', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem' }}>Hola, <strong style={{color: 'var(--purple-600)'}}>{user.name}</strong></span>
                <span style={{ fontSize: '0.75rem', background: 'var(--purple-100)', color: 'var(--purple-800)', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>
                  {user.role === 'donor' ? 'Donador' : 'Receptor'}
                </span>
              </div>
              
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Cerrar Sesión">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Inicia Sesión</Link>
              <Link to="/register" className="btn btn-primary">Regístrate</Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
