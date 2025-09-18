import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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

const ui = Platform.select({ ios: "System", android: "sans-serif" });

export default function EditProfile() {
  const { user, updateProfile } = useAuth();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<string>(""); // input como string
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setUsername(user.username ?? "");
    setName(user.name ?? "");
    setLastName(user.lastName ?? "");
    setAge(user.age == null ? "" : String(user.age));
  }, [user]);

  const onSave = async () => {
    if (!username.trim()) return Alert.alert("Error", "El usuario es obligatorio");
    if (!name.trim()) return Alert.alert("Error", "El nombre es obligatorio");

    const parsedAge = age.trim() === "" ? null : Number(age);
    if (parsedAge !== null && Number.isNaN(parsedAge)) {
      return Alert.alert("Error", "La edad debe ser numérica");
    }

    try {
      setLoading(true);
      const ok = await updateProfile({
        username: username.trim(),
        name: name.trim(),
        lastName: lastName.trim(),
        age: parsedAge,
      });

      if (!ok) {
        Alert.alert("Error", "No se pudo actualizar el perfil");
        return;
      }
      Alert.alert("Listo", "Perfil actualizado", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerIcon} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#3B2357" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Editar perfil</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Field label="Usuario">
          <TextInput
            style={s.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="tu_usuario"
          />
        </Field>

        <Field label="Nombre">
          <TextInput
            style={s.input}
            value={name}
            onChangeText={setName}
            placeholder="Nombre"
          />
        </Field>

        <Field label="Apellido">
          <TextInput
            style={s.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Apellido"
          />
        </Field>

        <Field label="Edad">
          <TextInput
            style={s.input}
            value={age}
            onChangeText={setAge}
            placeholder="Edad"
            keyboardType="number-pad"
          />
        </Field>

        <TouchableOpacity
          style={[s.button, loading && { opacity: 0.6 }]}
          onPress={onSave}
          disabled={loading}
          activeOpacity={0.9}
        >
          <Text style={s.buttonText}>{loading ? "Guardando..." : "Guardar cambios"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- UI helpers ---------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.label}>{label}</Text>
      {children}
    </View>
  );
}

/* ---------- Estilos ---------- */
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingTop: Platform.select({ ios: 46, android: 24 }) },
  header: {
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EFEAF7",
  },
  headerIcon: { padding: 6 },
  headerTitle: { fontFamily: ui, fontSize: 16, fontWeight: "800", color: "#3B2357" },

  content: { padding: 16, paddingBottom: 40 },

  label: { fontFamily: ui, fontSize: 12, fontWeight: "700", color: "#3B2357", marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#EADFF5",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FBF8FF",
  },

  button: {
    marginTop: 10,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
});

