import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDonations } from '../context/DonationContext';
import { SogamosoMap } from '../components/Map/SogamosoMap';
import { Navigate } from 'react-router-dom';
import { MapPin, CheckCircle, Package } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { donations, addDonation, updateDonationStatus } = useDonations();
  
  // Specific states for donor form
  const [items, setItems] = useState('');
  const [address, setAddress] = useState('');
  const [schedule, setSchedule] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Receiver state
  const [selectedDonation, setSelectedDonation] = useState(null);

  if (!user) return <Navigate to="/login" />;

  const isDonor = user.role === 'donor';

  const handleCreateDonation = async (e) => {
    e.preventDefault();
    if (!items || !address || !schedule) return;

    setIsSubmitting(true);
    // Simulate coordinates based loosely on Sogamoso, Boyacá bounds
    // Center: 5.7144, -72.9333. Variations by +/- 0.01 for some spread
    const lat = 5.7144 + (Math.random() - 0.5) * 0.02;
    const lng = -72.9333 + (Math.random() - 0.5) * 0.02;

    await addDonation({
      donorId: user.id,
      donorName: user.name,
      items,
      address,
      schedule,
      coordinates: [lat, lng],
      imageFile: imageFile
    });

    setItems('');
    setAddress('');
    setSchedule('');
    setImageFile(null);
    setIsSubmitting(false);
    alert('Donación publicada con éxito y agregada al mapa.');
  };

  const handleClaimDonation = () => {
    if (selectedDonation) {
      updateDonationStatus(selectedDonation.id, 'reserved', user.id);
      alert('¡Has reservado esta donación! Revisa la ruta en el mapa para ir a buscarla y avisa cuando la obtengas.');
      setSelectedDonation({ ...selectedDonation, status: 'reserved', receiver_id: user.id });
    }
  };

  const handleCancelReservation = () => {
    if (selectedDonation) {
      updateDonationStatus(selectedDonation.id, 'available');
      alert('Reserva cancelada. La donación vuelve a estar disponible en el mapa.');
      setSelectedDonation(null);
    }
  };

  const handleCompleteDonation = (donationId) => {
    updateDonationStatus(donationId, 'completed');
  };

  // Filter donations logic
  const availableDonations = useMemo(() => {
    return donations.filter(d => d.status === 'available');
  }, [donations]);

  const myReservations = useMemo(() => {
    return donations.filter(d => d.receiver_id === user.id && d.status === 'reserved');
  }, [donations, user.id]);

  const myDonations = useMemo(() => {
    return donations.filter(d => d.donor_id === user.id && d.status !== 'completed');
  }, [donations, user.id]);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Form (Donor) or Info (Receiver) */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          {isDonor ? (
            <>
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package className="text-purple-600" />
                Ofrecer Donación
              </h2>
              <form onSubmit={handleCreateDonation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>¿Qué donarás?</label>
                  <textarea 
                    value={items} 
                    onChange={e => setItems(e.target.value)} 
                    placeholder="Ej. 3 cuadernos, 1 caja de colores, morral usado..."
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Dirección (Sogamoso)</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      value={address} 
                      onChange={e => setAddress(e.target.value)} 
                      placeholder="Calle 11 # 12-34, Centro" 
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Horario de disponibilidad</label>
                  <input 
                    type="text" 
                    value={schedule} 
                    onChange={e => setSchedule(e.target.value)} 
                    placeholder="Lunes a Viernes 2pm a 6pm" 
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Foto de los útiles (Opcional)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])} 
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  {isSubmitting ? 'Publicando...' : 'Publicar en el Mapa'}
                </button>
              </form>

              {myDonations.length > 0 && (
                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Mis donaciones activas</h3>
                  {myDonations.map(d => (
                    <div key={d.id} style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                      <p><strong>{d.items}</strong></p>
                      <span style={{ fontSize: '0.8rem', background: d.status === 'reserved' ? 'var(--warning)' : 'var(--success)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', marginTop: '0.5rem', display: 'inline-block' }}>
                        {d.status === 'available' ? 'Disponible' : 'Reservado por alguien'}
                      </span>
                      {d.status === 'reserved' && (
                        <button onClick={() => handleCompleteDonation(d.id)} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', background: 'var(--success)' }}>
                          Marcar como Entregada
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 style={{ marginBottom: '1rem' }}>Buscar Donaciones</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Revisa el mapa para ver los útiles disponibles. Haz clic sobre un marcador para ver los detalles.
              </p>
              
              {selectedDonation ? (
                <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '0.5rem' }}>
                  <h3 style={{ color: 'var(--purple-600)', marginBottom: '1rem' }}>Detalle de Donación</h3>
                  {selectedDonation.image_url && (
                    <img 
                      src={selectedDonation.image_url} 
                      alt="Útiles" 
                      style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem' }} 
                    />
                  )}
                  <p><strong>Ofrece:</strong> {selectedDonation.donor_name}</p>
                  <p style={{ margin: '0.5rem 0' }}><strong>Útiles:</strong> {selectedDonation.items}</p>
                  <p style={{ margin: '0.5rem 0' }}><strong>Dirección:</strong> {selectedDonation.address}</p>
                  <p style={{ margin: '0.5rem 0' }}><strong>Horario:</strong> {selectedDonation.schedule}</p>
                  
                  {selectedDonation.status === 'reserved' && selectedDonation.receiver_id === user.id ? (
                    <>
                      <button onClick={handleCancelReservation} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'var(--danger, #e53e3e)' }}>
                        Cancelar Reserva
                      </button>
                      <button onClick={() => setSelectedDonation(null)} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        Volver
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleClaimDonation} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Reservar y Ver Ruta
                      </button>
                      <button onClick={() => setSelectedDonation(null)} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        Volver
                      </button>
                    </>
                  )}
                </div>
              ) : myReservations.length > 0 ? (
                <div>
                  <h3 style={{ marginBottom: '1rem' }}>Tienes útiles reservados</h3>
                  {myReservations.map(d => (
                    <div key={d.id} style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '2px solid var(--purple-500)' }}>
                      <p><strong>{d.items}</strong></p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><MapPin size={12}/> {d.address}</p>
                      <button 
                        onClick={() => setSelectedDonation(d)} 
                        className="btn btn-secondary" 
                        style={{ width: '100%', marginTop: '1rem' }}
                      >
                        Ver Detalles / Ruta
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', border: '2px dashed var(--border-color)', borderRadius: '0.5rem' }}>
                  <p>Viendo {availableDonations.length} donaciones en todo Sogamoso.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column: Interactive Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4>Mapa de Sogamoso</h4>
          <SogamosoMap 
            donations={isDonor ? myDonations : availableDonations} 
            onMarkerClick={(donation) => !isDonor && setSelectedDonation(donation)} 
            routeToDonation={!isDonor && selectedDonation?.status === 'reserved' ? selectedDonation : null}
          />
        </div>
      </div>
    </div>
  );
}
