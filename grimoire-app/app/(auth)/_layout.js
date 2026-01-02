import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F8F4E3', 
        },
        headerTintColor: '#4A3F35', 
        headerTitleStyle: {
          fontWeight: 'bold',
        },

        contentStyle: { backgroundColor: '#F8F4E3' }, 
      }}
    >

      <Stack.Screen 
        name="login" 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Crear Cuenta',
          headerBackTitle: 'Volver', 
        }} 
      />
    </Stack>
  );
}