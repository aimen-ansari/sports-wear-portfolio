import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getSupabase, isCurrentUserAdmin, isSupabaseConfigured } from "@/lib/supabase";

type AuthState = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const refreshRequest = useRef(0);
  const [state, setState] = useState<Omit<AuthState, "refresh">>({
    session: null,
    user: null,
    isAdmin: false,
    loading: true,
  });

  const refresh = async () => {
    const request = ++refreshRequest.current;
    const update = (next: Omit<AuthState, "refresh">) => {
      if (request === refreshRequest.current) setState(next);
    };
    if (!isSupabaseConfigured) {
      update({ session: null, user: null, isAdmin: false, loading: false });
      return;
    }
    const supabase = getSupabase();
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      update({ session: null, user: null, isAdmin: false, loading: false });
      return;
    }
    try {
      const isAdmin = await isCurrentUserAdmin();
      update({ session, user: session.user, isAdmin, loading: false });
    } catch (error) {
      console.error("Admin authorization check failed:", error);
      update({ session, user: session.user, isAdmin: false, loading: false });
    }
  };

  useEffect(() => {
    void refresh();
    if (!isSupabaseConfigured) return;
    const { data } = getSupabase().auth.onAuthStateChange(() => {
      window.setTimeout(() => void refresh(), 0);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ ...state, refresh }}>{children}</AuthContext.Provider>;
}

// The provider and hook intentionally share this small module to keep auth state private.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
