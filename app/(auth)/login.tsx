import { Link, router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg"; // ondas

export default function Login() {
  return (
    <View style={styles.container}>
      {/* ONDAS DE FONDO (no tocar) */}
      <Waves />

      {/* BURBUJAS GRANDES EN ESQUINAS (decoración, detrás de la card) */}
      <View
        pointerEvents="none"
        style={[styles.bubbleXL, { top: -100, left: -100, backgroundColor: "#FFD6E7" }]}
      />
      <View
        pointerEvents="none"
        style={[styles.bubbleXL, { top: -120, right: -120, backgroundColor: "#C9F7F0" }]}
      />
      <View
        pointerEvents="none"
        style={[styles.bubbleLG, { bottom: 400, left: -70, backgroundColor: "#E9D8FF" }]}
      />
      <View
        pointerEvents="none"
        style={[styles.bubbleLG, { bottom: 400, right: -60, backgroundColor: "#C9F7F0" }]}
      />

      {/* NUBES (decoración) */}
      <Cloud style={{ top: 80, left: 40, opacity: 0.9 }} scale={1} />
      <Cloud style={{ top: 150, right: 50, opacity: 0.85 }} scale={0.85} />

      {/* ESTRELLITAS (más cantidad) */}
      <Star x={28} y={200} /><Star x={70} y={240} /><Star x={110} y={210} />
      <Star x={160} y={190} /><Star x={210} y={220} /><Star x={260} y={200} />
      <Star x={310} y={235} /><Star x={340} y={260} />
      <Star x={90} y={300} /><Star x={200} y={310} /><Star x={0} y={0} />

      {/* MARCA */}
      <View style={styles.brandWrap}>
        <VibraMiniLogo />
        <Text style={styles.brand}>Vibely</Text>
        <Text style={styles.tagline}>Todos entendemos la vibra ✨</Text>
      </View>

      {/* TARJETA LOGIN */}
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo"
          placeholderTextColor="#8E8E93"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#8E8E93"
          secureTextEntry
        />

        {/* ⬇️ ESTA SECCIÓN QUEDA INTACTA ⬇️ */}
        <Link href="/(main)/home" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </Link>
   

     <TouchableOpacity
    style={styles.button}
      onPress={() => router.push("/(auth)/register")}
        >
  <Text style={styles.buttonText}>Registrarme</Text>
</TouchableOpacity>



        {/* Link olvidaste tu contraseña */}
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Recuperar contraseña", "Aquí va tu flujo de recuperación.")
          }
          accessibilityRole="button"
          style={styles.forgotWrap}
        >
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        {/* ⬆️ ESTA SECCIÓN QUEDA INTACTA ⬆️ */}
      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>© 2025 Vibely</Text>
    </View>
  );
}

/** Logo con barras de colores */
function VibraMiniLogo() {
  return (
    <View style={logoStyles.row}>
      <View style={[logoStyles.bar, { height: 10, backgroundColor: "#6F46FF" }]} />
      <View style={[logoStyles.bar, { height: 18, backgroundColor: "#C44BFF" }]} />
      <View style={[logoStyles.bar, { height: 26, backgroundColor: "#FF5BB1" }]} />
      <View style={[logoStyles.bar, { height: 14, backgroundColor: "#FFCA3A" }]} />
    </View>
  );
}

/** Ondas SVG (igual que antes) */
function Waves() {
  return (
    <View style={styles.wavesWrap}>
      <Svg width="100%" height="100%" viewBox="0 0 375 220" preserveAspectRatio="none">
        <Path
          d="M0,80 C60,110 120,50 180,80 C240,110 300,50 375,80 L375,220 L0,220 Z"
          fill="#FFE38D"
        />
        <Path
          d="M0,130 C60,160 120,100 180,130 C240,160 300,100 375,130 L375,220 L0,220 Z"
          fill="#FFC0C9"
        />
        <Path
          d="M0,180 C60,210 120,150 180,180 C240,210 300,150 375,180 L375,220 L0,220 Z"
          fill="#FF9EB3"
        />
      </Svg>
    </View>
  );
}

/** Nubecita hecha con círculos */
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

/** Estrellita (rombo) */
function Star({ x, y }: { x: number; y: number }) {
  return <View style={[starStyles.star, { left: x, top: y }]} />;
}

const CARD_BG = "#FFFFFF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7ECFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  // Marca
  brandWrap: { alignItems: "center", marginBottom: 18, marginTop: 30 },
  brand: {
    fontSize: 36,
    fontWeight: "800",
    color: "#3B2357",
    letterSpacing: 0.5,
    marginTop: 6,
  },
  tagline: { fontSize: 14, color: "#4B3E5E", marginTop: 2, opacity: 0.9 },

  // Card
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: CARD_BG,
    borderRadius: 22,
    padding: 20,
    marginTop: 16,
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
  title: { fontSize: 22, fontWeight: "700", color: "#2A1E3F", marginBottom: 10 },

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
    backgroundColor: "#FF7AAE",
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "800" },

  forgotWrap: { marginTop: 12, alignItems: "center" },
  forgotText: {
    fontSize: 12,
    color: "#6B4A8E",
    textDecorationLine: "underline",
  },

  // Ondas
  wavesWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,
    overflow: "hidden",
    zIndex: 0,
  },

  // Burbujas
  bubbleXL: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.4,
    zIndex: 0,
  },
  bubbleLG: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.4,
    zIndex: 0,
  },

  footer: {
    position: "absolute",
    bottom: 18,
    color: "#7A6C8F",
    fontSize: 12,
  },
});

/* Logo */
const logoStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginTop: 4 },
  bar: { width: 16, borderRadius: 10 },
});

/* Nubes */
const cloudStyles = StyleSheet.create({
  container: { position: "absolute", width: 140, height: 60, zIndex: 1 },
  ball: { backgroundColor: "#FFFFFF", position: "absolute" },
});

/* Estrellas */
const starStyles = StyleSheet.create({
  star: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
    borderRadius: 1,
    opacity: 0.9,
    zIndex: 1,
  },
});

