// app/(main)/edit-profile.tsx
import { AuthContext } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function EditProfile() {
  const router = useRouter();
  const { user, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: (user as any)?.bio || '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }
    if (formData.username && formData.username.length < 3) {
      Alert.alert('Error', 'El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }
    setLoading(true);
    try {
      const success = await updateProfile({
        name: formData.name.trim(),
        username: formData.username.trim() || undefined,
        // si tu backend soporta bio, se guardará; si no, simplemente se ignora
        ...(formData.bio?.trim() ? { bio: formData.bio.trim() } : {}),
      } as any);

      if (success) {
        Alert.alert('Éxito', 'Perfil actualizado correctamente', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Error', 'No se pudo actualizar el perfil. Intenta de nuevo.');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ocurrió un error inesperado. Intenta de nuevo.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectImage = () => {
    Alert.alert('Cambiar foto de perfil', 'Selecciona una opción', [
      { text: 'Cámara', onPress: () => console.log('Camera selected') },
      { text: 'Galería', onPress: () => console.log('Gallery selected') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <View style={s.container}>
      {/* Fondo Vibely */}
      <Waves />
      <View pointerEvents="none" style={[s.bubbleXL, { top: -110, left: -110, backgroundColor: "#FFD6E7" }]} />
      <View pointerEvents="none" style={[s.bubbleXL, { top: -130, right: -130, backgroundColor: "#C9F7F0" }]} />
      <View pointerEvents="none" style={[s.bubbleLG, { bottom: 140, left: -80, backgroundColor: "#E9D8FF" }]} />
      <View pointerEvents="none" style={[s.bubbleLG, { bottom: 180, right: -70, backgroundColor: "#C9F7F0" }]} />
      <Cloud style={{ top: 70, left: 24, opacity: 0.9 }} scale={0.9} />
      <Cloud style={{ top: 120, right: 28, opacity: 0.85 }} scale={0.75} />
      <Star x={22} y={170} /><Star x={70} y={185} /><Star x={120} y={175} />
      <Star x={220} y={165} /><Star x={280} y={180} /><Star x={330} y={170} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Encabezado */}
        <View style={s.header}>
          <TouchableOpacity style={s.headerIcon} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="#3B2357" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Editar perfil</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Sección avatar */}
        <View style={s.avatarSection}>
          <TouchableOpacity onPress={selectImage} style={s.avatarContainer}>
            <Image
              source={{
                uri:
                  (user as any)?.avatar_url ||
                  'https://via.placeholder.com/100/e1e1e1/666?text=User',
              }}
              style={s.avatar}
            />
            <View style={s.avatarOverlay}>
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={selectImage}>
            <Text style={s.changePhotoText}>Cambiar foto de perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Card de edición */}
        <View style={s.card}>
          <Field label="Nombre">
            <TextInput
              style={s.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Tu nombre completo"
              placeholderTextColor="#8E8E93"
            />
          </Field>

          <Field label="Usuario">
            <TextInput
              style={s.input}
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              placeholder="@nombredeusuario"
              placeholderTextColor="#8E8E93"
              autoCapitalize="none"
              maxLength={30}
            />
          </Field>

          <Field label="Biografía">
            <TextInput
              style={[s.input, s.bioInput]}
              value={formData.bio}
              onChangeText={(value) => handleInputChange('bio', value)}
              placeholder="Cuéntanos sobre ti..."
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={4}
              maxLength={150}
              textAlignVertical="top"
            />
            <Text style={s.characterCount}>{formData.bio.length}/150</Text>
          </Field>

          <TouchableOpacity
            onPress={handleSave}
            style={[s.button, loading && { opacity: 0.6 }]}
            disabled={loading}
            activeOpacity={0.9}
          >
            <Text style={s.buttonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.footer}>© 2025 Vibely</Text>
      </ScrollView>
    </View>
  );
}

/* ======= UI Vibely helpers ======= */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.label}>{label}</Text>
      {children}
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

function Star({ x, y }: { x: number; y: number }) {
  return <View pointerEvents="none" style={[starStyles.star, { left: x, top: y }]} />;
}

/* ======= Estilos Vibely ======= */
const CARD_BG = "#FFFFFF";
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7ECFF",
    paddingTop: Platform.select({ ios: 40, android: 24 }),
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 160,
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

  header: {
    paddingHorizontal: 6,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerIcon: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: "900", color: "#3B2357" },

  avatarSection: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EDE9F7",
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: "#3B2357",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  changePhotoText: {
    fontSize: 14,
    color: "#6F46FF",
    fontWeight: '700',
    textDecorationLine: 'underline',
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
  },
  bioInput: {
    height: 100,
    paddingTop: 10,
  },
  characterCount: {
    textAlign: 'right',
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
