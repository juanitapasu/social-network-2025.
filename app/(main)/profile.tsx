// app/(main)/profile.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const serif = Platform.select({ ios: "Times New Roman", android: "serif" });
const ui = Platform.select({ ios: "System", android: "sans-serif" });

export default function Profile() {
  const { user } = useAuth();

  const username = user?.username ?? "you";
  const fullName = [user?.name, user?.lastName].filter(Boolean).join(" ") || "Tu nombre";

  return (
    <View style={s.container}>
      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerIcon} onPress={() => router.push("/(main)/home")}>
          <Ionicons name="chevron-back" size={26} color="#3B2357" />
        </TouchableOpacity>

        <Text style={s.headerTitle}>vibely.me/{username}</Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity style={s.headerIcon} onPress={() => router.push("/(main)/new-post")}>
            <Ionicons name="add-circle-outline" size={24} color="#3B2357" />
          </TouchableOpacity>
          <TouchableOpacity style={s.headerIcon} onPress={() => console.log("Settings")}>
            <Ionicons name="menu-outline" size={26} color="#3B2357" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* CABECERA PERFIL */}
        <View style={s.topCard}>
          <View style={s.row}>
            {/* avatar + online */}
            <View style={s.avatarWrap}>
              <View style={s.avatar} />
              <View style={s.onlineDot} />
            </View>

            {/* stats */}
            <View style={s.statsRow}>
              <Stat n="128" label="Publicaciones" />
              <Stat n="2.4k" label="Vibers" />
              <Stat n="214" label="Likes" />
            </View>
          </View>

          <Text style={s.name}>{fullName}</Text>
          <Text style={s.bio}>Espacios de calma • Lecturas lentas • Respiración consciente</Text>
          <Text style={s.link}>vibely.app/{username}</Text>

          <View style={s.actionsRow}>
            <TouchableOpacity
              style={[s.btn, s.btnPrimary]}
              onPress={() => router.push("/(main)/updateProfile")} // 👈 a la pantalla de edición
            >
              <Text style={s.btnPrimaryTxt}>Editar perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btn, s.btnGhost]}>
              <Ionicons name="share-social-outline" size={18} color="#3B2357" />
            </TouchableOpacity>
          </View>
        </View>

        {/* TABS */}
        <View style={s.tabs}>
          <Tab icon="grid-outline" text="Posts" active />
          <Tab icon="book-outline" text="Notes" />
          <Tab icon="bookmark-outline" text="Saved" />
        </View>

        {/* PUNTOS DE LECTURA */}
        <Section title="Puntos de lectura">
          {[
            { title: "Cómo leer más despacio y recordar mejor", meta: "Ensayo breve · 6 min" },
            { title: "Micro-pausas de 40s: lo que dice la evidencia", meta: "Notas · 4 min" },
            { title: "Respirar 4-2-6: guía para empezar hoy", meta: "Guía práctica · 5 min" },
          ].map((it, i) => (
            <TouchableOpacity key={i} style={s.readItem} activeOpacity={0.8}>
              <View style={s.readBullet} />
              <View style={{ flex: 1 }}>
                <Text style={s.readTitle}>{it.title}</Text>
                <Text style={s.readMeta}>{it.meta}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8C7FA6" />
            </TouchableOpacity>
          ))}
        </Section>

        {/* ZONA DE MEDITACIÓN */}
        <Section title="Zona de meditación">
          <View style={s.meditGrid}>
            <MeditCard icon="leaf-outline" title="Respira 2 min" subtitle="4-2-6" />
            <MeditCard icon="moon-outline" title="Siesta 10 min" subtitle="body scan" />
            <MeditCard icon="sparkles-outline" title="Focus 5 min" subtitle="visualización" />
          </View>
        </Section>

        {/* FRASES BONITAS */}
        <Section title="Frases bonitas">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {[
              "Lee a la velocidad de tu pensamiento.",
              "Respira como si el mundo fuese ancho.",
              "Lo que no se nombra se siente más pesado.",
              "Haz espacio para una idea a la vez.",
            ].map((q, i) => (
              <View key={i} style={s.quoteCard}>
                <Text style={s.quoteText}>"{q}"</Text>
              </View>
            ))}
          </ScrollView>
        </Section>

        {/* GRID DE POSTS (placeholder) */}
        <Section title="Tus publicaciones">
          <View style={s.grid}>
            {Array.from({ length: 9 }).map((_, i) => (
              <View key={i} style={s.gridItem}>
                <View style={s.gridMedia} />
              </View>
            ))}
          </View>
        </Section>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={s.tabbar}>
        <TouchableOpacity style={s.tabItem} onPress={() => router.push("/(main)/home")}>
          <Ionicons name="home-outline" size={26} color="#3B2357" />
        </TouchableOpacity>
        <TouchableOpacity style={s.tabItem} onPress={() => router.push("/(main)/search")}>
          <Ionicons name="search-outline" size={26} color="#3B2357" />
        </TouchableOpacity>
        <TouchableOpacity style={[s.tabItem, s.tabAdd]} onPress={() => router.push("/(main)/new-post")}>
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={s.tabItem} onPress={() => router.push("/(main)/reels")}>
          <Ionicons name="sparkles-outline" size={26} color="#3B2357" />
        </TouchableOpacity>
        <TouchableOpacity style={s.tabItem} onPress={() => router.push("/(main)/profile")}>
          <View style={s.miniAvatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------- Subcomponentes ---------- */

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <View style={{ alignItems: "center", minWidth: 86 }}>
      <Text style={s.statN}>{n}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function Tab({ icon, text, active = false }: { icon: any; text: string; active?: boolean }) {
  return (
    <TouchableOpacity style={[s.tabPill, active && s.tabPillActive]}>
      <Ionicons name={icon} size={16} color={active ? "#3B2357" : "#6B4A8E"} />
      <Text style={[s.tabPillTxt, active && s.tabPillTxtActive]}>{text}</Text>
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 14, marginTop: 16 }}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.card}>{children}</View>
    </View>
  );
}

