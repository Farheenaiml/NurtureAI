// Centralized realistic mock data for the Nurture app.
// Backend (FastAPI + PostgreSQL) will later replace these via the service layer.

export const babySizeByWeek: Record<number, { fruit: string; emoji: string; weight: string; length: string }> = {
  20: { fruit: "Banana", emoji: "🍌", weight: "300g", length: "25cm" },
  21: { fruit: "Carrot", emoji: "🥕", weight: "360g", length: "26cm" },
  22: { fruit: "Papaya", emoji: "🫐", weight: "430g", length: "28cm" },
  23: { fruit: "Grapefruit", emoji: "🍊", weight: "500g", length: "29cm" },
  24: { fruit: "Corn", emoji: "🌽", weight: "600g", length: "30cm" },
  25: { fruit: "Cauliflower", emoji: "🥦", weight: "660g", length: "34cm" },
  26: { fruit: "Cucumber", emoji: "🥒", weight: "760g", length: "35cm" },
  27: { fruit: "Lettuce", emoji: "🥬", weight: "875g", length: "36cm" },
  28: { fruit: "Eggplant", emoji: "🍆", weight: "1005g", length: "37cm" },
  30: { fruit: "Cabbage", emoji: "🥬", weight: "1320g", length: "39cm" },
};

export interface WeekInfo {
  week: number;
  trimester: number;
  babyDevelopment: string;
  motherChanges: string;
  symptoms: string[];
  nutrition: string[];
  medical: string;
  avoid: string[];
  doctorVisit: string;
  size: { fruit: string; emoji: string; weight: string; length: string };
}

export const weeklyInfo: WeekInfo[] = Array.from({ length: 40 }, (_, i) => {
  const week = i + 1;
  const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;
  const size = babySizeByWeek[week] ?? {
    fruit: week < 12 ? "Lime" : week < 20 ? "Mango" : "Pineapple",
    emoji: week < 12 ? "🍋" : week < 20 ? "🥭" : "🍍",
    weight: `${Math.max(2, Math.round(week * 32))}g`,
    length: `${Math.max(1, Math.round(week * 1.3))}cm`,
  };
  return {
    week,
    trimester,
    size,
    babyDevelopment:
      week < 13
        ? "Major organs are forming. The heart is beating and tiny limbs are developing."
        : week < 28
          ? "Baby is growing rapidly, developing senses, and beginning to respond to sound and light."
          : "Baby is gaining weight, lungs are maturing, and preparing for life outside the womb.",
    motherChanges:
      trimester === 1
        ? "You may feel fatigue, nausea, and heightened emotions as hormones shift."
        : trimester === 2
          ? "Energy often returns and you may feel the first baby movements."
          : "You may feel heavier, experience back pain, and Braxton Hicks contractions.",
    symptoms:
      trimester === 1
        ? ["Morning sickness", "Fatigue", "Tender breasts", "Frequent urination"]
        : trimester === 2
          ? ["Round ligament pain", "Increased appetite", "Baby movements", "Nasal congestion"]
          : ["Back pain", "Swelling", "Heartburn", "Braxton Hicks"],
    nutrition:
      trimester === 1
        ? ["Folic acid", "Vitamin B6", "Ginger for nausea", "Small frequent meals"]
        : trimester === 2
          ? ["Iron-rich foods", "Calcium", "Omega-3", "Protein"]
          : ["Fiber", "Hydration", "Vitamin D", "Healthy fats"],
    medical: "Attend your scheduled prenatal check-up and monitor blood pressure and weight.",
    avoid: ["Raw fish", "Unpasteurized dairy", "Excess caffeine", "Alcohol"],
    doctorVisit:
      trimester === 3 ? "Visits become more frequent — every 2 weeks." : "Routine check-up recommended this month.",
  };
});

export interface Meal {
  name: string;
  items: string[];
  calories: number;
  emoji: string;
}
export const todaysMeals: Meal[] = [
  { name: "Breakfast", emoji: "🍳", items: ["Oatmeal with berries", "Boiled eggs", "Orange juice"], calories: 420 },
  { name: "Lunch", emoji: "🥗", items: ["Grilled chicken salad", "Quinoa", "Yogurt"], calories: 560 },
  { name: "Snacks", emoji: "🥜", items: ["Almonds", "Apple slices", "Hummus"], calories: 240 },
  { name: "Dinner", emoji: "🍲", items: ["Salmon", "Steamed broccoli", "Brown rice"], calories: 610 },
];

