#!/usr/bin/env node

// src/cli.tsx
import { render } from "ink";

// src/App.tsx
import { useEffect, useState } from "react";
import { useApp, useInput } from "ink";

// src/components/Dashboard.tsx
import { Box as Box2, Text as Text2 } from "ink";

// src/theme/themes.ts
var themes = [
  { name: "cyberpunk", border: "cyan", title: "magenta", text: "white", accent: "yellow", ok: "green", warn: "red" },
  { name: "retro", border: "green", title: "yellow", text: "green", accent: "white", ok: "green", warn: "red" },
  { name: "minimal", border: "gray", title: "white", text: "white", accent: "blue", ok: "green", warn: "yellow" }
];
var nextTheme = (current) => {
  const idx = themes.findIndex((t) => t.name === current);
  return themes[(idx + 1) % themes.length].name;
};
var getTheme = (name) => themes.find((t) => t.name === name) ?? themes[0];

// src/components/Panel.tsx
import { Box, Text } from "ink";
import { jsx, jsxs } from "react/jsx-runtime";
var Panel = ({ title, theme, focused, width, height, children }) => /* @__PURE__ */ jsxs(
  Box,
  {
    borderStyle: "round",
    borderColor: focused ? theme.accent : theme.border,
    flexDirection: "column",
    width,
    height,
    paddingX: 1,
    children: [
      /* @__PURE__ */ jsx(Text, { color: focused ? theme.accent : theme.title, children: title }),
      children
    ]
  }
);

// src/components/Dashboard.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var bar = (value) => "\u2593".repeat(Math.round(value / 20)) + "\u2591".repeat(5 - Math.round(value / 20));
var Dashboard = ({ state, themeName, focusIndex, commandMode, commandText }) => {
  const theme = getTheme(themeName);
  const byCol = (col) => state.tasks.filter((t) => t.column === col).map((t) => `#${t.id}`).join(", ") || "-";
  return /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", children: [
    /* @__PURE__ */ jsxs2(Box2, { borderStyle: "single", borderColor: theme.border, paddingX: 1, children: [
      /* @__PURE__ */ jsxs2(Text2, { color: theme.title, children: [
        "\u26A1 OPENCLAW MISSION CONTROL [",
        theme.name,
        "]"
      ] }),
      /* @__PURE__ */ jsxs2(Text2, { children: [
        "  ",
        state.now
      ] })
    ] }),
    /* @__PURE__ */ jsxs2(Box2, { children: [
      /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", width: "35%", children: [
        /* @__PURE__ */ jsx2(Panel, { title: "\u{1F7E2} AGENT STATUS", theme, focused: focusIndex === 0, children: state.agents.map((a) => /* @__PURE__ */ jsxs2(Text2, { color: a.online ? theme.ok : theme.warn, children: [
          a.name.padEnd(6),
          " \u2665 ",
          Math.floor(a.heartbeatSecAgo / 60),
          "m ago  focus: ",
          a.focus
        ] }, a.name)) }),
        /* @__PURE__ */ jsxs2(Panel, { title: "\u{1F4CA} SYSTEM HEALTH", theme, focused: focusIndex === 3, children: [
          /* @__PURE__ */ jsxs2(Text2, { children: [
            "CPU: ",
            bar(state.health.cpu),
            " ",
            state.health.cpu,
            "%"
          ] }),
          /* @__PURE__ */ jsxs2(Text2, { children: [
            "MEM: ",
            bar(state.health.mem),
            " ",
            state.health.mem,
            "%"
          ] }),
          /* @__PURE__ */ jsxs2(Text2, { children: [
            "DSK: ",
            bar(state.health.dsk),
            " ",
            state.health.dsk,
            "%"
          ] }),
          /* @__PURE__ */ jsxs2(Text2, { children: [
            "Tokens today: ",
            state.health.tokensToday
          ] }),
          /* @__PURE__ */ jsxs2(Text2, { children: [
            "Gateway: ",
            state.health.gatewayUp ? "\u2705 UP" : "\u274C DOWN"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", width: "65%", children: [
        /* @__PURE__ */ jsxs2(Panel, { title: "\u{1F4CB} TASK BOARD", theme, focused: focusIndex === 1, children: [
          /* @__PURE__ */ jsxs2(Text2, { children: [
            "OPEN: ",
            byCol("OPEN")
          ] }),
          /* @__PURE__ */ jsxs2(Text2, { children: [
            "PROGRESS: ",
            byCol("PROGRESS")
          ] }),
          /* @__PURE__ */ jsxs2(Text2, { children: [
            "REVIEW: ",
            byCol("REVIEW")
          ] })
        ] }),
        /* @__PURE__ */ jsx2(Panel, { title: "\u{1F4AC} AGENT ACTIVITY LOG", theme, focused: focusIndex === 2, children: state.activity.map((a, i) => /* @__PURE__ */ jsxs2(Text2, { children: [
          a.ts,
          " ",
          a.agent,
          ": ",
          a.message
        ] }, `${a.ts}-${i}`)) }),
        /* @__PURE__ */ jsx2(Panel, { title: "> COMMAND INPUT", theme, focused: focusIndex === 4, children: /* @__PURE__ */ jsx2(Text2, { children: commandMode ? `:${commandText}` : "(Tab: agents/tasks/log/health/cmd, : palette, t theme, q quit)" }) })
      ] })
    ] })
  ] });
};

