// contexts/AuthContext.tsx
import { supabase } from "@/utils/supabase";
import React, { createContext, useEffect, useState } from "react";

/** Perfil extendido que usa tu app (puede tener más campos que la tabla hoy). */
export interface AppUser {
  id: string;
  email: string;
  name?: string;
  username?: string;

  bio?: string;
  website?: string;   // ← aún no existe en DB
  location?: string;  // ← aún no existe en DB
  phone?: string;     // ← aún no existe en DB
  avatar_url?: string;

  followers_count?: number;
  following_count?: number;

  created_at?: string;
  updated_at?: string;
}

interface AuthContextProps {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: AppUser, password: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<AppUser>) => Promise<boolean>;
}

export const AuthContext = createContext({} as AuthContextProps);

/** ⚠️ Columnas que EXISTEN hoy en tu tabla `profiles`.
 *  Si más adelante agregas website/location/phone, añádelas aquí.
 */
const PROFILE_ALLOWED: (keyof AppUser)[] = [
  "email",
  "name",
  "username",
  "bio",
  "avatar_url",
  "followers_count",
  "following_count",
  
];



function buildPayload<T extends object>(
  data: Partial<T>,
  allowed: (keyof T)[]
) {
  return Object.fromEntries(
    Object.entries(data).filter(([k, v]) => allowed.includes(k as keyof T) && v !== undefined)
  );
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    console.log({ user });
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Login error:", error.message);
        return false;
      }

      if (data.user) {
        // Traer el perfil completo desde `profiles`
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profileData) {
          console.error("Profile fetch error:", profileError?.message);
          // Fallback a datos básicos del auth
          setUser({
            id: data.user.id,
            email: data.user.email!,
            name: (data.user.user_metadata as any)?.name || data.user.email!.split("@")[0],
            username: (data.user.user_metadata as any)?.username || data.user.email!.split("@")[0],
          } as AppUser);
        } else {
          setUser(profileData as AppUser);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const register = async (newUser: AppUser, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password,
      });

      if (error) {
        console.error("Registration error:", error.message);
        throw new Error(error.message);
      }

      if (data.user) {
        // Solo insertar columnas existentes en la tabla
        const payload = {
          id: data.user.id,
          ...buildPayload<AppUser>(
            {
              email: newUser.email,
              name: newUser.name,
              username: newUser.username,
              bio: newUser.bio,
              avatar_url: newUser.avatar_url,
              followers_count: newUser.followers_count,
              following_count: newUser.following_count,
              // website/location/phone se omiten hasta que existan en DB
            },
            PROFILE_ALLOWED
          ),
        };

        const { error: profileError } = await supabase.from("profiles").insert(payload);

        if (profileError) {
          console.error("Profile creation error:", profileError.message);
          throw new Error(`Error creando perfil: ${profileError.message}`);
        }

        setUser({
          email: data.user.email!,
          ...payload,
        } as AppUser);

        return true;
      }

      return false;
    } catch (err) {
      console.error("Registration error:", err);
      return false;
    }
  };

  const updateProfile = async (profileData: Partial<AppUser>) => {
    if (!user?.id) {
      console.error("No user ID available");
      return false;
    }

    try {
      // Filtrar a columnas existentes
      const payload = buildPayload<AppUser>(profileData, PROFILE_ALLOWED);

      const { error } = await supabase
        .from("profiles")
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.error("Update profile error:", error.message);
        throw new Error(error.message);
      }

      setUser((prev) => ({ ...(prev as AppUser), ...payload } as AppUser));
      return true;
    } catch (err) {
      console.error("Update profile error:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
