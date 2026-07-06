// Shared registry that lets each phase register an "in-phase previous"
// handler. If the handler returns true, the parent should NOT decrement
// the phase — the task handled navigation internally.
let handler: (() => boolean) | null = null;

export function registerPhasePrev(h: (() => boolean) | null) {
  handler = h;
  return () => {
    if (handler === h) handler = null;
  };
}

export function invokePhasePrev(): boolean {
  return handler ? !!handler() : false;
}
