import { Link, router } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { AuthContext } from "../../contexts/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const success = await register(
        {
          email: email.trim(),
          name: name.trim(),
          username: username.trim(),
          id: "" as any, // se asigna en supabase
        },
        password
      );

      if (success) {
        Alert.alert("Cuenta creada", "Tu cuenta ha sido creada exitosamente", [
          { text: "OK", onPress: () => router.replace("/(main)/home") },
        ]);
      } else {
        Alert.alert("Error", "No se pudo crear la cuenta. Intenta de nuevo.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error?.message || "Ocurrió un error inesperado. Intenta de nuevo.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      {/* Fondo Vibely */}
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

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Marca */}
        <View style={s.brandWrap}>
          <VibelyMark />
          <Text style={s.brand}>Vibely</Text>
          <Text style={s.tagline}>Share your vibe, spread the energy ✨</Text>
        </View>

        {/* Card registro */}
        <View style={s.card}>
          <Text style={s.title}>Crear cuenta</Text>

          <TextInput
            style={s.input}
            placeholder="Correo"
            placeholderTextColor="#8E8E93"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={s.input}
            placeholder="Usuario"
            placeholderTextColor="#8E8E93"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={s.input}
            placeholder="Nombre Completo"
            placeholderTextColor="#8E8E93"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            style={s.input}
            placeholder="Contraseña"
            placeholderTextColor="#8E8E93"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TextInput
            style={s.input}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#8E8E93"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[s.button, loading && s.buttonDisabled]}
            activeOpacity={0.9}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={s.buttonText}>
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 14 }}>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={s.helper}>Iniciar sesión</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <Text style={s.footer}>© 2025 Vibely</Text>
      </ScrollView>
    </View>
  );
}

/* ====== UI Vibely ====== */
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

/* ====== Estilos ====== */
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
    opacity: 0.38, zIndex: 0,
  },
  bubbleLG: {
    position: "absolute",
    width: 280, height: 280, borderRadius: 140,
    opacity: 0.36, zIndex: 0,
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

  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#EADFF5",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginTop: 12,
    backgroundColor: "#FBF8FF",
  },

  button: {
    marginTop: 16,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
  },
  buttonDisabled: { backgroundColor: "#9dbefb" },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "800" },

  helper: {
    textAlign: "center",
    color: "#6F46FF",
    marginTop: 14,
    fontSize: 13,
    textDecorationLine: "underline",
  },

  footer: {
    marginTop: 16,
    textAlign: "center",
    color: "#7A6C8F",
    fontSize: 12,
  },
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
