// app/(drawer)/(tabs)/campanas/index.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

export default function CampanasList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchCampaigns();
    }, [])
  );

  async function fetchCampaigns() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('created_by', user.id) // Solo las que yo creé
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.log('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>{item.title.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} color="#5D8C5D" />
      ) : (
        <FlatList
          data={campaigns}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay campañas activas. ¡Inicia una!</Text>
          }
        />
      )}

      {/* Botón Flotante para Crear */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/(drawer)/(tabs)/campanas/crear')}
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F4E3' },
  list: { padding: 20 },
  empty: { textAlign: 'center', marginTop: 50, color: '#A3B18A', fontStyle: 'italic' },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#E6DCC3'
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: '#8C7051',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#4A3F35' },
  desc: { fontSize: 14, color: '#6B705C', marginTop: 4 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#8C7051', // Marrón tierra para campañas
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});