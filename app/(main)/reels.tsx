// app/(tabs)/reels/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewToken,
} from "react-native";

const { height, width } = Dimensions.get("window");
const PAGE = height; // altura de cada reel (pantalla completa)

// Links de ejemplo: reemplaza src por tus URLs MP4 (https)
const reels: Array<{ id: string; user: string; caption: string; src: string }> = [
  {
    id: "1",
    user: "marti",
    caption: "Una pausa de calma ✨",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "2",
    user: "Lukas",
    caption: "La vibra de hoy 🌿",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    id: "3",
    user: "Zoe",
    caption: "Escribir y respirar ☕",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
];

type Reel = (typeof reels)[number];

export default function ReelsScreen() {
  const [activeId, setActiveId] = useState(reels[0]?.id ?? "");
  const listRef = useRef<FlatList<Reel>>(null);

  // Detecta el item realmente visible (>=95%)
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstFull = viewableItems.find((v) => v.isViewable && v.item);
      if (firstFull?.item?.id) setActiveId(String(firstFull.item.id));
    }
  ).current;

  const viewConfig = useMemo(() => ({ itemVisiblePercentThreshold: 95 }), []);

  const keyExtractor = useCallback((item: Reel) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Reel }) => (
      <ReelItem reel={item} isActive={item.id === activeId} />
    ),
    [activeId]
  );

  return (
    <View style={s.container}>
      <FlatList
        ref={listRef}
        data={reels}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        // 🔒 Paging exacto por alto de pantalla
        pagingEnabled
        snapToInterval={PAGE}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        overScrollMode="never"          // Android
        bounces={false}                 // iOS
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: PAGE,
          offset: PAGE * index,
          index,
        })}
        viewabilityConfig={viewConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        // 🧲 Ajuste final por si quedó “entre páginas”
        onMomentumScrollEnd={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          const index = Math.round(y / PAGE);
          const exactOffset = index * PAGE;
          if (Math.abs(y - exactOffset) > 1) {
            listRef.current?.scrollToOffset({ offset: exactOffset, animated: true });
          }
        }}
      />
    </View>
  );
}

function ReelItem({ reel, isActive }: { reel: Reel; isActive: boolean }) {
  const [muted, setMuted] = useState(true);

  const player = useVideoPlayer(reel.src, (p) => {
    p.loop = true;
    p.muted = true; // inicia silenciado
    p.play();
  });

  // Controla play/pausa según visibilidad
  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  // Sincroniza mute con el player
  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  const toggleMute = () => setMuted((m) => !m);

  return (
    <View style={s.reel}>
      <TouchableWithoutFeedback onPress={toggleMute}>
        <View style={s.fill}>
          <VideoView
            style={s.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            contentFit="cover"
          />
        </View>
      </TouchableWithoutFeedback>

      {/* Overlay UI (usuario, caption, acciones) */}
      <View style={s.overlay}>
        <View style={s.info}>
          <Text style={s.user}>@{reel.user}</Text>
          <Text style={s.caption}>{reel.caption}</Text>
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

      {/* Indicador de mute (tap para alternar) */}
      <View style={s.muteBadge}>
        <Ionicons name={muted ? "volume-mute" : "volume-high"} size={18} color="#fff" />
        <Text style={s.muteText}>{muted ? "Mute" : "Sound"}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  reel: { width, height: PAGE, backgroundColor: "#000" },
  fill: { width: "100%", height: "100%" },
  video: { width: "100%", height: "100%" },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 90, // deja espacio si tienes tabbar
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

  muteBadge: {
    position: "absolute",
    top: 20,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  muteText: { color: "#fff", fontSize: 12 },

  // (si luego agregas una tabbar flotante)
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
});
