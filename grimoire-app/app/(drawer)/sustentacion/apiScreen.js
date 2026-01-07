import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

export default function ApiScreen() {
  // PASO 1: Variables
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // PASO 2: La llamada a la API
  useEffect(() => {
    fetch('https://www.dnd5eapi.co/api/2014/monsters/') // 1. Vamos a la URL
      .then(response => response.json())          // 2. Convertimos respuesta a JSON
      .then(json => setData(json.results))        // 3. Guardamos los datos
      .catch(error => console.error(error))       // 4. Por si falla
      .finally(() => setLoading(false));          // 5. Apagamos el "cargando"
  }, []);

  // PASO 3: Lo que se ve en pantalla
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>
        Bestiario D&D
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#5D8C5D" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.index} // La API usa 'index' como ID único
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.texto}>🐉 {item.name}</Text>
            </View>
          )}
        />
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