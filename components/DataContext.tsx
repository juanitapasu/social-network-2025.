// src/contexts/DataContext.tsx
import type { User } from "@/types/common.type";
import { supabase } from "@/utils/supabase";
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import { AuthContext } from "../contexts/AuthContext";

type Chat = {
  id: string;
  user_id_1: string;
  user_id_2: string;
  created_at: string;
  updated_at: string;
};

interface DataContextProps {
  getUsers: () => Promise<User[]>;
  getChats: () => Promise<Chat[]>;
  chats: Chat[];
}

export const DataContext = createContext<DataContextProps>({
  getUsers: async () => [],
  getChats: async () => [],
  chats: [],
});

export function DataProvider({ children }: PropsWithChildren) {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState<Chat[]>([]);

  // Carga/actualiza los chats cuando cambie el usuario
  useEffect(() => {
    if (user?.id) void getChats();
    else setChats([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  /** Lista de usuarios (puedes filtrar el propio) */
  const getUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    // opcional: excluye al usuario actual
    return (user?.id ? data.filter((u) => u.id !== user.id) : data) as User[];
  };

  /** Trae los chats donde participa el usuario actual */
  const getChats = async (): Promise<Chat[]> => {
    const uid = user?.id ?? (await supabase.auth.getUser()).data.user?.id;
    if (!uid) return [];

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .or(`user_id_1.eq.${uid},user_id_2.eq.${uid}`)
      .order("updated_at", { ascending: false });

    if (error || !data) {
      setChats([]);
      return [];
    }

    setChats(data as Chat[]);
    return data as Chat[];
  };

  return (
    <DataContext.Provider value={{ getUsers, getChats, chats }}>
      {children}
    </DataContext.Provider>
  );
}

/** Hook de conveniencia */
export const useData = () => useContext(DataContext);
