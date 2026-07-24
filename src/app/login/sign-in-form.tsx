"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(undefined);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
      setStatus("Check your inbox for a secure sign-in link.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "We could not send the sign-in link.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="sign-in-form" onSubmit={onSubmit}>
      <label htmlFor="email">Email address</label>
      <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <button type="submit" className="button" disabled={submitting}>{submitting ? "Sending…" : "Email me a sign-in link"}</button>
      {status ? <p className="form-status" role="status">{status}</p> : null}
    </form>
  );
}
