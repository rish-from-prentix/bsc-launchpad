import { useState } from "react";
import { cn } from "@/lib/utils";

const MONO = "font-['IBM_Plex_Mono',ui-monospace,monospace]";

type Popup = {
  icon: string;
  title: string;
  av: string;
  avc: "km" | "pn" | "aj";
  nm: string;
  ro: string;
  msg: string;
};

const POPUPS: Record<string, Popup> = {
  km: {
    icon: "🎙",
    title: "Voice Note, Kiran Mehta",
    av: "KM",
    avc: "km",
    nm: "Kiran Mehta",
    ro: "Principal Architect, Meridian Architecture Studio",
    msg: "Keep your Week 1 analysis close, <strong>every design decision must trace back to it</strong>. Site data, personas, brief constraints. If you can't cite evidence for a decision, it's not a decision yet.<br/><br/>Don't be afraid to flag gaps. A question at brief stage costs nothing. A missed requirement at planning submission costs everything.",
  },
  pn: {
    icon: "📧",
    title: "Email, Priya Nair, PMC",
    av: "PN",
    avc: "pn",
    nm: "Priya Nair",
    ro: "Deputy Commissioner, Pune Municipal Corporation",
    msg: "Budget is <strong>firm at INR 8.1 crore.</strong> Asha Foundation will operate the café from 8am daily, but they need <strong>independent access confirmed in drawings</strong> before signing the MOU. Planning submission window opens in 3 weeks. The ward councillors want welcoming, not institutional.",
  },
  aj: {
    icon: "💰",
    title: "Message, Arvind Joshi, QS",
    av: "AJ",
    avc: "aj",
    nm: "Arvind Joshi",
    ro: "QS, Bharat Cost Consultants",
    msg: "<strong>Black cotton soil will push substructure to upper rate band (INR 2,400/sq.ft.)</strong>, factor this in early. Nashik removed passive cooling to hit budget. Their energy bills ran 27% over for 5 years. <strong>Do not repeat that trade-off</strong> without explicitly flagging it.",
  },
};

const AVATAR_CLS: Record<string, string> = {
  km: "bg-[#1a2a1a] text-[#52c47a] border-[#52c47a]",
  pn: "bg-[#1a1a2a] text-[#5299e0] border-[#5299e0]",
  aj: "bg-[#2a1a1a] text-[#e05252] border-[#e05252]",
};

