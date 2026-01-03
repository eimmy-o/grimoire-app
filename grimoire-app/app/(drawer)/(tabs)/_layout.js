import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from "expo-router";

export default function TabsLayout() {
  const navigation = useNavigation();

  // Función segura para abrir el Drawer
  const toggleMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: '#4A3F35',
        tabBarActiveTintColor: '#5D8C5D',
        tabBarInactiveTintColor: '#8C7051',
        
        // --- ARREGLO 1: Estilos de la Barra Inferior (Más alta) ---
        tabBarStyle: {
          backgroundColor: '#F8F4E3',
          borderTopColor: '#A3B18A',
          height: 75, // Aumentado de 60 a 75 para evitar solapamiento
          paddingBottom: 15, // Más espacio abajo
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 11, // Un pelín más pequeño para asegurar que quepa
          marginTop: -5, // Ajuste fino para separar del icono
        },
        
        // Estilos del Header
        headerStyle: {
          backgroundColor: '#F8F4E3',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E6DCC3',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },

        // --- ARREGLO 2: Botón Hamburguesa (Visible en todas) ---
        headerLeft: () => (
          <TouchableOpacity 
            onPress={toggleMenu} 
            style={{ marginLeft: 20, padding: 5 }} // Padding extra para facilitar el toque
          >
            <Ionicons name="menu" size={30} color="#4A3F35" />
          </TouchableOpacity>
        ),
      }}
    >
      {/* 1. INICIO */}
      <Tabs.Screen
        name="index"
        options={{
          title: "El Grimorio",
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }}
      />

      {/* 2. PERSONAJES */}
      <Tabs.Screen
        name="personajes/index"
        options={{
          title: "Mis Héroes",
          tabBarLabel: "Personajes",
          // --- ARREGLO 3: Header ACTIVADO ---
          headerShown: true, // Ahora sí se verá la barra superior y el menú
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "people" : "people-outline"} size={size} color={color} />
          ),
        }}
      />

      {/* 3. CAMPAÑAS */}
      <Tabs.Screen
        name="campanas/index"
        options={{
          title: "Aventuras",
          tabBarLabel: "Campañas",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "map" : "map-outline"} size={size} color={color} />
          ),
        }}
      />

      {/* 4. COMPENDIO */}
      <Tabs.Screen
        name="compendio/index"
        options={{
          title: "Biblioteca",
          tabBarLabel: "Compendio",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "book" : "book-outline"} size={size} color={color} />
          ),
        }}
      />

      {/* --- RUTAS OCULTAS --- */}
      <Tabs.Screen 
        name="personajes/crear" 
        options={{ 
          href: null, 
          title: "Nuevo Héroe", 
          tabBarStyle: { display: 'none' } 
        }} 
      />
      <Tabs.Screen 
        name="campanas/crear" 
        options={{ 
          href: null, 
          title: "Nueva Aventura", 
          tabBarStyle: { display: 'none' } 
        }} 
      />
    </Tabs>
  );
}