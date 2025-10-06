import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Image,
    ImageSourcePropType,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const serif = Platform.select({ ios: "Times New Roman", android: "serif" });
const ui = Platform.select({ ios: "System", android: "sans-serif" });

export default function NewPost() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<ImageSourcePropType | null>(null);
  const [mood, setMood] = useState<"calm" | "grateful" | "focus">("calm");
  const [tags, setTags] = useState<string[]>(["Mindfulness"]);

  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const chars = text.length;

  const toggleTag = (t: string) => {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const handlePublish = () => {
    if (!text.trim()) {
      alert("Escribe algo antes de publicar ✨");
      return;
    }
    // Aquí guardas en backend/estado global si lo deseas
    alert("Publicado con éxito ✨");
    router.push("/(main)/home");
  };

  // Simula adjuntar imagen (reemplaza por tu picker real)
  const mockAttach = () => {
    setImage({ uri: "https://picsum.photos/seed/vibelypost/1200/900" });
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
          <Ionicons name="close" size={26} color="#3B2357" />
        </TouchableOpacity>

        <Text style={s.headerTitle}>Nueva publicación</Text>

        <TouchableOpacity style={s.publishBtn} onPress={handlePublish}>
          <Text style={s.publishTxt}>Publicar</Text>
        </TouchableOpacity>
      </View>

      {/* BLOQUE SUPERIOR (chips + mood + adjuntos) */}
      <View style={s.topPanel}>
        {/* Chips de categorías */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipsWrap}
        >
          {["Mindfulness", "Lectura", "Ciencia", "Reflexión", "Hábitos"].map((t, i) => {
            const active = tags.includes(t);
            return (
              <TouchableOpacity
                key={i}
                onPress={() => toggleTag(t)}
                style={[s.chip, active && s.chipActive]}
              >
                <Text style={[s.chipTxt, active && s.chipTxtActive]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selector de estado (mood) */}
        <View style={s.moodRow}>
          <Text style={s.moodLabel}>Estado:</Text>
          {([
            { key: "calm", label: "Calma" },
            { key: "grateful", label: "Gratitud" },
            { key: "focus", label: "Enfoque" },
          ] as const).map((m) => {
            const active = mood === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                onPress={() => setMood(m.key)}
                style={[s.moodPill, active && s.moodPillActive]}
              >
                <Text style={[s.moodTxt, active && s.moodTxtActive]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Acciones rápidas: imagen / cita / meditación */}
        <View style={s.attachRow}>
          <AttachCard
            icon="image-outline"
            title="Imagen"
            subtitle="Añade una foto"
            onPress={mockAttach}
          />
          <AttachCard
            icon="text-outline"
            title="Cita"
            subtitle="Pega una frase"
            onPress={() => setText((t) => t + (t ? "\n\n" : "") + "“Escribe aquí tu cita favorita…”")}
          />
          <AttachCard
            icon="leaf-outline"
            title="Meditación"
            subtitle="Guía corta"
            onPress={() =>
              setText(
                (t) =>
                  t +
                  (t ? "\n\n" : "") +
                  "Respiración 4-2-6\n— Inhala 4s\n— Retén 2s\n— Exhala 6s (x6)"
              )
            }
          />
        </View>
      </View>

      {/* CUERPO */}
      <ScrollView style={s.body} showsVerticalScrollIndicator={false}>
        {/* Barra de formato (solo UI) */}
        <View style={s.toolbar}>
          <Tool icon="text" label="Aa" onPress={() => {}} />
          <Tool icon="remove-outline" label="B" onPress={() => {}} bold />
          <Tool icon="remove-outline" label="I" onPress={() => {}} italic />
          <Tool icon="chatbox-ellipses-outline" label="Quote" onPress={() => setText((t) => t + (t ? "\n\n" : "") + "> Tu cita aquí")} />
          <Tool icon="list-outline" label="Lista" onPress={() => setText((t) => t + (t ? "\n" : "") + "• ")} />
        </View>

        {/* Autor */}
        <View style={s.authorRow}>
          <View style={s.avatar} />
          <View>
            <Text style={s.username}>TuNombre</Text>
            <Text style={s.meta}>Escribe con calma • Vibely</Text>
          </View>
        </View>

        {/* Campo de texto */}
        <TextInput
          style={[
            s.input,
            mood === "calm" && { backgroundColor: "#FCFAFF" },
            mood === "grateful" && { backgroundColor: "#FFF9FB" },
            mood === "focus" && { backgroundColor: "#FAFCFF" },
          ]}
          placeholder="Comparte tu vibra hoy… (reflexión, guía, lectura…) "
          placeholderTextColor="#8C7FA6"
          multiline
          value={text}
          onChangeText={setText}
        />

        {/* Preview de imagen, si existe */}
        {image && (
          <View style={s.previewCard}>
            <Image source={image} style={s.previewImg} />
            <TouchableOpacity style={s.removeBtn} onPress={() => setImage(null)}>
              <Ionicons name="close" size={18} color="#3B2357" />
            </TouchableOpacity>
          </View>
        )}

        {/* Footer del editor: contador y guardado */}
        <View style={s.editorFooter}>
          <Text style={s.counter}>
            {words} palabras · {chars} caracteres
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={[s.smallBtn, { backgroundColor: "#F6F3FF", borderColor: "#E8E1F5" }]}
              onPress={() => alert("Borrador guardado")}
            >
              <Text style={[s.smallBtnTxt, { color: "#6B4A8E" }]}>Guardar borrador</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.smallBtn, { backgroundColor: "#FF9EB3", borderColor: "#FF9EB3" }]} onPress={handlePublish}>
              <Text style={[s.smallBtnTxt, { color: "#fff" }]}>Publicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* --- Subcomponentes --- */

function Tool({
  icon,
  label,
  onPress,
  bold,
  italic,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  bold?: boolean;
  italic?: boolean;
}) {
  return (
    <TouchableOpacity style={s.tool} onPress={onPress}>
      <Text
        style={[
          s.toolTxt,
          bold && { fontWeight: "900" },
          italic && { fontStyle: "italic" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function AttachCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: any;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={s.attachCard} onPress={onPress} activeOpacity={0.9}>
      <View style={s.attachIconWrap}>
        <Ionicons name={icon} size={20} color="#6F46FF" />
      </View>
      <Text style={s.attachTitle}>{title}</Text>
      <Text style={s.attachSub}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

/* --- Estilos --- */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF", paddingTop: Platform.select({ ios: 46, android: 24 }) },

  /* Header */
  header: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EFEAF7",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  iconBtn: { padding: 6 },
  headerTitle: { fontFamily: ui, fontSize: 16, fontWeight: "800", color: "#3B2357" },
  publishBtn: { backgroundColor: "#FF9EB3", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  publishTxt: { fontFamily: ui, fontWeight: "800", color: "#fff" },

  /* Panel superior */
  topPanel: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 },
  chipsWrap: { gap: 8, paddingBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#F6F3FF",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E8E1F5",
  },
  chipActive: { backgroundColor: "#EDE7FF", borderColor: "#DCD3F5" },
  chipTxt: { fontFamily: ui, color: "#6B4A8E", fontSize: 13 },
  chipTxtActive: { color: "#3B2357", fontWeight: "700" },

  moodRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  moodLabel: { fontFamily: ui, color: "#8C7FA6", fontSize: 12 },
  moodPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#FAF8FF",
    borderWidth: 1,
    borderColor: "#EEE7FA",
  },
  moodPillActive: { backgroundColor: "#FFF1F6", borderColor: "#FFD2E1" },
  moodTxt: { fontFamily: ui, color: "#6B4A8E", fontSize: 12, fontWeight: "700" },
  moodTxtActive: { color: "#C2437B" },

  attachRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  attachCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E8E1F5",
    backgroundColor: "#FAF8FF",
    borderRadius: 12,
    padding: 10,
  },
  attachIconWrap: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: "#EFE8FF",
    alignItems: "center", justifyContent: "center", marginBottom: 6,
  },
  attachTitle: { fontFamily: ui, fontWeight: "800", color: "#3B2357", fontSize: 13 },
  attachSub: { fontFamily: ui, color: "#6B4A8E", fontSize: 11, marginTop: 2 },

  /* Body */
  body: { paddingHorizontal: 14 },

  toolbar: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 8,
    marginTop: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F1FB",
  },
  tool: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F6F3FF",
    borderWidth: 1,
    borderColor: "#E8E1F5",
  },
  toolTxt: { fontFamily: ui, color: "#3B2357", fontWeight: "700" },

  authorRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#D9D4E8" },
  username: { fontFamily: ui, fontWeight: "800", color: "#3B2357" },
  meta: { fontFamily: ui, color: "#8C7FA6", fontSize: 12 },

  input: {
    marginTop: 10,
    fontFamily: serif,
    fontSize: 16,
    lineHeight: 26,
    minHeight: 160,
    color: "#2F2840",
    textAlignVertical: "top",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFEAF7",
  },

  previewCard: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E8E1F5",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  previewImg: { width: "100%", height: 220 },
  removeBtn: {
    position: "absolute",
    top: 8, right: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: "#E8E1F5",
  },

  editorFooter: {
    marginTop: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counter: { fontFamily: ui, color: "#8C7FA6", fontSize: 12 },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  smallBtnTxt: { fontFamily: ui, fontWeight: "800" },
});
 