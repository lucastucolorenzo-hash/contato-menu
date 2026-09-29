import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { PUBLIC_CONTACT_URL } from "@/lib/contacts";
import { checkPublicContactPage } from "@/lib/public-contact.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LMA Sites — QR Code" },
      {
        name: "description",
        content:
          "Aponte a câmera do celular para o QR Code e veja os contatos da LMA Sites: WhatsApp, Instagram e e-mail.",
      },
      { property: "og:title", content: "LMA Sites — QR Code" },
      {
        property: "og:description",
        content:
          "Escaneie o QR Code e fale com a LMA Sites: WhatsApp, Instagram e e-mail.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "LMA Sites — QR Code" },
      {
        name: "twitter:description",
        content:
          "Escaneie o QR Code e fale com a LMA Sites: WhatsApp, Instagram e e-mail.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const checkPublicPage = useServerFn(checkPublicContactPage);
  const [qrReady, setQrReady] = useState(false);
  const [shareLabel, setShareLabel] = useState("Compartilhar link");
  const [publicPageAvailable, setPublicPageAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        if (cancelled || !canvasRef.current) return;
        await QRCode.toCanvas(canvasRef.current, PUBLIC_CONTACT_URL, {
          width: 720,
          margin: 2,
          errorCorrectionLevel: "M",
          color: { dark: "#0a0e16", light: "#ffffff" },
        });
        if (!cancelled) setQrReady(true);
      } catch (err) {
        console.error("Failed to generate QR code", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    checkPublicPage()
      .then(({ available }) => {
        if (!cancelled) setPublicPageAvailable(available);
      })
      .catch(() => {
        if (!cancelled) setPublicPageAvailable(false);
      });

    return () => {
      cancelled = true;
    };
  }, [checkPublicPage]);

  const shareContactLink = async () => {
    const shareData: ShareData = {
      title: "LMA Sites — Contatos",
      text: "Veja os contatos da LMA Sites: WhatsApp, Instagram e e-mail.",
      url: PUBLIC_CONTACT_URL,
    };

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(PUBLIC_CONTACT_URL);
        setShareLabel("Link copiado!");
      }
    } catch (err) {
      // Share canceled by the user — nothing to do. Clipboard failures fall back silently.
      if (typeof navigator.share === "function" && err instanceof Error && err.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(PUBLIC_CONTACT_URL);
        setShareLabel("Link copiado!");
      } catch {
        console.error("Failed to share contact link", err);
        setShareLabel("Não foi possível copiar");
      }
    } finally {
      window.setTimeout(() => setShareLabel("Compartilhar link"), 2200);
    }
  };

  const downloadQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "lma-sites-qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="contact-page qr-page">
      <div className="contact-glow" aria-hidden="true" />
      <div className="contact-grid-lines" aria-hidden="true" />

      <div className="qr-card">
        <div className="contact-monogram" aria-hidden="true">
          LMA
        </div>
        <h1 className="contact-name">LMA Sites</h1>

        <div className="qr-frame qr-frame-lg">
          <canvas ref={canvasRef} className="qr-canvas" aria-label="QR Code dos contatos da LMA Sites" />
          {!qrReady && <div className="qr-placeholder">Gerando QR Code…</div>}
        </div>

        <p className="qr-hint">
          Aponte a câmera do celular para o QR Code para ver meus contatos
        </p>

        {publicPageAvailable === false && (
          <p className="qr-publish-warning" role="alert">
            Este QR Code ainda não pode ser aberto em outros celulares. Publique ou atualize o site para liberar a página de contatos.
          </p>
        )}

        <div className="qr-actions">
          <button type="button" className="qr-download" onClick={downloadQr} disabled={!qrReady}>
            Baixar QR Code
          </button>
          <button type="button" className="qr-download qr-share" onClick={shareContactLink}>
            {shareLabel}
          </button>
        </div>
      </div>

      <footer className="contact-footer">© {new Date().getFullYear()} LMA Sites</footer>
    </main>
  );
}
