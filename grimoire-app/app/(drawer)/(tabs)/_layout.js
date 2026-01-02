import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
    <Tabs
        screenOptions={{
            headerTitleAlign: "center",
        }}
    >
        <Tabs.Screen
            name="index"
            options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="personajes"
            options={{
            title: "Personajes",
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="campanas"
            options={{
            title: "Campañas",
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="compendio"
            options={{
            title: "Compendio",
            tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
            ),
            }}
        />
    </Tabs>
    );
}