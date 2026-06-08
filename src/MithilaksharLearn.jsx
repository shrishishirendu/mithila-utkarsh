import { useState, useEffect, useMemo, useRef } from "react";
import {
  Check, RotateCcw, Sparkles, ChevronLeft, Volume2,
  BookOpen, Target, PenLine, Undo2, Eraser
} from "lucide-react";
import { SunMotif, LotusMotif, FishMotif, BorderPattern } from "./components/Motifs.jsx";
import { PageHero } from "./components/PageBuildingBlocks.jsx";

// ============================================================
// DATA — Tirhuta / Mithilakshar
// Unicode block: U+11480–U+114DF
// ============================================================
const VOWELS = [
  { tirhuta: "𑒁", roman: "a",  dev: "अ",  ipa: "/ə/",   note: "short 'a' as in 'about'" },
  { tirhuta: "𑒂", roman: "ā",  dev: "आ",  ipa: "/aː/",  note: "long 'aa' as in 'father'" },
  { tirhuta: "𑒃", roman: "i",  dev: "इ",  ipa: "/i/",   note: "short 'i' as in 'sit'" },
  { tirhuta: "𑒄", roman: "ī",  dev: "ई",  ipa: "/iː/",  note: "long 'ee' as in 'see'" },
  { tirhuta: "𑒅", roman: "u",  dev: "उ",  ipa: "/u/",   note: "short 'u' as in 'put'" },
  { tirhuta: "𑒆", roman: "ū",  dev: "ऊ",  ipa: "/uː/",  note: "long 'oo' as in 'food'" },
  { tirhuta: "𑒇", roman: "ṛ",  dev: "ऋ",  ipa: "/r̩/",   note: "vocalic r" },
  { tirhuta: "𑒋", roman: "e",  dev: "ए",  ipa: "/eː/",  note: "as in 'they'" },
  { tirhuta: "𑒌", roman: "ai", dev: "ऐ",  ipa: "/əi/",  note: "diphthong 'ai'" },
  { tirhuta: "𑒍", roman: "o",  dev: "ओ",  ipa: "/oː/",  note: "as in 'go'" },
  { tirhuta: "𑒎", roman: "au", dev: "औ",  ipa: "/əu/",  note: "diphthong 'au'" },
];

const CONSONANTS = [
  { tirhuta: "𑒏", roman: "ka",  dev: "क", group: "Velar" },
  { tirhuta: "𑒐", roman: "kha", dev: "ख", group: "Velar" },
  { tirhuta: "𑒑", roman: "ga",  dev: "ग", group: "Velar" },
  { tirhuta: "𑒒", roman: "gha", dev: "घ", group: "Velar" },
  { tirhuta: "𑒓", roman: "ṅa",  dev: "ङ", group: "Velar" },
  { tirhuta: "𑒔", roman: "ca",  dev: "च", group: "Palatal" },
  { tirhuta: "𑒕", roman: "cha", dev: "छ", group: "Palatal" },
  { tirhuta: "𑒖", roman: "ja",  dev: "ज", group: "Palatal" },
  { tirhuta: "𑒗", roman: "jha", dev: "झ", group: "Palatal" },
  { tirhuta: "𑒘", roman: "ña",  dev: "ञ", group: "Palatal" },
  { tirhuta: "𑒙", roman: "ṭa",  dev: "ट", group: "Retroflex" },
  { tirhuta: "𑒚", roman: "ṭha", dev: "ठ", group: "Retroflex" },
  { tirhuta: "𑒛", roman: "ḍa",  dev: "ड", group: "Retroflex" },
  { tirhuta: "𑒜", roman: "ḍha", dev: "ढ", group: "Retroflex" },
  { tirhuta: "𑒝", roman: "ṇa",  dev: "ण", group: "Retroflex" },
  { tirhuta: "𑒞", roman: "ta",  dev: "त", group: "Dental" },
  { tirhuta: "𑒟", roman: "tha", dev: "थ", group: "Dental" },
  { tirhuta: "𑒠", roman: "da",  dev: "द", group: "Dental" },
  { tirhuta: "𑒡", roman: "dha", dev: "ध", group: "Dental" },
  { tirhuta: "𑒢", roman: "na",  dev: "न", group: "Dental" },
  { tirhuta: "𑒣", roman: "pa",  dev: "प", group: "Labial" },
  { tirhuta: "𑒤", roman: "pha", dev: "फ", group: "Labial" },
  { tirhuta: "𑒥", roman: "ba",  dev: "ब", group: "Labial" },
  { tirhuta: "𑒦", roman: "bha", dev: "भ", group: "Labial" },
  { tirhuta: "𑒧", roman: "ma",  dev: "म", group: "Labial" },
  { tirhuta: "𑒨", roman: "ya",  dev: "य", group: "Semivowel" },
  { tirhuta: "𑒩", roman: "ra",  dev: "र", group: "Semivowel" },
  { tirhuta: "𑒪", roman: "la",  dev: "ल", group: "Semivowel" },
  { tirhuta: "𑒫", roman: "va",  dev: "व", group: "Semivowel" },
  { tirhuta: "𑒬", roman: "śa",  dev: "श", group: "Sibilant" },
  { tirhuta: "𑒭", roman: "ṣa",  dev: "ष", group: "Sibilant" },
  { tirhuta: "𑒮", roman: "sa",  dev: "स", group: "Sibilant" },
  { tirhuta: "𑒯", roman: "ha",  dev: "ह", group: "Aspirate" },
];

