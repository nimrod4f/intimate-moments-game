import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  Clock3,
  Dices,
  ExternalLink,
  Heart,
  Lock,
  Moon,
  Pause,
  Play,
  RefreshCcw,
  RotateCcw,
  Sparkles,
  Unlock,
  Volume2,
} from "lucide-react";
import { cards, type Category, type GameCard } from "@/data/cards";
import { levels, levelOrder, timeSeconds } from "@/data/dice";
import { GameProvider, useGame, type GameScreen } from "@/lib/game-context";
import { Button } from "@/components/ui/button";

const places = [
  { icon: "🛏️", label: "בחדר" },
  { icon: "🛋️", label: "בסלון" },
  { icon: "🌙", label: "בחוץ" },
];
const drinks = [
  { icon: "🍺", label: "בירה" },
  { icon: "🍷", label: "יין" },
  { icon: "🍸", label: "קוקטייל" },
];
const categoryMeta: Record<Category, { title: string; icon: string; className: string }> = {
  closeness: { title: "קרבה", icon: "❤️", className: "category-closeness" },
  tension: { title: "מתח", icon: "🔥", className: "category-tension" },
  bold: { title: "נועז", icon: "😈", className: "category-bold" },
};
const animatedScreens: GameScreen[] = [
  "welcome",
  "place",
  "drink",
  "names",
  "write1",
  "pass2",
  "choose1",
  "write2",
  "pass1",
  "choose2",
  "summary",
  "menu",
  "categories",
  "finish",
  "diceLevel",
  "diceFinish",
];

