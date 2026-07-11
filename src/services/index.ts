import { mockRequest } from "./client";
import * as data from "./mockData";

export const pregnancyService = {
  getWeeklyInfo: () => mockRequest(data.weeklyInfo),
  getWeek: (week: number) => mockRequest(data.weeklyInfo.find((w) => w.week === week)),
  getWeightTrend: () => mockRequest(data.weightTrend),
};

export const nutritionService = {
  getMeals: () => mockRequest(data.todaysMeals),
  getNutrients: () => mockRequest(data.nutrients),
  getFoodsToEat: () => mockRequest(data.foodsToEat),
  getFoodsToAvoid: () => mockRequest(data.foodsToAvoid),
  getWaterLog: () => mockRequest(data.waterLog),
  getWaterTrend: () => mockRequest(data.waterWeekTrend),
};

export const symptomService = {
  getAll: () => mockRequest(data.symptoms),
  getById: (id: string) => mockRequest(data.symptoms.find((s) => s.id === id)),
};

export const exerciseService = {
  getAll: () => mockRequest(data.exercises),
};

export const babyService = {
  getGrowth: () => mockRequest(data.babyGrowth),
  getMilestones: () => mockRequest(data.babyMilestones),
  getFeedingLog: () => mockRequest(data.feedingLog),
  getSleepLog: () => mockRequest(data.sleepLog),
};

export const medicineService = {
  getAll: () => mockRequest(data.medicines),
};

export const calendarService = {
  getAppointments: () => mockRequest(data.appointments),
};

export const aiService = {
  getConversations: () => mockRequest(data.conversations),
  getSuggestedQuestions: () => mockRequest(data.suggestedQuestions),
  // Simulated streaming completion — replace with Gemini/LangGraph backend.
  sendMessage: (message: string) => mockRequest(generateAIResponse(message), 900),
};

export const postpartumService = {
  getRecoveryTimeline: () => mockRequest(data.recoveryTimeline),
  getAffirmations: () => mockRequest(data.affirmations),
  getScreeningQuestions: () => mockRequest(data.screeningQuestions),
};

export const insightsService = {
  getInsights: () => mockRequest(data.aiInsights),
  getNotifications: () => mockRequest(data.notifications),
};

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
  if (lower.includes("iron")) {
    return {
      main: "Iron is essential during pregnancy to support your increased blood volume and your baby's growth. Great iron-rich foods include lean red meat, lentils, spinach, fortified cereals, and pumpkin seeds. Pairing them with vitamin C (like oranges or bell peppers) boosts absorption significantly.",
      highlights: ["Aim for 27mg of iron daily in your second trimester", "Vitamin C improves iron absorption", "Avoid tea/coffee with iron-rich meals"],
      remember: ["Continue your prescribed iron supplement", "Spread iron intake across meals to reduce nausea"],
      warning: "Very high iron doses can cause constipation and should only be taken as prescribed by your doctor.",
      nextQuestions: ["What are signs of iron deficiency?", "Best iron-rich breakfast ideas?", "Does iron cause constipation?"],
      references: ["ACOG — Nutrition During Pregnancy", "WHO — Iron supplementation guidelines"],
      emergency: false,
    };
  }
  return {
    main: emergency
      ? "What you're describing may need prompt medical attention. Please don't wait — contact your doctor or local emergency services right away. I'm here with you."
      : "Thank you for sharing that with me, Sarah. Based on general evidence-based guidance, this is quite common during pregnancy. Let me walk you through what's helpful to know and when to reach out to your care team.",
    highlights: ["This is often a normal part of pregnancy", "Simple self-care steps usually help", "Track how you feel over the next day"],
    remember: ["Stay hydrated and rested", "Note any changes to share with your doctor"],
    warning: "If symptoms worsen suddenly or feel severe, please contact your healthcare provider.",
    nextQuestions: ["When should I be concerned?", "What self-care can I try?", "Is this safe for my baby?"],
    references: ["ACOG — Frequently Asked Questions", "Mayo Clinic — Pregnancy Week by Week"],
    emergency,
  };
}
