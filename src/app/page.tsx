import Link from "next/link";

const foundations = [
  ["Private by design", "Your league data will be scoped to your account and protected by database policies."],
  ["One league at a time", "Start with a dependable import and dashboard before expanding provider coverage."],
  ["Explainable AI", "Every recommendation will carry its source context, model version, and timestamp."],
];

export default function Home() {
  return (
    <main>
      <nav className="nav" aria-label="Primary navigation">
        <Link href="/" className="wordmark">FantasyAI</Link>
        <Link href="/login" className="button button-quiet">Sign in</Link>
      </nav>
      <section className="hero">
        <p className="eyebrow">SOA.GM foundation</p>
        <h1>Make every roster decision with a clearer signal.</h1>
        <p className="lede">FantasyAI is being rebuilt around secure league imports, a focused dashboard, and transparent recommendations.</p>
        <div className="actions">
          <Link href="/login" className="button">Join the build</Link>
          <a href="#foundation" className="button button-quiet">What is shipping first</a>
        </div>
      </section>
      <section id="foundation" className="cards" aria-label="Product foundations">
        {foundations.map(([title, text]) => (
          <article className="card" key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
