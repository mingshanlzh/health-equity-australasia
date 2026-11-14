"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

// A password-reset email link signs the user in with "type=recovery" in the
// URL hash. supabase-js clears the hash once it has used it, so check here,
// as the page loads.
let openedFromResetLink =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isMember: boolean; // member OR admin
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isMember: false,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetPending, setResetPending] = useState(false);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
  }, []);

  useEffect(() => {
    if (openedFromResetLink) {
      openedFromResetLink = false;
      setResetPending(true);
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadProfile(data.session?.user?.id).finally(() => setLoading(false));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      loadProfile(s?.user?.id);
      if (event === "PASSWORD_RECOVERY") setResetPending(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  // After a reset link signs the user in, take them to the new-password form.
  useEffect(() => {
    if (resetPending && session) {
      setResetPending(false);
      router.replace("/account/?reset=1");
    }
  }, [resetPending, session, router]);

  const refreshProfile = useCallback(async () => {
    await loadProfile(session?.user?.id);
  }, [loadProfile, session]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const role = profile?.role;
  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        isAdmin: role === "admin",
        isMember: role === "admin" || role === "member",
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