export const nutrients = [
  { name: "Protein", value: 68, target: 90, unit: "g", color: "chart-1" },
  { name: "Iron", value: 21, target: 27, unit: "mg", color: "chart-2" },
  { name: "Calcium", value: 820, target: 1000, unit: "mg", color: "chart-3" },
  { name: "Folic Acid", value: 520, target: 600, unit: "mcg", color: "chart-4" },
  { name: "Vitamin D", value: 12, target: 15, unit: "mcg", color: "chart-5" },
];

export const foodsToEat = [
  { name: "Leafy Greens", emoji: "🥬", benefit: "Rich in folate & iron" },
  { name: "Greek Yogurt", emoji: "🥛", benefit: "Calcium & protein" },
  { name: "Salmon", emoji: "🐟", benefit: "Omega-3 for brain" },
  { name: "Lentils", emoji: "🫘", benefit: "Iron & fiber" },
  { name: "Berries", emoji: "🫐", benefit: "Antioxidants" },
  { name: "Eggs", emoji: "🥚", benefit: "Choline & protein" },
];
export const foodsToAvoid = [
  { name: "Raw Fish", emoji: "🍣", reason: "Risk of listeria" },
  { name: "Soft Cheese", emoji: "🧀", reason: "Unpasteurized risk" },
  { name: "High Caffeine", emoji: "☕", reason: "Limit to 200mg/day" },
  { name: "Alcohol", emoji: "🍷", reason: "Avoid completely" },
  { name: "Deli Meats", emoji: "🥓", reason: "Listeria risk" },
  { name: "Raw Eggs", emoji: "🥚", reason: "Salmonella risk" },
];

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  status: "taken" | "skipped" | "upcoming";
}
export const medicines: Medicine[] = [
  { id: "m1", name: "Prenatal Vitamin", dosage: "1 tablet", time: "08:00 AM", status: "taken" },
  { id: "m2", name: "Iron Supplement", dosage: "65mg", time: "01:00 PM", status: "upcoming" },
  { id: "m3", name: "Vitamin D", dosage: "1000 IU", time: "07:00 PM", status: "upcoming" },
  { id: "m4", name: "Folic Acid", dosage: "400mcg", time: "09:00 PM", status: "skipped" },
];

