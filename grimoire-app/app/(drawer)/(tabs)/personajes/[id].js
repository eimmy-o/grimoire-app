import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { supabase } from '../../../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { TouchableOpacity } from 'react-native';

export default function DetallePersonaje() {
  const { id } = useLocalSearchParams();
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id && id !== 'index' && !isNaN(id)) {
      fetchBasicCharacter();
    }
  }, [id]);

  async function fetchBasicCharacter() {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setChar(data);
    } catch (error) {
      console.log('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#5D8C5D"/></View>;
  if (!char) return <View style={styles.center}><Text>No se encontró el personaje.</Text></View>;

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: char ? char.name : 'Cargando...', 
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.navigate('/(drawer)/(tabs)/personajes')}
              style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -8 }}
            >
              <Ionicons name="chevron-back" size={28} color="#4A3F35" /> 
              <Text style={{ color: '#4A3F35', fontSize: 17 }}>Volver</Text>
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{char.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.name}>{char.name}</Text>
            <Text style={styles.subtitle}>Nivel {char.total_level}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estado Vital</Text>
          <View style={styles.row}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={24} color="#E07A5F" />
              <Text style={styles.statLabel}>Vida Actual</Text>
              <Text style={styles.statValue}>{char.current_hp}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Ionicons name="shield" size={24} color="#5D8C5D" />
              <Text style={styles.statLabel}>Vida Máxima</Text>
              <Text style={styles.statValue}>{char.max_hp}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color="#8C7051" />
          <Text style={styles.infoText}>
            Más detalles (Raza, Clase, Inventario) estarán disponibles en la próxima actualización del Grimorio.
          </Text>
        </View>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F4E3', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F4E3' },
  
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#5D8C5D', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 3, borderColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.1, elevation: 5 },
  avatarText: { fontSize: 32, color: '#FFF', fontWeight: 'bold' },
  name: { fontSize: 26, fontWeight: 'bold', color: '#4A3F35' },
  subtitle: { fontSize: 18, color: '#8C7051' },

  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A3F35', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statLabel: { color: '#8C7051', fontSize: 12, marginTop: 5 },
  statValue: { color: '#4A3F35', fontSize: 24, fontWeight: 'bold' },
  divider: { width: 1, height: 40, backgroundColor: '#E6DCC3' },

  infoBox: { flexDirection: 'row', backgroundColor: 'rgba(140, 112, 81, 0.1)', padding: 15, borderRadius: 10, alignItems: 'center', gap: 10 },
  infoText: { flex: 1, color: '#8C7051', fontStyle: 'italic', fontSize: 14, lineHeight: 20 }
});