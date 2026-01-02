import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Link } from 'expo-router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithUsername() {
    setLoading(true);
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    console.log("1. Buscando usuario:", cleanUsername);

    try {
      const { data, error: searchError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', cleanUsername)
        .single();

      if (searchError || !data) {
        Alert.alert('Error', 'El usuario no existe o hay duplicados.');
        console.log("Error buscando perfil:", searchError);
        setLoading(false);
        return;
      }

      console.log("2. Email encontrado:", data.email); 

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: cleanPassword,
      });

      if (authError) {
        console.log("3. Error de Auth:", authError.message);
        Alert.alert('Error', 'Contraseña incorrecta (revisa mayúsculas).');
      } else {
        console.log("4. ¡Login exitoso!");
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema inesperado.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de sesión</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#A3B18A" 
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#A3B18A"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={signInWithUsername} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </TouchableOpacity>

      <Link href="/register" asChild>
        <TouchableOpacity style={styles.linkContainer}>
          <Text style={styles.linkText}>Crear cuenta</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#F8F4E3', 
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#4A3F35', 
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A3B18A',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12, 
    fontSize: 16,
    color: '#4A3F35',
  },
  button: {
    backgroundColor: '#5D8C5D', 
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  linkText: {
    color: '#8C7051', 
    fontSize: 16,
    fontWeight: '600',
  },
});