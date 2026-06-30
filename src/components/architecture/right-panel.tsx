import { cn } from "@/lib/utils";
import { useMessageCenter } from "./message-center";

const MONO = "";

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
