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
        "relative w-full text-left rounded-[5px] px-[10px] py-[8px] mb-[5px] text-[11px] leading-[1.5] border transition",
        unread
          ? "bg-[#13265a] border-l-[3px] border-l-primary border-y-[#2a3a72] border-r-[#2a3a72] text-[#e6ecff]"
          : "bg-[#152149] border-[#1d2a5a] text-[#94a3c4] hover:border-[#2a3a72]",
      )}
    >
      <div className={cn("text-[9px] text-primary mb-0.5 flex justify-between items-center gap-2", MONO)}>
        <span className="flex items-center gap-[5px]">
          {unread && (
            <span
              aria-label="Unread"
              className="h-[7px] w-[7px] rounded-full border border-primary bg-transparent shrink-0"
            />
          )}
          {from}
        </span>
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
