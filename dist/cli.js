#!/usr/bin/env node

// src/cli.tsx
import { render } from "ink";

// src/App.tsx
import { useEffect as useEffect2, useState as useState2 } from "react";
import { useApp, useInput } from "ink";

// src/components/Dashboard.tsx
import { Box as Box3, Text as Text3 } from "ink";

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

// src/components/QuoteWidget.tsx
import { useEffect, useMemo, useState } from "react";
import { Box as Box2, Text as Text2 } from "ink";

// src/data/quotes.json
var quotes_default = [
  {
    text: "\u5927\u4E8B\u306A\u306E\u306F\u53CD\u5FDC\u901F\u5EA6\u3088\u308A\u3001\u554F\u3044\u306E\u8CEA\u3002",
    author: "Talmudic spirit",
    category: "focus"
  },
  {
    text: "\u884C\u52D5\u306F\u4E0D\u5B89\u3092\u6D88\u3055\u306A\u3044\u3002\u3060\u304C\u4E0D\u5B89\u3092\u6271\u3048\u308B\u5F62\u306B\u5909\u3048\u308B\u3002",
    author: "Tim Ferriss",
    category: "courage"
  },
  {
    text: "\u5168\u90E8\u3092\u6C17\u306B\u3059\u308B\u306A\u3002\u672C\u5F53\u306B\u5927\u5207\u306A\u3082\u306E\u3092\u9078\u3079\u3002",
    author: "Mark Manson",
    category: "focus"
  },
  {
    text: "\u8AB2\u984C\u3092\u5206\u3051\u308B\u3068\u3001\u5FC3\u306F\u524D\u306B\u9032\u3081\u308B\u3002",
    author: "Alfred Adler",
    category: "courage"
  },
  {
    text: "\u611F\u8B1D\u306F\u73FE\u5B9F\u9003\u907F\u3067\u306F\u306A\u304F\u3001\u73FE\u5B9F\u628A\u63E1\u306E\u6280\u8853\u3060\u3002",
    author: "Jewish wisdom",
    category: "gratitude"
  },
  {
    text: "\u5C0F\u3055\u306A\u4FEE\u5FA9\u3092\u7D9A\u3051\u308B\u8005\u304C\u3001\u4E16\u754C\u3092\u9759\u304B\u306B\u5909\u3048\u308B\u3002",
    author: "Tikkun Olam",
    category: "gratitude"
  }
];

// src/components/QuoteWidget.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var QUOTES = quotes_default;
var REFRESH_MS = 6e4;
var pickRandom = (pool) => pool[Math.floor(Math.random() * pool.length)] ?? pool[0];
var QuoteWidget = ({ theme }) => {
  const [current, setCurrent] = useState(() => pickRandom(QUOTES));
  useEffect(() => {
    const id = setInterval(() => setCurrent(pickRandom(QUOTES)), REFRESH_MS);
    return () => clearInterval(id);
  }, []);
  const icon = useMemo(() => {
    switch (current.category) {
      case "focus":
        return "\u{1F9ED}";
      case "courage":
        return "\u{1F525}";
      case "gratitude":
        return "\u{1F64F}";
      default:
        return "\u2728";
    }
  }, [current.category]);
  return /* @__PURE__ */ jsxs2(Box2, { marginTop: 1, borderStyle: "single", borderColor: theme.border, paddingX: 1, justifyContent: "space-between", children: [
    /* @__PURE__ */ jsx2(Text2, { color: theme.title, children: "TODAY'S QUOTE" }),
    /* @__PURE__ */ jsxs2(Text2, { color: theme.accent, children: [
      icon,
      " \u201C",
      current.text,
      "\u201D \u2014 ",
      current.author
    ] })
  ] });
};