function MeditCard({ icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <TouchableOpacity style={s.meditCard} activeOpacity={0.9}>
      <View style={s.meditIconWrap}>
        <Ionicons name={icon} size={20} color="#6F46FF" />
      </View>
      <Text style={s.meditTitle}>{title}</Text>
      <Text style={s.meditSub}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

/* ---------- Estilos ---------- */

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.select({ ios: 46, android: 24 }),
  },

  /* Header */
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

  /* Top card */
  topCard: { paddingHorizontal: 14, paddingTop: 14 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatarWrap: { position: "relative" },
  avatar: { width: 78, height: 78, borderRadius: 39, backgroundColor: "#D9D4E8" },
  onlineDot: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#3CD77E",
    borderWidth: 2,
    borderColor: "#fff",
  },

  statsRow: { flexDirection: "row", gap: 22 },
  statN: { fontFamily: ui, fontWeight: "900", color: "#3B2357", fontSize: 18 },
  statLabel: { fontFamily: ui, color: "#8C7FA6", fontSize: 11, textAlign: "center" },

  name: { marginTop: 12, fontFamily: ui, fontWeight: "900", color: "#3B2357", fontSize: 20 },
  bio: { marginTop: 4, fontFamily: serif, color: "#2F2840", fontSize: 15, lineHeight: 22 },
  link: { marginTop: 6, fontFamily: ui, color: "#6B4A8E", fontSize: 12 },

  actionsRow: { marginTop: 12, flexDirection: "row", gap: 10 },
  btn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#FF9EB3" },
  btnPrimaryTxt: { color: "#fff", fontFamily: ui, fontWeight: "800" },
  btnGhost: { backgroundColor: "#F6F3FF" },

  /* Tabs */
  tabs: {
    marginTop: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    gap: 8,
  },
  tabPill: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#F6F3FF",
    alignItems: "center",
  },
  tabPillActive: { backgroundColor: "#EDE7FF" },
  tabPillTxt: { fontFamily: ui, color: "#6B4A8E", fontSize: 13 },
  tabPillTxtActive: { color: "#3B2357", fontWeight: "700" },

  /* Section generic */
  sectionTitle: {
    fontFamily: ui,
    fontSize: 14,
    fontWeight: "800",
    color: "#3B2357",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EFEAF7",
  },

  /* Reading list */
  readItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F1FB",
  },
  readBullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#C9BEDF" },
  readTitle: { fontFamily: serif, color: "#2F2840", fontSize: 16, lineHeight: 24 },
  readMeta: { fontFamily: ui, color: "#8C7FA6", fontSize: 12, marginTop: 2 },

  /* Meditación */
  meditGrid: { flexDirection: "row", gap: 10 },
  meditCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E8E1F5",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FAF8FF",
  },
  meditIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EFE8FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  meditTitle: { fontFamily: ui, fontWeight: "800", color: "#3B2357" },
  meditSub: { fontFamily: ui, color: "#6B4A8E", fontSize: 12, marginTop: 2 },

  /* Frases */
  quoteCard: {
    width: 240,
    borderWidth: 1,
    borderColor: "#E8E1F5",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
  },
  quoteText: { fontFamily: serif, fontSize: 16, lineHeight: 24, color: "#2F2840" },

  /* Grid de posts */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  gridItem: { width: "32%", aspectRatio: 1, borderRadius: 8, overflow: "hidden" },
  gridMedia: { flex: 1, backgroundColor: "#EDE9F7" },

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
