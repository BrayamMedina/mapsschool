import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('donor');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Pass empty name to indicate pure login without inline-registration hack
    const res = await login(role, null, email);
    if (res && res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--purple-100)', padding: '1rem', borderRadius: '50%', color: 'var(--purple-600)', marginBottom: '1rem' }}>
            <LogIn size={32} />
          </div>
          <h2>Iniciar Sesión</h2>
          <p>Bienvenido de nuevo a MAPSSchool</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="tu@email.com" 
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ingresar como</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="donor">Donador (Quiero ayudar)</option>
              <option value="receiver">Receptor (Necesito útiles)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Ingresar
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem' }}>
          ¿No tienes cuenta? <Link to="/register" style={{ fontWeight: 600 }}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
