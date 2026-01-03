import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

function CustomDrawerContent(props) {
  const router = useRouter();
  const [username, setUsername] = useState('Viajero');
  const [loading, setLoading] = useState(true);

  // Cargamos el nombre real del usuario al abrir el menú
  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        if (data) setUsername(data.username);
      }
    } catch (error) {
      // Si falla, se queda como 'Viajero'
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Seguro que quieres retirarte?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive",
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/login');
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#F8F4E3', paddingTop: 50 }}>
        {/* Cabecera Personalizada con Datos Reales */}
        <View style={styles.drawerHeader}>
          <View style={styles.avatarPlaceholder}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              // Muestra la inicial del usuario
              <Text style={styles.avatarInitial}>{username.charAt(0).toUpperCase()}</Text>
            )}
          </View>
          <Text style={styles.drawerTitle}>{username}</Text>
          <Text style={styles.drawerSubtitle}>El Grimorio</Text>
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.logoutSection}>
        <DrawerItem
          label="Cerrar Sesión"
          icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />}
          // CAMBIO AQUÍ: Quitamos el -20 y ponemos 5 para separar
          labelStyle={{ marginLeft: 5, fontWeight: 'bold' }}
          onPress={handleLogout}
          activeTintColor="#A3B18A"
          inactiveTintColor="#8C7051"
        />
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#5D8C5D',
        drawerActiveTintColor: '#FFF',
        drawerInactiveTintColor: '#4A3F35',
        // CAMBIO AQUÍ: Quitamos el -20 y ponemos 5 para separar en todos los items
        drawerLabelStyle: { marginLeft: 5, fontWeight: '600' },
        drawerStyle: { backgroundColor: '#F8F4E3', width: 280 },
        // Añadimos un poco de estilo al item para que no esté tan pegado a los bordes
        drawerItemStyle: { borderRadius: 10, marginHorizontal: 10, marginVertical: 2 }
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Inicio',
          title: 'Inicio',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen
        name="perfil/index"
        options={{
          drawerLabel: 'Mi Perfil',
          title: 'Perfil',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen
        name="configuracion/index"
        options={{
          drawerLabel: 'Configuración',
          title: 'Configuración',
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6DCC3',
    marginBottom: 10,
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8C7051',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F8F4E3',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A3F35',
  },
  drawerSubtitle: {
    fontSize: 14,
    color: '#A3B18A',
    fontStyle: 'italic'
  },
  logoutSection: {
    borderTopWidth: 1,
    borderTopColor: '#E6DCC3',
    paddingBottom: 20,
    backgroundColor: '#F8F4E3',
  }
});