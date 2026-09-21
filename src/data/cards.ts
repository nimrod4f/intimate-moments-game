export type Category = "closeness" | "tension" | "bold";
export type CardType = "text" | "timer" | "song" | "video" | "guess";
export type GameCard = { id:number; category:Category; title:string; type:CardType; text:string; duration?:number; swap?:boolean };
export const cards: GameCard[] = [
{ id:1, category:"closeness", title:"עיניים בעיניים", type:"timer", duration:120, swap:false, text:"שבו קרוב אחד מול השני במשך 2 דקות.\nהסתכלו אחד לשני בעיניים, בלי לדבר ובלי טלפונים.\nבסוף, כל אחד אומר דבר אחד שהוא עדיין אוהב מאוד בשני." },
{ id:2, category:"closeness", title:"הזיכרון", type:"text", text:"כל אחד מספר על רגע מתחילת הקשר שבו הרגיש משיכה חזקה במיוחד לבן הזוג." },
{ id:3, category:"closeness", title:"חיבוק", type:"timer", duration:180, swap:false, text:"התחבקו במשך 3 דקות.\nבלי לדבר ובלי למהר לשום מקום.\nפשוט להיות קרובים." },
{ id:4, category:"closeness", title:"השיר", type:"song", text:"בחרו יחד שיר אחד.\nשבו או שכבו קרוב אחד לשני לאורך כל השיר." },
{ id:5, category:"closeness", title:"מגע נעים", type:"timer", duration:300, swap:true, text:"אחד נותן לשני עיסוי עדין במשך 5 דקות באזור הכתפיים, הצוואר, הידיים והשיער.\nאחר כך מתחלפים." },
{ id:6, category:"closeness", title:"שלושה דברים", type:"text", text:"כל אחד אומר לבן הזוג:\nדבר אחד שהוא אוהב בגוף שלו.\nדבר אחד שהוא אוהב באופי שלו.\nדבר אחד שהוא אוהב בקשר שלכם." },
{ id:7, category:"tension", title:"כיסוי עיניים", type:"timer", duration:180, swap:false, text:"אחד מכסה את העיניים.\nהשני מוביל את המגע במשך 3 דקות.\nבלי להסביר מראש מה עומד לקרות." },
{ id:8, category:"tension", title:"כמעט", type:"timer", duration:300, swap:false, text:"במשך 5 דקות מותר להתקרב, להסתכל, להתנשק ולגעת.\nהמטרה היא ליצור מתח ולא למהר לשום מקום." },
{ id:9, category:"tension", title:"המוביל", type:"timer", duration:300, swap:true, text:"אחד מוביל במשך 5 דקות.\nהשני פשוט זורם ומקבל.\nאחרי 5 דקות מתחלפים." },
{ id:10, category:"tension", title:"לחישה", type:"text", text:"כל אחד לוחש לבן הזוג משהו שהיה רוצה שיקרה הערב.\nלא חייבים לבצע אותו.\nעצם השיתוף הוא חלק מהמשחק." },
{ id:11, category:"tension", title:"רק אתה יודע", type:"text", text:"כל אחד בוחר בסתר דבר אחד שהוא אוהב במיוחד במגע של בן הזוג.\nבן הזוג צריך לנסות לגלות מהו." },
{ id:12, category:"tension", title:"עוד פעם", type:"timer", duration:60, swap:false, text:"בחרו את הרגע שהכי נהניתם ממנו עד עכשיו.\nחזרו עליו במשך דקה נוספת, הפעם לאט יותר." },
{ id:13, category:"bold", title:"מגע חופשי", type:"timer", duration:300, swap:true, text:"אחד נוגע בשני במשך 5 דקות ובוחר את הקצב ואת המקומות שבהם ירצה לגעת.\nהשני פשוט מתמסר ונהנה.\nאחר כך מתחלפים." },
{ id:14, category:"bold", title:"שלוש נקודות", type:"text", text:"כל אחד בוחר אצל בן הזוג 3 נקודות:\nמקום שכמעט אף פעם לא נוגעים בו.\nמקום שאתם חושבים שבן הזוג רוצה שניגע בו.\nמקום שאתם הכי רוצים לגעת בו.\nאחרי ששניכם בחרתם, מגלים אחד לשני את שלוש הבחירות ומתקדמים לאט." },
{ id:15, category:"bold", title:"סצנה מסרט", type:"video", text:"בחרו יחד סצנה אירוטית מסרט שמסקרנת את שניכם.\nצפו בה יחד.\nאחר כך נסו ליצור בבית גרסה משלכם לסצנה." },
{ id:16, category:"bold", title:"הפתק הסודי", type:"text", text:"כל אחד כותב על פתק משהו אינטימי שהיה רוצה לחוות עם בן הזוג.\nמקפלים ומחליפים.\nכל אחד קורא את הפתק של השני ומחליט אם מתאים לו לנסות אותו הערב." },
{ id:17, category:"bold", title:"מכיר אותי?", type:"guess", text:"כל אחד אומר לבן הזוג 3 דברים שמדליקים או מסקרנים אותו.\n2 אמיתיים ואחד מומצא.\nבן הזוג צריך לנחש מה המומצא.\nאם הוא טועה, מי שאמר בוחר את המשימה הבאה.\nאם הוא צודק, הוא בוחר." },
{ id:18, category:"bold", title:"מייפל", type:"text", text:"בחרו יחד 3 נקודות על הגוף.\nטפטפו מעט סירופ מייפל על כל נקודה והפכו את זה למשחק חושני ואיטי של קרבה." }
];
