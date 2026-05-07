import { useAuth } from '../context/AuthContext';
import { useDonations } from '../context/DonationContext';
import { CheckCircle, Clock } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export function History() {
  const { user } = useAuth();
  const { donations } = useDonations();

  if (!user) return <Navigate to="/login" />;

  const isDonor = user.role === 'donor';

  const historyDonations = donations.filter((d) => 
    d.status === 'completed' && (isDonor ? d.donor_id === user.id : d.receiver_id === user.id)
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>
        {isDonor ? 'Mi Historial de Donaciones' : 'Útiles que he recibido'}
      </h2>

      {historyDonations.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Clock size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Aún no hay registros en tu historial.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {historyDonations.map((d) => (
            <div key={d.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid var(--success)' }}>
              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>{d.items}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {isDonor ? `Entregado al receptor` : `Donado por: ${d.donor_name}`}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Fecha: {new Date(d.created_at).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 600 }}>
                <CheckCircle size={20} />
                Completado
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