export interface Symptom {
  id: string;
  name: string;
  emoji: string;
  severity: "green" | "yellow" | "orange" | "red";
  overview: string;
  causes: string[];
  recommendations: string[];
  selfCare: string[];
  whenToCall: string;
  emergency: boolean;
}
export const symptoms: Symptom[] = [
  {
    id: "headache", name: "Headache", emoji: "🤕", severity: "yellow",
    overview: "Headaches are common during pregnancy due to hormonal changes and increased blood volume.",
    causes: ["Hormonal changes", "Dehydration", "Stress & fatigue", "Caffeine withdrawal"],
    recommendations: ["Stay hydrated", "Rest in a dark room", "Apply a cold compress", "Maintain regular meals"],
    selfCare: ["Drink 8+ glasses of water", "Practice relaxation", "Ensure adequate sleep"],
    whenToCall: "Contact your doctor if the headache is severe, sudden, or paired with vision changes or swelling.",
    emergency: false,
  },
  {
    id: "swelling", name: "Swelling", emoji: "🦶", severity: "yellow",
    overview: "Mild swelling in feet and ankles is normal, especially in the third trimester.",
    causes: ["Fluid retention", "Increased blood volume", "Standing for long periods"],
    recommendations: ["Elevate your feet", "Wear comfortable shoes", "Reduce salt intake"],
    selfCare: ["Gentle walking", "Cool foot soaks", "Left-side sleeping"],
    whenToCall: "Call your doctor if swelling is sudden, in the face/hands, or with headache — signs of preeclampsia.",
    emergency: false,
  },
  {
    id: "nausea", name: "Nausea", emoji: "🤢", severity: "green",
    overview: "Nausea and morning sickness are very common in the first trimester.",
    causes: ["Rising hCG hormone", "Heightened smell sensitivity", "Empty stomach"],
    recommendations: ["Eat small frequent meals", "Try ginger tea", "Avoid strong smells"],
    selfCare: ["Keep crackers by the bed", "Stay hydrated", "Vitamin B6"],
    whenToCall: "Call if you can't keep fluids down for 24 hours or lose weight.",
    emergency: false,
  },
  {
    id: "bleeding", name: "Bleeding", emoji: "🩸", severity: "red",
    overview: "Vaginal bleeding during pregnancy can be serious and needs prompt medical evaluation.",
    causes: ["Implantation", "Placental issues", "Infection", "Preterm labor"],
    recommendations: ["Contact your doctor immediately", "Note amount and color", "Rest"],
    selfCare: ["Avoid strenuous activity", "Do not use tampons"],
    whenToCall: "Seek emergency care now for heavy bleeding, especially with cramping or pain.",
    emergency: true,
  },
  {
    id: "back-pain", name: "Back Pain", emoji: "🔙", severity: "green",
    overview: "Back pain is common as your center of gravity shifts and ligaments loosen.",
    causes: ["Weight gain", "Posture changes", "Hormone relaxin"],
    recommendations: ["Prenatal yoga", "Warm compress", "Supportive pillows"],
    selfCare: ["Gentle stretching", "Good posture", "Comfortable shoes"],
    whenToCall: "Call if pain is severe, rhythmic, or with fever.",
    emergency: false,
  },
  {
    id: "fever", name: "Fever", emoji: "🌡️", severity: "orange",
    overview: "A fever during pregnancy may indicate an infection and should be monitored.",
    causes: ["Viral infection", "UTI", "Flu"],
    recommendations: ["Rest & hydrate", "Contact your doctor", "Acetaminophen if approved"],
    selfCare: ["Cool compress", "Light clothing", "Fluids"],
    whenToCall: "Call your doctor if fever is above 38.5°C (101°F) or persists.",
    emergency: false,
  },
  {
    id: "reduced-movement", name: "Reduced Baby Movement", emoji: "👶", severity: "orange",
    overview: "A noticeable decrease in baby's movements should always be checked.",
    causes: ["Baby sleeping", "Position", "Reduced amniotic fluid"],
    recommendations: ["Lie on your side", "Drink cold water", "Count kicks"],
    selfCare: ["Do a kick count session", "Rest and focus"],
    whenToCall: "If fewer than 10 movements in 2 hours, contact your doctor immediately.",
    emergency: true,
  },
  {
    id: "shortness-breath", name: "Shortness of Breath", emoji: "😮‍💨", severity: "yellow",
    overview: "Mild breathlessness is common as the uterus presses on the diaphragm.",
    causes: ["Growing uterus", "Increased oxygen demand", "Hormones"],
    recommendations: ["Sit upright", "Slow deep breaths", "Good posture"],
    selfCare: ["Sleep propped up", "Gentle pace"],
    whenToCall: "Seek care if sudden, severe, or with chest pain.",
    emergency: false,
  },
  {
    id: "blurred-vision", name: "Blurred Vision", emoji: "👁️", severity: "red",
    overview: "Blurred vision can be a warning sign of high blood pressure or preeclampsia.",
    causes: ["High blood pressure", "Preeclampsia", "Blood sugar changes"],
    recommendations: ["Contact your doctor immediately", "Rest your eyes", "Check blood pressure"],
    selfCare: ["Sit and rest", "Hydrate"],
    whenToCall: "Seek emergency care for vision changes with headache or swelling.",
    emergency: true,
  },
];