const NUMBERS = [
  { tirhuta: "𑓐", roman: "0", dev: "०" }, { tirhuta: "𑓑", roman: "1", dev: "१" },
  { tirhuta: "𑓒", roman: "2", dev: "२" }, { tirhuta: "𑓓", roman: "3", dev: "३" },
  { tirhuta: "𑓔", roman: "4", dev: "४" }, { tirhuta: "𑓕", roman: "5", dev: "५" },
  { tirhuta: "𑓖", roman: "6", dev: "६" }, { tirhuta: "𑓗", roman: "7", dev: "७" },
  { tirhuta: "𑓘", roman: "8", dev: "८" }, { tirhuta: "𑓙", roman: "9", dev: "९" },
];

const MATRAS = [
  { tirhuta: "𑒰", roman: "ā",  dev: "ा",  vowel: "ā",  example: "𑒏𑒰",  exRoman: "kā",  note: "Joins after the consonant" },
  { tirhuta: "𑒱", roman: "i",  dev: "ि",  vowel: "i",  example: "𑒏𑒱",  exRoman: "ki",  note: "Short 'i' sign" },
  { tirhuta: "𑒲", roman: "ī",  dev: "ी",  vowel: "ī",  example: "𑒏𑒲",  exRoman: "kī",  note: "Long 'ī' sign" },
  { tirhuta: "𑒳", roman: "u",  dev: "ु",  vowel: "u",  example: "𑒏𑒳",  exRoman: "ku",  note: "Attaches below" },
  { tirhuta: "𑒴", roman: "ū",  dev: "ू",  vowel: "ū",  example: "𑒏𑒴",  exRoman: "kū",  note: "Long 'ū' below" },
  { tirhuta: "𑒵", roman: "ṛ",  dev: "ृ",  vowel: "ṛ",  example: "𑒏𑒵",  exRoman: "kṛ",  note: "Vocalic r sign" },
  { tirhuta: "𑒹", roman: "e",  dev: "े",  vowel: "e",  example: "𑒏𑒹",  exRoman: "ke",  note: "Sign for 'e'" },
  { tirhuta: "𑒻", roman: "ai", dev: "ै",  vowel: "ai", example: "𑒏𑒻",  exRoman: "kai", note: "Sign for 'ai'" },
  { tirhuta: "𑒼", roman: "o",  dev: "ो",  vowel: "o",  example: "𑒏𑒼",  exRoman: "ko",  note: "Sign for 'o'" },
  { tirhuta: "𑒾", roman: "au", dev: "ौ",  vowel: "au", example: "𑒏𑒾",  exRoman: "kau", note: "Sign for 'au'" },
  { tirhuta: "𑓀", roman: "ṁ",  dev: "ं",  vowel: "anusvara",  example: "𑒏𑓀",  exRoman: "kaṁ", note: "Nasalisation (anusvāra)" },
  { tirhuta: "𑓁", roman: "ḥ",  dev: "ः",  vowel: "visarga",   example: "𑒏𑓁",  exRoman: "kaḥ", note: "Breath release (visarga)" },
  { tirhuta: "𑓂", roman: "·",  dev: "्",  vowel: "virāma",    example: "𑒏𑓂",  exRoman: "k",   note: "Removes the inherent 'a' — used to form conjuncts" },
];

