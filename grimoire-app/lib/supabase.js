import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// 1. Aquí van tus credenciales de Supabase
// (Lo ideal es usar variables de entorno .env, pero por ahora pégalas aquí para probar)
const supabaseUrl = 'https://czympwdluqakmksksegs.supabase.co';
const supabaseAnonKey = 'sb_publishable__gTxp664oDzvpF30ViUaCA_k3vwAoTH';

// 2. Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Configura el almacenamiento para persistir la sesión
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// 3. (Opcional) Manejo automático del estado de la app para refrescar tokens
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});