// src/components/Dashboard.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var bar = (value) => "\u2593".repeat(Math.round(value / 20)) + "\u2591".repeat(5 - Math.round(value / 20));
var Dashboard = ({ state, themeName, focusIndex, commandMode, commandText }) => {
  const theme = getTheme(themeName);
  const byCol = (col) => state.tasks.filter((t) => t.column === col).map((t) => `#${t.id}`).join(", ") || "-";
  return /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", children: [
    /* @__PURE__ */ jsxs3(Box3, { borderStyle: "single", borderColor: theme.border, paddingX: 1, children: [
      /* @__PURE__ */ jsxs3(Text3, { color: theme.title, children: [
        "\u26A1 OPENCLAW MISSION CONTROL [",
        theme.name,
        "]"
      ] }),
      /* @__PURE__ */ jsxs3(Text3, { children: [
        "  ",
        state.now
      ] })
    ] }),
    /* @__PURE__ */ jsx3(QuoteWidget, { theme }),
    /* @__PURE__ */ jsxs3(Box3, { children: [
      /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", width: "35%", children: [
        /* @__PURE__ */ jsx3(Panel, { title: "\u{1F7E2} AGENT STATUS", theme, focused: focusIndex === 0, children: state.agents.map((a) => /* @__PURE__ */ jsxs3(Text3, { color: a.online ? theme.ok : theme.warn, children: [
          a.name.padEnd(6),
          " \u2665 ",
          Math.floor(a.heartbeatSecAgo / 60),
          "m ago  focus: ",
          a.focus
        ] }, a.name)) }),
        /* @__PURE__ */ jsxs3(Panel, { title: "\u{1F4CA} SYSTEM HEALTH", theme, focused: focusIndex === 3, children: [
          /* @__PURE__ */ jsxs3(Text3, { children: [
            "CPU: ",
            bar(state.health.cpu),
            " ",
            state.health.cpu,
            "%"
          ] }),
          /* @__PURE__ */ jsxs3(Text3, { children: [
            "MEM: ",
            bar(state.health.mem),
            " ",
            state.health.mem,
            "%"
          ] }),
          /* @__PURE__ */ jsxs3(Text3, { children: [
            "DSK: ",
            bar(state.health.dsk),
            " ",
            state.health.dsk,
            "%"
          ] }),
          /* @__PURE__ */ jsxs3(Text3, { children: [
            "Tokens today: ",
            state.health.tokensToday
          ] }),
          /* @__PURE__ */ jsxs3(Text3, { children: [
            "Gateway: ",
            state.health.gatewayUp ? "\u2705 UP" : "\u274C DOWN"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", width: "65%", children: [
        /* @__PURE__ */ jsxs3(Panel, { title: "\u{1F4CB} TASK BOARD", theme, focused: focusIndex === 1, children: [
          /* @__PURE__ */ jsxs3(Text3, { children: [
            "OPEN: ",
            byCol("OPEN")
          ] }),
          /* @__PURE__ */ jsxs3(Text3, { children: [
            "PROGRESS: ",
            byCol("PROGRESS")
          ] }),
          /* @__PURE__ */ jsxs3(Text3, { children: [
            "REVIEW: ",
            byCol("REVIEW")
          ] })
        ] }),
        /* @__PURE__ */ jsx3(Panel, { title: "\u{1F4AC} AGENT ACTIVITY LOG", theme, focused: focusIndex === 2, children: state.activity.map((a, i) => /* @__PURE__ */ jsxs3(Text3, { children: [
          a.ts,
          " ",
          a.agent,
          ": ",
          a.message
        ] }, `${a.ts}-${i}`)) }),
        /* @__PURE__ */ jsx3(Panel, { title: "> COMMAND INPUT", theme, focused: focusIndex === 4, children: /* @__PURE__ */ jsx3(Text3, { children: commandMode ? `:${commandText}` : "(Tab: agents/tasks/log/health/cmd, : palette, t theme, q quit)" }) })
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

// src/pulse/alerts.ts
var ago = (sec) => {
  if (!Number.isFinite(sec)) return "unknown";
  if (sec < 60) return `${sec}s ago`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
};
var evaluateAlerts = (s) => {
  const out = [];
  if (!s.gateway.up) {
    out.push({
      id: "gateway-down",
      severity: "critical",
      title: "Gateway is DOWN",
      detail: `${s.gateway.host}:${s.gateway.port} not reachable`,
      bell: true
    });
  }
  if (s.resources.cpuPercent >= 90) {
    out.push({ id: "cpu-hot", severity: "warn", title: `High CPU ${s.resources.cpuPercent}%` });
  }
  if (s.resources.memPercent >= 90) {
    out.push({ id: "mem-hot", severity: "warn", title: `High MEM ${s.resources.memPercent}%` });
  }
  if (s.resources.diskPercent >= 90) {
    out.push({
      id: "disk-critical",
      severity: "critical",
      title: `Disk critical ${s.resources.diskPercent}%`,
      bell: true
    });
  } else if (s.resources.diskPercent >= 80) {
    out.push({ id: "disk-warn", severity: "warn", title: `Disk high ${s.resources.diskPercent}%` });
  }
  s.agents.filter((a) => !a.online).forEach((a) => {
    out.push({
      id: `agent-offline-${a.name}`,
      severity: "warn",
      title: `Agent offline: ${a.name}`,
      detail: `last heartbeat ${ago(a.heartbeatSecAgo)}`
    });
  });
  if (s.logs.oversizedFiles.length > 0) {
    out.push({
      id: "logs-oversized",
      severity: "warn",
      title: `Large log files detected (${s.logs.oversizedFiles.length})`,
      detail: s.logs.oversizedFiles.slice(0, 2).map((f) => `${f.path.split("/").pop()} ${f.sizeMb}MB`).join(", ")
    });
  }
  return out;
};
var applyAlerts = (s) => ({
  ...s,
  alerts: evaluateAlerts(s)
});

// src/pulse/monitor.ts
import fs from "fs";
import os from "os";
import path from "path";
import net from "net";
import { execSync } from "child_process";
var clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));
var readResources = (tokensToday = "N/A") => {
  const [l1] = os.loadavg();
  const cpuPercent = clamp(Math.round(l1 / Math.max(os.cpus().length, 1) * 100));
  const total = os.totalmem();
  const free = os.freemem();
  const memPercent = clamp(Math.round((total - free) / total * 100));
  let diskPercent = 0;
  try {
    const out = execSync("df -k / | tail -1", { encoding: "utf-8" }).trim();
    const cols = out.split(/\s+/);
    const cap = cols[4]?.replace("%", "");
    diskPercent = clamp(Number(cap || 0));
  } catch {
    diskPercent = 0;
  }
  return { cpuPercent, memPercent, diskPercent, tokensToday };
};
var checkGateway = async (host = "127.0.0.1", port = 18789, timeoutMs = 800) => {
  const checkedAt = (/* @__PURE__ */ new Date()).toISOString();
  const up = await new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;
    const close = (ok) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => close(true));
    socket.once("timeout", () => close(false));
    socket.once("error", () => close(false));
    socket.connect(port, host);
  });
  return { up, host, port, checkedAt };
};
var readAgentHeartbeats = (openclawHome = path.join(os.homedir(), ".openclaw"), agentNames = ["main", "dev", "intel", "philo", "pulse"]) => {
  const now = Date.now();
  return agentNames.map((name) => {
    const p = path.join(openclawHome, "agents", name, "sessions", "sessions.json");
    try {
      const st = fs.statSync(p);
      const ageSec = Math.max(0, Math.floor((now - st.mtimeMs) / 1e3));
      return {
        name,
        online: ageSec < 7200,
        heartbeatSecAgo: ageSec,
        lastUpdatedAt: new Date(st.mtimeMs).toISOString()
      };
    } catch {
      return {
        name,
        online: false,
        heartbeatSecAgo: Number.POSITIVE_INFINITY
      };
    }
  });
};
var listFiles = (dir) => {
  try {
    return fs.readdirSync(dir).map((f) => path.join(dir, f));
  } catch {
    return [];
  }
};
var readLogRotationStatus = (openclawHome = path.join(os.homedir(), ".openclaw"), warnMb = 100) => {
  const logDir = path.join(openclawHome, "logs");
  const files = listFiles(logDir);
  let totalBytes = 0;
  const oversized = [];
  for (const f of files) {
    try {
      const st = fs.statSync(f);
      if (!st.isFile()) continue;
      totalBytes += st.size;
      const sizeMb = st.size / (1024 * 1024);
      if (sizeMb >= warnMb) oversized.push({ path: f, sizeMb: Number(sizeMb.toFixed(1)) });
    } catch {
    }
  }
  return {
    oversizedFiles: oversized.sort((a, b) => b.sizeMb - a.sizeMb),
    totalLogMb: Number((totalBytes / (1024 * 1024)).toFixed(1))
  };
};
var pushDiskTrend = (prev, diskPercent, size = 30) => {
  const point = { ts: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 8), diskPercent };
  return [...prev, point].slice(-size);
};
var collectMonitoringSnapshot = async (prevTrend = [], opts = {}) => {
  const resources = readResources(opts.tokensToday ?? "N/A");
  const gateway = await checkGateway(opts.gatewayHost, opts.gatewayPort);
  const agents = readAgentHeartbeats(opts.openclawHome, opts.agentNames);
  const logs = readLogRotationStatus(opts.openclawHome, opts.logWarnMb);
  const diskTrend = pushDiskTrend(prevTrend, resources.diskPercent, opts.diskTrendSize ?? 30);
  return {
    now: (/* @__PURE__ */ new Date()).toISOString(),
    resources,
    gateway,
    agents,
    logs,
    diskTrend,
    alerts: []
  };
};

// src/App.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
var MAX_PANELS = 5;
var appendActivity = (s, agent, message) => ({
  ...s,
  activity: [{ ts: (/* @__PURE__ */ new Date()).toTimeString().slice(0, 5), agent, message }, ...s.activity].slice(0, 8)
});
var parseCommand = (raw) => {
  const [cmd = "", ...args] = raw.trim().split(/\s+/);
  return { cmd: cmd.toLowerCase(), args };
};
var App = () => {
  const { exit } = useApp();
  const [state, setState] = useState2(initialState);
  const [theme, setTheme] = useState2("cyberpunk");
  const [focus, setFocus] = useState2(0);
  const [commandMode, setCommandMode] = useState2(false);
  const [commandText, setCommandText] = useState2("");
  const [konamiBuffer, setKonamiBuffer] = useState2("");
  useEffect2(() => {
    const id = setInterval(() => setState((s) => nextState(s)), 1e3);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    let active = true;
    let trend = [];
    const tick = async () => {
      try {
        const snapshot = applyAlerts(await collectMonitoringSnapshot(trend, { tokensToday: state.health.tokensToday }));
        trend = snapshot.diskTrend;
        if (!active) return;
        setState((s) => ({
          ...s,
          agents: s.agents.map((a) => {
            const hb = snapshot.agents.find((x) => x.name === a.name);
            return hb ? { ...a, online: hb.online, heartbeatSecAgo: Number.isFinite(hb.heartbeatSecAgo) ? hb.heartbeatSecAgo : a.heartbeatSecAgo } : a;
          }),
          health: {
            ...s.health,
            cpu: snapshot.resources.cpuPercent,
            mem: snapshot.resources.memPercent,
            dsk: snapshot.resources.diskPercent,
            gatewayUp: snapshot.gateway.up
          }
        }));
      } catch {
      }
    };
    const id = setInterval(() => {
      void tick();
    }, 3e3);
    void tick();
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [state.health.tokensToday]);
  useInput((input, key) => {
    if (key.ctrl && input === "c") return exit();
    if (commandMode) {
      if (key.return) {
        const raw = commandText;
        const { cmd, args } = parseCommand(raw);
        if (cmd === "quit" || cmd === "q") {
          return exit();
        }
        if (cmd === "theme" && args[0]) {
          const t = args[0].toLowerCase();
          if (t === "cyberpunk" || t === "retro" || t === "minimal") {
            setTheme(t);
            setState((s) => appendActivity(s, "system", `theme -> ${t}`));
          } else {
            setState((s) => appendActivity(s, "system", `unknown theme: ${args[0]}`));
          }
        } else if (cmd === "help") {
          setState((s) => appendActivity(s, "system", "commands: :theme <cyberpunk|retro|minimal>, :focus <0-4>, :quit"));
        } else if (cmd === "focus" && args[0]) {
          const idx = Number(args[0]);
          if (Number.isInteger(idx) && idx >= 0 && idx < MAX_PANELS) {
            setFocus(idx);
            setState((s) => appendActivity(s, "system", `focus -> ${idx}`));
          }
        } else if (raw.trim() !== "") {
          setState((s) => appendActivity(s, "system", `unknown command: ${raw.trim()}`));
        }
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
    if (key.shift && key.tab) return setFocus((f) => (f - 1 + MAX_PANELS) % MAX_PANELS);
    if (key.tab) return setFocus((f) => (f + 1) % MAX_PANELS);
    if (input === "h" || input === "k") return setFocus((f) => (f - 1 + MAX_PANELS) % MAX_PANELS);
    if (input === "j" || input === "l") return setFocus((f) => (f + 1) % MAX_PANELS);
    const keyToken = key.upArrow ? "U" : key.downArrow ? "D" : key.leftArrow ? "L" : key.rightArrow ? "R" : input.toLowerCase();
    const next = (konamiBuffer + keyToken).slice(-10);
    setKonamiBuffer(next);
    if (next === "UUDDLRLRBA") {
      setState((s) => appendActivity(s, "system", "\u{1F389} Konami unlocked: Mission Deep Space"));
      process.stdout.write("\x07");
    }
  });
  return /* @__PURE__ */ jsx4(Dashboard, { state, themeName: theme, focusIndex: focus, commandMode, commandText });
};

// src/cli.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
render(/* @__PURE__ */ jsx5(App, {}));
