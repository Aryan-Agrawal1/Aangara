/**
 * AANGARA Autopilot — 31-step deterministic tour sequence
 */
import {
  AutopilotStep,
  StepContext,
  sleep,
  smoothScrollTo,
  scrollToSelector,
  waitForElement,
  waitForLoadingDone,
} from "./engine";
import { useAppStore } from "@/lib/store";

// Pause durations (ms) - tuned for live audience comprehension
const BEAT = 2200;    // brief read pause
const PAUSE = 3200;   // normal content pause
const LONG  = 4000;   // complex content pause

async function goTo(ctx: StepContext, path: string) {
  ctx.spotlight(null);
  ctx.navigate(path);
  // Give Next.js router time to initiate navigation
  await sleep(600, ctx.signal);
  // Wait for any spinner to appear + disappear
  await waitForLoadingDone(ctx.signal, 14000);
  // Brief settle after render
  await sleep(500, ctx.signal);
}

export const AUTOPILOT_STEPS: AutopilotStep[] = [
  // ── 0 ── Landing: top
  {
    id: "home-top",
    label: "Landing page — Hero",
    action: async (ctx) => {
      ctx.navigate("/");
      await sleep(800, ctx.signal);
      await smoothScrollTo(0, 400, ctx.signal);
      ctx.spotlight("section:first-of-type h1");
      await sleep(LONG, ctx.signal);
    },
  },

  // ── 1 ── Landing: Stats strip
  {
    id: "home-stats",
    label: "Landing page — Key statistics",
    action: async (ctx) => {
      ctx.spotlight(".bg-\\[\\#EBE6E3\\] .grid");
      await scrollToSelector(".bg-\\[\\#EBE6E3\\]", ctx.signal, -60);
      await sleep(BEAT, ctx.signal);
    },
  },

  // ── 2 ── Landing: Analytical engines
  {
    id: "home-engines",
    label: "Landing page — Precision engines",
    action: async (ctx) => {
      ctx.spotlight(null);
      await scrollToSelector(".py-20", ctx.signal, -60);
      await sleep(LONG, ctx.signal);
    },
  },

  // ── 3 ── Landing: CCTS Sectors grid
  {
    id: "home-sectors",
    label: "Landing page — CCTS Sector coverage",
    action: async (ctx) => {
      ctx.spotlight(null);
      await scrollToSelector(".bg-\\[\\#F6F8F7\\].border-y", ctx.signal, -60);
      ctx.spotlight(".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3");
      await sleep(LONG, ctx.signal);
    },
  },

  // ── 4 ── Landing: Authority Banner
  {
    id: "home-authority",
    label: "Landing page — Authoritative reference base",
    action: async (ctx) => {
      ctx.spotlight(null);
      await scrollToSelector(".bg-\\[\\#1F4D2E\\]", ctx.signal, -60);
      await sleep(BEAT, ctx.signal);
    },
  },

  // ── 5 ── Landing: Footer
  {
    id: "home-footer",
    label: "Landing page — Footer",
    action: async (ctx) => {
      await smoothScrollTo(document.body.scrollHeight, 900, ctx.signal);
      await sleep(BEAT, ctx.signal);
    },
  },

  // ── 6 ── Navigate to Facility Analysis
  {
    id: "nav-facility",
    label: "Navigating to Facility Analysis",
    action: async (ctx) => {
      await goTo(ctx, "/industrial-intelligence?demo=true");
      await smoothScrollTo(0, 400, ctx.signal);
    },
  },

  // ── 7 ── Facility: input form
  {
    id: "facility-form",
    label: "Facility Analysis — Input parameters",
    action: async (ctx) => {
      ctx.spotlight("[data-autopilot='facility-form']");
      await sleep(PAUSE, ctx.signal);
    },
  },

  // ── 8 ── Facility: wait for auto-run + carbon position
  {
    id: "facility-carbon",
    label: "Facility Analysis — Carbon Compliance Position",
    action: async (ctx) => {
      // Demo auto-runs on ?demo=true; wait for results
      await waitForLoadingDone(ctx.signal, 18000);
      await sleep(800, ctx.signal);
      ctx.spotlight("[data-autopilot='carbon-position']");
      await sleep(LONG, ctx.signal);
    },
  },

  // ── 9 ── Facility: Peer Benchmark chart
  {
    id: "facility-peer",
    label: "Facility Analysis — ML Peer Benchmark",
    action: async (ctx) => {
      ctx.spotlight("[data-autopilot='peer-benchmark']");
      await scrollToSelector("[data-autopilot='peer-benchmark']", ctx.signal);
      await sleep(LONG, ctx.signal);
    },
  },

  // ── 10 ── Facility: Decarbonisation matrix
  {
    id: "facility-decarb",
    label: "Facility Analysis — Decarbonisation Opportunities",
    action: async (ctx) => {
      ctx.spotlight("[data-autopilot='decarb-matrix']");
      await scrollToSelector("[data-autopilot='decarb-matrix']", ctx.signal);
      await sleep(PAUSE, ctx.signal);
    },
  },

  // ── 11 ── Facility: Strategy recommendation
  {
    id: "facility-strategy",
    label: "Facility Analysis — BUY vs BUILD vs HYBRID",
    action: async (ctx) => {
      ctx.spotlight("[data-autopilot='strategy-hero']");
      await scrollToSelector("[data-autopilot='strategy-hero']", ctx.signal);
      await sleep(LONG, ctx.signal);
    },
  },

  // ── 12 ── Navigate to Decision Twin
  {
    id: "nav-decision",
    label: "Navigating to Decision Twin",
    action: async (ctx) => {
      await goTo(ctx, "/decision");
      await smoothScrollTo(0, 400, ctx.signal);
    },
  },

  // ── 13 ── Decision: Carbon position card
  {
    id: "decision-carbon",
    label: "Decision Twin — Carbon Compliance Position",
    action: async (ctx) => {
      ctx.spotlight("[data-autopilot='carbon-position']");
      await sleep(PAUSE, ctx.signal);
    },
  },

  // ── 14 ── Decision: MRV card
  {
    id: "decision-mrv",
    label: "Decision Twin — MRV & Evidence Readiness",
    action: async (ctx) => {
      ctx.spotlight("[data-autopilot='mrv-card']");
      await sleep(PAUSE, ctx.signal);
    },
  },

  // ── 15 ── Decision: Strategy comparison
  {
    id: "decision-twin-hero",
    label: "Decision Twin — BUY vs BUILD vs HYBRID",
    action: async (ctx) => {
      ctx.spotlight("[data-autopilot='decision-hero']");
      await scrollToSelector("[data-autopilot='decision-hero']", ctx.signal);
      await sleep(LONG, ctx.signal);
    },
  },

  // ── 16 ── Decision: Strategy cards
  {
    id: "decision-cards",
    label: "Decision Twin — Strategy cards",
    action: async (ctx) => {
      ctx.spotlight("[data-autopilot='strategy-cards']");
      await scrollToSelector("[data-autopilot='strategy-cards']", ctx.signal);
      await sleep(LONG, ctx.signal);
    },
  },

  // ── 17 ── Navigate to Scenarios
  {
    id: "nav-scenarios",
    label: "Navigating to Scenario Stress Testing",
    action: async (ctx) => {
      await goTo(ctx, "/scenarios");
      await smoothScrollTo(0, 400, ctx.signal);
    },
  },

  // ── 18 ── Scenarios: show sliders
  {
    id: "scenarios-sliders",
    label: "Scenarios — Stress test controls",
    action: async (ctx) => {
      ctx.spotlight("[data-autopilot='scenario-sliders']");
      await sleep(BEAT, ctx.signal);
    },
  },

  // ── 19 ── Scenarios: raise CCC price
  {
    id: "scenarios-raise",
    label: "Scenarios — Raising CCC price to ₹1,800/t",
    action: async (ctx) => {
      ctx.spotlight(null);
      const store = useAppStore.getState();
      store.setScenarioParams({ ...store.scenarioParams, ccc_price_inr: 1800 });
      await sleep(400, ctx.signal);
      await waitForLoadingDone(ctx.signal, 12000);
      ctx.spotlight("[data-autopilot='scenario-results']");
      await scrollToSelector("[data-autopilot='scenario-results']", ctx.signal);
      await sleep(LONG, ctx.signal);
    },
  },

  // ── 20 ── Scenarios: lower CCC price
  {
    id: "scenarios-lower",
    label: "Scenarios — Lowering CCC price to ₹500/t",
    action: async (ctx) => {
      const store = useAppStore.getState();
      store.setScenarioParams({ ...store.scenarioParams, ccc_price_inr: 500 });
      await sleep(400, ctx.signal);
      await waitForLoadingDone(ctx.signal, 12000);
      ctx.spotlight("[data-autopilot='sensitivity-chart']");
      await sleep(PAUSE, ctx.signal);
    },
  },

  // ── 21 ── Scenarios: reset & show sensitivity curve
  {
    id: "scenarios-reset",
    label: "Scenarios — Resetting to base assumptions",
    action: async (ctx) => {
      useAppStore.getState().resetScenarioParams();
      await sleep(400, ctx.signal);
      await waitForLoadingDone(ctx.signal, 12000);
      ctx.spotlight("[data-autopilot='sensitivity-chart']");
      await sleep(BEAT, ctx.signal);
    },
  },

  // ── 22 ── Navigate to Portfolio
  {
    id: "nav-portfolio",
    label: "Navigating to Portfolio Overview",
    action: async (ctx) => {
      await goTo(ctx, "/overview");
      await smoothScrollTo(0, 400, ctx.signal);
    },
  },

  // ── 23 ── Portfolio: show overview
  {
    id: "portfolio-view",
    label: "Portfolio — National sector overview",
    action: async (ctx) => {
      ctx.spotlight("[data-autopilot='portfolio-chart']");
      await sleep(LONG, ctx.signal);
    },
  },

  // ── 24 ── Navigate to Evidence
  {
    id: "nav-evidence",
    label: "Navigating to Evidence Center",
    action: async (ctx) => {
      await goTo(ctx, "/sources");
      await smoothScrollTo(0, 400, ctx.signal);
    },
  },

  // ── 25 ── Evidence: source register
  {
    id: "evidence-sources",
    label: "Evidence Center — Source register",
    action: async (ctx) => {
      ctx.spotlight("[data-autopilot='source-register']");
      await sleep(PAUSE, ctx.signal);
    },
  },

  // ── 26 ── Navigate to Trust Center
  {
    id: "nav-trust",
    label: "Navigating to Trust Center",
    action: async (ctx) => {
      await goTo(ctx, "/trust");
      await smoothScrollTo(0, 400, ctx.signal);
    },
  },

  // ── 27 ── Trust: model cards
  {
    id: "trust-models",
    label: "Trust Center — Model cards & traceability",
    action: async (ctx) => {
      ctx.spotlight("[data-autopilot='trust-content']");
      await sleep(LONG, ctx.signal);
    },
  },

  // ── 28 ── Return home
  {
    id: "home-return",
    label: "Returning to landing page",
    action: async (ctx) => {
      ctx.spotlight(null);
      await goTo(ctx, "/");
      await smoothScrollTo(0, 600, ctx.signal);
      await sleep(BEAT, ctx.signal);
    },
  },

  // ── 29 ── Done
  {
    id: "done",
    label: "Tour complete",
    action: async (ctx) => {
      ctx.spotlight(null);
      await sleep(800, ctx.signal);
    },
  },
];
