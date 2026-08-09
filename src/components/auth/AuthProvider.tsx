import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

type AuthState = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<AuthState, "refresh">>({
    session: null,
    user: null,
    isAdmin: false,
    loading: true,
  });

  const refresh = async () => {
    if (!isSupabaseConfigured) {
      setState({ session: null, user: null, isAdmin: false, loading: false });
      return;
    }
    const supabase = getSupabase();
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      setState({ session: null, user: null, isAdmin: false, loading: false });
      return;
    }
    const { data: isAdmin, error } = await supabase.rpc("is_admin");
    setState({ session, user: session.user, isAdmin: !error && isAdmin === true, loading: false });
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
