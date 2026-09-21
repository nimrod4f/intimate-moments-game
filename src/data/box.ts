export type BoxStep = {
  id: number;
  title: string;
  text: string;
  duration: number;
  needsRope?: boolean;
};

export const boxSteps: BoxStep[] = [
  {
    id: 1,
    title: "נשימה",
    text: "שבו או עמדו קרוב.\nנשמו ליד האוזן.\nעדיין בלי לגעת.",
    duration: 60,
  },
  {
    id: 2,
    title: "מילים",
    text: "לחשו שלושה דברים שאתם אוהבים בבן/בת הזוג.\nעדיין בלי לגעת.",
    duration: 60,
  },
  { id: 3, title: "מגע ראשון", text: "רק כפות ידיים.\nפנים, שיער, צוואר.\nלאט.", duration: 120 },
  {
    id: 4,
    title: "הידיים",
    text: "קשרו בעדינות את הידיים.\nמעכשיו רק אתם מובילים.",
    duration: 120,
    needsRope: true,
  },
  {
    id: 5,
    title: "קצב",
    text: "דקה ראשונה איטית מאוד.\nדקה שנייה מהירה יותר.\nואז שוב לאט.",
    duration: 180,
  },
  {
    id: 6,
    title: "הובלה",
    text: "קחו אותה/אותו ביד והעבירו למקום אחר בבית.\nהיא/הוא לא יודע/ת לאן.",
    duration: 120,
  },
  { id: 7, title: "בלי ידיים", text: "רק שפתיים ונשימה.\nהידיים מאחורי הגב.", duration: 120 },
  { id: 8, title: "הבחירה שלה/שלו", text: "שאלו: איפה עכשיו?\nותישארו שם.", duration: 180 },
  { id: 9, title: "מכאן – אתם", text: "הורידו את הכיסוי כשמתאים לכם.", duration: 0 },
];
