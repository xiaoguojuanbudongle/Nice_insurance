"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockRegister, mockSignIn } from "@/lib/mock";
import { getCurrentProfile } from "@/lib/queries";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function redirectByRole() {
    const profile = await getCurrentProfile();
    router.replace(profile?.role === "employee" ? "/employee" : "/customer");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    try {
      if (mode === "register") {
        if (!hasSupabaseEnv) {
          await mockRegister(fullName, email, password);
          await redirectByRole();
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        setMessage("Registration submitted. Check email confirmation if Supabase requires it.");
        return;
      }

      if (!hasSupabaseEnv) {
        await mockSignIn(email, password);
        await redirectByRole();
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await redirectByRole();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Insurance portal</p>
          <h1>{mode === "login" ? "Sign in" : "Create customer account"}</h1>
          <p className="muted">
            {mode === "login"
              ? "Use a customer or employee demo account to enter the right workspace."
              : "New public registrations create customer accounts. Employee accounts are seeded by the backend."}
          </p>
        </div>
        <form className="form-stack" onSubmit={onSubmit}>
          {mode === "register" ? (
            <label>
              Full name
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
            </label>
          ) : null}
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {message ? <p className="form-message">{message}</p> : null}
          <button className="primary-button" disabled={pending}>
            {pending ? "Working..." : mode === "login" ? "Sign in" : "Register"}
          </button>
        </form>
        <p className="muted">
          {mode === "login" ? (
            <>
              Need an account? <Link href="/register">Register</Link>
            </>
          ) : (
            <>
              Already registered? <Link href="/login">Sign in</Link>
            </>
          )}
        </p>
        <div className="demo-box">
          <strong>{hasSupabaseEnv ? "Demo accounts" : "Local mock mode"}</strong>
          {!hasSupabaseEnv ? <span>No Supabase env found, so these accounts use browser localStorage.</span> : null}
          <span>customer1@example.com / Password123!</span>
          <span>customer2@example.com / Password123!</span>
          <span>employee1@example.com / Password123!</span>
        </div>
      </section>
    </main>
  );
}