// src/data/mockStream.ts
var base = {
  now: (/* @__PURE__ */ new Date()).toLocaleString("ja-JP"),
  agents: [
    { name: "main", online: true, heartbeatSecAgo: 120, focus: "orchestration" },
    { name: "dev", online: true, heartbeatSecAgo: 40, focus: "TUI skeleton" },
    { name: "intel", online: true, heartbeatSecAgo: 85, focus: "data feeds" },
    { name: "philo", online: true, heartbeatSecAgo: 55, focus: "UX narratives" },
    { name: "pulse", online: true, heartbeatSecAgo: 15, focus: "monitoring" }
  ],
  tasks: [
    { id: 42, title: "Mission Control TUI", column: "PROGRESS" },
    { id: 36, title: "claude code usage audit", column: "REVIEW" },
    { id: 43, title: "intel feed panel", column: "OPEN" }
  ],
  activity: [
    { ts: "15:00", agent: "main", message: "issue #42 orchestrating" },
    { ts: "15:01", agent: "dev", message: "scaffold started" }
  ],
  health: { cpu: 62, mem: 45, dsk: 78, tokensToday: "1.2M", gatewayUp: true }
};
var rand = (min, max) => Math.max(min, Math.min(max, Math.round(min + Math.random() * (max - min))));
var nextState = (prev) => {
  const s = prev ?? base;
  const now = /* @__PURE__ */ new Date();
  const hhmm = now.toTimeString().slice(0, 5);
  const tickMsg = [
    "heartbeat complete",
    "issue synced",
    "commit pushed",
    "feed refreshed",
    "health check ok"
  ][Math.floor(Math.random() * 5)];
  return {
    ...s,
    now: now.toLocaleString("ja-JP"),
    agents: s.agents.map((a) => ({ ...a, heartbeatSecAgo: Math.max(0, a.heartbeatSecAgo + rand(-10, 15)) })),
    activity: [{ ts: hhmm, agent: s.agents[rand(0, s.agents.length - 1)].name, message: tickMsg }, ...s.activity].slice(0, 8),
    health: {
      ...s.health,
      cpu: rand(35, 88),
      mem: rand(30, 75),
      dsk: s.health.dsk,
      gatewayUp: true
    }
  };
};
var initialState = base;

// src/App.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var MAX_PANELS = 5;
var App = () => {
  const { exit } = useApp();
  const [state, setState] = useState(initialState);
  const [theme, setTheme] = useState("cyberpunk");
  const [focus, setFocus] = useState(0);
  const [commandMode, setCommandMode] = useState(false);
  const [commandText, setCommandText] = useState("");
  const [konamiBuffer, setKonamiBuffer] = useState("");
  useEffect(() => {
    const id = setInterval(() => setState((s) => nextState(s)), 1e3);
    return () => clearInterval(id);
  }, []);
  useInput((input, key) => {
    if (key.ctrl && input === "c") return exit();
    if (commandMode) {
      if (key.return) {
        setCommandMode(false);
        setCommandText("");
        return;
      }
      if (key.escape) {
        setCommandMode(false);
        setCommandText("");
        return;
      }
      if (key.backspace || key.delete) {
        setCommandText((t) => t.slice(0, -1));
        return;
      }
      if (input) setCommandText((t) => t + input);
      return;
    }
    if (input === "q") return exit();
    if (input === ":") return setCommandMode(true);
    if (input === "t") return setTheme((t) => nextTheme(t));
    if (key.tab) return setFocus((f) => (f + 1) % MAX_PANELS);
    if (key.shift && key.tab) return setFocus((f) => (f - 1 + MAX_PANELS) % MAX_PANELS);
    if (input === "h" || input === "k") return setFocus((f) => (f - 1 + MAX_PANELS) % MAX_PANELS);
    if (input === "j" || input === "l") return setFocus((f) => (f + 1) % MAX_PANELS);
    const next = (konamiBuffer + input).slice(-10);
    setKonamiBuffer(next);
    if (next.includes("uuddlrlrba")) {
      setState((s) => ({ ...s, activity: [{ ts: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 5), agent: "system", message: "\u{1F389} Konami unlocked: Mission Deep Space" }, ...s.activity].slice(0, 8) }));
    }
  });
  return /* @__PURE__ */ jsx3(Dashboard, { state, themeName: theme, focusIndex: focus, commandMode, commandText });
};

// src/cli.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
render(/* @__PURE__ */ jsx4(App, {}));
