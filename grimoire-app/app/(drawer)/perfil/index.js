import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { useFocusEffect, useRouter } from 'expo-router';

export default function Personajes() {
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.contenedor}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#5D8C5D" />
      ) : profile ? (
        <View>
          <Text style={styles.titulo}>Perfil de Usuario</Text>
          <Text style={styles.texto}>UserName: { profile.id } </Text>
          <Text style={styles.texto}>Avatar URL: { profile.avatar_url } </Text>
        </View>
      ) : (
        <Text style={styles.texto}>No se encontró el perfil.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
        flex: 1, 
        padding: 50, 
        backgroundColor: '#F8F4E3',
    },

    titulo: {
        fontSize: 24, marginBottom: 20, fontWeight: 'bold'
    },

    item: {
        padding: 15, borderBottomWidth: 1, borderColor: '#ccc'
    },

    texto: {
        fontSize: 18
    },
});