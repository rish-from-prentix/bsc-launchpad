import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Linkedin, Copy, Check, BadgePlus } from "lucide-react";
import { Confetti } from "./confetti";

const CERT_W = 1920;
const CERT_H = 1361;

const CERT_CAPTION = `I just completed an Architecture Design Internship simulation — from client brief decoding to a final crisis management memo, built around a real-world-style brief: a Community Learning Hub

Over 5 weeks I worked through site analysis, space programming and adjacency, concept direction, schematic floor planning, cost reconciliation against a fixed budget, sustainability trade-offs, MEP coordination, a pre-construction defect audit, and a live design crisis under deadline pressure.

Every decision had to be justified with evidence — not just "it feels right."

Proud to share my certificate of completion. 🎓

#Architecture #ArchitectureStudent #Internship #DesignEducation #BuiltEnvironment`;

function staticCode(seed: string, len: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  let out = "";
  for (let i = 0; i < len; i++) {
    h = (h * 1103515245 + 12345) | 0;
    out += chars[Math.abs(h) % chars.length];
  }
  return out;
}

function CertificateNode({ name, scale = 1 }: { name: string; scale?: number }) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div
      style={{
        width: CERT_W,
        height: CERT_H,
        position: "relative",
        background: "#0A1628",
        overflow: "hidden",
        fontFamily: "'Inter','Helvetica Neue',system-ui,sans-serif",
        color: "#0A1628",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 210,
          background:
            "repeating-linear-gradient(135deg,#0A1628 0 32px,#13315c 32px 64px,#1d4ed8 64px 96px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 210,
          background:
            "repeating-linear-gradient(45deg,#0A1628 0 32px,#13315c 32px 64px,#1d4ed8 64px 96px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "42px 245px",
          background: "#ffffff",
          borderRadius: 14,
          padding: "100px 112px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 40,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  color: "#0A1628",
                  lineHeight: 1,
                }}
              >
                MERIDIAN
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 18,
                  letterSpacing: "0.32em",
                  color: "#5b6b8c",
                  fontWeight: 600,
                }}
              >
                ARCHITECTURE STUDIO
              </div>
              <div
                style={{
                  marginTop: 16,
                  width: 90,
                  height: 4,
                  background: "#1d4ed8",
                }}
              />
            </div>
            <div
              style={{
                background: "#0A1628",
                color: "#fff",
                padding: "32px 46px",
                textAlign: "center",
                minWidth: 320,
                clipPath:
                  "polygon(0 0,100% 0,100% 100%,50% 88%,0 100%)",
              }}
            >
              <div
                style={{ fontWeight: 700, fontSize: 36, letterSpacing: "0.01em" }}
              >
                prent<span style={{ color: "#5dc4fe" }}>i</span>x
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  letterSpacing: "0.04em",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                Shaping Early Careers
                <br />
                Across The Globe.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 60 }}>
            <div
              style={{
                fontSize: 84,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "#0A1628",
              }}
            >
              Virtual Internship: Architecture Design
            </div>
            <div style={{ marginTop: 44, fontSize: 48, fontWeight: 700 }}>
              Certificate of Completion
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 36,
                fontWeight: 600,
                color: "#0A1628",
              }}
            >
              {today}
            </div>
            <div style={{ marginTop: 44, fontSize: 22, color: "#374151" }}>
              Awarded to
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 84,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "#0A1628",
              }}
            >
              {name}
            </div>
            <div
              style={{
                marginTop: 36,
                fontSize: 22,
                lineHeight: 1.55,
                color: "#374151",
                maxWidth: 1280,
              }}
            >
              This certifies that {name} completed the Meridian Architecture
              Studio Virtual Internship by Prentix, working a Community
              Learning Hub project from client brief through site analysis,
              space programming, concept direction, schematic planning, cost
              reconciliation, sustainability and MEP coordination, defect
              audit, and a live design crisis memo, with every decision held
              to evidence-based justification.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 32,
          }}
        >
          <div style={{ fontSize: 18, color: "#4b5563" }}>
            Verification Code: {staticCode(name + "meridian", 18)}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#0A1628" }}>
              Kiran Mehta
            </div>
            <div style={{ fontSize: 20, color: "#4b5563", marginTop: 4 }}>
              Principal Architect, Meridian Architecture Studio
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArchCompletion({ name }: { name: string }) {
  const certName = name?.trim() || "Participant";
  const certificateRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"confetti" | "headline" | "cert">("confetti");
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setStage("headline"), 600);
    const t2 = window.setTimeout(() => setStage("cert"), 2400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const id = "inter-bold-font-link";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  async function downloadCertificate() {
    if (!certificateRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 1,
        useCORS: true,
        backgroundColor: "#0A1628",
        width: CERT_W,
        height: CERT_H,
        windowWidth: CERT_W,
        windowHeight: CERT_H,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [CERT_W, CERT_H],
      });
      pdf.addImage(imgData, "PNG", 0, 0, CERT_W, CERT_H);
      pdf.save(`Meridian-Architecture-Internship-${certName}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  async function shareCertOnLinkedIn() {
    // Download a 1200x627 social share PNG of the certificate, then open LinkedIn share dialog.
    if (certificateRef.current) {
      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 1200 / CERT_W,
          useCORS: true,
          backgroundColor: "#0A1628",
          width: CERT_W,
          height: CERT_H,
          windowWidth: CERT_W,
          windowHeight: CERT_H,
        });
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `Meridian-Architecture-Certificate-${certName}.png`;
        a.click();
      } catch {
        /* noop */
      }
    }
    const shareUrl = typeof window !== "undefined" ? window.location.href : "https://prentix.ai";
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function addToLinkedInProfile() {
    const today = new Date();
    const params = new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: "Virtual Internship: Architecture Design",
      organizationName: "Meridian Architecture Studio (Prentix)",
      issueYear: String(today.getFullYear()),
      issueMonth: String(today.getMonth() + 1),
      certUrl: typeof window !== "undefined" ? window.location.href : "https://prentix.ai",
      certId: staticCode(certName + "meridian", 18),
    });
    window.open(
      `https://www.linkedin.com/profile/add?${params.toString()}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function copyCaption() {
    navigator.clipboard.writeText(CERT_CAPTION).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  }

  const previewScale = 0.3;

  return (
    <div className="mx-auto max-w-[820px] px-5 sm:px-8 py-10 sm:py-16">
      {stage !== "cert" && <Confetti />}
      {stage !== "cert" ? (
        <div className="min-h-[55vh] flex flex-col items-center justify-center text-center">
          <div
            className="text-5xl sm:text-6xl font-semibold tracking-tight text-[#e6ecff]"
            style={{ animation: "fadeSlide 600ms ease-out" }}
          >
            Internship complete
          </div>
          <div className="mt-4 text-sm text-[#94a3c4] uppercase tracking-[0.22em]">
            Meridian Architecture Studio · 11 of 11
          </div>
        </div>
      ) : (
        <div style={{ animation: "fadeSlide 350ms ease-out" }} className="space-y-10">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
              Your certificate
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-[#e6ecff]">
              Congratulations, {certName.split(" ")[0]}.
            </h2>
            <p className="mt-2 text-[13px] text-[#94a3c4]">
              You took a Community Learning Hub from brief to construction defence.
            </p>
          </div>

          <div className="flex justify-center">
            <div
              style={{
                width: CERT_W * previewScale,
                height: CERT_H * previewScale,
                maxWidth: "100%",
                overflow: "hidden",
                borderRadius: 10,
                boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
              }}
              className="border border-primary/40"
            >
              <CertificateNode name={certName} scale={previewScale} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={downloadCertificate}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-black hover:brightness-110 disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              {downloading ? "Generating PDF…" : "Download as PDF"}
            </button>
            <button
              onClick={shareCertOnLinkedIn}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              <Linkedin className="h-4 w-4" /> Share on LinkedIn
            </button>
            <button
              onClick={addToLinkedInProfile}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2a3a72] bg-[#0f1a3e] px-5 py-3 text-sm font-semibold text-[#e6ecff] hover:border-primary/50 hover:text-primary"
            >
              <BadgePlus className="h-4 w-4" /> Add to LinkedIn Profile
            </button>
            <button
              onClick={copyCaption}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2a3a72] bg-[#0f1a3e] px-5 py-3 text-sm font-semibold text-[#94a3c4] hover:text-[#e6ecff]"
            >
              {copied ? <Check className="h-4 w-4 text-[#7ab87a]" /> : <Copy className="h-4 w-4" />}
              {copied ? "Caption copied" : "Copy caption"}
            </button>
          </div>

          <p className="text-center text-[12px] text-[#94a3c4]">
            Share opens LinkedIn with this page link; attach the downloaded PNG and paste the copied caption to publish.
          </p>
        </div>
      )}

      {/* Hidden full-size certificate for capture */}
      <div
        style={{ position: "fixed", left: -100000, top: 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <div ref={certificateRef}>
          <CertificateNode name={certName} />
        </div>
      </div>
    </div>
  );
}