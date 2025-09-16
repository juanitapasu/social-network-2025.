import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Dimensions,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { height, width } = Dimensions.get("window");

// Mock de “reels” (solo imágenes)
const reelsMock = [
  {
    id: "1",
    user: "martí",
    caption: "Una pausa de calma ✨",
    bg: "https://picsum.photos/id/1003/1080/1920", // vertical
  },
  {
    id: "2",
    user: "Lukas",
    caption: "La vibra de hoy 🌿",
    bg: "https://picsum.photos/id/1018/1080/1920",
  },
  {
    id: "3",
    user: "Zoe",
    caption: "Escribir y respirar ☕",
    bg: "https://picsum.photos/id/1021/1080/1920",
  },
];

export default function ReelsMock() {
  return (
    <View style={s.container}>
      {/* Páginas verticales (mock) */}
      <ScrollView
        pagingEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        {reelsMock.map((item) => (
          <View key={item.id} style={s.reel}>
            <ImageBackground
              source={{ uri: item.bg }}
              style={s.bg}
              imageStyle={{ resizeMode: "cover" }}
            >
              {/* Gradiente simple con overlay usando un View oscuro */}
              <View style={s.fade} />

              {/* UI superpuesta */}
              <View style={s.overlay}>
                <View style={s.info}>
                  <Text style={s.user}>@{item.user}</Text>
                  <Text style={s.caption}>{item.caption}</Text>
                </View>

                <View style={s.actions}>
                  <TouchableOpacity style={s.actionBtn}>
                    <Ionicons name="heart-outline" size={28} color="#fff" />
                    <Text style={s.count}>2.4k</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={s.actionBtn}>
                    <Ionicons name="chatbubble-outline" size={28} color="#fff" />
                    <Text style={s.count}>128</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={s.actionBtn}>
                    <Ionicons name="share-social-outline" size={28} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      {/* Bottom bar (mock) */}
      <View style={s.tabbar}>
        <TouchableOpacity style={s.tabItem} onPress={() => router.push("/(main)/home")}>
          <Ionicons name="home-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={s.tabItem} onPress={() => router.push("/(main)/search")}>
          <Ionicons name="search-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tabItem, s.tabAdd]}
          onPress={() => router.push("/(main)/new-post")}
        >
          <Ionicons name="add" size={26} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={s.tabItem} onPress={() => router.push("/(main)/reels")}>
          <Ionicons name="sparkles-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={s.tabItem} onPress={() => router.push("/(main)/profile")}>
          <View style={s.avatarDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  reel: {
    width,
    height,
    backgroundColor: "#000",
  },
  bg: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  fade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },

  overlay: {
    paddingHorizontal: 16,
    paddingBottom: 90, // deja espacio para la tabbar
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  info: { flex: 1, paddingRight: 16 },
  user: { color: "#fff", fontWeight: "900", fontSize: 16, marginBottom: 6 },
  caption: { color: "#fff", fontSize: 14, lineHeight: 20, opacity: 0.95 },

  actions: { alignItems: "center", gap: 18 },
  actionBtn: { alignItems: "center", gap: 4 },
  count: { color: "#fff", fontSize: 12, opacity: 0.9 },

  // Bottom bar (sobre vídeo)
  tabbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    backgroundColor: "rgba(0,0,0,0.5)",
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
  avatarDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#D9D4E8" },
});
