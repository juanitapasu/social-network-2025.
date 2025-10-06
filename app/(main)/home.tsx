import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const serif = Platform.select({ ios: "Times New Roman", android: "serif" });
const ui = Platform.select({ ios: "System", android: "sans-serif" });

export default function Home() {
  const { width } = useWindowDimensions();
  const pad = width > 900 ? (width - 900) / 2 : 0;

  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={s.scroll}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 94, paddingLeft: pad, paddingRight: pad }}
      >
        {/* ====== HEADER BLOQUE (sticky) ====== */}
        <HeaderBlock />

        {/* ====== FEED ====== */}
        <View style={s.feed}>
          <PostCard
            author="martí"
            time="30 Aug · Edited"
            text="this is my definition of a peaceful life:"
            images={[
              { uri: "https://picsum.photos/seed/peace1/800/600" },
              { uri: "https://picsum.photos/seed/peace2/800/600" },
            ]}
            likes="2,5K"
            comments="262"
            reshares="24"
          />

          <PostCard
            author="ece"
            time="18 Aug"
            text="Sobre descanso digital y volver a sentir el cuerpo."
            images={[{ uri: "https://picsum.photos/seed/rest1/900/700" }]}
            likes="840"
            comments="90"
            reshares="10"
          />

          {/* Nota solo texto (tipo Substack) */}
          <PostCard
            author="pluma.studies"
            time="Yesterday"
            text="Paper nuevo: micro-pausas de 20–60s mejoran precisión sostenida (meta-analysis). Dejo método de 3 pasos para implementarlo en oficina:"
            bullets={[
              "Cada 25 min, pausa de 40s mirando a distancia.",
              "Respiración 4–2–6 por 4 ciclos.",
              "Vuelve con una intención de 1 línea.",
            ]}
            likes="1,1K"
            comments="128"
            reshares="34"
          />

          {/* Hilo largo */}
          <PostCard
            author="maria.reader"
            time="2d"
            text={`Hoy re-ordené mi feed para leer como si fuese un periódico lento: 
— 10 min de novedades
— 20 min de lectura larga
— 5 min de nota personal
Me baja la ansiedad y siento que aprendo de verdad.`}
            likes="560"
            comments="47"
            reshares="9"
          />

          {/* Recomendación/blockquote */}
          <PostCard
            author="quiet.notes"
            time="2d"
            text="Cita que me encantó:"
            quote={{
              title: "Cómo leer despacio",
              source: "Ensayo · 5 min",
              excerpt:
                "Lee a la velocidad de tu pensamiento; deja que el cuerpo marque la cadencia.",
            }}
            likes="410"
            comments="33"
            reshares="7"
          />

          {/* Encuesta simple */}
          <PostCard
            author="mind.lukas"
            time="3d"
            text="¿Cuándo te es más fácil meditar?"
            poll={["Mañana", "Tarde", "Noche"]}
            likes="290"
            comments="62"
            reshares="5"
          />

          {/* Galería 2×1 */}
          <PostCard
            author="zen.garden"
            time="3d"
            text="Esquina tranquila para escribir por la mañana."
            images={[{ uri: "https://picsum.photos/seed/desk/1000/800" }]}
            likes="1,9K"
            comments="300"
            reshares="40"
          />
        </View>
      </ScrollView>

     
      
       
     
    </SafeAreaView>
  );
}

