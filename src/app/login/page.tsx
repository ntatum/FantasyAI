import Link from "next/link";
import { SignInForm } from "./sign-in-form";

export default function LoginPage() {
  return (
    <main className="login-shell">
      <Link href="/" className="wordmark">FantasyAI</Link>
      <section className="login-card" aria-labelledby="sign-in-heading">
        <p className="eyebrow">Early access</p>
        <h1 id="sign-in-heading">Sign in to your league workspace</h1>
        <p>Use a secure email magic link. Provider connections will be added after the authorization baseline is complete.</p>
        <SignInForm />
      </section>
    </main>
  );
}
