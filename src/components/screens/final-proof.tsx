import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, ExternalLink, Linkedin } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BrandMark } from "@/components/brand-mark";
import type { MonthData } from "@/lib/simulation";
import {
  SKILLS,
  buildPost,
  buildResumeLine,
  ebitdaInCr,
  getPerformanceTier,
  selectPostVariant,
} from "./final-shared";

const LINKEDIN_SHARE_URL =
  "https://www.linkedin.com/sharing/share-offsite/?url=https://prentix.ai";

export function FinalProof({
  name,
  months,
  postVariantSeed,
}: {
  name: string;
  months: MonthData[];
  postVariantSeed: number;
}) {
  const totalProfit = months
    .filter((m) => m && m.month >= 1)
    .reduce((s, m) => s + (m.totalProfit ?? 0), 0);
  const tier = getPerformanceTier(totalProfit);
  const ebitdaCr = ebitdaInCr(totalProfit);
  const variant = selectPostVariant(tier, postVariantSeed);
  const postText = buildPost(variant, ebitdaCr);
  const resumeLine = buildResumeLine(ebitdaCr);
  const certName = name?.trim() || "Participant";

  // --- Certificate (ported from previous final-results.tsx) ---------------
  const certificateRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const id = "inter-bold-font-link";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap";
    document.head.appendChild(link);
  }, []);

  const nameFontSize =
    certName.length > 18 ? Math.max(36, 64 - (certName.length - 18) * 2) : 64;

  async function downloadCertificate() {
    if (!certificateRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1200, 850],
      });
      pdf.addImage(imgData, "PNG", 0, 0, 1200, 850);
      pdf.save(`BSC-Internship-Certificate-${certName}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  function shareCertOnLinkedIn() {
    window.open(LINKEDIN_SHARE_URL, "_blank", "noopener,noreferrer");
  }

  const CertificateNode = ({ scale = 1 }: { scale?: number }) => (
    <div
      style={{
        width: 1200,
        height: 850,
        position: "relative",
        backgroundImage: "url(/assets/certificate-template.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 195,
          top: 310,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: `${nameFontSize}px`,
          color: "#0A1628",
          lineHeight: 1,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}
      >
        {certName}
      </div>
    </div>
  );

  // --- Skills copy state ---------------------------------------------------
  const [copiedSkill, setCopiedSkill] = useState<string | null>(null);
  function copySkill(skill: string) {
    navigator.clipboard.writeText(skill).then(() => {
      setCopiedSkill(skill);
      window.setTimeout(() => {
        setCopiedSkill((c) => (c === skill ? null : c));
      }, 1500);
    });
  }

  // --- Resume line copy ----------------------------------------------------
  const [resumeCopied, setResumeCopied] = useState(false);
  function copyResume() {
    navigator.clipboard.writeText(resumeLine).then(() => {
      setResumeCopied(true);
      window.setTimeout(() => setResumeCopied(false), 2000);
    });
  }

  // --- Post copy + share ---------------------------------------------------
  const [postCopied, setPostCopied] = useState(false);
  function copyPost() {
    navigator.clipboard.writeText(postText).then(() => {
      setPostCopied(true);
      window.setTimeout(() => setPostCopied(false), 2000);
    });
  }
  function postToLinkedIn() {
    window.open(LINKEDIN_SHARE_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="mx-auto max-w-[720px] px-5 sm:px-8 py-12 sm:py-16 space-y-16"
      style={{ animation: "fadeSlide 250ms ease-out" }}
    >
      {/* SECTION 1 — Certificate */}
      <section>
        <div className="flex justify-center">
          <div
            style={{
              width: 600,
              height: 425,
              maxWidth: "100%",
              overflow: "hidden",
              borderRadius: 8,
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            }}
            className="border border-primary/40"
          >
            <CertificateNode scale={0.5} />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={downloadCertificate}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition justify-center disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Generating PDF…" : "Download Certificate (PDF) →"}
          </button>
          <button
            onClick={shareCertOnLinkedIn}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-6 py-3 text-sm font-medium text-foreground hover:bg-card transition justify-center"
          >
            Share on LinkedIn →
          </button>
        </div>

        <p className="mt-4 text-center text-[12px] text-muted-foreground">
          This certificate is verifiable. Each one carries a unique engagement code.
        </p>
      </section>

      {/* SECTION 2 — Skills */}
      <section>
        <div className="text-center text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Skills you can add to your resume and LinkedIn
        </div>
        <p className="mt-4 text-center text-[14px] text-muted-foreground leading-relaxed">
          You didn't just complete a simulation. You practiced skills that take most people
          years of on-the-job experience to develop. Add these.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {SKILLS.map((skill) => {
            const isCopied = copiedSkill === skill;
            return (
              <button
                key={skill}
                onClick={() => copySkill(skill)}
                className="group relative inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card px-3.5 py-1.5 text-[12px] text-foreground hover:bg-primary/10 transition cursor-pointer"
              >
                <span>{skill}</span>
                {isCopied ? (
                  <Check className="h-3 w-3 text-[color:var(--success)]" />
                ) : (
                  <Copy className="h-3 w-3 opacity-0 group-hover:opacity-60 transition" />
                )}
                {isCopied && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground/90 px-2 py-0.5 text-[10px] font-medium text-background whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-center text-[13px] text-muted-foreground">
          Click any skill to copy it. Add it directly to your LinkedIn Skills section or resume.
        </p>
      </section>

      {/* SECTION 3 — Resume line */}
      <section>
        <div className="text-center text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Your resume line
        </div>
        <p className="mt-4 text-center text-[14px] text-muted-foreground leading-relaxed">
          Copy this directly into your resume under Experience or Projects.
        </p>

        <div className="mt-6 rounded-lg bg-card border-l-2 border-primary p-5">
          <pre className="font-mono text-[13px] text-foreground/90 leading-relaxed whitespace-pre-wrap select-text m-0">
{resumeLine}
          </pre>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={copyResume}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-5 py-2.5 text-sm font-medium hover:bg-card transition"
          >
            {resumeCopied ? (
              <>
                <Check className="h-4 w-4 text-[color:var(--success)]" />
                <span className="text-[color:var(--success)]">Copied ✓</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Resume Line</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* SECTION 4 — LinkedIn post */}
      <section>
        <div className="text-center text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Your LinkedIn post
        </div>
        <p className="mt-4 text-center text-[14px] text-muted-foreground leading-relaxed">
          Ready to post. Written to sound like you, not like AI. Personalised to your run.
        </p>

        <div className="mt-6 rounded-xl overflow-hidden border border-white/5" style={{ backgroundColor: "#1C1C1C" }}>
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-neutral-700 text-white flex items-center justify-center text-sm font-semibold">
              {(name || "Y").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold text-neutral-100 truncate">
                {name || "Your Name"}
              </div>
              <div className="text-[11px] text-neutral-400">
                Growth & Business Ops Intern
              </div>
            </div>
            <Linkedin className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="p-4 text-[13.5px] leading-[1.65] text-neutral-100 whitespace-pre-wrap">
            {postText}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={copyPost}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-5 py-3 text-sm font-medium hover:bg-card transition justify-center"
          >
            {postCopied ? (
              <>
                <Check className="h-4 w-4 text-[color:var(--success)]" />
                <span className="text-[color:var(--success)]">Copied ✓</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Post</span>
              </>
            )}
          </button>
          <button
            onClick={postToLinkedIn}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition justify-center"
          >
            Post to LinkedIn <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-center text-[13px] text-muted-foreground">
          LinkedIn will open with a share dialog. Paste your copied post text and attach your
          downloaded certificate as an image for maximum visibility.
        </p>
      </section>

      {/* SECTION 5 — Footer close */}
      <section className="flex flex-col items-center gap-3 pt-4">
        <BrandMark brand="prentix" height={20} />
        <p className="text-center text-[14px] text-muted-foreground">
          An internship experience by Prentix. Built with Bombay Shaving Company.
        </p>
        <a
          href="https://prentix.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-primary hover:underline"
        >
          Explore more internships at prentix.ai →
        </a>
      </section>

      {/* Hidden full-size certificate capture node */}
      <div
        style={{
          position: "fixed",
          left: -10000,
          top: 0,
          pointerEvents: "none",
          opacity: 1,
        }}
        aria-hidden="true"
      >
        <div ref={certificateRef}>
          <CertificateNode />
        </div>
      </div>
    </div>
  );
}