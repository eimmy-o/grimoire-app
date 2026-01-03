// app/(drawer)/(tabs)/campanas/crear.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../../../lib/supabase';
import { useRouter } from 'expo-router';

export default function CrearCampana() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    if (!title) return Alert.alert('Falta el título', 'Ponle un nombre a tu aventura.');

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('campaigns')
        .insert([{
          title: title,
          description: desc,
          created_by: user.id
        }]);

      if (error) throw error;

      Alert.alert('¡Aventura lista!', 'La campaña ha sido creada.', [
        { text: 'Ir al mapa', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nueva Campaña</Text>
      
      <Text style={styles.label}>Título de la Aventura</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej: La Maldición de Strahd"
        placeholderTextColor="#A3B18A"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Descripción / Sinopsis</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="¿De qué trata esta historia?"
        placeholderTextColor="#A3B18A"
        multiline
        numberOfLines={4}
        value={desc}
        onChangeText={setDesc}
      />

      <TouchableOpacity style={styles.btn} onPress={handleCreate} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF"/> : <Text style={styles.btnText}>Crear Aventura</Text>}
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ alignItems: 'center', marginTop: 20 }} 
        // CAMBIO AQUÍ: Redirección explícita al index de campañas
        onPress={() => router.back()}
      >
        <Text style={{ color: '#A3B18A', fontSize: 16 }}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F4E3', padding: 25 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#4A3F35', marginBottom: 30 },
  label: { fontSize: 16, fontWeight: '600', color: '#6B705C', marginBottom: 8 },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#A3B18A',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    color: '#4A3F35'
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  btn: {
    backgroundColor: '#8C7051',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});