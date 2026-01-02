import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { supabase } from '../lib/supabase'; // Asegúrate que la ruta sea correcta

export default function Index() {

  useEffect(() => {
    const fetchRaces = async () => {
      // Intentamos traer datos de la tabla 'races' que definiste en el PDF
      const { data, error } = await supabase
        .from('races')
        .select('*');

      if (error) {
        console.error('Error conectando a Supabase:', error);
      } else {
        console.log('¡Conexión exitosa! Razas encontradas:', data);
      }
    };

    fetchRaces();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Revisa la consola para ver la conexión</Text>
    </View>
  );
}