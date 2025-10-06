// app/(main)/profile/edit.tsx
import CameraModal from "@/components/CameraModal";
import { AuthContext } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useContext, useMemo, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const toDataUri = (base64?: string | null, mime = "image/jpeg") =>
  base64 ? `data:${mime};base64,${base64}` : null;

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, updateProfile } = useContext(AuthContext);

  // ------- estado
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    website: user?.website || "",
    location: user?.location || "",
    phone: user?.phone || "",
  });

  // guardamos siempre como data-uri base64
  const [avatar, setAvatar] = useState<string | null>(user?.avatar_url ?? null);
  const [showCam, setShowCam] = useState(false);
  const [loading, setLoading] = useState(false);

  const avatarPreview = useMemo(() => {
    if (avatar) return avatar;
    const seed =
      user?.name?.trim() || user?.username?.trim() || "Vibely User";
    return `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
      seed
    )}`;
  }, [avatar, user?.name, user?.username]);

  const onChange = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  // ------- galería (base64)
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Activa acceso a tu galería.");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
      base64: true,
    });

    if (!res.canceled) {
      const asset = res.assets[0];
      const dataUri = toDataUri(asset.base64);
      if (dataUri) setAvatar(dataUri);
    }
  };

  // ------- cámara (usa tu ModalCamera → entrega base64)
  const takePhoto = () => setShowCam(true);
  const handleCapture = (base64: string) => {
    const dataUri = toDataUri(base64);
    if (dataUri) setAvatar(dataUri);
  };

  const selectImage = () => {
    Alert.alert("Cambiar foto de perfil", "Selecciona una opción", [
      { text: "Cámara", onPress: takePhoto },
      { text: "Galería", onPress: pickFromGallery },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const onSave = async () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "El nombre es requerido");
      return;
    }
    if (form.username && form.username.length < 3) {
      Alert.alert("Error", "El nombre de usuario debe tener al menos 3 caracteres");
      return;
    }

    setLoading(true);
    try {
      const ok = await updateProfile({
        name: form.name.trim(),
        username: form.username.trim() || undefined,
        bio: form.bio.trim() || undefined,
        website: form.website.trim() || undefined,
        location: form.location.trim() || undefined,
        phone: form.phone.trim() || undefined,
        // 👇 guardamos data-uri base64
        avatar_url: avatar || undefined,
      });

      if (ok) {
        Alert.alert("Éxito", "Perfil actualizado correctamente", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", "No se pudo actualizar el perfil. Intenta de nuevo.");
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[s.root, { paddingTop: Math.max(insets.top, 14) }]}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.headerIcon} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="#3B2357" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Editar perfil</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Avatar */}
        <View style={s.avatarSection}>
          <TouchableOpacity onPress={selectImage} style={s.avatarContainer}>
            <Image
              key={avatarPreview}
              source={{ uri: avatarPreview }}
              style={s.avatar}
              contentFit="cover"
              cachePolicy="none"
            />
            <View style={s.avatarOverlay}>
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={selectImage}>
            <Text style={s.changePhotoText}>Cambiar foto de perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Card/Form */}
        <View style={s.card}>
          <Field label="Nombre">
            <TextInput
              style={s.input}
              value={form.name}
              onChangeText={(v) => onChange("name", v)}
              placeholder="Tu nombre completo"
              placeholderTextColor="#8E8E93"
            />
          </Field>

          <Field label="Usuario">
            <TextInput
              style={s.input}
              value={form.username}
              onChangeText={(v) => onChange("username", v)}
              placeholder="@nombredeusuario"
              placeholderTextColor="#8E8E93"
              autoCapitalize="none"
              maxLength={30}
            />
            <Text style={s.helpText}>Solo letras, números y guiones bajos</Text>
          </Field>

          <Field label="Biografía">
            <TextInput
              style={[s.input, s.bioInput]}
              value={form.bio}
              onChangeText={(v) => onChange("bio", v)}
              placeholder="Cuéntanos sobre ti…"
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={4}
              maxLength={150}
              textAlignVertical="top"
            />
            <Text style={s.characterCount}>{form.bio.length}/150</Text>
          </Field>

          <Field label="Sitio web">
            <TextInput
              style={s.input}
              value={form.website}
              onChangeText={(v) => onChange("website", v)}
              placeholder="https://tusitio.com"
              placeholderTextColor="#8E8E93"
              autoCapitalize="none"
              keyboardType="url"
              maxLength={100}
            />
          </Field>

          <Field label="Ubicación">
            <TextInput
              style={s.input}
              value={form.location}
              onChangeText={(v) => onChange("location", v)}
              placeholder="Ciudad, País"
              placeholderTextColor="#8E8E93"
              maxLength={50}
            />
          </Field>

          <Field label="Teléfono">
            <TextInput
              style={s.input}
              value={form.phone}
              onChangeText={(v) => onChange("phone", v)}
              placeholder="+1 234 567 8900"
              placeholderTextColor="#8E8E93"
              keyboardType="phone-pad"
              maxLength={20}
            />
          </Field>

          <TouchableOpacity
            onPress={onSave}
            style={[s.button, loading && { opacity: 0.6 }]}
            disabled={loading}
            activeOpacity={0.9}
          >
            <Text style={s.buttonText}>
              {loading ? "Guardando..." : "Guardar"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={s.footer}>© 2025 Vibely</Text>
      </ScrollView>

      {/* Modal cámara (base64) */}
      {showCam && (
        <CameraModal
          onClose={() => setShowCam(false)}
          onCapture={(b64) => {
            handleCapture(b64);
            setShowCam(false);
          }}
        />
      )}
    </View>
  );
}

/* ---------- UI helpers ---------- */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.label}>{label}</Text>
      {children}
    </View>
  );
}

/* ---------- Estilos Vibely ---------- */
const CARD_BG = "#FFFFFF";
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7ECFF",
  },
  scroll: { flex: 1, paddingHorizontal: 20 },
  header: {
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerIcon: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: "900", color: "#3B2357" },

  avatarSection: {
    alignItems: "center",
    paddingVertical: 18,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EDE9F7",
  },
  avatarOverlay: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#3B2357",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  changePhotoText: {
    fontSize: 14,
    color: "#6F46FF",
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  card: {
    zIndex: 3,
    backgroundColor: CARD_BG,
    borderRadius: 22,
    padding: 16,
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
  label: { fontSize: 12, fontWeight: "800", color: "#3B2357", marginBottom: 6 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#EADFF5",
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FBF8FF",
    color: "#2A2141",
  },
  helpText: { fontSize: 11, color: "#8C7FA6", marginTop: 4 },
  bioInput: { height: 100, paddingTop: 10 },
  characterCount: {
    textAlign: "right",
    color: "#8C7FA6",
    fontSize: 12,
    marginTop: 4,
  },

  button: {
    marginTop: 16,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "800" },

  footer: {
    marginTop: 16,
    textAlign: "center",
    color: "#7A6C8F",
    fontSize: 12,
  },
});
