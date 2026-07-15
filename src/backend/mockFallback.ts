export interface AIResponse {
  main: string;
  highlights: string[];
  remember: string[];
  warning: string;
  nextQuestions: string[];
  references: string[];
  emergency: boolean;
}

export function generateAIResponse(message: string): AIResponse {
  const lower = message.toLowerCase();
  const emergency = /bleed|severe|emergency|faint|chest pain|not moving/.test(lower);

  if (/rides|rollercoaster|amusement|theme park|disney|ferris wheel/.test(lower)) {
    return {
      main: `High-speed rides, rollercoasters, and amusement park attractions that involve sudden acceleration, drops, sharp turns, or jarring forces are generally **not safe** during pregnancy. 

Here is a detailed breakdown of precautions and why these restrictions exist:
* **Risk of Placental Abruption:** The primary medical concern with high-impact rides is the rapid deceleration and gravitational forces (G-forces), which can cause the placenta to prematurely separate from the uterine wall (placental abruption). This is a life-threatening emergency for both mother and baby.
* **Abdominal Trauma:** Direct impact or jarring movements against the safety bars, harnesses, or seat belts can put pressure on your uterus.
* **Safe Alternatives:** You can safely enjoy gentle flat-surface attractions, such as slowly moving boat rides (e.g., "it's a small world"), live stage shows, 3D movies (without moving seats), and walking paths.
* **Stay Hydrated & Rested:** Theme parks involve extensive walking and heat exposure. Drink plenty of water and take resting breaks every 45 minutes.`,
      highlights: ["Avoid all rollercoasters, water slides, and high-velocity rides", "Jolting forces carry a risk of placental abruption", "Stick to safe, flat-surface activities at theme parks"],
      remember: ["Look for warning signs posted at ride entrances", "Consult your obstetrician before planning theme park visits", "Stay hydrated and take frequent breaks out of the sun"],
      warning: "Seek immediate emergency medical attention if you experience vaginal bleeding, abdominal pain, or contractions after riding an attraction.",
      nextQuestions: ["Can I go to amusement parks while pregnant?", "Are water slides safe during pregnancy?", "What symptoms indicate placental abruption?"],
      references: ["ACOG — Safety guidelines for high-impact activities", "Mayo Clinic — Physical safety guidelines"],
      emergency: false,
    };
  }

  if (/travel|trip|flight|fly|flying|car|plane|airline|long drive/.test(lower)) {
    return {
      main: `Travel is generally safe for healthy pregnant individuals with uncomplicated pregnancies up to 36 weeks. 

Here are the key precautions to take for a safe journey:
* **Seatbelt Safety in Cars:** Always wear your seatbelt. Position the lap strap low across your hip bones, securely under your baby bump. Place the shoulder strap diagonally across the center of your chest, to the side of your bump.
* **Air Travel Guidelines:** Most domestic airlines allow pregnant passengers to fly up to 36 weeks. Ensure you carry a copy of your medical records and a doctor's fit-to-fly letter.
* **Preventing Blood Clots (DVT):** Pregnancy increases the risk of deep vein thrombosis. On long flights or drives, walk for 5-10 minutes every 1-2 hours, stretch/flex your ankles regularly, and consider wearing compression stockings.
* **Stay Hydrated:** Drink plenty of water and avoid carbonated beverages or salty foods that can worsen bloating and swelling.`,
      highlights: ["Domestic travel is safest up to week 36 for uncomplicated pregnancies", "Position seatbelt lap strap under your belly, never over it", "Walk every 1-2 hours to maintain healthy circulation"],
      remember: ["Bring a copy of your prenatal health records", "Stay hydrated and avoid carbonated drinks before flying", "Locate nearest medical centers at your destination"],
      warning: "Avoid traveling to regions with active outbreaks of Zika virus or malaria, and consult your doctor before any international travel.",
      nextQuestions: ["Is it safe to fly during the third trimester?", "What are signs of a blood clot during travel?", "How should I position a seatbelt when pregnant?"],
      references: ["ACOG — Travel During Pregnancy Guidelines", "WHO — International travel health recommendations"],
      emergency: false,
    };
  }

  if (/sleep|sleeping|lay|laying|lying|bed|posture|position/.test(lower)) {
    return {
      main: `From the second trimester onward (around week 20), sleeping or laying flat on your back is not recommended. 

Here is what you need to know about pregnancy sleep positions:
* **The Side Sleeping rule (SOS):** Sleeping on your side—especially your left side—is the optimal position. It prevents the heavy uterus from compressing the inferior vena cava (the main vein returning blood to your heart), maximizing blood and nutrient supply to the placenta and kidneys.
* **Pillow Support:** Place a pillow between your knees to keep your hips aligned, and slide a supportive pillow under your abdomen to relieve lower back strain.
* **Waking Up on Your Back:** If you wake up on your back, do not worry or panic. It is a natural movement. Simply turn back onto your side and go back to sleep.
* **Relieving Heartburn:** Elevate your upper body slightly with extra pillows to prevent stomach acid from rising, and avoid heavy meals 2-3 hours before bed.`,
      highlights: ["Sleep on your side (left side is optimal for blood flow)", "Avoid sleeping flat on your back after 20 weeks", "Use pillows between your knees and under your belly for support"],
      remember: ["Use a pregnancy pillow to maintain a comfortable side position", "Don't panic if you wake up on your back; simply roll back onto your side", "Elevate your head slightly if you suffer from acid reflux"],
      warning: "If you feel faint, lightheaded, or short of breath while laying down, roll onto your left side immediately.",
      nextQuestions: ["Why is the left side better for sleeping?", "How can I use pillows to relieve back pain while sleeping?", "Is it safe to sleep on my stomach in the first trimester?"],
      references: ["ACOG — Sleeping positions during pregnancy", "National Sleep Foundation — Maternal sleep guidelines"],
      emergency: false,
    };
  }

  if (/movement|kick|develop|growth|fetal|baby move|baby growth|active baby/.test(lower)) {
    return {
      main: `Feeling your baby's kicks and movements is an important indicator of fetal wellness. 

Here is how you can monitor baby development and movement patterns:
* **Timeline of Quickening:** First-time mothers usually feel initial flutters (quickening) between weeks 18 and 22. If you have an anterior placenta, it may take slightly longer (up to 24 weeks).
* **Fetal Movement Counts (Kick Counts):** Starting at week 28, it is highly recommended to track your baby's movements daily. Choose a quiet hour when your baby is usually active (often after meals or in the evening).
* **The 10-Kick Rule:** Lie on your left side or sit quietly. Count how long it takes to feel 10 distinct movements (kicks, rolls, flutters, or jabs). You should ideally feel 10 movements within a 2-hour window (most babies achieve this in under 30 minutes).
* **What to do if Movement Slows:** If your baby is quiet, drink a glass of cold fruit juice or eat a snack, then lie down on your left side to see if they wake up.`,
      highlights: ["Initial flutters (quickening) are felt between 18-22 weeks", "Perform kick counts daily starting at week 28", "Aim for 10 movements within a 2-hour window"],
      remember: ["Babies have sleep cycles (often 20-40 minutes) where they move less", "Cold water or a light snack can sometimes stimulate baby movement", "Every pregnancy and baby has a unique movement pattern"],
      warning: "If you notice a sudden decrease or complete absence of baby movement, contact your healthcare provider or go to labor and delivery immediately.",
      nextQuestions: ["How do I perform a kick count?", "When does baby movement become regular?", "Why does my baby move more at night?"],
      references: ["ACOG — Track your baby's movements", "NHS — Fetal movements guide"],
      emergency: false,
    };
  }

  if (/iron|anemic|anemia|ferritin|hemoglobin/.test(lower)) {
    return {
      main: `Iron is essential during pregnancy to support your increased blood volume and your baby's growth. 

Here is a detailed guide on optimizing your iron levels:
* **Daily Requirements:** Pregnant individuals need 27 mg of iron daily, which is double the amount needed when not pregnant. Fetal growth and red blood cell production peak in the second and third trimesters.
* **Dietary Sources:** Focus on heme iron sources (easily absorbed) like lean beef, poultry, and fish, and non-heme iron sources like lentils, spinach, beans, and fortified cereals.
* **Absorption Boosting:** Always pair non-heme iron sources with vitamin C (like oranges, strawberries, tomatoes, or bell peppers) to boost absorption.
* **Avoid Calcium Overlap:** Calcium supplements, milk, tea, and coffee inhibit iron absorption. Avoid consuming them within 2 hours of your iron supplement or iron-rich meals.`,
      highlights: ["Aim for 27mg of iron daily in your second trimester", "Vitamin C improves iron absorption", "Avoid tea/coffee with iron-rich meals"],
      remember: ["Continue your prescribed iron supplement", "Spread iron intake across meals to reduce nausea"],
      warning: "Very high iron doses can cause constipation and should only be taken as prescribed by your doctor.",
      nextQuestions: ["What are signs of iron deficiency?", "Best iron-rich breakfast ideas?", "Does iron cause constipation?"],
      references: ["ACOG — Nutrition During Pregnancy", "WHO — Iron supplementation guidelines"],
      emergency: false,
    };
  }

  if (/exercise|workout|yoga|active|stretch|stretching|fitness|gym|run|walking|swimming|cycling/.test(lower)) {
    return {
      main: `Staying active during pregnancy is highly beneficial for both you and your baby. 

Here are the guidelines for safe physical activity:
* **Weekly Activity Goals:** Aim for at least 150 minutes of moderate-intensity activity per week (e.g., 30 minutes, 5 days a week).
* **Highly Recommended Exercises:** Focus on low-impact routines:
  * **Walking:** The easiest and safest way to maintain cardiovascular health.
  * **Swimming:** Water supports your weight, relieving joint strain and lower back pressure.
  * **Prenatal Yoga & Pilates:** Strengthens your core, increases flexibility, and teaches breathing techniques for labor.
  * **Stationary Cycling:** Safe cardio that avoids the risk of balance loss or falling.
* **Exercises to Avoid:** Avoid contact sports, hot yoga, lifting heavy weights, or any workouts that pose a risk of falling or involve lying flat on your back after the first trimester.
* **Hydration and Temperature:** Never exercise to the point of exhaustion or overheating. Keep your effort level at a 'conversational' pace.`,
      highlights: ["Aim for 150 minutes of moderate-intensity activity per week", "Walking, swimming, and prenatal yoga are highly recommended", "Avoid activities with a risk of falling or joint strain"],
      remember: ["Stay hydrated and wear supportive shoes", "Keep your heart rate at a conversational pace", "Warm up and cool down properly"],
      warning: "Stop exercising immediately and contact your doctor if you experience dizziness, contractions, chest pain, or fluid leakage.",
      nextQuestions: ["Is running safe during pregnancy?", "How can I stretch my lower back?", "What exercises help prepare for labor?"],
      references: ["ACOG — Physical Activity and Exercise During Pregnancy", "WHO — Physical activity guidelines"],
      emergency: false,
    };
  }

  if (/pain|ache|swell|nausea|symptom|back|headache|cramp|vomit|edema|sick|discomfort/.test(lower)) {
    return {
      main: `Gestational symptoms like backaches, minor swelling, and nausea are common as your body adapts to support your baby. 

Here is how you can manage these symptoms safely:
* **Relieving Back Pain:** Practice good posture by keeping your shoulders back and chest high. Wear low-heeled, supportive shoes. Sleep with a body pillow and apply warm compresses to sore areas.
* **Managing Mild Swelling (Edema):** Elevate your legs above heart level when resting. Avoid standing or sitting in one position for long periods. Wear compression socks and drink plenty of water to help flush out fluids.
* **Morning Sickness & Nausea:** Eat small, plain meals frequently (e.g., dry toast or crackers) to keep your stomach from being empty. Ginger tea and vitamin B6 supplements (as directed by your doctor) are highly effective.
* **Safe Pain Relief:** Acetaminophen (Tylenol) is generally considered the safest pain reliever during pregnancy, but always verify the dosage with your doctor. Avoid NSAIDs like ibuprofen.`,
      highlights: ["Back pain is often caused by shifting centers of gravity", "Elevate legs to reduce mild lower extremity swelling", "Eat small, plain meals frequently for nausea relief"],
      remember: ["Use a firm mattress and sleep on your side", "Practice safe lifting by bending at the knees", "Avoid standing or sitting in one position for too long"],
      warning: "Seek immediate care for severe, sudden swelling (especially of the face/hands), one-sided calf pain/redness, or persistent severe headaches.",
      nextQuestions: ["Is back pain normal in the third trimester?", "What causes sudden swelling?", "How can I relieve morning sickness naturally?"],
      references: ["ACOG — Back Pain During Pregnancy", "Mayo Clinic — Managing pregnancy discomforts"],
      emergency: false,
    };
  }

  if (/depress|stress|anxiety|blue|mental|crying|cry|mood|sad|feelings|emotional/.test(lower)) {
    return {
      main: `It is completely normal to experience emotional shifts during and after pregnancy due to hormonal changes, fatigue, and life transitions. 

Here is a guide to supporting your mental wellness:
* **The 'Baby Blues':** Affects up to 80% of new mothers. Symptoms include mild mood swings, crying spells, and anxiety, which typically begin 2-3 days postpartum and resolve on their own within 14 days.
* **Postpartum Depression (PPD):** If feelings of severe sadness, exhaustion, anxiety, or hopelessness persist for more than 2 weeks, it may be PPD. PPD is a common, treatable medical condition.
* **Self-Care Strategies:** Prioritize rest, accept help from family for chores, discuss feelings openly with loved ones, and engage in gentle outdoor walking.
* **Treatment Options:** Professional therapy (CBT), support groups, and pregnancy-safe medications are highly effective. Reach out to your doctor if you feel overwhelmed.`,
      highlights: ["Baby blues affect up to 80% of mothers and resolve quickly", "PPD is common (10-15%) and requires professional care", "Therapy and support groups are highly effective first-line treatments"],
      remember: ["Be gentle with yourself and prioritize rest", "Share how you feel with your partner or loved ones", "Do not hesitate to seek professional counseling support"],
      warning: "If you have thoughts of harming yourself or your baby, please contact your healthcare provider or emergency services immediately.",
      nextQuestions: ["What are early warning signs of PPD?", "How can I manage daily stress?", "Where can I find maternal mental health support groups?"],
      references: ["WHO — Maternal mental health guidelines", "ACOG — Postpartum Depression"],
      emergency: false,
    };
  }

  if (/nutrition|food|diet|eat|supplement|calcium|vitamin|nutrients|protein|caffeine|coffee|tea/.test(lower)) {
    return {
      main: `A balanced, nutrient-dense diet during pregnancy is key to supporting your baby's development. 

Here are the guidelines for healthy pregnancy nutrition:
* **Core Nutritional Needs:** Make sure your diet includes:
  * **Folic Acid (Folate):** 600 mcg daily to prevent neural tube defects. Found in leafy greens, citrus, and beans.
  * **Calcium & Vitamin D:** 1,000 mg of calcium and 600 IU of Vitamin D daily for baby's bone and tooth development.
  * **Protein:** Critical for tissue growth. Include lean meats, poultry, eggs, tofu, beans, and Greek yogurt.
* **Safe Meal Practices:** Wash all fruits and vegetables thoroughly, cook eggs and meat completely, and consume only pasteurized dairy and juices.
* **Foods to Avoid:** Raw or undercooked seafood (sushi), raw sprouts, deli meats (unless heated steaming hot), unpasteurized cheeses (brie, feta), and high-mercury fish.
* **Caffeine Limitations:** Limit daily caffeine intake to 200 mg (about one 12 oz mug of coffee).`,
      highlights: ["Calcium and Vitamin D are crucial for baby's bone development", "Include adequate protein (lean meats, beans, tofu, eggs)", "Limit daily caffeine to a single mug of coffee (200mg max)"],
      remember: ["Take your prenatal vitamins daily with a meal", "Stay hydrated with 8-10 cups of water per day", "Avoid high-mercury fish like swordfish and king mackerel"],
      warning: "Always consult your OB/GYN or a registered dietitian before starting any new high-dose dietary supplements.",
      nextQuestions: ["Which foods should I completely avoid?", "How much protein do I need daily?", "What are pregnancy-safe snack ideas?"],
      references: ["ACOG — Nutrition During Pregnancy", "WHO — Healthy diet guidelines for pregnant women"],
      emergency: false,
    };
  }

  return {
    main: emergency
      ? "What you're describing may need prompt medical attention. Please don't wait — contact your doctor or local emergency services right away. I'm here with you."
      : `Thank you for sharing that with me. Based on general evidence-based guidance, this is quite common during pregnancy. 

Here are the standard supportive measures to consider:
* **Rest and Recovery:** Prioritize getting adequate sleep and taking breaks when feeling tired.
* **Hydration:** Drink at least 8 to 10 glasses of water daily to maintain amniotic fluid and healthy circulation.
* **Consultation:** Note your symptom details (when it started, severity) to discuss at your next prenatal visit.`,
    highlights: ["This is often a normal part of pregnancy", "Simple self-care steps usually help", "Track how you feel over the next day"],
    remember: ["Stay hydrated and rested", "Note any changes to share with your doctor"],
    warning: "If symptoms worsen suddenly or feel severe, please contact your healthcare provider.",
    nextQuestions: ["When should I be concerned?", "What self-care can I try?", "Is this safe for my baby?"],
    references: ["ACOG — Frequently Asked Questions", "Mayo Clinic — Pregnancy Week by Week"],
    emergency,
  };
}
