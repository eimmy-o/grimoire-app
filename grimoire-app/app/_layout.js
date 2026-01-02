// app/_layout.js
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [session, setSession] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // 1. Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setInitialized(true);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    // 2. Comprobar si estamos en un grupo de autenticación (login/register)
    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      // Si hay usuario y está en login, mándalo a la app principal
      // Ajusta esto a tu ruta principal, por ejemplo: '/(drawer)/(tabs)/personajes' o simplemente '/'
      router.replace('/(drawer)/(tabs)/personajes'); 
    } else if (!session && !inAuthGroup) {
      // Si NO hay usuario y NO está en login, mándalo al login
      router.replace('/login');
    }
  }, [session, segments, initialized]);

  // Pantalla de carga mientras verificamos sesión
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Renderiza la pantalla actual (Slot)
  return <Slot />;
}