import type { Category } from "@/data/cards";

export const actions = ["ללטף", "לנשק", "ללחוש", "לנשוף", "ללקק", "לעסות", "להסתכל", "לנשוך בעדינות"];

const closenessPlaces = ["צוואר", "אוזן", "גב", "ידיים", "שפתיים", "כתפיים", "שיער", "כפות רגליים"];
const tensionPlaces = [...closenessPlaces, "ירכיים", "בטן", "חזה (מעל הבגדים)", "ישבן (מעל הבגדים)", "מקום שאתה בוחר"];
const boldPlaces = [...tensionPlaces, "חזה", "ישבן", "אזור אינטימי", "מקום שבן/בת הזוג בוחר/ת"];

export const times = ["30 שניות", "1 דקה", "2 דקות", "עד שהשני אומר די"];
export const levels: Record<Category, { actions: string[]; places: string[]; times: string[] }> = {
  closeness: { actions, places: closenessPlaces, times },
  tension: { actions, places: tensionPlaces, times },
  bold: { actions, places: boldPlaces, times },
};

export const timeSeconds: Record<string, number | null> = {
  "30 שניות": 30,
  "1 דקה": 60,
  "2 דקות": 120,
  "עד שהשני אומר די": null,
};

export const levelOrder: Category[] = ["closeness", "tension", "bold"];