export function ArchRightPanel() {
  const [open, setOpen] = useState<Popup | null>(null);

  return (
    <>
      <aside
        className={cn(
          "w-[230px] shrink-0 border-l border-[#2a2a2a] bg-[#161616] p-[10px] overflow-y-auto",
          "hidden lg:block",
        )}
      >
        <Section label="Messages">
          <NoteItem unread onClick={() => setOpen(POPUPS.km)} from="KIRAN MEHTA" time="Now" body="Check your active task brief" />
          <NoteItem unread onClick={() => setOpen(POPUPS.pn)} from="PRIYA NAIR · PMC" time="08:12" body="Budget firm at INR 8.1cr · entrance must face DP Road" />
          <NoteItem onClick={() => setOpen(POPUPS.aj)} from="ARVIND JOSHI · QS" time="09:15" body="Black cotton soil, substructure upper rate" />
        </Section>

        <Section label="Deadlines">
          <Dl k="W1" title="Brief + Site Analysis" body="Decode brief, 5-layer site board" />
          <Dl k="W2" title="Design" body="Programme + concept direction" />
          <Dl k="W3" title="Develop" body="Floor plan + cost + sustainability" />
          <Dl k="W4" title="Coordinate + Audit" body="MEP · RFI · Pre-construction check" />
          <Dl k="+12" title="Planning Submission" body="Hard deadline · PMC" danger />
        </Section>

        <Section label="Project Data">
          <div className={cn("text-[10.5px] leading-[2.1]", MONO, "text-[#7a756c]")}>
            <div>Site: <span className="text-[#e8e4dc]">Survey 147, Aundh</span></div>
            <div>GFA: <span className="text-[#e8e4dc]">12–15,000 sq.ft.</span></div>
            <div>Budget: <span className="text-[#e8e4dc]">INR 8.1 crore</span></div>
            <div>Soil: <span className="text-[#e0b752]">Black cotton, raft fdn</span></div>
            <div>Trees: <span className="text-[#52c47a]">3× neem (TPO)</span></div>
            <div>Noise: <span className="text-[#e05252]">DP Rd 68–72 dB</span></div>
          </div>
        </Section>
      </aside>

      {open && <PopupModal popup={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className={cn("text-[9px] uppercase tracking-[0.12em] text-[#4a4640] mb-2", MONO)}>
        {label}
      </div>
      {children}
    </div>
  );
}

function NoteItem({
  from,
  time,
  body,
  unread,
  onClick,
}: {
  from: string;
  time: string;
  body: string;
  unread?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full text-left bg-[#1e1e1e] border border-[#2a2a2a] rounded-[5px] px-[10px] py-[8px] mb-[5px] text-[11px] text-[#7a756c] leading-[1.5] hover:border-[#333] transition",
        unread && "pl-[16px]",
      )}
    >
      {unread && (
        <span className="absolute left-[5px] top-1/2 -translate-y-1/2 h-[5px] w-[5px] rounded-full bg-primary" />
      )}
      <div className={cn("text-[9px] text-primary mb-0.5 flex justify-between", MONO)}>
        <span>{from}</span>
        <span className="text-[#4a4640]">{time}</span>
      </div>
      <div>{body}</div>
    </button>
  );
}

function Dl({ k, title, body, danger }: { k: string; title: string; body: string; danger?: boolean }) {
  return (
    <div className="flex items-center gap-[6px] py-[5px] border-b border-[#2a2a2a] last:border-b-0">
      <div className={cn("text-[15px] font-bold w-6 shrink-0 leading-none text-primary", MONO)}>{k}</div>
      <div className="text-[11px] text-[#7a756c] leading-[1.4]">
        <strong className={cn("block text-[11.5px]", danger ? "text-[#e05252]" : "text-[#e8e4dc]")}>
          {title}
        </strong>
        {body}
      </div>
    </div>
  );
}

function PopupModal({ popup, onClose }: { popup: Popup; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/65 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#161616] border border-[#333] rounded-[10px] w-[440px] max-w-[95vw] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="flex items-center px-3 py-[10px] bg-[#111] border-b border-[#2a2a2a] gap-[7px]">
          <span className="text-[14px]">{popup.icon}</span>
          <span className={cn("text-[11.5px] text-[#e8e4dc] font-medium", MONO)}>{popup.title}</span>
          <button
            onClick={onClose}
            className="ml-auto w-[18px] h-[18px] rounded-full bg-[#252525] text-[#7a756c] hover:bg-[#e05252] hover:text-white flex items-center justify-center text-[10px] transition"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3 pb-[10px] border-b border-[#2a2a2a]">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold border",
                MONO,
                AVATAR_CLS[popup.avc],
              )}
            >
              {popup.av}
            </div>
            <div>
              <div className="text-[12px] font-semibold text-[#e8e4dc]">{popup.nm}</div>
              <div className={cn("text-[10px] text-[#7a756c]", MONO)}>{popup.ro}</div>
            </div>
          </div>
          <div
            className="text-[12px] text-[#7a756c] leading-[1.7] [&_strong]:text-[#e8e4dc]"
            dangerouslySetInnerHTML={{ __html: popup.msg }}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={onClose}
              className={cn(
                "inline-flex items-center gap-1 rounded-[4px] bg-primary px-[15px] py-[7px] text-[11.5px] font-medium text-black border border-primary hover:brightness-110",
                MONO,
              )}
            >
              Got it
            </button>
            <button
              onClick={onClose}
              className={cn(
                "inline-flex items-center gap-1 rounded-[4px] border border-[#333] text-[#7a756c] px-[15px] py-[7px] text-[11.5px] font-medium hover:border-primary/40 hover:text-primary",
                MONO,
              )}
            >
              Reply later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
