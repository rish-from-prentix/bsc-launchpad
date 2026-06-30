import { cn } from "@/lib/utils";
import { useMessageCenter } from "./message-center";

const MONO = "";

type Popup = {
  icon: string;
  title: string;
  av: string;
  avc: "km" | "pn" | "aj";
  nm: string;
  ro: string;
  msg: string;
};

const AVATAR_CLS: Record<string, string> = {
  km: "bg-[#1a2a1a] text-[#52c47a] border-[#52c47a]",
  pn: "bg-[#1a1a2a] text-[#5299e0] border-[#5299e0]",
  aj: "bg-[#2a1a1a] text-[#e05252] border-[#e05252]",
  sr: "bg-[#1a1a2a] text-[#e0b752] border-[#e0b752]",
  sm: "bg-[#1a1a2a] text-[#e0b752] border-[#e0b752]",
  da: "bg-[#2a1a1a] text-[#e05252] border-[#e05252]",
};

export function ArchRightPanel() {
  const { archive, unread, open } = useMessageCenter();

  return (
    <>
      <aside
        className={cn(
          "w-[230px] shrink-0 border-l border-[#1d2a5a] bg-[#0f1a3e] p-[10px] overflow-y-auto",
          "hidden lg:block",
        )}
      >
        <Section label={`Messages${archive.length ? ` (${archive.length})` : ""}`}>
          {archive.length === 0 ? (
            <div className="text-[10.5px] text-[#5a6a92] italic leading-[1.5] px-1 py-2">
              Stakeholder messages will land here as they arrive.
            </div>
          ) : (
            archive
              .slice()
              .reverse()
              .map((m) => (
                <NoteItem
                  key={m.id}
                  unread={unread.has(m.id)}
                  onClick={() => open(m.id)}
                  from={`${m.name.toUpperCase()}${
                    m.role ? " · " + m.role.split(",")[0].split("·")[0].trim().slice(0, 14) : ""
                  }`}
                  time={m.timestamp.split("·")[0].trim()}
                  body={m.preview}
                />
              ))
          )}
        </Section>

        <Section label="Deadlines">
          <Dl k="W1" title="Brief + Site Analysis" body="Decode brief, 5-layer site board" />
          <Dl k="W2" title="Design" body="Programme + concept direction" />
          <Dl k="W3" title="Develop" body="Floor plan + cost + sustainability" />
          <Dl k="W4" title="Coordinate + Audit" body="MEP · RFI · Pre-construction check" />
          <Dl k="+12" title="Planning Submission" body="Hard deadline · PMC" danger />
        </Section>

        <Section label="Project Data">
          <div className={cn("text-[10.5px] leading-[2.1]", MONO, "text-[#94a3c4]")}>
            <div>Site: <span className="text-[#e6ecff]">Survey 147, Aundh</span></div>
            <div>GFA: <span className="text-[#e6ecff]">12–15,000 sq.ft.</span></div>
            <div>Budget: <span className="text-[#e6ecff]">INR 8.1 crore</span></div>
            <div>Soil: <span className="text-[#e0b752]">Black cotton, raft fdn</span></div>
            <div>Trees: <span className="text-[#52c47a]">3× neem (TPO)</span></div>
            <div>Noise: <span className="text-[#e05252]">DP Rd 68–72 dB</span></div>
          </div>
        </Section>
      </aside>
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className={cn("text-[9px] uppercase tracking-[0.12em] text-[#3a4670] mb-2", MONO)}>
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
        "relative w-full text-left bg-[#152149] border border-[#1d2a5a] rounded-[5px] px-[10px] py-[8px] mb-[5px] text-[11px] text-[#94a3c4] leading-[1.5] hover:border-[#2a3a72] transition",
        unread && "pl-[16px]",
      )}
    >
      {unread && (
        <span className="absolute left-[5px] top-1/2 -translate-y-1/2 h-[5px] w-[5px] rounded-full bg-primary" />
      )}
      <div className={cn("text-[9px] text-primary mb-0.5 flex justify-between", MONO)}>
        <span>{from}</span>
        <span className="text-[#3a4670]">{time}</span>
      </div>
      <div>{body}</div>
    </button>
  );
}

function Dl({ k, title, body, danger }: { k: string; title: string; body: string; danger?: boolean }) {
  return (
    <div className="flex items-center gap-[6px] py-[5px] border-b border-[#1d2a5a] last:border-b-0">
      <div className={cn("text-[15px] font-bold w-6 shrink-0 leading-none text-primary", MONO)}>{k}</div>
      <div className="text-[11px] text-[#94a3c4] leading-[1.4]">
        <strong className={cn("block text-[11.5px]", danger ? "text-[#e05252]" : "text-[#e6ecff]")}>
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
      <div className="bg-[#0f1a3e] border border-[#2a3a72] rounded-[10px] w-[440px] max-w-[95vw] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="flex items-center px-3 py-[10px] bg-[#0b1336] border-b border-[#1d2a5a] gap-[7px]">
          <span className="text-[14px]">{popup.icon}</span>
          <span className={cn("text-[11.5px] text-[#e6ecff] font-medium", MONO)}>{popup.title}</span>
          <button
            onClick={onClose}
            className="ml-auto w-[18px] h-[18px] rounded-full bg-[#1c2b5e] text-[#94a3c4] hover:bg-[#e05252] hover:text-white flex items-center justify-center text-[10px] transition"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3 pb-[10px] border-b border-[#1d2a5a]">
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
              <div className="text-[12px] font-semibold text-[#e6ecff]">{popup.nm}</div>
              <div className={cn("text-[10px] text-[#94a3c4]", MONO)}>{popup.ro}</div>
            </div>
          </div>
          <div
            className="text-[12px] text-[#94a3c4] leading-[1.7] [&_strong]:text-[#e6ecff]"
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
                "inline-flex items-center gap-1 rounded-[4px] border border-[#2a3a72] text-[#94a3c4] px-[15px] py-[7px] text-[11.5px] font-medium hover:border-primary/40 hover:text-primary",
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