/* ===== Header bloque pegajoso ===== */
function HeaderBlock() {
  return (
    <View style={s.headerBlock}>
      {/* APP BAR */}
      <View style={s.appbar}>
        <TouchableOpacity style={s.iconBtn}>
          <Ionicons name="menu-outline" size={26} color="#3B2357" />
        </TouchableOpacity>

        <Text style={s.title}>Vibely</Text>

        {/* Acciones derechas: Mensajes (con badge) + Perfil */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity style={s.iconBtn} onPress={() => router.push("/(main)/Chats")}>
            <View>
              <Ionicons name="paper-plane-outline" size={24} color="#3B2357" />
              <View style={s.badge}>
                <Text style={s.badgeTxt}>3</Text>
              </View>
            </View>
          </TouchableOpacity>

         
        </View>
      </View>

      {/* TOP TABS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabsWrap}
      >
        {[
          "Home",
          "Following",
          "New Bestsellers",
          "Alternative Medicine",
          "Mindfulness",
          "Neuroscience",
        ].map((t, i) => (
          <TouchableOpacity key={i} style={[s.tab, i === 0 && s.tabActive]}>
            <Text style={[s.tabTxt, i === 0 && s.tabTxtActive]} numberOfLines={1}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* CHIPS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chipsWrap}
      >
        {[
          { label: "Vivir en tu celular…", color: "#EADAF8" },
          { label: "plum pits", color: "#FFE3D9" },
          { label: "unroot your brain", color: "#DFF6F2" },
          { label: "sleep hygiene", color: "#E6F0FF" },
          { label: "reading list", color: "#F7F0FF" },
        ].map((c, i) => (
          <View key={i} style={[s.chip, { backgroundColor: c.color }]}>
            <Text style={s.chipTxt} numberOfLines={1}>
              {c.label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ===== Card de post ===== */
function PostCard({
  author,
  time,
  text,
  images = [],
  likes = "0",
  comments = "0",
  reshares = "0",
  bullets,
  quote,
  poll,
}: {
  author: string;
  time: string;
  text: string;
  images?: ImageSourcePropType[];
  likes?: string;
  comments?: string;
  reshares?: string;
  bullets?: string[];
  quote?: { title: string; source: string; excerpt: string };
  poll?: string[];
}) {
  const twoCols = images.length >= 2;

  return (
    <View style={s.card}>
      {/* header autor */}
      <View style={s.cardHeader}>
        <View style={s.row}>
          <View style={s.avatar} />
          <View>
            <Text style={s.author}>{author}</Text>
            <Text style={s.meta}>{time}</Text>
          </View>
        </View>

        <View style={s.row}>
          <TouchableOpacity style={s.subscribe}>
            <Text style={s.subscribeTxt}>Subscribe</Text>
          </TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={18} color="#8C7FA6" />
        </View>
      </View>

      {/* cuerpo */}
      <Text style={s.body}>{text}</Text>

      {bullets && bullets.length > 0 && (
        <View style={{ marginTop: 8 }}>
          {bullets.map((b, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 4 }}>
              <View style={s.dot} />
              <Text style={s.body}>{b}</Text>
            </View>
          ))}
        </View>
      )}

      {quote && (
        <View style={s.quoteCard}>
          <Text style={s.quoteTitle}>{quote.title}</Text>
          <Text style={s.quoteSource}>{quote.source}</Text>
          <Text style={s.quoteExcerpt}>{quote.excerpt}</Text>
        </View>
      )}

      {poll && poll.length > 0 && (
        <View style={s.pollWrap}>
          {poll.map((opt, i) => (
            <View key={i} style={s.pollOption}>
              <Text style={s.pollTxt}>{opt}</Text>
              <Ionicons name="radio-button-off-outline" size={18} color="#6B4A8E" />
            </View>
          ))}
        </View>
      )}

      {images.length > 0 && (
        <View style={[s.mediaWrap, twoCols && { flexDirection: "row", gap: 8 }]}>
          {images.slice(0, 2).map((src, i) => (
            <View key={i} style={[s.media, twoCols && { flex: 1 }]}>
              <Image source={src} style={{ width: "100%", height: "100%", borderRadius: 10 }} />
            </View>
          ))}
        </View>
      )}

      {/* acciones */}
      <View style={s.actions}>
        <View style={s.actionLeft}>
          <View style={s.actionBtn}>
            <Ionicons name="heart-outline" size={20} color="#3B2357" />
            <Text style={s.actionTxt}>{likes}</Text>
          </View>
          <View style={s.actionBtn}>
            <Ionicons name="chatbubble-outline" size={20} color="#3B2357" />
            <Text style={s.actionTxt}>{comments}</Text>
          </View>
        </View>
        <View style={s.actionRight}>
          <View style={s.actionBtn}>
            <Ionicons name="repeat-outline" size={20} color="#3B2357" />
            <Text style={s.actionTxt}>{reshares}</Text>
          </View>
          <Ionicons name="bookmark-outline" size={20} color="#3B2357" />
          <Ionicons name="share-social-outline" size={20} color="#3B2357" />
        </View>
      </View>
    </View>
  );
}

/* ===== Estilos ===== */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { flex: 1 },

  headerBlock: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EFEAF7",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  appbar: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBtn: { padding: 6 },
  title: { fontFamily: ui, fontSize: 18, fontWeight: "800", color: "#3B2357" },

  // Badge de mensajes y avatar del header
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    backgroundColor: "#FF7AAE",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },
  avatarSm: { width: 26, height: 26, borderRadius: 13, backgroundColor: "#D9D4E8" },

  tabsWrap: { paddingHorizontal: 8, paddingVertical: 8, gap: 8 },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#F6F3FF",
    marginRight: 6,
  },
  tabActive: { backgroundColor: "#EDE7FF" },
  tabTxt: { fontFamily: ui, color: "#6B4A8E", fontSize: 13 },
  tabTxtActive: { color: "#3B2357", fontWeight: "700" },

  chipsWrap: { paddingHorizontal: 8, gap: 8, paddingBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, marginRight: 8 },
  chipTxt: { fontFamily: ui, color: "#3B2357", fontWeight: "700" },

  feed: { maxWidth: 900, alignSelf: "center", width: "100%" },

  card: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EFEAF7",
    backgroundColor: "#FFFFFF",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#D9D4E8" },
  author: { fontFamily: ui, fontWeight: "800", color: "#3B2357" },
  meta: { fontFamily: ui, color: "#8C7FA6", fontSize: 12 },

  subscribe: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#FFF1F6",
    borderWidth: 1,
    borderColor: "#FFD2E1",
    marginRight: 6,
  },
  subscribeTxt: { fontFamily: ui, color: "#C2437B", fontWeight: "700", fontSize: 12 },

  body: { marginTop: 8, fontFamily: serif, fontSize: 16, lineHeight: 26, color: "#2F2840" },

  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#C9BEDF", marginTop: 10 },

  quoteCard: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E8E1F5",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  quoteTitle: { fontFamily: serif, fontWeight: "700", color: "#3B2357", fontSize: 16, marginBottom: 2 },
  quoteSource: { fontFamily: ui, color: "#8C7FA6", fontSize: 12, marginBottom: 6 },
  quoteExcerpt: { fontFamily: serif, fontSize: 15, lineHeight: 24, color: "#2F2840" },

  pollWrap: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E8E1F5",
    borderRadius: 12,
    padding: 8,
    gap: 6,
  },
  pollOption: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FAF8FF",
    borderWidth: 1,
    borderColor: "#EEE7FA",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pollTxt: { fontFamily: ui, color: "#3B2357", fontWeight: "700" },

  mediaWrap: { marginTop: 10 },
  media: { width: "100%", aspectRatio: 1.3, borderRadius: 10, overflow: "hidden" },

  actions: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionLeft: { flexDirection: "row", gap: 18, alignItems: "center" },
  actionBtn: { flexDirection: "row", gap: 6, alignItems: "center" },
  actionTxt: { fontFamily: ui, color: "#3B2357", fontSize: 12 },
  actionRight: { flexDirection: "row", gap: 16, alignItems: "center" },

  /* Bottom bar */
  tabbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.5,
    borderTopColor: "#EFEAF7",
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