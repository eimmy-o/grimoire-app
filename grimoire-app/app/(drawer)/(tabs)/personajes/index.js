import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

export default function Personajes() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // 1. Cargar Personajes (Se ejecuta cada vez que entras a la pantalla)
  useFocusEffect(
    useCallback(() => {
      fetchCharacters();
    }, [])
  );

  async function fetchCharacters() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('characters')
        .select(`
          id, name, total_level, 
          character_races(races(name)), 
          character_classes(classes(name))
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Aplanamos la estructura para que sea fácil de usar
      const formattedData = data.map(char => ({
        id: char.id,
        name: char.name,
        level: char.total_level,
        race: char.character_races?.[0]?.races?.name || '?',
        class: char.character_classes?.[0]?.classes?.name || '?',
      }));

      setCharacters(formattedData);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // 2. Función para borrar personaje
  const handleDelete = (id, name) => {
    Alert.alert(
      "Borrar Personaje",
      `¿Estás seguro que quieres eliminar a ${name}? Esta acción es permanente.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from('characters').delete().eq('id', id);
            if (error) Alert.alert('Error', error.message);
            else fetchCharacters(); // Recargamos la lista
          }
        }
      ]
    );
  };

  // 3. Renderizado de cada tarjeta
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => console.log('Ver detalles de', item.id)} // Futuro: Ver detalles
      onLongPress={() => handleDelete(item.id, item.name)} // Mantener presionado para borrar
      delayLongPress={500}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>Nivel {item.level} | {item.race} {item.class}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#A3B18A" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#5D8C5D" />
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); fetchCharacters(); }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tienes héroes aún. ¡Crea uno!</Text>
          }
        />
      )}

      {/* Botón Flotante (FAB) para crear */}
      <TouchableOpacity 
        style={styles.fab} 
        // CAMBIO IMPORTANTE: Apunta a 'crear' (que es el archivo crear.js en la misma carpeta)
        onPress={() => router.push('/(drawer)/(tabs)/personajes/crear')} 
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4E3',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Espacio para el FAB
  },
  card: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#5D8C5D',
  },
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#DDBEA9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A3F35',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A3F35',
  },
  details: {
    fontSize: 14,
    color: '#8C7051',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#A3B18A',
    fontSize: 16,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#5D8C5D',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});