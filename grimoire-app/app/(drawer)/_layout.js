import { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable, Alert } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

export default function DrawerLayout() {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem("auth_user");
      if (!user) {
        router.replace("/(auth)/login");
        return;
      }

      const userData = JSON.parse(user);
      const now = new Date().getTime();
      const loginTime = userData.time;

      const time_exp = 10 * 1000 ;

      if((now - loginTime) > time_exp){
        Alert.alert("Sesion Expirada" , "La sesion se ha cerrado");
        await AsyncStorage.removeItem("auth_user");
        router.replace("/(auth)/login");
        return ;
      }

      setChecked(true);
    };

    checkAuth();

    const patrulla = setInterval(() => {
      checkAuth();
    }, 2000);

    return () => clearInterval(patrulla);
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("auth_user");
    router.replace("/(auth)/login");
  };

  if (!checked) {
    return null;
  }

  return (
    <Drawer
      screenOptions={{
        drawerType: "slide",
        overlayColor: "rgba(0,0,0,0.2)",
        headerTitleAlign: "center",
        drawerActiveTintColor: "#5e1b5cff",
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: "500",
        },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <View
            style={{
              marginTop: 20,
              borderTopWidth: 1,
              borderTopColor: "#E0E0E0",
              paddingTop: 12,
              paddingHorizontal: 16,
            }}
          >
            <Pressable
              onPress={logout}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#C62828"
                style={{ marginRight: 12 }}
              />
              <Text
                style={{
                  fontSize: 15,
                  color: "#C62828",
                  fontWeight: "500",
                }}
              >
                Cerrar sesión
              </Text>
            </Pressable>
          </View>
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Inicio",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="usuarios"
        options={{
          title: "Usuarios Internos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="configuracion"
        options={{
          title: "Configuración",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}