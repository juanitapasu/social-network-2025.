// app/(auth)/register.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

/* ================== REGISTER ================== */
export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const user = { name: name.trim(), email: email.trim(), password };
      await AsyncStorage.setItem("@user", JSON.stringify(user));

      Alert.alert("Éxito", "Cuenta creada exitosamente");
      router.replace("/(auth)/login");
    } catch {
      Alert.alert("Error", "No se pudo guardar el usuario");
    }
  };

  return (
    <View style={s.container}>
      {/* Fondo */}
      <Waves />
      <View pointerEvents="none" style={[s.bubbleXL, { top: -110, left: -110, backgroundColor: "#FFD6E7" }]} />
      <View pointerEvents="none" style={[s.bubbleXL, { top: -130, right: -130, backgroundColor: "#C9F7F0" }]} />
      <View pointerEvents="none" style={[s.bubbleLG, { bottom: 210, left: -80, backgroundColor: "#E9D8FF" }]} />
      <View pointerEvents="none" style={[s.bubbleLG, { bottom: 240, right: -70, backgroundColor: "#C9F7F0" }]} />
      <Cloud style={{ top: 90, left: 24, opacity: 0.9 }} scale={0.9} />
      <Cloud style={{ top: 130, right: 28, opacity: 0.85 }} scale={0.75} />
      <Star x={22} y={180} /><Star x={70} y={195} /><Star x={120} y={185} />
      <Star x={220} y={175} /><Star x={280} y={190} /><Star x={330} y={180} />
      <Star x={50} y={60} fromBottom /><Star x={140} y={45} fromBottom />
      <Star x={230} y={55} fromBottom /><Star x={310} y={40} fromBottom />

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Marca */}
        <View style={s.brandWrap}>
          <VibelyMark />
          <Text style={s.brand}>Vibely</Text>
          <Text style={s.tagline}>Share your vibe, spread the energy ✨</Text>
        </View>

        {/* Card */}
        <View style={s.card}>
          <Text style={s.title}>Crear cuenta</Text>
          <Text style={s.subtitle}>Únete a nuestra comunidad positiva </Text>

          <View style={s.inputWrap}>
            <Text style={s.label}>Nombre completo</Text>
            <TextInput
              style={s.input}
              placeholder="Tu nombre completo"
              value={formData.name}
              onChangeText={(v) => handleInputChange("name", v)}
              autoCapitalize="words"
            />
          </View>

          <View style={s.inputWrap}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input}
              placeholder="tu@email.com"
              value={formData.email}
              onChangeText={(v) => handleInputChange("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={s.inputWrap}>
            <Text style={s.label}>Contraseña</Text>
            <TextInput
              style={s.input}
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChangeText={(v) => handleInputChange("password", v)}
              secureTextEntry
            />
          </View>

          <View style={s.inputWrap}>
            <Text style={s.label}>Confirmar contraseña</Text>
            <TextInput
              style={s.input}
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChangeText={(v) => handleInputChange("confirmPassword", v)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={s.button} activeOpacity={0.9} onPress={handleRegister}>
            <Text style={s.buttonText}>Crear Cuenta</Text>
          </TouchableOpacity>

          <View style={s.footerRow}>
            <Text style={s.footerText}>¿Ya tienes cuenta? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={s.link}>Inicia sesión</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ========== Decoración ========== */
function VibelyMark() {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, marginBottom: 6 }}>
      <View style={{ width: 16, height: 10, borderRadius: 8, backgroundColor: "#6F46FF" }} />
      <View style={{ width: 16, height: 18, borderRadius: 8, backgroundColor: "#C44BFF" }} />
      <View style={{ width: 16, height: 26, borderRadius: 8, backgroundColor: "#FF5BB1" }} />
      <View style={{ width: 16, height: 14, borderRadius: 8, backgroundColor: "#FFCA3A" }} />
    </View>
  );
}

function Waves() {
  return (
    <View style={s.wavesWrap} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 375 220" preserveAspectRatio="none">
        <Path d="M0,80 C60,110 120,50 180,80 C240,110 300,50 375,80 L375,220 L0,220 Z" fill="#FFE38D" />
        <Path d="M0,130 C60,160 120,100 180,130 C240,160 300,100 375,130 L375,220 L0,220 Z" fill="#FFC0C9" />
        <Path d="M0,180 C60,210 120,150 180,180 C240,210 300,150 375,180 L375,220 L0,220 Z" fill="#FF9EB3" />
      </Svg>
    </View>
  );
}

function Cloud({ style, scale = 1 }: { style?: any; scale?: number }) {
  const base = 22 * scale;
  return (
    <View style={[cloudStyles.container, style]}>
      <View style={[cloudStyles.ball, { width: base * 2.2, height: base * 1.2, borderRadius: base }]} />
      <View style={[cloudStyles.ball, { left: base * 1.1, top: -base * 0.6, width: base * 1.8, height: base * 1.4, borderRadius: base }]} />
      <View style={[cloudStyles.ball, { left: base * 0.2, top: -base * 0.4, width: base * 1.5, height: base * 1.2, borderRadius: base }]} />
    </View>
  );
}

function Star({ x, y, fromBottom = false }: { x: number; y: number; fromBottom?: boolean }) {
  return (
    <View
      pointerEvents="none"
      style={[starStyles.star, { left: x, ...(fromBottom ? { bottom: y } : { top: y }) }]}
    />
  );
}

/* ========== Estilos ========== */
const CARD_BG = "#FFFFFF";

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7ECFF",
    paddingTop: Platform.select({ ios: 40, android: 24 }),
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 220,
  },

  wavesWrap: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    height: 220, zIndex: 0,
  },
  bubbleXL: {
    position: "absolute",
    width: 340, height: 340, borderRadius: 170,
    opacity: 0.38, zIndex: 0, // 👈 atrás
  },
  bubbleLG: {
    position: "absolute",
    width: 280, height: 280, borderRadius: 140,
    opacity: 0.36, zIndex: 0, // 👈 atrás
  },

  brandWrap: { alignItems: "center", marginBottom: 14, zIndex: 3 },
  brand: { fontSize: 32, fontWeight: "900", color: "#3B2357", letterSpacing: 0.5 },
  tagline: { fontSize: 12, color: "#4B3E5E", opacity: 0.95, marginTop: 2 },

  card: {
    zIndex: 3,
    backgroundColor: CARD_BG,
    borderRadius: 22,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 6 },
    }),
  },
  title: { fontSize: 22, fontWeight: "800", color: "#2A1E3F" },
  subtitle: { fontSize: 13, color: "#6B4A8E", marginTop: 4, marginBottom: 8 },

  inputWrap: { marginTop: 10 },
  label: { fontSize: 12, fontWeight: "700", color: "#3B2357", marginBottom: 6 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#EADFF5",
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FBF8FF",
  },

  button: {
    marginTop: 16,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF7AAE",
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "800" },

  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 14 },
  footerText: { color: "#7A6C8F", fontSize: 12 },
  link: { color: "#6F46FF", fontWeight: "800", fontSize: 12, textDecorationLine: "underline" },
});

const cloudStyles = StyleSheet.create({
  container: { position: "absolute", width: 140, height: 60, zIndex: 2 },
  ball: { backgroundColor: "#FFFFFF", position: "absolute" },
});
const starStyles = StyleSheet.create({
  star: {
    position: "absolute",
    width: 8, height: 8,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
    borderRadius: 1, opacity: 0.9, zIndex: 2,
  },
});
