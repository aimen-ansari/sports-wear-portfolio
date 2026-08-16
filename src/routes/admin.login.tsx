import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabase, isCurrentUserAdmin, isSupabaseConfigured } from "@/lib/supabase";

type LoginSearch = { reason?: string | undefined };

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    reason: typeof search["reason"] === "string" ? search["reason"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Admin Login | RION APPARELS" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot" | "recovery">(() =>
    typeof window !== "undefined" && window.location.hash.includes("type=recovery")
      ? "recovery"
      : "login",
  );
  const [message, setMessage] = useState(
    search.reason === "unauthorized"
      ? "This account is not authorized as a RION APPARELS administrator."
      : "",
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && isAdmin && mode !== "recovery")
      navigate({ to: "/admin/dashboard", replace: true });
  }, [authLoading, isAdmin, mode, navigate]);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const { data } = getSupabase().auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("recovery");
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      if (!isSupabaseConfigured)
        throw new Error("Supabase environment variables are not configured.");
      const supabase = getSupabase();
      if (mode === "forgot") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/admin/login`,
        });
        if (resetError) throw resetError;
        setMessage("If that account exists, a secure password-reset link has been sent.");
      } else if (mode === "recovery") {
        if (password.length < 8) throw new Error("Use at least 8 characters for the new password.");
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw updateError;
        setMessage("Password updated. You can now continue to the dashboard.");
        await refresh();
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        if (!(await isCurrentUserAdmin())) {
          await supabase.auth.signOut();
          throw new Error("This account is not authorized as a RION APPARELS administrator.");
        }
        await refresh();
        navigate({ to: "/admin/dashboard", replace: true });
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-surface lg:grid-cols-[1fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-y-0 right-0 w-1 bg-accent" />
        <img src="/logo.png" alt="RION APPARELS" className="h-16 w-52 object-cover" />
        <div className="relative max-w-md">
          <p className="eyebrow text-white/55">Secure administration</p>
          <h1 className="mt-4 text-4xl leading-tight">
            Manage the RION APPARELS product catalog and customer inquiries.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/60">
            Access is restricted to approved administrative accounts.
          </p>
        </div>
        <p className="text-xs text-white/40">RION APPARELS Admin Portal</p>
      </div>
      <div className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <img
            src="/logo.png"
            alt="RION APPARELS"
            className="mx-auto mb-10 h-16 w-52 object-cover lg:hidden"
          />
          <p className="eyebrow">Admin portal</p>
          <h2 className="mt-3 text-3xl">
            {mode === "forgot"
              ? "Reset password"
              : mode === "recovery"
                ? "Choose a new password"
                : "Welcome back"}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in with your approved admin account."
              : mode === "forgot"
                ? "We will email a secure recovery link."
                : "Enter a new password for your account."}
          </p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            {mode !== "recovery" && (
              <label className="block">
                <span className="eyebrow">Email</span>
                <span className="relative mt-2 block">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="field-base pl-10"
                    autoComplete="email"
                    required
                  />
                </span>
              </label>
            )}
            {mode !== "forgot" && (
              <label className="block">
                <span className="eyebrow">{mode === "recovery" ? "New password" : "Password"}</span>
                <span className="relative mt-2 block">
                  <LockKeyhole className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="field-base px-10"
                    autoComplete={mode === "recovery" ? "new-password" : "current-password"}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>
            )}
            {error && (
              <p
                className="border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
            {message && (
              <p className="border border-accent/30 bg-accent/5 p-3 text-sm" role="status">
                {message}
              </p>
            )}
            <button type="submit" disabled={busy} className="btn-base btn-accent w-full">
              {busy
                ? "Please wait..."
                : mode === "forgot"
                  ? "Send Reset Link"
                  : mode === "recovery"
                    ? "Update Password"
                    : "Login"}
            </button>
          </form>
          {mode !== "recovery" && (
            <button
              type="button"
              onClick={() => {
                setMode(mode === "forgot" ? "login" : "forgot");
                setError("");
                setMessage("");
              }}
              className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {mode === "forgot" && <ArrowLeft className="h-4 w-4" />}
              {mode === "forgot" ? "Back to login" : "Forgot Password?"}
            </button>
          )}
          <a
            href="/"
            className="mt-10 block border-t border-border pt-5 text-xs text-muted-foreground hover:text-foreground"
          >
            Return to RION APPARELS website
          </a>
        </div>
      </div>
    </div>
  );
}
