import { Stack } from 'expo-router'
import React from 'react'

export default function LayoutChat() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Chats"
        }}
      />
      <Stack.Screen
        name="chat"
      />
    </Stack>
  )
}