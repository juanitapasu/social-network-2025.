// contexts/AuthContext.tsx
import type { User } from "@/types/common.type";
import { supabase } from "@/utils/supabase";
import { createContext, useContext, useMemo, useState } from "react";

interface AuthContextProps {
  user: any | null; // puedes mapearlo a tu User si guardas perfil
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: User, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      console.error("Supabase login error:", error?.message);
      return false;
    }
    setUser(data.user);
    return true;
  };

  const register = async (u: User, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email: u.email, password });
    if (error) {
      console.error("Supabase register error:", error.message);
      return false;
    }
    // OJO: si confirmación de email está activa, el user aparece como "unconfirmed"
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
