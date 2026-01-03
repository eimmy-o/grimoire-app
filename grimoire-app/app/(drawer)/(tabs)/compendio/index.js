// app/(drawer)/(tabs)/compendio/index.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../../../../lib/supabase';

export default function CompendioIndex() {
  const [loading, setLoading] = useState(true);
  const [races, setRaces] = useState([]);
  const [classes, setClasses] = useState([]);
  const [spells, setSpells] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      // Hacemos las 3 peticiones en paralelo (Promise.all es más rápido)
      const [racesRes, classesRes, spellsRes] = await Promise.all([
        supabase.from('races').select('*'),
        supabase.from('classes').select('*'),
        supabase.from('spells').select('*')
      ]);

      setRaces(racesRes.data || []);
      setClasses(classesRes.data || []);
      setSpells(spellsRes.data || []);
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Tarjeta simple para los items
  const InfoCard = ({ title, subtitle, color }) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </View>
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#5D8C5D"/></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>Conocimiento Arcano</Text>
      <Text style={styles.subHeader}>Todo lo que necesitas para tu aventura</Text>

      {/* SECCIÓN 1: RAZAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Razas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {races.map(r => (
            <View key={r.id} style={styles.boxCard}>
              <Text style={styles.boxTitle}>{r.name}</Text>
              <Text style={styles.boxDetail}>Vel: {r.speed}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* SECCIÓN 2: CLASES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Clases</Text>
        {classes.map(c => (
          <InfoCard 
            key={c.id} 
            title={c.name} 
            subtitle={`Dado de Golpe: ${c.hit_die}`} 
            color="#8C7051" // Marrón
          />
        ))}
      </View>

      {/* SECCIÓN 3: HECHIZOS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hechizos</Text>
        {spells.map(s => (
          <InfoCard 
            key={s.id} 
            title={s.name} 
            subtitle={`${s.school} | Daño: ${s.damage || 'N/A'}`} 
            color="#E07A5F" // Terracota mágico
          />
        ))}
      </View>
      
      <View style={{height: 40}} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F4E3', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F4E3' },
  mainHeader: { fontSize: 26, fontWeight: 'bold', color: '#4A3F35' },
  subHeader: { fontSize: 14, color: '#A3B18A', marginBottom: 25 },
  
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#5D8C5D', marginBottom: 15 },
  
  // Estilo Horizontal (Cajas)
  horizontalScroll: { paddingBottom: 10 },
  boxCard: {
    backgroundColor: '#FFF',
    width: 120,
    height: 100,
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  boxTitle: { fontWeight: 'bold', color: '#4A3F35', fontSize: 16 },
  boxDetail: { color: '#8C7051', fontSize: 12, marginTop: 5 },

  // Estilo Lista (Fichas)
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#4A3F35' },
  cardSubtitle: { fontSize: 13, color: '#6B705C', marginTop: 2 }
});