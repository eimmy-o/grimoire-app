import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../../../lib/supabase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CrearPersonaje() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [catalogsLoaded, setCatalogsLoaded] = useState(false);
  
  // Datos del formulario
  const [name, setName] = useState('');
  const [races, setRaces] = useState([]);
  const [classes, setClasses] = useState([]);
  
  // Selección del usuario
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // Cargar catálogos al iniciar
  useEffect(() => {
    fetchCatalogs();
  }, []);

  async function fetchCatalogs() {
    try {
      const { data: racesData } = await supabase.from('races').select('*');
      const { data: classesData } = await supabase.from('classes').select('*');
      
      if (racesData) setRaces(racesData);
      if (classesData) setClasses(classesData);
    } catch (error) {
      console.log(error);
    } finally {
      setCatalogsLoaded(true);
    }
  }

  async function handleCreate() {
    if (!name || !selectedRace || !selectedClass) {
      Alert.alert('Faltan datos', 'Por favor elige un nombre, una raza y una clase.');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Crear el Personaje Base
      const { data: charData, error: charError } = await supabase
        .from('characters')
        .insert([{
          user_id: user.id,
          name: name,
          total_level: 1, // Empiezan nivel 1
          current_hp: 10, // Default simple
          max_hp: 10
        }])
        .select()
        .single();

      if (charError) throw charError;

      const charId = charData.id;

      // 2. Relacionar Raza
      await supabase.from('character_races').insert({
        character_id: charId,
        race_id: selectedRace.id
      });

      // 3. Relacionar Clase
      await supabase.from('character_classes').insert({
        character_id: charId,
        class_id: selectedClass.id,
        class_level: 1
      });

      Alert.alert('¡Éxito!', 'Tu héroe ha nacido.', [
        { text: 'Genial', onPress: () => router.back() } // Volver a la lista
      ]);

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  // Componente de Selección (Píldoras)
  const SelectionPill = ({ item, isSelected, onPress }) => (
    <TouchableOpacity 
      style={[styles.pill, isSelected && styles.pillSelected]} 
      onPress={onPress}
    >
      <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nuevo Aventurero</Text>
      
      {/* SECCIÓN NOMBRE */}
      <View style={styles.section}>
        <Text style={styles.label}>Nombre del Héroe</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Aragorn..."
          placeholderTextColor="#A3B18A"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* SECCIÓN RAZA */}
      <View style={styles.section}>
        <Text style={styles.label}>Elige una Raza</Text>
        <View style={styles.pillsContainer}>
          {!catalogsLoaded ? <ActivityIndicator color="#5D8C5D"/> : 
            races.map(race => (
              <SelectionPill 
                key={race.id} 
                item={race} 
                isSelected={selectedRace?.id === race.id}
                onPress={() => setSelectedRace(race)}
              />
            ))
          }
        </View>
      </View>

      {/* SECCIÓN CLASE */}
      <View style={styles.section}>
        <Text style={styles.label}>Elige una Clase</Text>
        <View style={styles.pillsContainer}>
          {!catalogsLoaded ? <ActivityIndicator color="#5D8C5D"/> : 
            classes.map(clase => (
              <SelectionPill 
                key={clase.id} 
                item={clase} 
                isSelected={selectedClass?.id === clase.id}
                onPress={() => setSelectedClass(clase)}
              />
            ))
          }
        </View>
      </View>

      {/* BOTÓN CREAR */}
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={handleCreate}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : (
          <>
            <Ionicons name="flash" size={20} color="#FFF" style={{marginRight: 8}} />
            <Text style={styles.createButtonText}>Invocar Personaje</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F4E3' },
  content: { padding: 25 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4A3F35', marginBottom: 30, textAlign: 'center' },
  section: { marginBottom: 25 },
  label: { fontSize: 16, fontWeight: '600', color: '#6B705C', marginBottom: 10 },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#A3B18A',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#4A3F35',
  },
  pillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A3B18A',
  },
  pillSelected: {
    backgroundColor: '#5D8C5D',
    borderColor: '#5D8C5D',
  },
  pillText: { color: '#6B705C', fontWeight: '600' },
  pillTextSelected: { color: '#FFF' },
  createButton: {
    backgroundColor: '#8C7051',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  createButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  cancelButton: { alignItems: 'center', marginTop: 20 },
  cancelText: { color: '#A3B18A', fontSize: 16 },
});