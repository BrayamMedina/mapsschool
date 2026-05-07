import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, MapPin, Route } from 'lucide-react';

export function Home() {
  const { user } = useAuth();

  return (
    <main className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--purple-700)' }}>
          Conectando corazones con educación
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          MAPSSchool centraliza y facilita la donación de útiles escolares en Sogamoso. 
          Los donadores ofrecen útiles y los estudiantes trazan la ruta para buscarlos.
        </p>

        {!user ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Comenzar ahora
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Ya tengo cuenta
            </Link>
          </div>
        ) : (
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Ir a mi Dashboard
          </Link>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--purple-600)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <HeartHandshake size={48} />
          </div>
          <h3>Dona lo que ya no usas</h3>
          <p style={{ marginTop: '0.5rem' }}>Escribe qué útiles quieres donar, pon una dirección, horario y deja que quienes lo necesiten te contacten.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--purple-600)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <MapPin size={48} />
          </div>
          <h3>Mapa Local de Sogamoso</h3>
          <p style={{ marginTop: '0.5rem' }}>Utilizamos un mapa interactivo veloz centrado en nuestra ciudad para visualizar todas las donaciones cerquita de ti.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--purple-600)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <Route size={48} />
          </div>
          <h3>Traza tu ruta</h3>
          <p style={{ marginTop: '0.5rem' }}>Como receptor, podrás ver automáticamente la mejor ruta para llegar a recoger tus útiles escolares.</p>
        </div>
      </div>
    </main>
  );
}