function Shell({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <div
        className={`mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 ${compact ? "py-6" : "py-10"}`}
      >
        {children}
      </div>
    </main>
  );
}
function Brand() {
  return (
    <div className="mb-10 flex items-center justify-between">
      <span className="font-display text-xl font-semibold text-primary">משחק מקדים</span>
      <Moon className="h-5 w-5 text-accent" strokeWidth={1.5} />
    </div>
  );
}
function Back({ to }: { to: GameScreen }) {
  const { setState } = useGame();
  return (
    <Button
      variant="ghost"
      aria-label="חזרה"
      onClick={() => setState((s) => ({ ...s, screen: to }))}
      className="absolute start-4 top-4 h-11 w-11 p-0"
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  );
}
function Progress({ step }: { step: number }) {
  return (
    <div className="mb-10 flex justify-center gap-2" aria-label={`שלב ${step} מתוך 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`progress-dot ${i <= step ? "progress-dot-active" : ""}`} />
      ))}
    </div>
  );
}
function ChoiceGrid({
  items,
  onChoose,
}: {
  items: { icon: string; label: string }[];
  onChoose: (v: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {items.map((item, i) => (
        <motion.button
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          whileTap={{ scale: 0.98 }}
          className="choice-card"
          onClick={() => onChoose(item.label)}
        >
          <span className="text-3xl">{item.icon}</span>
          <span className="text-lg font-semibold">{item.label}</span>
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </motion.button>
      ))}
    </div>
  );
}

function Welcome() {
  const { setState } = useGame();
  const [adult, setAdult] = useState(false);
  return (
    <Shell>
      <div className="flex flex-1 flex-col justify-center pb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Moon className="mx-auto mb-8 h-14 w-14 text-accent" strokeWidth={1} />
          <h1 className="font-display text-5xl font-bold leading-tight text-primary">משחק מקדים</h1>
          <p className="mt-4 text-lg text-muted-foreground">ערב של קרבה, מתח ומשחק</p>
        </motion.div>
        <div className="mt-20">
          <label className="consent-row">
            <input
              type="checkbox"
              checked={adult}
              onChange={(e) => setAdult(e.target.checked)}
              className="sr-only"
            />
            <span className={`checkbox ${adult ? "checkbox-checked" : ""}`}>
              {adult && <Check className="h-4 w-4" />}
            </span>
            <span>שנינו מעל גיל 18</span>
          </label>
          <Button
            disabled={!adult}
            onClick={() => setState((s) => ({ ...s, screen: "place" }))}
            className="mt-5 w-full"
          >
            מתחילים
          </Button>
        </div>
      </div>
    </Shell>
  );
}
function SetupChoice({ kind }: { kind: "place" | "drink" }) {
  const { setState } = useGame();
  const isPlace = kind === "place";
  return (
    <Shell>
      <Back to={isPlace ? "welcome" : "place"} />
      <Brand />
      <Progress step={isPlace ? 1 : 2} />
      <p className="eyebrow">בונים אווירה</p>
      <h1 className="screen-title">{isPlace ? "איפה הערב?" : "מה שותים?"}</h1>
      <p className="screen-copy">
        {isPlace ? "בחרו את המקום שמתאים לכם הערב" : "משהו קטן שיכניס אתכם לאווירה"}
      </p>
      <div className="mt-10">
        <ChoiceGrid
          items={isPlace ? places : drinks}
          onChoose={(v) =>
            setState((s) => ({ ...s, [kind]: v, screen: isPlace ? "drink" : "names" }))
          }
        />
      </div>
    </Shell>
  );
}
function Names() {
  const { state, setState } = useGame();
  return (
    <Shell>
      <Back to="drink" />
      <Brand />
      <Progress step={3} />
      <p className="eyebrow">רק ביניכם</p>
      <h1 className="screen-title">איך לקרוא לכם?</h1>
      <p className="screen-copy">אפשר להשאיר את ברירת המחדל</p>
      <div className="mt-10 space-y-4">
        {state.names.map((n, i) => (
          <label key={i} className="field-label">
            {`שם ${i + 1}`}
            <input
              className="text-field"
              value={n}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  names: s.names.map((x, j) => (j === i ? e.target.value : x)) as [string, string],
                }))
              }
            />
          </label>
        ))}
      </div>
      <Button
        className="mt-auto"
        disabled={state.names.some((n) => !n.trim())}
        onClick={() => setState((s) => ({ ...s, screen: "write1" }))}
      >
        ממשיכים
      </Button>
    </Shell>
  );
}
function WriteOptions({ person }: { person: 0 | 1 }) {
  const { state, setState } = useGame();
  const opts = person === 0 ? state.options1 : state.options2;
  const target = state.names[person === 0 ? 1 : 0];
  return (
    <Shell>
      <Brand />
      <Progress step={3} />
      <p className="eyebrow">בחירה סודית</p>
      <h1 className="screen-title">{state.names[person]}</h1>
      <p className="screen-copy">כתבו 3 אופציות למה {target} ילבש/תלבש הערב</p>
      <div className="mt-9 space-y-3">
        {opts.map((v, i) => (
          <input
            key={i}
            className="text-field"
            value={v}
            placeholder={`אופציה ${i + 1}`}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                [person === 0 ? "options1" : "options2"]: opts.map((x, j) =>
                  j === i ? e.target.value : x,
                ),
              }))
            }
          />
        ))}
      </div>
      <Button
        disabled={opts.some((x) => !x.trim())}
        className="mt-auto"
        onClick={() => setState((s) => ({ ...s, screen: person === 0 ? "pass2" : "pass1" }))}
      >
        מוכן — להעביר את הטלפון
      </Button>
    </Shell>
  );
}
function PassPhone({ toPerson }: { toPerson: 0 | 1 }) {
  const { state, setState } = useGame();
  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="pass-icon"
        >
          <Moon className="h-10 w-10" strokeWidth={1.3} />
        </motion.div>
        <p className="eyebrow mt-8">הגיע הזמן להחליף</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight">
          העבירו את הטלפון
          <br />ל{state.names[toPerson]}
        </h1>
        <p className="mt-5 text-muted-foreground">האופציות נשארות סודיות עד שהטלפון עובר</p>
        <Button
          className="mt-12 w-full"
          onClick={() =>
            setState((s) => ({ ...s, screen: toPerson === 1 ? "choose1" : "choose2" }))
          }
        >
          קיבלתי
        </Button>
      </div>
    </Shell>
  );
}
function ChooseOutfit({ chooser }: { chooser: 0 | 1 }) {
  const { state, setState } = useGame();
  const options = chooser === 1 ? state.options1 : state.options2;
  const wearer = chooser === 1 ? 1 : 0;
  return (
    <Shell>
      <Brand />
      <Progress step={3} />
      <p className="eyebrow">עכשיו הבחירה שלך</p>
      <h1 className="screen-title">
        {state.names[chooser]}, מה {state.names[wearer]} ילבש/תלבש?
      </h1>
      <div className="mt-10 grid gap-3">
        {options.map((o, i) => (
          <Button
            variant="secondary"
            className="choice-button"
            key={i}
            onClick={() =>
              setState((s) => ({
                ...s,
                outfits: s.outfits.map((x, j) => (j === wearer ? o : x)) as [string, string],
                screen: chooser === 1 ? "write2" : "summary",
              }))
            }
          >
            {o}
          </Button>
        ))}
      </div>
    </Shell>
  );
}
function Summary() {
  const { state, setState } = useGame();
  return (
    <Shell>
      <Brand />
      <div className="flex flex-1 flex-col justify-center">
        <p className="eyebrow text-center">הכל מוכן</p>
        <h1 className="mt-3 text-center font-display text-4xl font-bold">הערב שלכם</h1>
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="summary-panel mt-9"
        >
          <SummaryLine label="איפה" value={state.place} />
          <SummaryLine label="שותים" value={state.drink} />
          <SummaryLine label={state.names[0]} value={`לובש/ת ${state.outfits[0]}`} />
          <SummaryLine label={state.names[1]} value={`לובש/ת ${state.outfits[1]}`} />
        </motion.div>
        <Button className="mt-8" onClick={() => setState((s) => ({ ...s, screen: "menu" }))}>
          למשחקים
        </Button>
      </div>
    </Shell>
  );
}
function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="summary-line">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
function NewEvening() {
  const { reset } = useGame();
  return (
    <Button variant="ghost" onClick={reset} className="text-xs">
      <RefreshCcw className="h-4 w-4" />
      ערב חדש
    </Button>
  );
}
function Menu() {
  const { setState } = useGame();
  return (
    <Shell>
      <div className="flex items-center justify-between">
        <Brand />
        <NewEvening />
      </div>
      <p className="eyebrow mt-5">בחרו משחק</p>
      <h1 className="screen-title">מה בא לכם עכשיו?</h1>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setState((s) => ({ ...s, screen: "categories" }))}
        className="game-card-active mt-10"
      >
        <span className="game-number">01</span>
        <div>
          <span className="block text-sm text-primary/70">משחק 1</span>
          <strong className="mt-1 block font-display text-3xl">הקלפים</strong>
          <span className="mt-2 block text-sm text-muted-foreground">18 רגעים שמחכים לכם</span>
        </div>
        <ChevronLeft className="h-6 w-6 text-accent" />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setState((s) => ({ ...s, screen: "diceLevel" }))}
        className="game-card-active mt-4"
      >
        <span className="game-number">02</span>
        <div>
          <span className="block text-sm text-primary/70">משחק 2</span>
          <strong className="mt-1 block font-display text-3xl">הקוביות</strong>
          <span className="mt-2 block text-sm text-muted-foreground">גלגלו ותנו למקרה להחליט</span>
        </div>
        <ChevronLeft className="h-6 w-6 text-accent" />
      </motion.button>
      <div className="game-card-disabled">
        <span className="game-number">03</span>
        <div>
          <span className="block text-sm">משחק 3</span>
          <strong className="mt-1 block text-xl">בקרוב</strong>
        </div>
      </div>
    </Shell>
  );
}
function Categories() {
  const { state, setState } = useGame();
  const allDone = Object.values(state.opened).every((ids) => ids.length === 6);
  useEffect(() => {
    if (allDone) setState((s) => ({ ...s, screen: "finish" }));
  }, [allDone, setState]);
  const choose = (cat: Category) => {
    const remaining = cards.filter((c) => c.category === cat && !state.opened[cat].includes(c.id));
    if (!remaining.length) return;
    const card = remaining[Math.floor(Math.random() * remaining.length)];
    if (!card) return;
    setState((s) => ({ ...s, activeCategory: cat, activeCardId: card.id, screen: "shuffle" }));
  };
  return (
    <Shell>
      <div className="flex items-center justify-between">
        <Brand />
        <NewEvening />
      </div>
      <p className="eyebrow mt-4">משחק הקלפים</p>
      <h1 className="screen-title">איזה קצב מתאים עכשיו?</h1>
      <div className="mt-9 flex flex-col gap-4">
        {(Object.keys(categoryMeta) as Category[]).map((cat, i) => {
          const left = 6 - state.opened[cat].length;
          const m = categoryMeta[cat];
          return (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: left ? 0.98 : 1 }}
              disabled={!left}
              onClick={() => choose(cat)}
              className={`category-button ${m.className} ${!left ? "category-done" : ""}`}
            >
              <span className="text-3xl">{m.icon}</span>
              <span className="flex-1 text-right">
                <strong className="block font-display text-2xl">{m.title}</strong>
                <small>{left ? `נשארו ${left} מתוך 6` : "סיימתם את הקטגוריה"}</small>
              </span>
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          );
        })}
      </div>
    </Shell>
  );
}
function Shuffle() {
  const { state, setState } = useGame();
  useEffect(() => {
    const t = setTimeout(() => setState((s) => ({ ...s, screen: "card" })), 1500);
    return () => clearTimeout(t);
  }, [setState]);
  const cat = state.activeCategory ?? "closeness";
  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="eyebrow">מערבבים רגעים</p>
        <h1 className="mt-3 font-display text-4xl font-bold">הקלף שלכם בדרך</h1>
        <div className="relative mt-16 h-60 w-44">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={`shuffle-card ${categoryMeta[cat].className}`}
              initial={{ x: 0, y: i * 3, rotate: 0 }}
              animate={{
                x: [0, (i % 2 ? 1 : -1) * (70 + i * 10), 0],
                rotate: [0, (i % 2 ? 1 : -1) * 12, 0],
                y: [i * 3, -8, i * 3],
              }}
              transition={{ duration: 0.48, repeat: 2, delay: i * 0.04 }}
            >
              <Moon className="h-10 w-10" strokeWidth={1} />
            </motion.div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
function CardView() {
  const { state, setState } = useGame();
  const card = cards.find((c) => c.id === state.activeCardId);
  const [guessDone, setGuessDone] = useState(false);
  if (!card || !state.activeCategory) return null;
  const cat = state.activeCategory;
  const done = () => {
    if (card.type === "guess" && !guessDone) {
      setGuessDone(true);
      return;
    }
    setState((s) => ({
      ...s,
      opened: { ...s.opened, [cat]: [...s.opened[cat], card.id] },
      screen: "categories",
      activeCardId: null,
    }));
  };
  const swap = () => {
    const remaining = cards.filter(
      (c) => c.category === cat && !state.opened[cat].includes(c.id) && c.id !== card.id,
    );
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    if (!next) return;
    setState((s) => ({
      ...s,
      activeCardId: next.id,
      swapped: { ...s.swapped, [cat]: true },
      screen: "shuffle",
    }));
  };
  return (
    <Shell compact>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-primary">
          {categoryMeta[cat].icon} {categoryMeta[cat].title}
        </span>
        <span className="text-xs text-muted-foreground">{state.opened[cat].length + 1} / 6</span>
      </div>
      <motion.article
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.55 }}
        className={`task-card mt-6 ${categoryMeta[cat].className}`}
      >
        <Sparkles className="h-6 w-6 text-accent" />
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight">{card.title}</h1>
        <p className="mt-6 whitespace-pre-line text-lg leading-8 text-card-foreground/90">
          {card.text}
        </p>
        <div className="mt-auto pt-8">
          <CardAction card={card} />
        </div>
      </motion.article>
      {guessDone ? (
        <GuessResult onSelect={done} />
      ) : (
        <div className="mt-5 grid gap-3">
          <Button onClick={done}>סיימנו</Button>
          {!state.swapped[cat] && (
            <Button variant="ghost" onClick={swap}>
              <RotateCcw className="h-4 w-4" />
              החלף קלף
            </Button>
          )}
        </div>
      )}
    </Shell>
  );
}
function CardAction({ card }: { card: GameCard }) {
  const [timerOpen, setTimerOpen] = useState(false);
  if (card.type === "timer")
    return (
      <>
        <Button variant="secondary" onClick={() => setTimerOpen(true)} className="w-full">
          <Clock3 className="h-5 w-5" />
          התחילו
        </Button>
        <AnimatePresence>
          {timerOpen && (
            <TimerOverlay
              seconds={card.duration ?? 60}
              swap={card.swap ?? false}
              onClose={() => setTimerOpen(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  if (card.type === "song") return <SongAction />;
  if (card.type === "video")
    return (
      <a
        href="https://www.netflix.com/search?q=bridgerton"
        target="_blank"
        rel="noreferrer"
        className="external-action"
      >
        לצפייה בסצנה <ExternalLink className="h-5 w-5" />
      </a>
    );
  return null;
}
function SongAction() {
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!started) return;
    const i = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [started]);
  return (
    <div className="space-y-3">
      <a
        href="https://open.spotify.com"
        target="_blank"
        rel="noreferrer"
        className="external-action"
      >
        בחרו שיר ב־Spotify <ExternalLink className="h-5 w-5" />
      </a>
      <Button variant="secondary" className="w-full" onClick={() => setStarted((x) => !x)}>
        {started ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        {started ? formatTime(seconds) : seconds ? "המשיכו" : "התחילו"}
      </Button>
    </div>
  );
}
function TimerOverlay({
  seconds,
  swap,
  onClose,
}: {
  seconds: number;
  swap: boolean;
  onClose: () => void;
}) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(1);
  useEffect(() => {
    if (!running || left <= 0) return;
    const i = setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(i);
  }, [running, left]);
  useEffect(() => {
    if (left === 0 && running) {
      setRunning(false);
      try {
        navigator.vibrate?.(150);
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 528;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      } catch {
        /* ignore */
      }
    }
  }, [left, running]);
  const progress = ((seconds - left) / seconds) * 100;
  const secondRound = () => {
    setRound(2);
    setLeft(seconds);
    setRunning(true);
  };
  return createPortal(
    <motion.div
      className="timer-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button className="timer-close" onClick={onClose} aria-label="סגירת טיימר">
        ×
      </button>
      <p className="eyebrow">{round === 1 ? "הזמן שלכם" : "סבב שני"}</p>
      <div
        className="timer-ring mt-12"
        style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}
      >
        <div className="timer-inner">
          <span>{formatTime(left)}</span>
          <small>{running ? "הזמן רץ" : "מוכנים?"}</small>
        </div>
      </div>
      {left === 0 ? (
        <div className="mt-12 w-full">
          {swap && round === 1 ? (
            <>
              <h2 className="mb-5 text-center font-display text-3xl font-bold">מתחלפים 🔄</h2>
              <Button onClick={secondRound} className="w-full">
                התחילו סבב שני
              </Button>
            </>
          ) : (
            <Button onClick={onClose} className="w-full">
              סיימנו
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            aria-label={running ? "השהיה" : "הפעלה"}
            onClick={() => setRunning((x) => !x)}
            className="h-16 w-16 p-0"
          >
            {running ? <Pause /> : <Play />}
          </Button>
          <Button
            variant="ghost"
            aria-label="איפוס"
            onClick={() => {
              setRunning(false);
              setLeft(seconds);
            }}
            className="h-16 w-16 p-0"
          >
            <RotateCcw />
          </Button>
        </div>
      )}
      <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
        <Volume2 className="h-4 w-4" />
        בסיום יישמע צליל עדין
      </div>
    </motion.div>,
    document.body,
  );
}
function GuessResult({ onSelect }: { onSelect: () => void }) {
  const { state } = useGame();
  const [winner, setWinner] = useState("");
  if (winner)
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="winner-note">
        <strong>{winner} בוחר/ת את הקטגוריה הבאה</strong>
        <Button onClick={onSelect}>לבחירת קטגוריה</Button>
      </motion.div>
    );
  return (
    <div className="mt-5">
      <p className="mb-3 text-center font-semibold">מי ניחש נכון?</p>
      <div className="grid grid-cols-2 gap-3">
        {state.names.map((n) => (
          <Button key={n} variant="secondary" onClick={() => setWinner(n)}>
            {n}
          </Button>
        ))}
      </div>
    </div>
  );
}
function Finish() {
  const { reset } = useGame();
  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Moon className="h-16 w-16 text-accent" strokeWidth={1} />
        <h1 className="mt-8 font-display text-4xl font-bold leading-tight">
          סיימתם את כל הקלפים.
          <br />
          לילה טוב 🌙
        </h1>
        <Button className="mt-12 w-full" onClick={reset}>
          ערב חדש
        </Button>
      </div>
    </Shell>
  );
}
function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function clickSound() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 760;
    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.15);
  } catch {
    /* ignore */
  }
}

function DiceLevel() {
  const { state, setState } = useGame();
  return (
    <Shell>
      <div className="flex items-center justify-between">
        <Brand />
        <NewEvening />
      </div>
      <p className="eyebrow mt-4">משחק הקוביות</p>
      <h1 className="screen-title">באיזו רמה מתחילים?</h1>
      <div className="mt-9 flex flex-col gap-4">
        {levelOrder.map((cat, i) => {
          const m = categoryMeta[cat];
          return (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                setState((s) => ({
                  ...s,
                  diceLevel: cat,
                  diceRounds: 0,
                  diceTurn: 0,
                  diceAskedAt: 0,
                  screen: "diceGame",
                }))
              }
              className={`category-button ${m.className}`}
            >
              <span className="text-3xl">{m.icon}</span>
              <span className="flex-1 text-right">
                <strong className="block font-display text-2xl">{m.title}</strong>
              </span>
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          );
        })}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">אפשר לעלות רמה תוך כדי המשחק</p>
      <p className="sr-only">{state.names.join(" ו")}</p>
    </Shell>
  );
}

function DiceGame() {
  const { state, setState } = useGame();
  const level = state.diceLevel;
  const data = levels[level];
  const pools = useMemo(() => [data.actions, data.places, data.times], [data]);
  const [reels, setReels] = useState<string[]>(() => pools.map((p) => p[0]!));
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);
  const [timerOpen, setTimerOpen] = useState(false);
  const [watchOpen, setWatchOpen] = useState(false);
  const [askLevel, setAskLevel] = useState(false);
  const [votes, setVotes] = useState<[boolean | null, boolean | null]>([null, null]);
  const [locked, setLocked] = useState<(string | null)[]>([null, null, null]);
  const [prevLocked, setPrevLocked] = useState<(string | null)[]>([null, null, null]);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const cleanup = useRef<number[]>([]);
  useEffect(
    () => () => {
      cleanup.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );
  const roll = () => {
    if (spinning) return;
    setResult(null);
    setEditing(null);
    setSpinning(true);
    const finals = pools.map((p, i) => locked[i] ?? p[Math.floor(Math.random() * p.length)]!);
    const settled = pools.map((_, i) => locked[i] !== null);
    const spin = window.setInterval(
      () =>
        setReels(
          pools.map((p, i) => (settled[i] ? finals[i]! : p[Math.floor(Math.random() * p.length)]!)),
        ),
      70,
    );
    pools.forEach((_, i) => {
      if (locked[i] !== null) return;
      const t = window.setTimeout(
        () => {
          settled[i] = true;
          clickSound();
          setReels((r) => r.map((v, j) => (j === i ? finals[i]! : v)));
        },
        700 + i * 350,
      );
      cleanup.current.push(t);
    });
    const end = window.setTimeout(
      () => {
        window.clearInterval(spin);
        setReels(finals);
        setSpinning(false);
        setResult(finals);
      },
      700 + pools.length * 350,
    );
    cleanup.current.push(end);
  };
  const lockedCount = locked.filter(Boolean).length;
  const toggleLock = (i: number) => {
    if (spinning) return;
    if (locked[i] !== null) {
      setLocked((l) => l.map((v, j) => (j === i ? null : v)));
      return;
    }
    if (lockedCount >= 2) return;
    setDraft("");
    setEditing(i);
  };
  const confirmLock = (i: number) => {
    const text = draft.trim();
    if (!text) return;
    setLocked((l) => l.map((v, j) => (j === i ? text : v)));
    setReels((r) => r.map((v, j) => (j === i ? text : v)));
    setEditing(null);
  };
  const turnName = state.names[state.diceTurn];
  const canPass = !state.dicePasses[state.diceTurn];
  const usePass = () => {
    setState((s) => ({
      ...s,
      dicePasses: s.dicePasses.map((v, i) => (i === s.diceTurn ? true : v)) as [boolean, boolean],
    }));
    roll();
  };
  const nextRound = () => {
    const rounds = state.diceRounds + 1;
    const ask = level !== "bold" && rounds % 5 === 0 && rounds > state.diceAskedAt;
    setState((s) => ({
      ...s,
      diceRounds: rounds,
      diceTurn: (s.diceTurn === 0 ? 1 : 0) as 0 | 1,
      diceAskedAt: ask ? rounds : s.diceAskedAt,
    }));
    setResult(null);
    setPrevLocked(locked);
    setLocked([null, null, null]);
    setEditing(null);
    if (ask) {
      setVotes([null, null]);
      setAskLevel(true);
    }
  };
  useEffect(() => {
    if (votes[0] === true && votes[1] === true) {
      const next = levelOrder[levelOrder.indexOf(level) + 1];
      if (next) setState((s) => ({ ...s, diceLevel: next }));
      setAskLevel(false);
    } else if (votes[0] === false || votes[1] === false) {
      setAskLevel(false);
    }
  }, [votes, level, setState]);
  const seconds = result ? (timeSeconds[result[2]!] ?? null) : null;
  return (
    <Shell compact>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-primary">
          {categoryMeta[level].icon} {categoryMeta[level].title}
        </span>
        <Button
          variant="ghost"
          className="text-xs"
          onClick={() => setState((s) => ({ ...s, screen: "diceFinish" }))}
        >
          ⋯ סיימנו להערב
        </Button>
      </div>
      <div className="mt-6 text-center">
        <h1 className="font-display text-3xl font-bold">תור של {turnName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">סיבוב {state.diceRounds + 1}</p>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        לחצו על המנעול כדי לכתוב משלכם
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {reels.map((v, i) => (
          <div
            key={i}
            className={`reel relative ${spinning && locked[i] === null ? "reel-spinning" : ""}`}
            style={locked[i] !== null ? { borderColor: "var(--accent)" } : undefined}
          >
            <button
              type="button"
              aria-label="נעילה"
              disabled={locked[i] === null && lockedCount >= 2}
              onClick={() => toggleLock(i)}
              className="absolute start-1 top-1 grid h-11 w-11 place-items-center text-muted-foreground disabled:opacity-30"
              style={locked[i] !== null ? { color: "var(--accent)" } : undefined}
            >
              {locked[i] !== null ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </button>
            {editing === i ? (
              <div className="flex w-full flex-col gap-2 px-8" dir="rtl">
                <input
                  autoFocus
                  className="text-field min-h-11"
                  placeholder="כתבו משלכם"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmLock(i);
                  }}
                />
                <Button
                  variant="secondary"
                  className="min-h-11"
                  disabled={!draft.trim()}
                  onClick={() => confirmLock(i)}
                >
                  אישור
                </Button>
              </div>
            ) : (
              <span className="font-display text-2xl font-bold">{v}</span>
            )}
          </div>
        ))}
      </div>
      {!result && !spinning && prevLocked.some(Boolean) && locked.every((v) => v === null) && (
        <button
          type="button"
          className="mt-3 text-center text-xs text-muted-foreground underline underline-offset-4"
          onClick={() => {
            setLocked(prevLocked);
            setReels((r) => r.map((v, i) => prevLocked[i] ?? v));
          }}
        >
          לנעול כמו בסיבוב הקודם
        </button>
      )}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-7 text-center"
        >
          <p className="font-display text-2xl font-bold leading-9">{result.join(" · ")}</p>
        </motion.div>
      )}
      <div className="mt-auto grid gap-3 pt-8">
        {!result ? (
          <Button onClick={roll} disabled={spinning} className="h-16 text-xl">
            <Dices className="h-6 w-6" />
            {spinning ? "מגלגלים…" : "גלגלו 🎲"}
          </Button>
        ) : (
          <>
            <Button onClick={() => (seconds ? setTimerOpen(true) : setWatchOpen(true))}>
              <Clock3 className="h-5 w-5" />
              התחילו
            </Button>
            <Button variant="secondary" onClick={nextRound}>
              הסיבוב הבא
            </Button>
          </>
        )}
        {canPass && (
          <Button variant="ghost" className="text-xs" onClick={usePass}>
            <RotateCcw className="h-4 w-4" />
            פאס
          </Button>
        )}
      </div>
      <AnimatePresence>
        {timerOpen && seconds && (
          <TimerOverlay seconds={seconds} swap={false} onClose={() => setTimerOpen(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {watchOpen && <StopwatchOverlay onClose={() => setWatchOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {askLevel && (
          <LevelModal votes={votes} setVotes={setVotes} onClose={() => setAskLevel(false)} />
        )}
      </AnimatePresence>
    </Shell>
  );
}

function LevelModal({
  votes,
  setVotes,
  onClose,
}: {
  votes: [boolean | null, boolean | null];
  setVotes: React.Dispatch<React.SetStateAction<[boolean | null, boolean | null]>>;
  onClose: () => void;
}) {
  const { state } = useGame();
  return createPortal(
    <motion.div
      className="level-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="level-modal-card">
        <h2 className="font-display text-3xl font-bold">לעלות רמה?</h2>
        <p className="mt-2 text-sm text-muted-foreground">עולים רק אם שניכם מסכימים</p>
        <div className="mt-7 grid gap-3">
          {state.names.map((n, i) => (
            <Button
              key={i}
              variant={votes[i] ? "default" : "secondary"}
              onClick={() =>
                setVotes(
                  (v) => v.map((x, j) => (j === i ? true : x)) as [boolean | null, boolean | null],
                )
              }
            >
              {n} — כן{votes[i] ? " ✓" : ""}
            </Button>
          ))}
          <Button variant="ghost" onClick={onClose}>
            לא עכשיו
          </Button>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}

function StopwatchOverlay({ onClose }: { onClose: () => void }) {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, []);
  return createPortal(
    <motion.div
      className="timer-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button className="timer-close" onClick={onClose} aria-label="סגירה">
        ×
      </button>
      <p className="eyebrow">עד שהשני אומר די</p>
      <div
        className="timer-ring mt-12"
        style={{ "--progress": `${(sec % 60) * 6}deg` } as React.CSSProperties}
      >
        <div className="timer-inner">
          <span>{formatTime(sec)}</span>
          <small>הזמן רץ</small>
        </div>
      </div>
      <Button className="mt-12 w-full" onClick={onClose}>
        די
      </Button>
    </motion.div>,
    document.body,
  );
}

function DiceFinish() {
  const { state, reset } = useGame();
  const passes = state.dicePasses.filter(Boolean).length;
  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Moon className="h-16 w-16 text-accent" strokeWidth={1} />
        <h1 className="mt-8 font-display text-4xl font-bold leading-tight">
          {state.diceRounds} סיבובים · {passes} פאסים
          <br />
          לילה טוב 🌙
        </h1>
        <Button className="mt-12 w-full" onClick={reset}>
          ערב חדש
        </Button>
      </div>
    </Shell>
  );
}

function Game() {
  const { state } = useGame();
  let content: React.ReactNode;
  switch (state.screen) {
    case "welcome":
      content = <Welcome />;
      break;
    case "place":
      content = <SetupChoice kind="place" />;
      break;
    case "drink":
      content = <SetupChoice kind="drink" />;
      break;
    case "names":
      content = <Names />;
      break;
    case "write1":
      content = <WriteOptions person={0} />;
      break;
    case "pass2":
      content = <PassPhone toPerson={1} />;
      break;
    case "choose1":
      content = <ChooseOutfit chooser={1} />;
      break;
    case "write2":
      content = <WriteOptions person={1} />;
      break;
    case "pass1":
      content = <PassPhone toPerson={0} />;
      break;
    case "choose2":
      content = <ChooseOutfit chooser={0} />;
      break;
    case "summary":
      content = <Summary />;
      break;
    case "menu":
      content = <Menu />;
      break;
    case "categories":
      content = <Categories />;
      break;
    case "shuffle":
      content = <Shuffle />;
      break;
    case "card":
      content = <CardView />;
      break;
    case "finish":
      content = <Finish />;
      break;
    case "diceLevel":
      content = <DiceLevel />;
      break;
    case "diceGame":
      content = <DiceGame />;
      break;
    case "diceFinish":
      content = <DiceFinish />;
      break;
    default:
      content = <Welcome />;
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animatedScreens.includes(state.screen) ? state.screen : "game"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
export function EveningApp() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
