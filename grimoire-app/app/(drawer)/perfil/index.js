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
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#5D8C5D" />
      ) : profile ? (
        <View>
          <Text style={styles.text}>Perfil de Usuario</Text>
          <Text style={styles.subtext}>UserName: { profile.id } </Text>
          <Text style={styles.subtext}>Avatar URL: { profile.avatar_url } </Text>
        </View>
      ) : (
        <Text style={styles.text}>No se encontró el perfil.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F4E3' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#4A3F35', marginTop: 20 },
  subtext: { fontSize: 16, color: '#8C7051', marginTop: 10, fontStyle: 'italic' }
});