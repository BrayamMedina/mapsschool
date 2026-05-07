import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const DonationContext = createContext();

export function DonationProvider({ children }) {
  const [donations, setDonations] = useState([]);
  const { user } = useAuth();

  const loadDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations from postgres:', error);
    }
  };

  // Load from DB on init and setup realtime subscription if possible, 
  // but for simplicity we rely on manual reloads or interval
  useEffect(() => {
    loadDonations();
  }, []);

  const addDonation = async (donationData) => {
    try {
      let imageUrl = null;
      if (donationData.imageFile) {
        const file = donationData.imageFile;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('imagenes')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('imagenes')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrlData.publicUrl;
      }

      const dbPayload = {
        donor_id: donationData.donorId,
        donor_name: donationData.donorName,
        items: donationData.items,
        address: donationData.address,
        schedule: donationData.schedule,
        coordinates: donationData.coordinates, // Will be mapped to array of float
        status: 'available',
        image_url: imageUrl
      };

      const { data, error } = await supabase
        .from('donations')
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;
      
      setDonations((prev) => [data, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding donation:', error);
      alert('Error guardando en la base de datos PostgreSQL.');
      return { success: false };
    }
  };

  const updateDonationStatus = async (id, newStatus, receiverId = null) => {
    try {
      let updatePayload = { status: newStatus };
      if (receiverId) {
        updatePayload.receiver_id = receiverId;
      }
      // Si se cancela la reserva (vuelve a 'available'), limpiar el receptor
      if (newStatus === 'available') {
        updatePayload.receiver_id = null;
      }

      const { data, error } = await supabase
        .from('donations')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;

      setDonations((prev) =>
        prev.map((doc) => (doc.id === id ? data : doc))
      );
    } catch (error) {
      console.error('Error updating donation:', error);
      alert('Error al actualizar registro en Postgres.');
    }
  };

  return (
    <DonationContext.Provider
      value={{ donations, addDonation, updateDonationStatus, loadDonations }}
    >
      {children}
    </DonationContext.Provider>
  );
}

export function useDonations() {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonations must be used within a DonationProvider');
  }
  return context;
}
