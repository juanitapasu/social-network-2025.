// app/(main)/profile/index.tsx
import { AuthContext } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useContext, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileIndex() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  // http(s) o data:image/...;base64; si no hay, fallback con iniciales
  const avatarUri = useMemo(() => {
    if (user?.avatar_url) return user.avatar_url;
    const seed =
      user?.name?.trim() ||
      user?.username?.trim() ||
      "Vibely User";
    return `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
      seed
    )}`;
  }, [user?.avatar_url, user?.name, user?.username]);

  return (
    <ScrollView
      style={[s.container, { paddingTop: Math.max(insets.top, 14) }]}
      contentContainerStyle={{ paddingBottom: 28 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top link */}
      <View style={s.topbar}>
        <Text numberOfLines={1} style={s.topLink}>
          vibely.me/{user?.username || "user"}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(main)/profile/edit")}
          style={s.topIcon}
        >
          <Ionicons name="menu-outline" size={20} color="#7A6C8F" />
        </TouchableOpacity>
      </View>

      {/* Header con avatar + datos + acciones */}
      <View style={s.headerRow}>
        <Image
          key={avatarUri}           // fuerza remount cuando cambia
          source={{ uri: avatarUri }}
          style={s.avatar}
          contentFit="cover"
          cachePolicy="none"        // sin caché → se ve el cambio inmediato
        />

        <View style={s.nameBlock}>
          <Text numberOfLines={1} style={s.name}>
            {user?.name || "Usuario"}
          </Text>

          {!!user?.username && (
            <Text numberOfLines={1} style={s.username}>
              @{user.username}
            </Text>
          )}

          {/* Bio visible */}
          {!!user?.bio && (
            <Text numberOfLines={2} style={s.bio}>
              {user.bio}
            </Text>
          )}

          {/* Acciones: Editar (rosa) + icono de link */}
          <View style={s.actionsRow}>
            <TouchableOpacity
              onPress={() => router.push("/(main)/profile/edit")}
              style={s.editBadge}
              activeOpacity={0.9}
            >
              <Ionicons name="create-outline" size={16} color="#fff" />
              <Text style={s.editBadgeText}>Editar perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.secondaryIcon} activeOpacity={0.9}>
              <Ionicons name="link-outline" size={16} color="#6F46FF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tabs (Posts / Notes / Saved) */}
      <View style={s.tabsRow}>
        <Tab label="Posts" active />
        <Tab label="Notes" />
        <Tab label="Saved" />
      </View>

      {/* Sección: Puntos de lectura */}
      <SectionTitle title="Puntos de lectura" />
      <CardList
        items={[
          {
            title: "Cómo leer más despacio y recordar mejor",
            subtitle: "Ensayo breve • 6 min",
          },
          {
            title: "Micro-pausas de 40s: lo que dice la evidencia",
            subtitle: "Notas • 4 min",
          },
          {
            title: "Respirar 4-2-6: guía para empezar hoy",
            subtitle: "Guía práctica • 5 min",
          },
        ]}
      />

      {/* Sección: Zona de meditación (3 tiles) */}
      <SectionTitle title="Zona de meditación" />
      <View style={s.meditationRow}>
        <Tile title="Respira 2 min" subtitle="4-2-6" icon="leaf-outline" />
        <Tile title="Siesta 10 min" subtitle="body scan" icon="moon-outline" />
        <Tile title="Focus 5 min" subtitle="visualización" icon="sparkles-outline" />
      </View>

      {/* Sección: Frases bonitas */}
      <SectionTitle title="Frases bonitas" />
      <QuoteCard quote="Hazlo simple, pero significativo." author="Don Draper" />
    </ScrollView>
  );
}

/* ---------- Mini componentes de UI ---------- */

function Tab({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={[s.tab, active ? s.tabActive : null]}>
      <Ionicons
        name={
          label === "Posts"
            ? "albums-outline"
            : label === "Notes"
            ? "document-text-outline"
            : "bookmark-outline"
        }
        size={14}
        color={active ? "#4B2FA7" : "#7A6C8F"}
      />
      <Text style={[s.tabText, active ? s.tabTextActive : null]}>{label}</Text>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={s.sectionTitle}>{title}</Text>;
}

function CardList({ items }: { items: { title: string; subtitle: string }[] }) {
  return (
    <View style={s.cardList}>
      {items.map((it, idx) => (
        <View key={`${it.title}-${idx}`} style={s.card}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={s.cardTitle}>
              {it.title}
            </Text>
            <Text numberOfLines={1} style={s.cardSubtitle}>
              {it.subtitle}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C8BBDC" />
        </View>
      ))}
    </View>
  );
}

function Tile({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: any;
}) {
  return (
    <View style={s.tile}>
      <View style={s.tileIconWrap}>
        <Ionicons name={icon} size={18} color="#6F46FF" />
      </View>
      <Text numberOfLines={1} style={s.tileTitle}>
        {title}
      </Text>
      <Text numberOfLines={1} style={s.tileSubtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

function QuoteCard({ quote, author }: { quote: string; author?: string }) {
  return (
    <View style={s.quoteCard}>
      <Ionicons name="sparkles-outline" size={18} color="#6F46FF" />
      <Text style={s.quoteText}>"{quote}"</Text>
      {!!author && <Text style={s.quoteAuthor}>— {author}</Text>}
    </View>
  );
}

/* ---------- Estilos (visual Vibely) ---------- */

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },

  // Barra superior
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  topLink: {
    color: "#7A6C8F",
    fontSize: 12,
    fontWeight: "700",
  },
  topIcon: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#F4ECFF",
  },

  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 14,
    paddingVertical: 6,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#EEEAF8",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  nameBlock: {
    flex: 1,
    minHeight: 86,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "900",
    color: "#2A2141",
  },
  username: {
    marginTop: 2,
    fontSize: 13,
    color: "#7A6C8F",
    fontWeight: "700",
  },
  bio: {
    marginTop: 6,
    fontSize: 12.5,
    color: "#514766",
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  editBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FF6CA3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: "#FF6CA3",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  editBadgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  secondaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F4ECFF",
    alignItems: "center",
    justifyContent: "center",
  },

  // Tabs
  tabsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    marginBottom: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#FBF8FF",
    borderWidth: 1,
    borderColor: "#EADFF5",
  },
  tabActive: {
    backgroundColor: "#F0E9FF",
    borderColor: "#D7C8FF",
  },
  tabText: {
    color: "#7A6C8F",
    fontWeight: "800",
    fontSize: 12,
  },
  tabTextActive: {
    color: "#4B2FA7",
  },

  // Listas/cards
  sectionTitle: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "900",
    color: "#3B2357",
  },
  cardList: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EADFF5",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: "#2A2141",
    fontWeight: "800",
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#9B8BB6",
    fontWeight: "700",
  },

  // Tiles meditación
  meditationRow: {
    flexDirection: "row",
    gap: 10,
  },
  tile: {
    flex: 1,
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EADFF5",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  tileIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "#F4ECFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#3B2357",
  },
  tileSubtitle: {
    fontSize: 11,
    color: "#9B8BB6",
    fontWeight: "700",
    marginTop: 2,
  },

  // Quote
  quoteCard: {
    marginTop: 6,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EADFF5",
    gap: 6,
  },
  quoteText: {
    fontSize: 13,
    color: "#3B2357",
    fontStyle: "italic",
  },
  quoteAuthor: {
    fontSize: 12,
    color: "#7A6C8F",
    fontWeight: "700",
  },
});