export interface Exercise {
  id: string;
  name: string;
  category: string;
  emoji: string;
  difficulty: "Easy" | "Moderate" | "Advanced";
  duration: string;
  trimester: string;
  benefits: string[];
}
export const exercises: Exercise[] = [
  { id: "e1", name: "Prenatal Yoga Flow", category: "Yoga", emoji: "🧘‍♀️", difficulty: "Easy", duration: "20 min", trimester: "All trimesters", benefits: ["Flexibility", "Stress relief", "Better sleep"] },
  { id: "e2", name: "Gentle Stretching", category: "Stretching", emoji: "🤸‍♀️", difficulty: "Easy", duration: "10 min", trimester: "All trimesters", benefits: ["Reduce cramps", "Mobility"] },
  { id: "e3", name: "Mindful Walking", category: "Walking", emoji: "🚶‍♀️", difficulty: "Easy", duration: "30 min", trimester: "All trimesters", benefits: ["Cardio", "Mood boost", "Circulation"] },
  { id: "e4", name: "Deep Breathing", category: "Breathing", emoji: "🌬️", difficulty: "Easy", duration: "8 min", trimester: "All trimesters", benefits: ["Calm", "Oxygen", "Labor prep"] },
  { id: "e5", name: "Guided Meditation", category: "Meditation", emoji: "🧘", difficulty: "Easy", duration: "15 min", trimester: "All trimesters", benefits: ["Anxiety relief", "Focus"] },
  { id: "e6", name: "Pelvic Floor Exercises", category: "Pelvic Floor", emoji: "💪", difficulty: "Moderate", duration: "12 min", trimester: "All trimesters", benefits: ["Core strength", "Labor prep", "Recovery"] },
];

export interface Appointment {
  id: string;
  title: string;
  doctor: string;
  hospital: string;
  date: string;
  time: string;
  reason: string;
  status: "upcoming" | "completed";
}
export const appointments: Appointment[] = [
  { id: "a1", title: "Prenatal Check-up", doctor: "Dr. Emily Carter", hospital: "St. Mary's Women's Hospital", date: "2026-07-18", time: "10:30 AM", reason: "Routine 26-week check", status: "upcoming" },
  { id: "a2", title: "Glucose Screening", doctor: "Dr. Emily Carter", hospital: "St. Mary's Women's Hospital", date: "2026-07-30", time: "09:00 AM", reason: "Gestational diabetes test", status: "upcoming" },
  { id: "a3", title: "Ultrasound Scan", doctor: "Dr. Raj Patel", hospital: "City Imaging Center", date: "2026-06-20", time: "02:00 PM", reason: "Anatomy scan", status: "completed" },
];

export const testimonials = [
  { name: "Aisha Rahman", role: "First-time mom", rating: 5, text: "Nurture felt like having a caring midwife in my pocket. The daily guidance kept me calm through every trimester." },
  { name: "Priya Sharma", role: "Mom of two", rating: 5, text: "The symptom checker gave me peace of mind at 2am more than once. Beautifully designed and genuinely helpful." },
  { name: "Emma Thompson", role: "Postpartum mom", rating: 5, text: "The postpartum support and mood tracking helped me through the hardest weeks. I never felt alone." },
  { name: "Sofia Garcia", role: "34 weeks pregnant", rating: 5, text: "I love the nutrition planner and the AI answers. It's like Flo and Apple Health combined but warmer." },
];

export const faqs = [
  { q: "Is Nurture a replacement for my doctor?", a: "No. Nurture provides evidence-based guidance and support but never replaces professional medical care. We always encourage you to consult your healthcare provider." },
  { q: "How does the AI keep my data private?", a: "Your health data is encrypted and never sold. You control what is shared, and can export or delete your data anytime." },
  { q: "Can I use Nurture after childbirth?", a: "Yes. Nurture automatically adapts to your postpartum journey with recovery tracking, mood check-ins, feeding trackers and baby care." },
  { q: "What can I ask the AI assistant?", a: "Anything about pregnancy, nutrition, baby development, mental wellness, symptoms and postpartum recovery — by text or voice." },
  { q: "Is my pregnancy tracking accurate?", a: "Tracking is based on established medical week-by-week guidance and personalized to your due date and inputs." },
  { q: "Does Nurture support postpartum depression?", a: "Yes, with educational screening, mood tracking and supportive resources — always encouraging professional help when needed." },
];

