import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { supabase } from '../../../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { TouchableOpacity } from 'react-native';

export default function DetalleCampana() {
  const { id } = useLocalSearchParams();
  const [camp, setCamp] = useState(null);
  const [notes, setNotes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id && id !== 'index' && !isNaN(id)) {
      fetchBasicCampaign();
    }
  }, [id]);

  async function fetchBasicCampaign() {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setCamp(data);

      const { data: notesData } = await supabase
        .from('campaign_notes')
        .select('content, created_at')
        .eq('campaign_id', id)
        .order('created_at', { ascending: false });
        
      if (notesData) setNotes(notesData);

    } catch (error) {
      console.log('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#8C7051"/></View>;
  if (!camp) return <View style={styles.center}><Text>No se encontró la campaña.</Text></View>;

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Aventura', 
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.navigate('/(drawer)/(tabs)/campanas')}
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
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>{camp.title.charAt(0)}</Text>
          </View>
          <Text style={styles.title}>{camp.title}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sinopsis</Text>
          <Text style={styles.desc}>
            {camp.description || 'Sin descripción disponible.'}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bitácora</Text>
            <Ionicons name="journal-outline" size={20} color="#8C7051" />
          </View>

          {notes.length === 0 ? (
            <Text style={styles.emptyText}>No hay notas registradas.</Text>
          ) : (
            notes.map((note, index) => (
              <View key={index} style={styles.noteCard}>
                <Text style={styles.noteContent}>{note.content}</Text>
                <Text style={styles.noteDate}>
                  {new Date(note.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F4E3', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F4E3' },
  
  header: { alignItems: 'center', marginBottom: 25 },
  iconBox: { width: 60, height: 60, backgroundColor: '#8C7051', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  iconText: { fontSize: 30, color: '#FFF', fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4A3F35', textAlign: 'center' },

  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 25, elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#8C7051', marginBottom: 8, textTransform: 'uppercase' },
  desc: { fontSize: 16, color: '#4A3F35', lineHeight: 24 },

  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#4A3F35' },
  
  noteCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#5D8C5D' },
  noteContent: { fontSize: 15, color: '#333', marginBottom: 5 },
  noteDate: { fontSize: 12, color: '#A3B18A', textAlign: 'right' },
  
  emptyText: { fontStyle: 'italic', color: '#A3B18A', textAlign: 'center', marginTop: 10 }
});