export type Status = "info" | "discuss" | "attention" | "good";

export const user = { name: "Rosie", age: 34, cycleDay: 18, cycleLength: 29 };

export const metrics = [
  { key: "rhr", label: "Resting heart rate", value: "58", unit: "bpm", delta: "+6", up: true, source: "Oura", series: [52, 53, 52, 54, 53, 55, 57, 56, 58, 58] },
  { key: "hrv", label: "Heart rate variability", value: "42", unit: "ms", delta: "−12%", up: false, source: "Apple Watch", series: [52, 50, 51, 48, 47, 46, 44, 45, 43, 42] },
  { key: "sleep", label: "Sleep", value: "6h 52", unit: "m", delta: "−38m", up: false, source: "Oura", series: [7.6, 7.4, 7.8, 7.1, 7.0, 6.9, 7.2, 6.6, 6.8, 6.9] },
  { key: "steps", label: "Activity", value: "8,412", unit: "steps", delta: "+4%", up: true, source: "Apple Health", series: [6, 7, 9, 8, 7, 10, 8, 9, 7, 8.4] },
];

export const insights = [
  {
    id: "rhr",
    category: "Cardiovascular",
    status: "discuss" as Status,
    title: "Your resting heart rate has changed.",
    body: "Your resting heart rate has been 6 bpm higher than your personal baseline for 6 days. This coincides with shorter sleep and the luteal phase of your cycle.",
    confidence: "Moderate",
    sources: ["Oura", "Apple Watch", "Cycle log"],
    series: [52, 53, 52, 54, 53, 55, 57, 56, 58, 58, 59, 58],
    tone: "pink",
  },
  {
    id: "sleep",
    category: "Sleep",
    status: "info" as Status,
    title: "Sleep is shorter before your period.",
    body: "Across your last 4 cycles, average sleep dropped by 34 minutes in the 5 days before menstruation.",
    confidence: "High",
    sources: ["Oura", "Cycle log"],
    series: [7.6, 7.5, 7.8, 7.2, 6.9, 6.7, 7.4, 7.7, 7.5, 7.0, 6.8, 6.6],
    tone: "cobalt",
  },
  {
    id: "ferritin",
    category: "Labs",
    status: "discuss" as Status,
    title: "Ferritin is trending down.",
    body: "Your last three ferritin results declined from 48 to 22 ng/mL. Still within the lab range, but the trend may be worth raising with your clinician.",
    confidence: "High",
    sources: ["Labcorp"],
    series: [48, 41, 33, 22],
    tone: "coral",
  },
  {
    id: "screening",
    category: "Preventive",
    status: "info" as Status,
    title: "Cervical screening due in March.",
    body: "Based on your last screening in March 2023 and current guidelines for your age.",
    confidence: "Guideline",
    sources: ["MyChart"],
    series: [],
    tone: "lime",
  },
];

export const timeline = [
  { date: "Today", title: "Resting heart rate elevated", meta: "Signal · Oura", kind: "signal" },
  { date: "Oct 12", title: "Annual physical", meta: "Dr. Lena Ortiz · Visit note", kind: "visit" },
  { date: "Oct 03", title: "Lab results", meta: "CBC, ferritin, TSH · 1 flagged trend", kind: "lab" },
  { date: "Sep 14", title: "Started new medication", meta: "Spironolactone 25mg", kind: "med" },
  { date: "Aug 28", title: "Logged symptom", meta: "Headache · higher stress", kind: "symptom" },
  { date: "Jul 10", title: "Sleep pattern change", meta: "Later bedtime · 3 weeks", kind: "signal" },
];

export const labs = [
  { name: "Ferritin", value: "22", unit: "ng/mL", range: "15–150", pos: 0.06, trend: "down", status: "discuss" as Status },
  { name: "TSH", value: "2.1", unit: "mIU/L", range: "0.4–4.0", pos: 0.47, trend: "flat", status: "good" as Status },
  { name: "Vitamin D", value: "34", unit: "ng/mL", range: "30–100", pos: 0.06, trend: "up", status: "good" as Status },
  { name: "HbA1c", value: "5.2", unit: "%", range: "<5.7", pos: 0.35, trend: "flat", status: "good" as Status },
  { name: "LDL", value: "118", unit: "mg/dL", range: "<100", pos: 0.82, trend: "up", status: "discuss" as Status },
];

export const meds = [
  { name: "Spironolactone", dose: "25 mg · daily", since: "Sep 2026" },
  { name: "Vitamin D3", dose: "2000 IU · daily", since: "Jan 2025" },
  { name: "Iron bisglycinate", dose: "25 mg · alternate days", since: "Oct 2026" },
];