export const suggestedQuestions = [
  "Can I eat mango during pregnancy?",
  "Baby movements reduced today",
  "What foods increase iron?",
  "Is headache normal in week 26?",
  "How do I identify postpartum depression?",
  "Breastfeeding tips",
  "Can I exercise today?",
];

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}
export interface Conversation {
  id: string;
  title: string;
  group: "Today" | "Yesterday" | "Last Week";
  pinned?: boolean;
  messages: ChatMessage[];
}
export const conversations: Conversation[] = [
  {
    id: "c1", title: "Nutrition for week 26", group: "Today", pinned: true,
    messages: [
      { id: "m1", role: "user", content: "What foods increase iron during pregnancy?", time: "9:12 AM" },
      { id: "m2", role: "assistant", content: "Great question, Sarah! Iron is especially important in your second trimester.", time: "9:12 AM" },
    ],
  },
  { id: "c2", title: "Is mild swelling normal?", group: "Today", messages: [] },
  { id: "c3", title: "Sleeping positions", group: "Yesterday", messages: [] },
  { id: "c4", title: "Baby kick counting", group: "Last Week", messages: [] },
  { id: "c5", title: "Managing heartburn", group: "Last Week", messages: [] },
];

export const waterLog = { current: 1500, target: 2500 };

export const moodTrend = [
  { day: "Mon", mood: 4, energy: 3 },
  { day: "Tue", mood: 3, energy: 4 },
  { day: "Wed", mood: 5, energy: 4 },
  { day: "Thu", mood: 4, energy: 5 },
  { day: "Fri", mood: 5, energy: 4 },
  { day: "Sat", mood: 4, energy: 3 },
  { day: "Sun", mood: 5, energy: 5 },
];

export const weightTrend = [
  { week: "W20", weight: 64 },
  { week: "W21", weight: 64.6 },
  { week: "W22", weight: 65.3 },
  { week: "W23", weight: 66 },
  { week: "W24", weight: 66.8 },
  { week: "W25", weight: 67.4 },
  { week: "W26", weight: 68 },
];

export const waterWeekTrend = [
  { day: "Mon", ml: 2100 },
  { day: "Tue", ml: 2400 },
  { day: "Wed", ml: 1900 },
  { day: "Thu", ml: 2600 },
  { day: "Fri", ml: 2300 },
  { day: "Sat", ml: 2000 },
  { day: "Sun", ml: 1500 },
];

export const healthTips = [
  { title: "Stay Hydrated", text: "Aim for 8-10 glasses of water today to support increased blood volume.", emoji: "💧" },
  { title: "Take a Walk", text: "A 20-minute gentle walk can boost mood and circulation.", emoji: "🚶‍♀️" },
  { title: "Iron-Rich Lunch", text: "Pair leafy greens with vitamin C for better iron absorption.", emoji: "🥬" },
];

// ---- Postpartum data ----
export const recoveryTimeline = [
  { period: "Week 1", title: "Early Recovery", body: "Your body begins healing. Rest as much as possible.", details: { body: "Uterus contracting, bleeding (lochia).", hormonal: "Sharp hormone drop.", emotional: "Baby blues common.", nutrition: "Iron, protein, hydration.", exercise: "Gentle walking only.", doctor: "Watch for heavy bleeding or fever.", avoid: ["Heavy lifting", "Strenuous exercise"] } },
  { period: "Week 2", title: "Settling In", body: "Establishing feeding routines and bonding.", details: { body: "Reduced bleeding, sore breasts.", hormonal: "Milk supply regulating.", emotional: "Mood swings normal.", nutrition: "Galactagogues, healthy fats.", exercise: "Pelvic floor exercises.", doctor: "First postpartum check often scheduled.", avoid: ["Skipping meals"] } },
  { period: "Week 3", title: "Finding Rhythm", body: "Energy slowly returns.", details: { body: "Healing perineum/incision.", hormonal: "Stabilizing.", emotional: "Increasing confidence.", nutrition: "Balanced meals.", exercise: "Light stretching.", doctor: "Report persistent sadness.", avoid: ["Isolation"] } },
  { period: "Week 4", title: "One Month", body: "Many mothers feel more like themselves.", details: { body: "Bleeding usually stops.", hormonal: "More stable.", emotional: "Watch for PPD signs.", nutrition: "Continue supplements.", exercise: "Postnatal yoga.", doctor: "6-week check approaching.", avoid: ["Overexertion"] } },
  { period: "Month 2", title: "Rebuilding", body: "Cleared for more activity after check-up.", details: { body: "Core rebuilding.", hormonal: "Cycle may return.", emotional: "Stronger bonding.", nutrition: "Protein for tissue repair.", exercise: "Gradual cardio.", doctor: "Contraception discussion.", avoid: ["Comparing yourself"] } },
  { period: "Month 3", title: "New Normal", body: "Confidence and routine established.", details: { body: "Mostly recovered.", hormonal: "Normalizing.", emotional: "Sustained wellbeing.", nutrition: "Whole foods.", exercise: "Full workouts if cleared.", doctor: "Continue self-care.", avoid: ["Neglecting rest"] } },
  { period: "Month 6", title: "Thriving", body: "Long-term health and wellness focus.", details: { body: "Fully recovered.", hormonal: "Stable.", emotional: "Confident motherhood.", nutrition: "Sustainable habits.", exercise: "Any activity you enjoy.", doctor: "Annual wellness.", avoid: ["Skipping check-ups"] } },
];

