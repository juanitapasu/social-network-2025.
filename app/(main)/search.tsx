import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const serif = Platform.select({ ios: "Times New Roman", android: "serif" });
const ui = Platform.select({ ios: "System", android: "sans-serif" });

export default function Search() {
  const [q, setQ] = useState("");

  // Datos de ejemplo
  const topics = [
    "Mindfulness",
    "Neurociencia",
    "Lectura lenta",
    "Productividad",
    "Sueño",
    "Gratitud",
    "Respiración",
  ];

  const creators = [
    { name: "Todo es Mental", handle: "@mental", avatar: "https://i.pravatar.cc/100?img=12" },
    { name: "EresInteligente", handle: "@eres", avatar: "https://i.pravatar.cc/100?img=23" },
    { name: "Neurociencias", handle: "@neuro", avatar: "https://i.pravatar.cc/100?img=7" },
    { name: "Pensamientos", handle: "@pensar", avatar: "https://i.pravatar.cc/100?img=30" },
  ];

  const collections = [
    {
      title: "Citas de motivación",
      images: [
        "https://picsum.photos/seed/quote1/400/300",
        "https://picsum.photos/seed/quote2/400/300",
        "https://picsum.photos/seed/quote3/400/300",
      ],
    },
    {
      title: "Meditaciones cortas",
      images: [
        "https://picsum.photos/seed/med1/400/300",
        "https://picsum.photos/seed/med2/400/300",
        "https://picsum.photos/seed/med3/400/300",
      ],
    },
  ];

  const posts = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    image: `https://picsum.photos/seed/vibely${i}/600/800`,
    title: i % 2 ? "Respirar 4-2-6 para bajar revoluciones" : "Una idea lenta: leer sin prisa",
  }));

  const filteredCreators = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return creators;
    return creators.filter(
      (c) =>
        c.name.toLowerCase().includes(t) ||
        c.handle.toLowerCase().includes(t)
    );
  }, [q]);

  return (
    <View style={s.container}>
      {/* Header con barra de búsqueda */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.push("/(main)/home")} style={s.headerBtn}>
          <Ionicons name="chevron-back" size={24} color="#3B2357" />
        </TouchableOpacity>

        <View style={s.searchBox}>
          <Ionicons name="search-outline" size={18} color="#8C7FA6" />
          <TextInput
            style={s.searchInput}
            placeholder="Buscar personas, temas, lecturas…"
            placeholderTextColor="#8C7FA6"
            value={q}
            onChangeText={setQ}
            returnKeyType="search"
          />
        </View>

        <TouchableOpacity onPress={() => setQ("")} style={s.headerBtn}>
          <Ionicons name="sparkles-outline" size={22} color="#3B2357" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Chips de temas */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipsRow}
        >
          {topics.map((t, i) => (
            <TouchableOpacity key={i} style={s.chip} onPress={() => setQ(t)}>
              <Text style={s.chipTxt}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Hero (noticia/destacado) */}
        <View style={s.heroCard}>
          <Image
            source={{ uri: "https://picsum.photos/seed/heroVibely/1200/700" }}
            style={s.heroImg}
          />
          <View style={s.heroOverlay} />
          <Text numberOfLines={2} style={s.heroTitle}>
            Descubre nuevas voces que resuenan contigo
          </Text>
        </View>

        {/* Sección: Suscríbete / Seguir (creators) */}
        <Section title="Cuentas que te pueden gustar">
          {filteredCreators.map((c, i) => (
            <View key={i} style={s.creatorRow}>
              <Image source={{ uri: c.avatar }} style={s.creatorAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={s.creatorName}>{c.name}</Text>
                <Text style={s.creatorHandle}>{c.handle}</Text>
              </View>
              <TouchableOpacity style={s.followBtn} onPress={() => alert(`Siguiendo a ${c.name}`)}>
                <Text style={s.followTxt}>Seguir</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Section>

        {/* Sección: Colecciones tipo Pinterest */}
        {collections.map((col, idx) => (
          <Section key={idx} title={col.title}>
            <View style={s.collectionRow}>
              {col.images.map((uri, j) => (
                <Image key={j} source={{ uri }} style={s.collectionImg} />
              ))}
            </View>
          </Section>
        ))}

        {/* Sección: Trending posts (grid) */}
        <Section title="Tendencias ahora">
          <View style={s.grid}>
            {posts.map((p) => (
              <TouchableOpacity key={p.id} style={s.card} activeOpacity={0.9}>
                <Image source={{ uri: p.image }} style={s.cardImg} />
                <Text numberOfLines={2} style={s.cardTitle}>
                  {p.title}
                </Text>
                <View style={s.cardMetaRow}>
                  <Ionicons name="sparkles-outline" size={14} color="#6B4A8E" />
                  <Text style={s.cardMeta}> Ver vibra</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Section>
      </ScrollView>

      
      
    </View>
  );
}

/* ---------- UI helpers ---------- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 14, marginTop: 14 }}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionCard}>{children}</View>
    </View>
  );
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.select({ ios: 46, android: 24 }),
  },

  /* Header + search */
  header: {
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerBtn: { padding: 6 },
  searchBox: {
    flex: 1,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#F6F3FF",
    borderWidth: 1,
    borderColor: "#E8E1F5",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: ui,
    color: "#2F2840",
  },

  /* Chips */
  chipsRow: { gap: 8, paddingHorizontal: 14, paddingVertical: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#F6F3FF",
    borderWidth: 1,
    borderColor: "#E8E1F5",
    marginRight: 8,
  },
  chipTxt: { fontFamily: ui, color: "#6B4A8E", fontSize: 13, fontWeight: "700" },

  /* Hero */
  heroCard: { marginTop: 6, paddingHorizontal: 14 },
  heroImg: { width: "100%", height: 170, borderRadius: 14 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.12)",
    borderRadius: 14,
  },
  heroTitle: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 16,
    color: "#fff",
    fontFamily: serif,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  },

  /* Sections */
  sectionTitle: {
    fontFamily: ui,
    fontSize: 14,
    fontWeight: "800",
    color: "#3B2357",
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EFEAF7",
    padding: 10,
  },

  /* Creators */
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F1FB",
  },
  creatorAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#DDD" },
  creatorName: { fontFamily: ui, fontWeight: "800", color: "#2F2840" },
  creatorHandle: { fontFamily: ui, color: "#8C7FA6", fontSize: 12 },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#FF9EB3",
  },
  followTxt: { fontFamily: ui, color: "#fff", fontWeight: "800" },

  /* Collections (3 preview images) */
  collectionRow: { flexDirection: "row", gap: 8 },
  collectionImg: { flex: 1, height: 88, borderRadius: 10, backgroundColor: "#EEE" },

  /* Grid posts */
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: {
    width: "48%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFEAF7",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  cardImg: { width: "100%", height: 160, backgroundColor: "#EDE9F7" },
  cardTitle: {
    fontFamily: serif,
    fontSize: 14,
    lineHeight: 20,
    color: "#2F2840",
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingTop: 6,
  },
  cardMeta: { fontFamily: ui, color: "#6B4A8E", fontSize: 12 },

  /* Bottom bar */
  tabbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.5,
    borderTopColor: "#E8E1F5",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: { alignItems: "center", justifyContent: "center", width: 56, height: 56 },
  tabAdd: {
    width: 68,
    height: 40,
    backgroundColor: "#FF9EB3",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  miniAvatar: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#D9D4E8" },
});