const CONJUNCTS = [
  { tirhuta: "𑒏𑓂𑒭", roman: "kṣa", dev: "क्ष", parts: "ka + virama + ṣa", example: "lakṣmī",     gloss: "Goddess Lakshmi" },
  { tirhuta: "𑒖𑓂𑒘", roman: "jña", dev: "ज्ञ", parts: "ja + virama + ña", example: "jñāna",      gloss: "knowledge" },
  { tirhuta: "𑒞𑓂𑒩", roman: "tra", dev: "त्र", parts: "ta + virama + ra", example: "tribhuvana", gloss: "three worlds" },
  { tirhuta: "𑒮𑓂𑒫", roman: "sva", dev: "स्व", parts: "sa + virama + va", example: "svāgata",    gloss: "welcome" },
  { tirhuta: "𑒮𑓂𑒟", roman: "stha", dev: "स्थ", parts: "sa + virama + tha", example: "sthāna",    gloss: "place" },
  { tirhuta: "𑒮𑓂𑒩", roman: "sra", dev: "स्र", parts: "sa + virama + ra", example: "sravantī",   gloss: "river" },
  { tirhuta: "𑒬𑓂𑒩", roman: "śra", dev: "श्र", parts: "śa + virama + ra", example: "śrī",        gloss: "honoured / Mr." },
  { tirhuta: "𑒠𑓂𑒨", roman: "dya", dev: "द्य", parts: "da + virama + ya", example: "vidyā",      gloss: "learning" },
  { tirhuta: "𑒠𑓂𑒫", roman: "dva", dev: "द्व", parts: "da + virama + va", example: "dvāra",      gloss: "door" },
  { tirhuta: "𑒣𑓂𑒩", roman: "pra", dev: "प्र", parts: "pa + virama + ra", example: "prasāda",    gloss: "blessed food" },
  { tirhuta: "𑒑𑓂𑒩", roman: "gra", dev: "ग्र", parts: "ga + virama + ra", example: "grāma",      gloss: "village" },
  { tirhuta: "𑒧𑓂𑒯", roman: "mha", dev: "म्ह", parts: "ma + virama + ha", example: "kumhāra",    gloss: "potter (common in Maithili)" },
  { tirhuta: "𑒢𑓂𑒯", roman: "nha", dev: "न्ह", parts: "na + virama + ha", example: "kanhā",      gloss: "Krishna (Maithili form)" },
  { tirhuta: "𑒪𑓂𑒯", roman: "lha", dev: "ल्ह", parts: "la + virama + ha", example: "kulhāṛī",    gloss: "axe (Maithili form)" },
  { tirhuta: "𑒮𑓂𑒧", roman: "sma", dev: "स्म", parts: "sa + virama + ma", example: "smaraṇa",    gloss: "remembrance" },
];

const TABS = [
  { id: "vowels",     label: "Svara",     sub: "Vowels",      data: VOWELS },
  { id: "consonants", label: "Vyañjana",  sub: "Consonants",  data: CONSONANTS },
  { id: "numbers",    label: "Aṅka",      sub: "Numbers",     data: NUMBERS },
  { id: "matras",     label: "Mātrā",     sub: "Vowel signs", data: MATRAS },
  { id: "conjuncts",  label: "Sanyukta",  sub: "Conjuncts",   data: CONJUNCTS },
];

// One representative consonant from each phonetic class, used in the
// Mātrā view to show how each vowel sign attaches across the consonant system.
const CLASS_REPS = [
  { class: "Velar",     consonant: "𑒏", short: "k" },
  { class: "Palatal",   consonant: "𑒔", short: "c" },
  { class: "Retroflex", consonant: "𑒙", short: "ṭ" },
  { class: "Dental",    consonant: "𑒞", short: "t" },
  { class: "Labial",    consonant: "𑒣", short: "p" },
  { class: "Semivowel", consonant: "𑒨", short: "y" },
  { class: "Sibilant",  consonant: "𑒬", short: "ś" },
  { class: "Aspirate",  consonant: "𑒯", short: "h" },
];

// Compute the romanisation of consonant + mātrā for a given pairing.
const matraRoman = (rep, matra) => {
  if (matra.vowel === "virāma")   return rep.short;             // strips the inherent 'a'
  if (matra.vowel === "anusvara") return rep.short + "aṁ";      // ka → kaṁ
  if (matra.vowel === "visarga")  return rep.short + "aḥ";      // ka → kaḥ
  return rep.short + matra.roman;                                // ka + ā → kā
};

// ============================================================
// localStorage helpers
// ============================================================
const lsGet = (key) => {
  try { return localStorage.getItem(key); } catch (_) { return null; }
};
const lsSet = (key, value) => {
  try { localStorage.setItem(key, value); } catch (_) { /* quota / disabled */ }
};