export const affirmations = [
  "You are exactly the mother your baby needs.",
  "Rest is productive. Healing takes time.",
  "You are stronger than you feel today.",
  "It's okay to ask for help.",
  "Every small step is progress.",
];

export const feedingLog = [
  { id: "f1", side: "Left", duration: "18 min", time: "6:30 AM", type: "Breast" },
  { id: "f2", side: "Right", duration: "15 min", time: "9:45 AM", type: "Breast" },
  { id: "f3", side: "Bottle", duration: "20 min", time: "12:30 PM", type: "Formula" },
  { id: "f4", side: "Left", duration: "22 min", time: "3:15 PM", type: "Breast" },
];

export const sleepLog = [
  { day: "Mon", hours: 5.2 },
  { day: "Tue", hours: 4.8 },
  { day: "Wed", hours: 6.1 },
  { day: "Thu", hours: 5.5 },
  { day: "Fri", hours: 4.5 },
  { day: "Sat", hours: 6.8 },
  { day: "Sun", hours: 5.9 },
];

export const babyGrowth = { age: "6 weeks", weight: "4.8 kg", height: "56 cm", head: "38 cm" };
export const babyMilestones = [
  { title: "Social smile", done: true },
  { title: "Follows objects with eyes", done: true },
  { title: "Holds head up briefly", done: true },
  { title: "Coos and makes sounds", done: false },
  { title: "Grasps objects", done: false },
];

export const screeningQuestions = [
  "I have been able to laugh and see the funny side of things",
  "I have looked forward with enjoyment to things",
  "I have blamed myself unnecessarily when things went wrong",
  "I have felt anxious or worried for no good reason",
  "I have felt scared or panicky for no good reason",
  "Things have been getting on top of me",
  "I have been so unhappy that I have had difficulty sleeping",
  "I have felt sad or miserable",
  "I have been so unhappy that I have been crying",
  "The thought of harming myself has occurred to me",
];

export const notifications = [
  { id: "n1", category: "Medicine", title: "Iron Supplement due", body: "Time to take your 1:00 PM iron supplement.", time: "2m ago", unread: true, emoji: "💊" },
  { id: "n2", category: "AI Insights", title: "Weekly insight ready", body: "Your water intake improved 20% this week.", time: "1h ago", unread: true, emoji: "✨" },
  { id: "n3", category: "Appointments", title: "Upcoming appointment", body: "Prenatal check-up on July 18 at 10:30 AM.", time: "3h ago", unread: true, emoji: "📅" },
  { id: "n4", category: "Nutrition", title: "Nutrition reminder", body: "You're 20g short on protein today.", time: "5h ago", unread: false, emoji: "🥗" },
  { id: "n5", category: "Mental Wellness", title: "Mood check-in", body: "How are you feeling this evening?", time: "Yesterday", unread: false, emoji: "💙" },
];

export const aiInsights = [
  "You've been sleeping less than 5 hours for three consecutive nights.",
  "Water intake has improved by 20% this week. Keep it up!",
  "Mood has improved compared to last week.",
  "You haven't logged feeding today.",
];

export const languages = ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali"];
