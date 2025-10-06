import { supabase } from '@/utils/supabase';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface Media {
    id: string
    url: string,
    type: 'image' | 'video' | 'document' | 'audio',
}

interface Message {
    id: string,
    text: string,
    createdAt: Date,
    deteledAt?: Date,
    seenAt?: Date,
    sentAt: Date,
    sentBy: string,
    media?: Media[],
    chatId: string
}

interface Chats {
    id: string,
    message: Message[]
    userId1: string,
    userId2: string
}

export default function Chat() {

    const { id } = useLocalSearchParams();
    const [messages, setMessages] = useState([] as Message[]);

    useEffect(() => {
        // Where -> message.chatId changes
        const channel = supabase
            .channel(id as string) 
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'messages' },
                (payload) => {
                    console.log('Change received!', payload);
                }).subscribe((status, error) => console.log({
                    status, error
                }));
        return () => {
            supabase.removeChannel(channel);
        }

    }, []);

    return (
        <View>
            <Text>chat</Text>
        </View>
    )
}