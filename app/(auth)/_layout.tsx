import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Estas rutas ya existen como archivos en (auth) */}
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="recover" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
}
