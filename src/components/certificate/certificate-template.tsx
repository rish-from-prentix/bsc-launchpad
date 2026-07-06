import { useEffect, useMemo, useRef, useState } from "react";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import prentixLogo from "@/assets/prentix-logo.png";

export type CertificateTemplateProps = {
  recipientName: string;
  /** Partner company logo URL. If omitted, `companyName` is rendered as a text mark. */
  companyLogoUrl?: string;
  /** Partner company name (used as image alt and as text fallback when no logo). */
  companyName?: string;
  internshipName: string;
  /** ISO string, Date, or any parseable value. Defaults to today. */
  completionDate?: string | Date;
  /** Full paragraph text. If omitted, built from descriptionParts. */
  descriptionParagraph?: string;
  /** Optional deterministic seed for verification codes. */
  verificationSeed?: string;
  /** Optional filename prefix for download. */
  downloadFileName?: string;
};

// ---------- helpers ----------

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDate(d: Date) {
  const month = d.toLocaleString("en-US", { month: "long" });
  return `${ordinal(d.getDate())} ${month}, ${d.getFullYear()}`;
}

function monthYear(d: Date) {
  const month = d.toLocaleString("en-US", { month: "long" });
  return `${month} ${d.getFullYear()}`;
}

function toDate(v?: string | Date) {
  if (!v) return new Date();
  if (v instanceof Date) return v;
  const d = new Date(v);
  return isNaN(d.getTime()) ? new Date() : d;
}

function randCode(len: number, seed?: string, salt = "") {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  if (!seed) {
    let out = "";
    for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
    return out;
  }
  // deterministic pseudo-random from seed+salt
  let h = 2166136261;
  const s = seed + "|" + salt;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let out = "";
  for (let i = 0; i < len; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    out += alphabet[Math.abs(h) % alphabet.length];
  }
  return out;
}

// ---------- component ----------

