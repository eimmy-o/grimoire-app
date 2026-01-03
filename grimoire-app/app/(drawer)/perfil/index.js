import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Perfil() {
  return (
    <View style={styles.container}>
      <Ionicons name="construct" size={80} color="#A3B18A" />
      <Text style={styles.text}>Perfil del Aventurero</Text>
      <Text style={styles.subtext}>Working on it... 🧙‍♂️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F4E3' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#4A3F35', marginTop: 20 },
  subtext: { fontSize: 16, color: '#8C7051', marginTop: 10, fontStyle: 'italic' }
});