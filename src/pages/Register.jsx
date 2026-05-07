import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('donor');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name) return;
    
    const res = await login(role, name, email);
    if (res && res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--purple-100)', padding: '1rem', borderRadius: '50%', color: 'var(--purple-600)', marginBottom: '1rem' }}>
            <UserPlus size={32} />
          </div>
          <h2>Registro</h2>
          <p>Únete a MAPSSchool</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre Completo</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Juan Pérez" 
              required
            />
          </div>

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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>¿Qué papel tendrás?</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="donor">Donador (Quiero ayudar)</option>
              <option value="receiver">Receptor (Necesito útiles)</option>
            </select>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              {role === 'donor' 
                ? 'Como donador podrás registrar los artículos que deseas regalar y ubicarlos en el mapa.'
                : 'Como receptor podrás ver en el mapa las donaciones disponibles y trazar una ruta para recogerlas.'}
            </p>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Registrarse
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ fontWeight: 600 }}>Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}
