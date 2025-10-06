// app/(main)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function LayoutMain() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#3B2357",
        tabBarInactiveTintColor: "#7A6C8F",
        tabBarStyle: {
          height: 70,
          backgroundColor: "#FFFFFF",
          borderTopColor: "#EFEAF7",
          borderTopWidth: 0.5,
          paddingTop: 6,
          paddingBottom: Platform.OS === "ios" ? 18 : 12,
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      {/* SEARCH (usa este si tienes app/(main)/search.tsx) */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={24} color={color} />
          ),
        }}
      />

      {/* NEW POST – botón central (pastilla rosa) */}
      <Tabs.Screen
        name="new-post"
        options={{
          tabBarIcon: () => (
            <View style={styles.newPostButton}>
              <Ionicons name="add" size={26} color="#FFFFFF" />
            </View>
          ),
        }}
      />

      {/* REELS / EXPLORAR */}
      <Tabs.Screen
        name="reels"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="sparkles-outline" size={24} color={color} />
          ),
        }}
      />

      {/* MENSAJES */}
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* PERFIL (carpeta app/(main)/profile) */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  newPostButton: {
    width: 72,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FF9EB3",
    alignItems: "center",
    justifyContent: "center",
    // ligera sombra bonita
    elevation: 4,
    shadowColor: "#FF9EB3",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
});
