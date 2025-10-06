// app/intro.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text /*, Image*/, View } from "react-native";

export default function Intro() {
  const router = useRouter();
  const didNavigateRef = useRef(false);

 
  const FIXED_DURATION_MS = 3000;

  // Fade-out antes de navegar
  const fade = useRef(new Animated.Value(1)).current;

  const goNext = () => {
    if (didNavigateRef.current) return;
    didNavigateRef.current = true;

    Animated.timing(fade, {
      toValue: 0,
      duration: 380,
      useNativeDriver: true,
    }).start(() => router.replace("/login"));
  };

  useEffect(() => {
    const t = setTimeout(goNext, FIXED_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.root}>
      {/* Degradé estilo Vibely */}
      <LinearGradient
        colors={["#FF9EB3", "#FFC6B3", "#FFF2F7"]}
        start={{ x: 0.1, y: 0.0 }}
        end={{ x: 0.9, y: 1.0 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.container, { opacity: fade }]}>
        <LottieView
          source={require("../assets/animations/intro.json")}
          autoPlay
          loop={false}
          speed={1}
          style={styles.animation}
          resizeMode="cover"
        />

        {/* ---- Marca / logo abajo ---- */}
        <View style={styles.brandWrap}>
          {/* Si tienes logo, descomenta y ajusta ruta:
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          */}
          <Text style={styles.brandText}>vibely</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  animation: { width: 220, height: 220 },

  brandWrap: {
    position: "absolute",
    bottom: 36,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  // Logo opcional
  logo: { width: 96, height: 24, resizeMode: "contain", opacity: 0.95 },

  brandText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#3A2B2F",
    opacity: 0.85,
  },
});
