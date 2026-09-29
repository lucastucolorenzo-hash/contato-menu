import { createFileRoute } from "@tanstack/react-router";
import { contacts } from "@/lib/contacts";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "LMA Sites — Contato" },
      {
        name: "description",
        content:
          "Fale com a LMA Sites: WhatsApp, Instagram e e-mail em um só lugar.",
      },
      { property: "og:title", content: "LMA Sites — Contato" },
      {
        property: "og:description",
        content:
          "WhatsApp, Instagram e e-mail da LMA Sites em um só lugar. Fale conosco.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "LMA Sites — Contato" },
      {
        name: "twitter:description",
        content:
          "WhatsApp, Instagram e e-mail da LMA Sites em um só lugar.",
      },
    ],
  }),
  component: Contato,
});

function Contato() {
  return (
    <main className="contact-page">
      <div className="contact-glow" aria-hidden="true" />
      <div className="contact-grid-lines" aria-hidden="true" />

      <div className="contact-card">
        <header className="contact-header">
          <div className="contact-monogram" aria-hidden="true">
            LMA
          </div>
          <div>
            <h1 className="contact-name">LMA Sites</h1>
            <p className="contact-tagline">Sites que vendem — fale com a gente</p>
          </div>
        </header>

        <ul className="contact-list">
          {contacts.map((c) => (
            <li key={c.label}>
              <a
                className="contact-item"
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="contact-item-icon">{c.icon}</span>
                <span className="contact-item-text">
                  <span className="contact-item-label">{c.label}</span>
                  <span className="contact-item-value">{c.value}</span>
                </span>
                <span className="contact-item-arrow" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="contact-footer">© {new Date().getFullYear()} LMA Sites</footer>
    </main>
  );
}
