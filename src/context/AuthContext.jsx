import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Intentar cargar la sesión del storage local en un inicio para mantener ruteo fluido
  useEffect(() => {
    const savedUser = localStorage.getItem('mapsSchoolUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (role, name, email) => {
    try {
      // Si recibimos name, es porque viene de Register. Si viene de Login, solo buscamos.
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      let loggedUser = existingUser;

      // Si no existe el usuario y NO hay nombre (es decir, es un mero login), lanzar error.
      if (!existingUser && !name) {
        alert('Este correo no está registrado. Ve a la sección de Registro primero.');
        return { success: false };
      }

      // Si no existe pero SI enviaron name (es decir, viene del Register.jsx)
      if (!existingUser && name) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ email, name, role }])
          .select()
          .single();
          
        if (insertError) throw insertError;
        loggedUser = newUser;
      }
      
      // Update global state and localStorage cache
      setUser(loggedUser);
      localStorage.setItem('mapsSchoolUser', JSON.stringify(loggedUser));
      return { success: true };
      
    } catch (error) {
      console.error("Error logging in/registering:", error);
      alert('Credenciales incorrectas o hubo un error.');
      return { success: false, error };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mapsSchoolUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