// ============================================================
// Helpers
// ============================================================
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ============================================================
// Writing Canvas
// ============================================================
function WritingCanvas({ targetChar, size = 320 }) {
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const currentRef = useRef([]);
  const drawingRef = useRef(false);
  const [, forceRender] = useState(0);

  const inkColor = "#1B1A2E";

  const drawStroke = (ctx, stroke) => {
    if (stroke.length === 0) return;
    if (stroke.length === 1) {
      ctx.beginPath();
      ctx.arc(stroke[0].x, stroke[0].y, 4, 0, Math.PI * 2);
      ctx.fillStyle = inkColor;
      ctx.fill();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length - 1; i++) {
      const xc = (stroke[i].x + stroke[i + 1].x) / 2;
      const yc = (stroke[i].y + stroke[i + 1].y) / 2;
      ctx.quadraticCurveTo(stroke[i].x, stroke[i].y, xc, yc);
    }
    const last = stroke[stroke.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const fullRedraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    strokesRef.current.forEach((s) => drawStroke(ctx, s));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    fullRedraw();
    // eslint-disable-next-line
  }, [size]);

  useEffect(() => {
    strokesRef.current = [];
    currentRef.current = [];
    drawingRef.current = false;
    fullRedraw();
    forceRender((n) => n + 1);
    // eslint-disable-next-line
  }, [targetChar]);

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    drawingRef.current = true;
    currentRef.current = [getPoint(e)];
    try { canvasRef.current.setPointerCapture(e.pointerId); } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!drawingRef.current) return;
    const point = getPoint(e);
    currentRef.current.push(point);
    const stroke = currentRef.current;
    if (stroke.length >= 2) {
      const ctx = canvasRef.current.getContext("2d");
      const a = stroke[stroke.length - 2];
      const b = stroke[stroke.length - 1];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  };

  const handlePointerUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (currentRef.current.length > 0) {
      strokesRef.current.push(currentRef.current);
    }
    currentRef.current = [];
    forceRender((n) => n + 1);
  };

  const clear = () => {
    strokesRef.current = [];
    fullRedraw();
    forceRender((n) => n + 1);
  };

  const undo = () => {
    strokesRef.current.pop();
    fullRedraw();
    forceRender((n) => n + 1);
  };

  const hasStrokes = strokesRef.current.length > 0;

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-2xl"
           style={{ border: "1px dashed rgba(27,26,46,0.18)", background: "var(--paper)" }}>
        <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: "rgba(27,26,46,0.08)" }}/>
        <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: "rgba(27,26,46,0.08)" }}/>
      </div>

      <div className="absolute inset-0 grid place-items-center pointer-events-none font-tirhuta"
           style={{ fontSize: size * 0.66, color: "rgba(27,26,46,0.10)", lineHeight: 1 }}>
        {targetChar}
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: "none", display: "block", position: "relative", cursor: "crosshair" }}
        className="rounded-2xl"
      />

      <div className="absolute bottom-2 right-2 flex gap-1.5">
        <button onClick={undo}
                disabled={!hasStrokes}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 disabled:opacity-30 transition-opacity"
                style={{ background: "var(--cream-2)", color: "var(--ink)" }}>
          <Undo2 className="w-3.5 h-3.5" /> Undo
        </button>
        <button onClick={clear}
                disabled={!hasStrokes}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 disabled:opacity-30 transition-opacity"
                style={{ background: "var(--vermillion)", color: "var(--paper)" }}>
          <Eraser className="w-3.5 h-3.5" /> Clear
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================
export default function MithilaksharLearn() {
  const [tab, setTab] = useState("vowels");
  const [mode, setMode] = useState("browse");
  const [selected, setSelected] = useState(null);
  const [learned, setLearned] = useState(new Set());
  const [practised, setPractised] = useState(new Set());
  const [hydrated, setHydrated] = useState(false);

  const [quiz, setQuiz] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [feedback, setFeedback] = useState(null);

  const [writeIdx, setWriteIdx] = useState(0);

  // Hydrate from localStorage
  useEffect(() => {
    const v1 = lsGet("mcsa-learned");
    if (v1) { try { setLearned(new Set(JSON.parse(v1))); } catch (_) {} }
    const v2 = lsGet("mcsa-practised");
    if (v2) { try { setPractised(new Set(JSON.parse(v2))); } catch (_) {} }
    setHydrated(true);
  }, []);

  // Persist + notify sidebar
  useEffect(() => {
    if (!hydrated) return;
    lsSet("mcsa-learned",   JSON.stringify([...learned]));
    lsSet("mcsa-practised", JSON.stringify([...practised]));
    window.dispatchEvent(new Event("mcsa-progress-update"));
  }, [learned, practised, hydrated]);

  const currentTab = TABS.find((t) => t.id === tab);
  const currentData = currentTab.data;
  const totalAll = TABS.reduce((sum, t) => sum + t.data.length, 0);
  const learnedCount = learned.size;
  const pct = Math.round((learnedCount / totalAll) * 100);

  const toggleLearned = (key) => {
    setLearned((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });
  };

  const markPractised = (key) => {
    setPractised((prev) => new Set([...prev, key]));
  };

  const startQuiz = () => {
    nextQuestion(currentData);
    setScore({ correct: 0, total: 0 });
    setFeedback(null);
  };

  const nextQuestion = (pool = currentData) => {
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const wrongs = shuffle(pool.filter((x) => x.tirhuta !== correct.tirhuta)).slice(0, 3);
    const options = shuffle([correct, ...wrongs]);
    setQuiz({ correct, options });
    setFeedback(null);
  };

  const answer = (option) => {
    if (feedback) return;
    const isRight = option.roman === quiz.correct.roman;
    setScore((s) => ({ correct: s.correct + (isRight ? 1 : 0), total: s.total + 1 }));
    setFeedback({ type: isRight ? "correct" : "wrong", answer: quiz.correct.roman });
    if (isRight) setLearned((prev) => new Set([...prev, quiz.correct.tirhuta]));
  };

  useEffect(() => {
    if (mode === "practice") {
      if (!quiz || !currentData.some((d) => d.tirhuta === quiz.correct.tirhuta)) startQuiz();
    } else {
      setQuiz(null);
    }
    if (mode === "write") setWriteIdx(0);
    // eslint-disable-next-line
  }, [mode, tab]);

  const speak = (text, lang = "hi-IN") => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (_) {}
  };

  return (
    <div className="font-body" style={{ color: "var(--ink)" }}>
      {/* HERO — 3-script (Mithilakshar primary, English, Devanagari) */}
      <PageHero
        eyebrow="Tirhuta · Mithilakshar"
        title="Mithilakshar"
        devanagari="मिथिलाक्षर"
        description="Begin with vowels and consonants, learn how mātrās attach, study common conjuncts, then practise writing each one yourself."
      >
        <div className="mt-6 max-w-md">
          <div className="flex items-center justify-between text-xs mb-1.5" style={{ opacity: 0.7 }}>
            <span className="font-medium tracking-wide uppercase">Your progress</span>
            <span className="font-display italic">{pct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--cream-2)" }}>
            <div className="h-full transition-all duration-500"
                 style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--turmeric), var(--vermillion))" }}/>
          </div>
        </div>
      </PageHero>

      {/* MODE TOGGLE */}
      <div className="px-6 lg:px-10 max-w-5xl mx-auto">
        <div className="inline-flex rounded-full p-1 border" style={{ borderColor: "var(--cream-2)", background: "var(--paper)" }}>
          {[
            { id: "browse",   label: "Browse",   icon: BookOpen },
            { id: "practice", label: "Practice", icon: Target },
            { id: "write",    label: "Write",    icon: PenLine },
          ].map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${active ? "" : "opacity-60 hover:opacity-90"}`}
                      style={active ? { background: "var(--ink)", color: "var(--paper)" } : { color: "var(--ink)" }}>
                <Icon className="w-4 h-4" /> {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TABS */}
      <nav className="px-6 lg:px-10 max-w-5xl mx-auto mt-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`px-5 py-3 rounded-2xl text-left transition-all border shrink-0 ${active ? "shadow-sm" : "hover:bg-white/40"}`}
                      style={{
                        borderColor: active ? "var(--ink)" : "var(--cream-2)",
                        background: active ? "var(--paper)" : "transparent"
                      }}>
                <div className="font-display text-lg leading-none" style={{ color: active ? "var(--vermillion)" : "var(--ink)" }}>
                  {t.label}
                </div>
                <div className="text-[11px] tracking-wider uppercase mt-1" style={{ opacity: 0.6 }}>
                  {t.sub} · {t.data.length}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* CONTENT */}
      <main className="px-6 lg:px-10 max-w-5xl mx-auto mt-6 pb-16">
        {mode === "browse" && (
          <BrowseGrid data={currentData} tabId={tab} learned={learned} onSelect={setSelected} />
        )}
        {mode === "practice" && quiz && (
          <PracticePanel quiz={quiz} feedback={feedback} score={score}
            tabLabel={currentTab.sub} onAnswer={answer} onNext={() => nextQuestion()} />
        )}
        {mode === "write" && (
          <WritePanel data={currentData} tabLabel={currentTab.sub}
            writeIdx={writeIdx} setWriteIdx={setWriteIdx}
            practised={practised} onMarkPractised={markPractised} />
        )}
      </main>

      {/* DETAIL MODAL */}
      {selected && (
        <DetailModal char={selected} tabId={tab}
          isLearned={learned.has(selected.tirhuta)}
          onToggle={() => toggleLearned(selected.tirhuta)}
          onClose={() => setSelected(null)} onSpeak={speak} />
      )}
    </div>
  );
}

// ============================================================
// Browse Grid
// ============================================================
function BrowseGrid({ data, tabId, learned, onSelect }) {
  const grouped = useMemo(() => {
    if (!data[0]?.group) return [{ group: null, items: data }];
    const map = new Map();
    data.forEach((c) => {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group).push(c);
    });
    return [...map.entries()].map(([group, items]) => ({ group, items }));
  }, [data]);

  const isMatra = tabId === "matras";
  const isConjunct = tabId === "conjuncts";

  return (
    <div className="space-y-8">
      {isMatra && (
        <div className="rounded-2xl p-4 text-sm leading-relaxed"
             style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
          <span className="font-display italic" style={{ color: "var(--leaf)" }}>About mātrās — </span>
          A mātrā is a vowel sign that attaches to a consonant. Each card below shows the mātrā applied to one representative from every consonant class — so you can see how the same sign behaves across the system.
          <div className="mt-2 text-xs" style={{ opacity: 0.65 }}>
            Combinations use Unicode rendering via Noto Sans Tirhuta. Traditional Maithili handwritten forms may have variations for certain letters — these will be refined with scholar input.
          </div>
        </div>
      )}

      {isConjunct && (
        <div className="rounded-2xl p-4 text-sm leading-relaxed"
             style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
          <span className="font-display italic" style={{ color: "var(--leaf)" }}>About conjuncts (sanyukta) — </span>
          When two consonants come together without a vowel, the <em>virāma</em> (<span className="font-tirhuta">𑓂</span>) joins them. Each card below shows the cluster with a real Maithili word.
        </div>
      )}

      {grouped.map(({ group, items }) => (
        <div key={group ?? "all"}>
          {group && (
            <div className="mb-3 flex items-center gap-3">
              <span className="font-display text-sm uppercase tracking-[0.2em]" style={{ color: "var(--vermillion-dark)" }}>{group}</span>
              <div className="flex-1 h-px" style={{ background: "var(--cream-2)" }}/>
            </div>
          )}

          {isConjunct ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((c) => (
                <button key={c.tirhuta}
                        onClick={() => onSelect(c)}
                        className="text-left rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md p-4 relative"
                        style={{ borderColor: "var(--cream-2)", background: "var(--paper)" }}>
                  {learned.has(c.tirhuta) && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full grid place-items-center"
                          style={{ background: "var(--leaf)", color: "var(--paper)" }}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                  )}
                  <div className="flex items-baseline gap-3">
                    <span className="font-tirhuta text-5xl leading-none">{c.tirhuta}</span>
                    <div>
                      <div className="font-display italic text-xl" style={{ color: "var(--vermillion)" }}>{c.roman}</div>
                      <div className="text-sm" style={{ opacity: 0.6 }}>{c.dev}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs" style={{ opacity: 0.7 }}>
                    <span className="font-display italic">{c.example}</span> — {c.gloss}
                  </div>
                </button>
              ))}
            </div>
          ) : isMatra ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {items.map((c) => (
                <MatraComparisonCard key={c.tirhuta} matra={c} onSelect={onSelect} isLearned={learned.has(c.tirhuta)} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {items.map((c) => (
                <button key={c.tirhuta}
                        onClick={() => onSelect(c)}
                        className="group relative aspect-square rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md text-left p-3 flex flex-col"
                        style={{ borderColor: "var(--cream-2)", background: "var(--paper)" }}>
                  {learned.has(c.tirhuta) && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full grid place-items-center"
                          style={{ background: "var(--leaf)", color: "var(--paper)" }}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                  )}
                  <div className="flex-1 grid place-items-center">
                    <span className="font-tirhuta text-5xl sm:text-6xl leading-none">{c.tirhuta}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display italic text-base" style={{ color: "var(--vermillion)" }}>
                      {c.roman}
                    </span>
                    <span className="text-sm" style={{ opacity: 0.55 }}>{c.dev}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Mātrā Comparison Card — shows a mātrā applied across all consonant classes
// ============================================================
function MatraComparisonCard({ matra, onSelect, isLearned }) {
  return (
    <div className="rounded-2xl border p-5 relative transition-all hover:shadow-md"
         style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
      {isLearned && (
        <span className="absolute top-3 right-3 w-5 h-5 rounded-full grid place-items-center z-10"
              style={{ background: "var(--leaf)", color: "var(--paper)" }}>
          <Check className="w-3 h-3" strokeWidth={3} />
        </span>
      )}

      {/* Header — the matra itself */}
      <button onClick={() => onSelect(matra)}
              className="w-full text-left flex items-start gap-4 pb-4 border-b"
              style={{ borderColor: "var(--cream-2)" }}>
        <span className="font-tirhuta text-6xl leading-none shrink-0">{matra.tirhuta}</span>
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-display italic text-2xl" style={{ color: "var(--vermillion)" }}>
              {matra.roman === "·" ? "virāma" : `${matra.roman}-mātrā`}
            </span>
            <span className="text-sm" style={{ opacity: 0.6 }}>{matra.dev}</span>
          </div>
          {matra.note && (
            <div className="text-xs mt-1 leading-relaxed" style={{ opacity: 0.7 }}>
              {matra.note}
            </div>
          )}
        </div>
      </button>

      {/* Body — class comparison grid */}
      <div className="mt-4">
        <div className="text-[10px] tracking-[0.2em] uppercase mb-2.5"
             style={{ color: "var(--vermillion-dark)", opacity: 0.85 }}>
          Across the consonant classes
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5">
          {CLASS_REPS.map((rep) => {
            const combined = rep.consonant + matra.tirhuta;
            const combinedRoman = matraRoman(rep, matra);
            return (
              <div key={rep.class}
                   className="rounded-lg px-2 py-2.5 text-center"
                   style={{ background: "var(--cream)" }}>
                <div className="text-[8px] tracking-[0.12em] uppercase font-medium" style={{ opacity: 0.55 }}>
                  {rep.class}
                </div>
                <div className="font-tirhuta text-3xl leading-none mt-1.5">{combined}</div>
                <div className="text-[11px] font-display italic mt-1"
                     style={{ color: "var(--vermillion)" }}>
                  {combinedRoman}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Detail Modal
// ============================================================
function DetailModal({ char, tabId, isLearned, onToggle, onClose, onSpeak }) {
  const isMatra = tabId === "matras";
  const isConjunct = tabId === "conjuncts";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" style={{ background: "rgba(27,26,46,0.55)" }} onClick={onClose}>
      <div className="pop-in w-full max-w-md rounded-3xl overflow-hidden"
           style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}
           onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-5 flex items-center justify-between">
          <button onClick={onClose}
                  className="text-xs tracking-wider uppercase flex items-center gap-1"
                  style={{ opacity: 0.6 }}>
            <ChevronLeft className="w-3 h-3" /> Close
          </button>
          {char.group && (
            <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--vermillion-dark)" }}>
              {char.group}
            </span>
          )}
        </div>

        <div className="px-6 py-8 grid place-items-center">
          {isMatra ? (
            <div className="text-center">
              <div className="font-tirhuta text-[110px] leading-none">{char.tirhuta}</div>
              <div className="text-[11px] tracking-[0.2em] uppercase mt-3" style={{ opacity: 0.5 }}>with ka</div>
              <div className="font-tirhuta text-[60px] leading-none mt-2">{char.example}</div>
            </div>
          ) : (
            <div className="font-tirhuta text-[140px] leading-none">{char.tirhuta}</div>
          )}
        </div>

        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl p-3" style={{ background: "var(--cream)" }}>
              <div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>Roman</div>
              <div className="font-display italic text-xl mt-0.5" style={{ color: "var(--vermillion)" }}>
                {isMatra ? char.exRoman : char.roman}
              </div>
            </div>
            <div className="rounded-xl p-3" style={{ background: "var(--cream)" }}>
              <div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>Devanagari</div>
              <div className="text-xl mt-0.5">{char.dev}</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: "var(--cream)" }}>
              <div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>
                {isConjunct ? "Parts" : isMatra ? "Vowel" : "IPA"}
              </div>
              <div className="text-base mt-0.5 font-display italic">
                {isConjunct ? char.parts.split(" + ").length + " parts" : isMatra ? char.vowel : (char.ipa ?? "—")}
              </div>
            </div>
          </div>

          {isConjunct && (
            <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: "var(--cream)" }}>
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ opacity: 0.6 }}>Breakdown</div>
              <div className="font-display italic">{char.parts}</div>
              <div className="mt-2 text-xs" style={{ opacity: 0.7 }}>
                Example: <span className="font-display italic">{char.example}</span> — {char.gloss}
              </div>
            </div>
          )}

          {char.note && (
            <p className="mt-4 text-sm leading-relaxed" style={{ opacity: 0.75 }}>
              <span className="font-display italic" style={{ color: "var(--leaf)" }}>Tip — </span>
              {char.note}
            </p>
          )}

          <div className="mt-5 flex gap-2">
            <button onClick={() => onSpeak(char.dev || char.roman)}
                    className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium border"
                    style={{ borderColor: "var(--cream-2)" }}>
              <Volume2 className="w-4 h-4" /> Hear
            </button>
            <button onClick={onToggle}
                    className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all"
                    style={isLearned
                      ? { background: "var(--leaf)", color: "var(--paper)" }
                      : { background: "var(--ink)", color: "var(--paper)" }}>
              {isLearned ? <><Check className="w-4 h-4" /> Learned</> : <><Sparkles className="w-4 h-4" /> Mark learned</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Practice Panel
// ============================================================
function PracticePanel({ quiz, feedback, score, tabLabel, onAnswer, onNext }) {
  const accuracy = score.total === 0 ? 0 : Math.round((score.correct / score.total) * 100);
  return (
    <div className="grid md:grid-cols-[1.2fr_1fr] gap-6">
      <div className="rounded-3xl p-8 relative overflow-hidden border"
           style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
        <div className="absolute -top-6 -right-6 opacity-10" style={{ color: "var(--vermillion)" }}>
          <SunMotif className="w-44 h-44" />
        </div>
        <div className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--leaf)" }}>
          {tabLabel} · what is this?
        </div>
        <div className="grid place-items-center py-8">
          <div className={`font-tirhuta text-[140px] sm:text-[180px] leading-none ${feedback?.type === "wrong" ? "shake" : ""}`}>
            {quiz.correct.tirhuta}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quiz.options.map((opt) => {
            const isCorrect = feedback && opt.roman === quiz.correct.roman;
            const isWrongPick = feedback?.type === "wrong" && opt.roman === feedback.answer;
            return (
              <button key={opt.tirhuta}
                      onClick={() => onAnswer(opt)}
                      disabled={!!feedback}
                      className="px-4 py-4 rounded-2xl border text-left transition-all hover:-translate-y-0.5 disabled:cursor-default"
                      style={{
                        borderColor: isCorrect ? "var(--leaf)" : "var(--cream-2)",
                        background: isCorrect ? "rgba(72,107,60,0.12)" : "var(--cream)",
                        opacity: feedback && !isCorrect && !isWrongPick ? 0.5 : 1,
                      }}>
                <div className="font-display italic text-2xl" style={{ color: isCorrect ? "var(--leaf)" : "var(--vermillion)" }}>
                  {opt.roman}
                </div>
                <div className="text-xs mt-0.5" style={{ opacity: 0.6 }}>{opt.dev}</div>
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className="mt-5 flex items-center justify-between">
            <div className="text-sm">
              {feedback.type === "correct"
                ? <span style={{ color: "var(--leaf)" }} className="font-medium">✓ Correct!</span>
                : <span style={{ color: "var(--vermillion)" }} className="font-medium">
                    Not quite — it's <em className="font-display">{feedback.answer}</em>
                  </span>}
            </div>
            <button onClick={onNext}
                    className="px-5 py-2.5 rounded-full text-sm font-semibold"
                    style={{ background: "var(--ink)", color: "var(--paper)" }}>
              Next →
            </button>
          </div>
        )}
      </div>

      <div className="rounded-3xl p-6 border" style={{ background: "var(--cream-2)", borderColor: "var(--cream-2)" }}>
        <div className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "var(--vermillion-dark)" }}>Session</div>
        <div className="font-display text-4xl leading-none">
          {score.correct} <span className="opacity-40">/ {score.total}</span>
        </div>
        <div className="mt-1 text-sm font-display italic" style={{ color: "var(--leaf)" }}>{accuracy}% accuracy</div>

        <div className="mt-6 h-px" style={{ background: "var(--cream)" }}/>

        <p className="mt-4 text-sm leading-relaxed" style={{ opacity: 0.75 }}>
          Correct answers mark the character as <em className="font-display">learned</em> in your progress.
          Switch tabs above to practise vowels, consonants, numbers, mātrās or conjuncts.
        </p>

        <button onClick={onNext}
                className="mt-5 w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
                style={{ background: "var(--paper)", border: "1px solid var(--cream)" }}>
          <RotateCcw className="w-4 h-4" /> Skip
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Write Panel
// ============================================================
function WritePanel({ data, tabLabel, writeIdx, setWriteIdx, practised, onMarkPractised }) {
  const current = data[writeIdx];
  const next = () => setWriteIdx((i) => (i + 1) % data.length);
  const prev = () => setWriteIdx((i) => (i - 1 + data.length) % data.length);

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
      <div className="rounded-3xl p-6 border flex flex-col items-center"
           style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
        <div className="w-full flex items-center justify-between mb-4">
          <div className="text-[11px] tracking-[0.2em] uppercase" style={{ color: "var(--leaf)" }}>
            {tabLabel} · trace
          </div>
          <div className="text-xs" style={{ opacity: 0.6 }}>
            {writeIdx + 1} / {data.length}
          </div>
        </div>

        <WritingCanvas key={current.tirhuta} targetChar={current.tirhuta} size={300} />

        <div className="mt-5 w-full flex items-center justify-between gap-3">
          <button onClick={prev}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ borderColor: "var(--cream-2)" }}>
            ← Prev
          </button>
          <button onClick={() => { onMarkPractised(current.tirhuta); next(); }}
                  className="flex-1 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: "var(--ink)", color: "var(--paper)" }}>
            <Check className="w-4 h-4" /> Done — Next
          </button>
          <button onClick={next}
                  className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ borderColor: "var(--cream-2)" }}>
            Skip →
          </button>
        </div>
      </div>

      <div className="rounded-3xl p-6 border relative overflow-hidden"
           style={{ background: "var(--cream-2)", borderColor: "var(--cream-2)" }}>
        <div className="absolute -bottom-6 -right-6 opacity-10" style={{ color: "var(--indigo)" }}>
          <LotusMotif className="w-44 h-44" />
        </div>

        <div className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "var(--vermillion-dark)" }}>
          You're writing
        </div>

        <div className="flex items-baseline gap-4">
          <span className="font-tirhuta text-7xl leading-none">{current.tirhuta}</span>
          <div>
            <div className="font-display italic text-3xl" style={{ color: "var(--vermillion)" }}>
              {current.exRoman ?? current.roman}
            </div>
            <div className="text-sm mt-1" style={{ opacity: 0.65 }}>{current.dev}</div>
          </div>
        </div>

        {current.note && (
          <p className="mt-4 text-sm leading-relaxed" style={{ opacity: 0.8 }}>
            <span className="font-display italic" style={{ color: "var(--leaf)" }}>Tip — </span>
            {current.note}
          </p>
        )}

        {current.example && current.gloss && (
          <p className="mt-3 text-sm" style={{ opacity: 0.75 }}>
            Example: <span className="font-display italic">{current.example}</span> — {current.gloss}
          </p>
        )}

        <div className="mt-6 h-px" style={{ background: "var(--paper)" }}/>

        <div className="mt-4">
          <div className="text-[11px] tracking-[0.18em] uppercase mb-2" style={{ opacity: 0.6 }}>Jump to</div>
          <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
            {data.map((c, i) => {
              const active = i === writeIdx;
              const done = practised.has(c.tirhuta);
              return (
                <button key={c.tirhuta}
                        onClick={() => setWriteIdx(i)}
                        className="font-tirhuta text-xl w-10 h-10 rounded-lg border grid place-items-center transition-all hover:-translate-y-0.5"
                        style={{
                          borderColor: active ? "var(--ink)" : "var(--cream)",
                          background: active ? "var(--paper)" : "transparent",
                          color: done ? "var(--leaf)" : "var(--ink)",
                          fontWeight: done ? 600 : 400,
                        }}
                        title={c.exRoman ?? c.roman}>
                  {c.tirhuta}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px]" style={{ opacity: 0.6 }}>
            Characters in <span style={{ color: "var(--leaf)", fontWeight: 600 }}>green</span> have been practised.
          </p>
        </div>
      </div>
    </div>
  );
}
