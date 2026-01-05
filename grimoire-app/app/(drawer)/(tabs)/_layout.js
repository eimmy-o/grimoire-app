import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from "expo-router";

export default function TabsLayout() {
  const navigation = useNavigation();

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
        
        tabBarStyle: {
          backgroundColor: '#F8F4E3',
          borderTopColor: '#A3B18A',
          height: 75, 
          paddingBottom: 15, 
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 11, 
          marginTop: -5, 
        },
        
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

        headerLeft: () => (
          <TouchableOpacity 
            onPress={toggleMenu} 
            style={{ marginLeft: 20, padding: 5 }} 
          >
            <Ionicons name="menu" size={30} color="#4A3F35" />
          </TouchableOpacity>
        ),
      }}
    >
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

      <Tabs.Screen
        name="personajes/index"
        options={{
          title: "Mis Personajes",
          tabBarLabel: "Personajes",
          headerShown: true, 
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "people" : "people-outline"} size={size} color={color} />
          ),
        }}
      />

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

      <Tabs.Screen 
        name="personajes/crear" 
        options={{ 
          href: null, 
          title: "Nuevo Personaje", 
          tabBarStyle: { display: 'none' } 
        }} 
      />

      <Tabs.Screen 
        name="personajes/[id]" 
        options={{ 
          href: null, 
          title: "Descripcion", 
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

      <Tabs.Screen 
        name="campanas/[id]" 
        options={{ 
          href: null, 
          title: "Descripcion", 
          tabBarStyle: { display: 'none' } 
        }} 
      />
    </Tabs>
  );
}