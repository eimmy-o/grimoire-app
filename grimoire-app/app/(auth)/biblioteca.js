import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useFocusEffect } from 'expo-router';

export default function Biblioteca() {
  const [character, setCharacter] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchCharacter();
    }, [])
  );

  async function fetchCharacter() {
    try {
      setLoading(true);  
      const { data, error } = await supabase
        .from('characters')
        .select(`
          name, total_level
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCharacter(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#5D8C5D" />
        ) : character ? (
          <View> 
            <Text style={styles.text}>Personaje Encontrado:</Text>
            <Text style={styles.subtext}>Name: {character[0].name}</Text>
            <Text style={styles.subtext}>Nivel Total: {character[0].total_level}</Text>
          </View>
        ) : (
            <Text>Personaje no encontrado para mostrar</Text>
        )}
      </View>
    );
  }

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F4E3' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#4A3F35', marginTop: 20 },
  subtext: { fontSize: 16, color: '#8C7051', marginTop: 10, fontStyle: 'italic' }
});