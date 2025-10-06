import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ui = Platform.select({ ios: "System", android: "sans-serif" });
const serif = Platform.select({ ios: "Times New Roman", android: "serif" });

type Chat = {
  id: string;
  name: string;
  last: string;
  time: string;
  unread?: number;
  typing?: boolean;
};

const CHATS: Chat[] = [
  { id: "1", name: "martí", last: "Me encantó esa cita 📝", time: "09:24", unread: 2 },
  { id: "2", name: "Lukas", last: "te mando el ejercicio 4-2-6", time: "08:58" },
  { id: "3", name: "Zoe", last: "“Lee a la velocidad de tu pensamiento”", time: "Ayer" },
  { id: "4", name: "Maya", last: "grabé una vibra nueva 🎧", time: "Ayer", unread: 1 },
  { id: "5", name: "Quiet Notes", last: "Tip de lectura lenta…", time: "Mié" },
  { id: "6", name: "Ale", last: "Escribiendo…", time: "Mié", typing: true },
];

export default function Messages() {
  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => router.push("/(main)/home")}>
          <Ionicons name="chevron-back" size={26} color="#3B2357" />
        </TouchableOpacity>
        <Text style={s.title}>Mensajes</Text>
        <TouchableOpacity style={s.iconBtn} onPress={() => router.push("/(main)/Chats")}>
          <Ionicons name="person-circle-outline" size={26} color="#3B2357" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={18} color="#8C7FA6" />
        <TextInput
          style={s.searchInput}
          placeholder="Buscar conversaciones"
          placeholderTextColor="#9EA2A8"
        />
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={18} color="#6B4A8E" />
        </TouchableOpacity>
      </View>

      {/* Sections (tabs mock) */}
      <View style={s.tabs}>
        {["Todo", "Conectadas", "Favoritos"].map((t, i) => (
          <View key={t} style={[s.tab, i === 0 && s.tabActive]}>
            <Text style={[s.tabTxt, i === 0 && s.tabTxtActive]}>{t}</Text>
          </View>
        ))}
      </View>

      {/* Chats */}
      <FlatList
        data={CHATS}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={s.sep} />}
        renderItem={({ item }) => <ChatRow chat={item} />}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating new message */}
      <TouchableOpacity style={s.fab} activeOpacity={0.9} onPress={() => {}}>
        <Ionicons name="create-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ---- Row de chat (mock) ---- */
function ChatRow({ chat }: { chat: Chat }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={s.row}>
      {/* avatar */}
      <View style={s.avatar}>
        <Text style={s.avatarTxt}>{chat.name[0]?.toUpperCase()}</Text>
        <View style={s.statusDot} />
      </View>

      {/* contenido */}
      <View style={s.rowCenter}>
        <View style={s.rowTop}>
          <Text style={s.name} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={s.time}>{chat.time}</Text>
        </View>

        {chat.typing ? (
          <View style={s.typingWrap}>
            <View style={s.dot} />
            <View style={s.dot} />
            <View style={s.dot} />
            <Text style={s.typingTxt}> escribiendo…</Text>
          </View>
        ) : (
          <Text style={s.last} numberOfLines={1}>
            {chat.last}
          </Text>
        )}
      </View>

      {/* acciones/estado */}
      <View style={s.rowEnd}>
        {chat.unread ? (
          <View style={s.badge}>
            <Text style={s.badgeTxt}>{chat.unread}</Text>
          </View>
        ) : (
          <Ionicons name="ellipse-outline" size={16} color="#D8D2E8" />
        )}
      </View>
    </TouchableOpacity>
  );
}

/* ---- Estilos ---- */
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: { padding: 6 },
  title: { fontFamily: ui, fontSize: 20, fontWeight: "900", color: "#3B2357" },

  searchWrap: {
    marginHorizontal: 14,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E1F5",
    backgroundColor: "#F9F7FF",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: { flex: 1, fontFamily: ui, color: "#2F2840" },

  tabs: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F3EEFF",
  },
  tabActive: { backgroundColor: "#E7DEFF" },
  tabTxt: { fontFamily: ui, color: "#6B4A8E" },
  tabTxtActive: { color: "#3B2357", fontWeight: "700" },

  sep: { height: 1, backgroundColor: "#F0EBFA", marginLeft: 72 },

  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D9D4E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarTxt: { color: "#3B2357", fontWeight: "900" },
  statusDot: {
    position: "absolute",
    right: -1,
    bottom: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#7BE495",
    borderWidth: 2,
    borderColor: "#fff",
  },

  rowCenter: { flex: 1 },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontFamily: ui, fontWeight: "800", color: "#3B2357", fontSize: 15, maxWidth: "75%" },
  time: { fontFamily: ui, color: "#8C7FA6", fontSize: 12 },

  last: { marginTop: 4, color: "#5A4B73", fontFamily: serif, fontSize: 14, lineHeight: 20 },

  typingWrap: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  typingTxt: { color: "#8C7FA6", fontFamily: ui, fontSize: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#C7BDE0" },

  rowEnd: { width: 32, alignItems: "flex-end" },
  badge: {
    minWidth: 20,
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF7AAE",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTxt: { color: "#fff", fontFamily: ui, fontSize: 12, fontWeight: "800" },

  fab: {
    position: "absolute",
    right: 18,
    bottom: 86,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF9EB3",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  // bottom bar
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
});