export const sources = [
  { name: "Apple Health", detail: "Steps, workouts, cycle", synced: "2 min ago", on: true, color: "pink" },
  { name: "Oura", detail: "Sleep, readiness, temperature", synced: "1 h ago", on: true, color: "ink" },
  { name: "Apple Watch", detail: "Heart rate, HRV", synced: "2 min ago", on: true, color: "coral" },
  { name: "MyChart", detail: "Visits, conditions, notes", synced: "Oct 12", on: true, color: "cobalt" },
  { name: "Labcorp", detail: "Lab results", synced: "Oct 03", on: true, color: "aqua" },
  { name: "Withings", detail: "Weight, blood pressure", synced: "—", on: false, color: "lilac" },
];

export const twinDimensions = [
  { key: "Sleep", value: "−6%", x: 18, y: 22 },
  { key: "Cardio", value: "+3%", x: 78, y: 18 },
  { key: "Recovery", value: "+12%", x: 14, y: 70 },
  { key: "Activity", value: "+8%", x: 82, y: 66 },
  { key: "Hormonal", value: "Luteal", x: 50, y: 88 },
];

export const twinSystems = [
  { key: "Cardiovascular", status: "discuss" as Status, headline: "Resting heart rate running high", detail: "58 bpm — 6 above your baseline for 6 days, tracking your cycle phase and shorter sleep.", sources: ["Oura", "Apple Watch"], series: [52, 53, 52, 54, 53, 55, 57, 56, 58, 58] },
  { key: "Sleep & recovery", status: "info" as Status, headline: "Sleep dips before your period", detail: "6h 52 last night. Across your last 4 cycles, sleep drops about 34 minutes in the 5 days before menstruation.", sources: ["Oura", "Cycle log"], series: [7.6, 7.4, 7.8, 7.1, 7.0, 6.9, 7.2, 6.6, 6.8, 6.9] },
  { key: "Metabolic", status: "good" as Status, headline: "Blood sugar steady", detail: "HbA1c 5.2% — well inside range and flat across your last three results.", sources: ["Labcorp"], series: [5.4, 5.3, 5.3, 5.2, 5.2] },
  { key: "Hormonal & reproductive", status: "info" as Status, headline: "Luteal phase, day 18 of 29", detail: "Temperature and HRV shifts line up with your usual luteal pattern.", sources: ["Cycle log", "Oura"], series: [36.5, 36.4, 36.6, 36.7, 36.8, 36.9, 36.8] },
  { key: "Blood & nutrients", status: "discuss" as Status, headline: "Ferritin trending down", detail: "48 → 22 ng/mL across your last three results. Still in range, but worth raising with your clinician.", sources: ["Labcorp"], series: [48, 41, 33, 22] },
];

export const twinLayers = [
  { key: "Signals", subtitle: "Live from your wearables", detail: "Continuous streams mimi watches every day and compares against your baselines.", items: ["Resting heart rate · 58 bpm", "HRV · 42 ms", "Sleep · 6h 52", "Skin temperature · +0.2°C"], meta: "Oura · Apple Watch · synced 2 min ago" },
  { key: "Behaviors", subtitle: "What you log yourself", detail: "Cycle, symptoms, medications and habits you record add context to every signal.", items: ["Cycle · day 18 of 29", "Spironolactone 25 mg · daily", "Iron bisglycinate · alternate days", "Headache logged · Aug 28"], meta: "Self-logged · 43 entries" },
  { key: "Clinical", subtitle: "Labs, visits and notes", detail: "The record your clinicians keep — labs, diagnoses and visit summaries.", items: ["Ferritin · 22 ng/mL · trending down", "TSH · 2.1 mIU/L · in range", "Vitamin D · 34 ng/mL", "LDL · 118 mg/dL", "Annual physical · Oct 12"], meta: "Labcorp · MyChart · Oct 03" },
  { key: "Model", subtitle: "How your twin learns", detail: "Your baselines, confidence levels, and the lines mimi will not cross.", items: ["Baseline window · rolling 90 days", "Measurements · 1,284 across 5 sources", "Confidence · moderate on 2 signals", "Never infers risk or diagnoses"], meta: "Private to you · demo · synthetic data" },
];

export const suggested = [
  "What changed in my health recently?",
  "Why is my resting heart rate higher?",
  "Explain my latest lab results",
  "Prepare me for my next appointment",
];

export const statusLabel: Record<Status, string> = {
  info: "For your information",
  discuss: "Worth discussing",
  attention: "Needs timely attention",
  good: "In your range",
};
