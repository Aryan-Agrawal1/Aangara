/**
 * AANGARA Autopilot Engine
 * Deterministic, self-driving product demo tour.
 */
import { useAppStore } from "@/lib/store";

export type AutopilotStatus = "idle" | "running" | "paused" | "stopped";

export interface AutopilotStep {
  id: string;
  label: string;
  action: (ctx: StepContext) => Promise<void>;
}

export interface StepContext {
  signal: AbortSignal;
  navigate: (path: string) => void;
  spotlight: (selector: string | null) => void;
  onStepChange: (index: number) => void;
}

export function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException("Aborted", "AbortError")); return; }
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => { clearTimeout(t); reject(new DOMException("Aborted", "AbortError")); }, { once: true });
  });
}

export function waitForElement(selector: string, signal: AbortSignal, timeout = 12000): Promise<Element> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException("Aborted", "AbortError")); return; }
    const startTime = Date.now();
    const check = () => {
      if (signal.aborted) { reject(new DOMException("Aborted", "AbortError")); return; }
      if (Date.now() - startTime > timeout) { reject(new Error(`Timeout waiting for ${selector}`)); return; }
      const el = document.querySelector(selector);
      if (el) { resolve(el); return; }
      setTimeout(check, 150);
    };
    check();
  });
}

export function waitForLoadingDone(signal: AbortSignal, timeout = 15000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException("Aborted", "AbortError")); return; }
    const startTime = Date.now();
    const check = () => {
      if (signal.aborted) { reject(new DOMException("Aborted", "AbortError")); return; }
      if (Date.now() - startTime > timeout) { resolve(); return; }
      if (document.querySelectorAll(".animate-spin").length === 0) { resolve(); return; }
      setTimeout(check, 250);
    };
    setTimeout(check, 700);
  });
}

export function smoothScrollTo(targetY: number, duration: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    if (Math.abs(diff) < 4) { resolve(); return; }
    const startTime = performance.now();
    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const tick = (now: number) => {
      if (signal.aborted) { resolve(); return; }
      const p = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + diff * ease(p));
      if (p < 1) requestAnimationFrame(tick); else resolve();
    };
    requestAnimationFrame(tick);
  });
}

export async function scrollToSelector(selector: string, signal: AbortSignal, offset = -100): Promise<void> {
  const el = document.querySelector(selector);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  await smoothScrollTo(Math.max(0, window.scrollY + rect.top + offset), 900, signal);
}

export class AutopilotEngine {
  private abortController: AbortController | null = null;
  private isPaused = false;
  private pauseResolve: (() => void) | null = null;

  public onStatusChange: (status: AutopilotStatus) => void = () => {};
  public onStepChange: (index: number, label: string) => void = () => {};
  public onSpotlight: (selector: string | null) => void = () => {};

  private navigate: (path: string) => void = () => {};

  constructor(navigateFn: (path: string) => void) {
    this.navigate = navigateFn;
  }

  async start(steps: AutopilotStep[]) {
    if (this.abortController) { this.stop(); }
    this.abortController = new AbortController();
    this.isPaused = false;
    this.onStatusChange("running");

    const signal = this.abortController.signal;
    const ctx: StepContext = {
      signal,
      navigate: this.navigate,
      spotlight: (sel) => this.onSpotlight(sel),
      onStepChange: (idx) => this.onStepChange(idx, steps[idx]?.label ?? ""),
    };

    try {
      for (let i = 0; i < steps.length; i++) {
        if (signal.aborted) break;
        if (this.isPaused) {
          await new Promise<void>((resolve) => { this.pauseResolve = resolve; });
        }
        if (signal.aborted) break;
        ctx.onStepChange(i);
        try {
          await steps[i].action(ctx);
        } catch (e: any) {
          if (e?.name === "AbortError") break;
          console.warn(`[Autopilot] Step ${i} skipped due to error:`, e?.message);
        }
      }
    } finally {
      this.cleanup();
    }
  }

  pause() { if (!this.isPaused && this.abortController) { this.isPaused = true; this.onStatusChange("paused"); } }
  resume() { if (this.isPaused) { this.isPaused = false; this.onStatusChange("running"); this.pauseResolve?.(); this.pauseResolve = null; } }
  skip() { if (this.isPaused) { this.resume(); } }
  stop() { this.abortController?.abort(); this.pauseResolve?.(); this.pauseResolve = null; this.cleanup(); }

  private cleanup() {
    this.abortController = null;
    this.isPaused = false;
    this.onSpotlight(null);
    this.onStatusChange("idle");
    try { useAppStore.getState().resetScenarioParams(); } catch {}
  }
}
