## Change

Replace the user-facing word **"assignment"** with **"Challenge"** in the task-handoff context only.

### Edits in `src/components/aic-isb/task-one.tsx`
- Line ~390: `"Receiving assignment from Animesh…"` → `"Receiving challenge from Animesh…"`
- Line ~540: `"Assignment unlocked below"` → `"Challenge unlocked below"`

### Left untouched
- All occurrences in `task-three.tsx` ("Mentor Assignment", "mentor assignments", "Accelerator Mentor Assignment", etc.) — these refer to assigning mentors to startups, where "Challenge" would not make sense.
- Internal code identifiers (`type Assignment`, `assignments` state, `StartupAssignmentBlock`, `revealAssignment`) — not user-visible.

If you also want the mentor-pairing copy rewritten (e.g. "Mentor Matching" instead), let me know and I'll add it.