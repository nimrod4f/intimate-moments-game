import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Category } from "@/data/cards";

export type GameScreen =
  | "welcome"
  | "place"
  | "drink"
  | "names"
  | "write1"
  | "pass2"
  | "choose1"
  | "write2"
  | "pass1"
  | "choose2"
  | "summary"
  | "menu"
  | "categories"
  | "shuffle"
  | "card"
  | "finish"
  | "diceLevel"
  | "diceGame"
  | "diceFinish"
  | "boxSetup"
  | "boxIntro"
  | "boxStep"
  | "boxFinish";
type GameState = {
  screen: GameScreen;
  names: [string, string];
  place: string;
  drink: string;
  options1: string[];
  options2: string[];
  outfits: [string, string];
  opened: Record<Category, number[]>;
  swapped: Record<Category, boolean>;
  activeCategory: Category | null;
  activeCardId: number | null;
  diceLevel: Category;
  diceRounds: number;
  dicePasses: [boolean, boolean];
  diceTurn: 0 | 1;
  diceAskedAt: number;
  boxLeader: 0 | 1;
  boxRope: boolean;
  boxStepIndex: number;
  boxAgreed: boolean;
};
const initial: GameState = {
  screen: "welcome",
  names: ["בן זוג 1", "בן זוג 2"],
  place: "",
  drink: "",
  options1: ["", "", ""],
  options2: ["", "", ""],
  outfits: ["", ""],
  opened: { closeness: [], tension: [], bold: [] },
  swapped: { closeness: false, tension: false, bold: false },
  activeCategory: null,
  activeCardId: null,
  diceLevel: "closeness",
  diceRounds: 0,
  dicePasses: [false, false],
  diceTurn: 0,
  diceAskedAt: 0,
  boxLeader: 0,
  boxRope: false,
  boxStepIndex: 0,
  boxAgreed: false,
};
type Ctx = {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  reset: () => void;
};
const GameContext = createContext<Ctx | undefined>(undefined);
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initial);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("evening-game");
      if (saved) setState({ ...initial, ...JSON.parse(saved) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem("evening-game", JSON.stringify(state));
  }, [state, hydrated]);
  return (
    <GameContext.Provider
      value={{
        state,
        setState,
        reset: () => {
          localStorage.removeItem("evening-game");
          setState(initial);
        },
      }}
    >
      {hydrated ? children : <div className="min-h-dvh bg-background" />}
    </GameContext.Provider>
  );
}
export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error("useGame must be inside GameProvider");
  return value;
}
