import { useState } from "react";
import { Check, Copy, ExternalLink, Linkedin } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { CertificateTemplate } from "@/components/certificate/certificate-template";
import bscLogo from "@/assets/bsc-logo.png";
import type { MonthData } from "@/lib/simulation";
import { SKILLS, buildPost, buildResumeLine, ebitdaInCr, getPerformanceTier, selectPostVariant } from "./final-shared";

export function FinalProof({
  name,
  months,
  postVariantSeed,
}: {
  name: string;
  months: MonthData[];
  postVariantSeed: number;
}) {
  const totalProfit = months.filter((m) => m && m.month >= 1).reduce((s, m) => s + (m.totalProfit ?? 0), 0);
  const tier = getPerformanceTier(totalProfit);
  const ebitdaCr = ebitdaInCr(totalProfit);
  const variant = selectPostVariant(tier, postVariantSeed);
  const postText = buildPost(variant, ebitdaCr);
  const resumeLine = buildResumeLine(ebitdaCr);
  const certName = name?.trim() || "Participant";
  const now = new Date();
  const monthYearLabel = now.toLocaleString("en-US", { month: "long" }) + " " + now.getFullYear();
  const bscDescription =
    `During ${monthYearLabel}, the participant engaged with marketing, inventory, and channel strategy, demonstrating the ability to make data-informed decisions under uncertainty. ` +
    `The experience involved navigating trade-offs across growth, marketing, and inventory in a dynamic business environment.`;

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
  function handleLinkedIn() {
    navigator.clipboard.writeText(postText);
    window.open("https://www.linkedin.com/feed/", "_blank");
  }

  return (
    <div
      className="mx-auto max-w-[720px] px-5 sm:px-8 py-12 sm:py-16 space-y-16"
      style={{ animation: "fadeSlide 250ms ease-out" }}
    >
      {/* SECTION 1, Certificate */}
      <section>
        <CertificateTemplate
          recipientName={certName}
          companyLogoUrl={bscLogo}
          internshipName="Virtual Internship: Growth & Business Ops"
          completionDate={now}
          descriptionParagraph={bscDescription}
          downloadFileName={`BSC-Internship-Certificate-${certName}`}
        />

        <p className="mt-4 text-center text-[12px] text-muted-foreground">
          This certificate is verifiable. Each one carries a unique engagement code.
        </p>
      </section>

      {/* SECTION 4, LinkedIn post */}
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
              <div className="text-[14px] font-semibold text-neutral-100 truncate">{name || "Your Name"}</div>
              <div className="text-[11px] text-neutral-400">Growth & Business Ops Intern</div>
            </div>
            <Linkedin className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="p-4 text-[13.5px] leading-[1.65] text-neutral-100 whitespace-pre-wrap">{postText}</div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLinkedIn}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition justify-center"
          >
            Open LinkedIn <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-center text-[13px] text-muted-foreground">
          Your post is copied to clipboard. Open LinkedIn, start a new post, and paste.
        </p>
      </section>

      {/* SECTION 3, Resume line */}
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

      {/* SECTION 4, Skills */}
      <section>
        <div className="text-center text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Skills you can add to your resume and LinkedIn
        </div>
        <p className="mt-4 text-center text-[14px] text-muted-foreground leading-relaxed">
          You didn't just complete a simulation. You practiced skills that take most people years of on-the-job
          experience to develop. Add these.
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

      {/* SECTION 5, Footer close */}
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
    </div>
  );
}