export function CertificateTemplate(props: CertificateTemplateProps) {
  const {
    recipientName,
    companyLogoUrl,
    companyName,
    internshipName,
    completionDate,
    descriptionParagraph,
    verificationSeed,
    downloadFileName,
  } = props;

  const date = toDate(completionDate);
  const dateLabel = formatDate(date);
  const my = monthYear(date);

  const paragraph =
    descriptionParagraph?.replace("{monthYear}", my) ??
    `During ${my}, the participant engaged with the core problems of this internship, demonstrating the ability to make data-informed decisions under uncertainty. The experience involved navigating trade-offs in a dynamic business environment.`;

  const codes = useMemo(() => {
    const seed = verificationSeed ?? `${recipientName}|${internshipName}|${date.toISOString().slice(0, 10)}`;
    return {
      engagement: randCode(20, verificationSeed ? seed : undefined, "engagement"),
      user: randCode(16, verificationSeed ? seed : undefined, "user"),
    };
    // regenerate only if identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientName, internshipName, verificationSeed, date.toDateString()]);

  // Load fonts for name + signature
  useEffect(() => {
    const id = "prentix-cert-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Great+Vibes&display=swap";
    document.head.appendChild(link);
  }, []);

  const nodeRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState<null | "png" | "pdf">(null);

  const nameFontSize = recipientName.length > 18 ? Math.max(34, 56 - (recipientName.length - 18) * 1.8) : 56;

  async function renderCanvas() {
    if (!nodeRef.current) return null;
    return await html2canvas(nodeRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
    });
  }

  const safeName = (recipientName || "Participant").replace(/[^\w-]+/g, "_");
  const baseName = downloadFileName || `Prentix-Certificate-${safeName}`;

  async function downloadPng() {
    if (downloading) return;
    setDownloading("png");
    try {
      const canvas = await renderCanvas();
      if (!canvas) return;
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}.png`;
      a.click();
    } finally {
      setDownloading(null);
    }
  }

  async function downloadPdf() {
    if (downloading) return;
    setDownloading("pdf");
    try {
      const canvas = await renderCanvas();
      if (!canvas) return;
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1200, 850] });
      pdf.addImage(img, "PNG", 0, 0, 1200, 850);
      pdf.save(`${baseName}.pdf`);
    } finally {
      setDownloading(null);
    }
  }

  // ---------- visual (fixed 1200x850) ----------

  const Certificate = () => (
    <div
      style={{
        width: 1200,
        height: 850,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0A1628",
        fontFamily: "'Inter', sans-serif",
        color: "#0A1628",
      }}
    >
      {/* Diagonal blue stripe pattern — top-left cluster */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(135deg, transparent 0 40px, rgba(59,130,246,0.35) 40px 62px, transparent 62px 120px, rgba(37,99,235,0.55) 120px 148px, transparent 148px 240px)",
          maskImage:
            "radial-gradient(ellipse 60% 55% at 100% 0%, black 30%, transparent 70%), radial-gradient(ellipse 60% 55% at 0% 100%, black 30%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 55% at 100% 0%, black 30%, transparent 70%), radial-gradient(ellipse 60% 55% at 0% 100%, black 30%, transparent 70%)",
          maskComposite: "add",
          WebkitMaskComposite: "source-over",
        }}
      />

      {/* White card */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 60,
          right: 70,
          bottom: 60,
          backgroundColor: "#FFFFFF",
          borderRadius: 2,
          padding: "70px 80px",
          boxSizing: "border-box",
        }}
      >
        {/* Company logo top-left (image or text fallback) */}
        {companyLogoUrl ? (
          <img
            src={companyLogoUrl}
            alt={companyName ?? ""}
            crossOrigin="anonymous"
            style={{
              position: "absolute",
              left: 80,
              top: 60,
              maxWidth: 260,
              maxHeight: 130,
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              left: 80,
              top: 60,
              maxWidth: 320,
              fontWeight: 900,
              fontSize: 32,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "#0A1628",
              textTransform: "uppercase",
            }}
          >
            {companyName ?? ""}
          </div>
        )}

        {/* Body content */}
        <div style={{ position: "absolute", left: 80, top: 260, right: 80 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: nameFontSize,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#0A1628",
              marginBottom: 12,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {recipientName || "Participant"}
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 40,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#0A1628",
              marginBottom: 22,
            }}
          >
            {internshipName}
          </div>
          <div style={{ fontWeight: 700, fontSize: 26, color: "#0A1628" }}>
            Certificate of Completion
          </div>
          <div style={{ fontWeight: 700, fontSize: 24, color: "#0A1628", marginTop: 4 }}>
            {dateLabel}
          </div>

          <p
            style={{
              marginTop: 60,
              fontSize: 13,
              lineHeight: 1.55,
              color: "#0A1628",
              maxWidth: 900,
            }}
          >
            {paragraph}
          </p>

          <div style={{ marginTop: 24, fontSize: 12, color: "#0A1628" }}>
            Engagement Verification Code: {codes.engagement}
            <span style={{ margin: "0 10px", color: "#94A3B8" }}>|</span>
            User Verification Code: {codes.user}
          </div>
        </div>

        {/* Signature block bottom-right */}
        <div
          style={{
            position: "absolute",
            right: 80,
            bottom: 60,
            textAlign: "right",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 18, color: "#0A1628" }}>Rishik Reddy</div>
          <div style={{ fontSize: 13, color: "#0A1628" }}>Founder, Prentix</div>
        </div>
      </div>

      {/* Prentix ribbon badge top-right */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 110,
          width: 260,
          height: 220,
          backgroundColor: "#0A0A0A",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
          padding: "36px 24px 0",
          boxSizing: "border-box",
          textAlign: "center",
          color: "#FFFFFF",
        }}
      >
        <img
          src={prentixLogo}
          alt=""
          crossOrigin="anonymous"
          style={{ height: 44, objectFit: "contain", display: "inline-block" }}
        />
        <div style={{ marginTop: 26, fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>
          Shaping Early Careers
          <br />
          Across The Globe.
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Scaled preview */}
      <div className="flex justify-center">
        <div
          className="border border-primary/40"
          style={{
            width: 600,
            height: 425,
            maxWidth: "100%",
            overflow: "hidden",
            borderRadius: 8,
            boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ transform: "scale(0.5)", transformOrigin: "top left" }}>
            <Certificate />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={downloadPdf}
          disabled={downloading !== null}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition justify-center disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {downloading === "pdf" ? "Generating PDF…" : "Download PDF"}
        </button>
        <button
          onClick={downloadPng}
          disabled={downloading !== null}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-6 py-3 text-sm font-medium text-foreground hover:bg-card transition justify-center disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {downloading === "png" ? "Generating PNG…" : "Download PNG"}
        </button>
      </div>

      {/* Hidden full-size render node for capture */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", left: -10000, top: 0, pointerEvents: "none", opacity: 1 }}
      >
        <div ref={nodeRef}>
          <Certificate />
        </div>
      </div>
    </div>
  );
}