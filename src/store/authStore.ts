import { create } from "zustand";
import { persist } from "zustand/middleware";

export type JourneyStage = "pregnant" | "postpartum";

export interface NurtureUser {
  fullName: string;
  email: string;
  phone?: string;
  age?: number;
  country?: string;
  language?: string;
  avatar?: string;
  // journey
  stage: JourneyStage;
  // pregnancy
  currentWeek?: number;
  dueDate?: string;
  previousPregnancy?: boolean;
  // postpartum
  babyName?: string;
  babyBirthDate?: string;
  babyAgeWeeks?: number;
  deliveryType?: string;
  breastfeeding?: boolean;
  // medical
  height?: number;
  weight?: number;
  bloodGroup?: string;
  conditions?: string;
  allergies?: string;
  medications?: string;
  doctor?: string;
  hospital?: string;
  emergencyContact?: string;
  emergencyRelationship?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  onboarded: boolean;
  user: NurtureUser | null;
  login: (email: string) => void;
  signup: (fullName: string, email: string, phone?: string) => void;
  logout: () => void;
  completeOnboarding: (data: Partial<NurtureUser>) => void;
  updateUser: (data: Partial<NurtureUser>) => void;
}

const demoUser: NurtureUser = {
  fullName: "Sarah Mitchell",
  email: "sarah@nurture.health",
  phone: "+1 (415) 555-0123",
  age: 29,
  country: "United States",
  language: "English",
  stage: "pregnant",
  currentWeek: 26,
  dueDate: "2026-10-17",
  previousPregnancy: false,
  height: 165,
  weight: 68,
  bloodGroup: "O+",
  conditions: "None",
  allergies: "Penicillin",
  medications: "Prenatal vitamins, Iron supplement",
  doctor: "Dr. Emily Carter",
  hospital: "St. Mary's Women's Hospital",
  emergencyContact: "+1 (415) 555-0199",
  emergencyRelationship: "Husband",
  babyName: "Baby Mitchell",
  babyBirthDate: "2026-01-04",
  babyAgeWeeks: 6,
  deliveryType: "Vaginal",
  breastfeeding: true,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      onboarded: false,
      user: null,
      login: (email) =>
        set({ isAuthenticated: true, onboarded: true, user: { ...demoUser, email } }),
      signup: (fullName, email, phone) =>
        set({
          isAuthenticated: true,
          onboarded: false,
          user: { ...demoUser, fullName, email, phone },
        }),
      logout: () => set({ isAuthenticated: false, onboarded: false, user: null }),
      completeOnboarding: (data) =>
        set((s) => ({
          onboarded: true,
          user: { ...(s.user ?? demoUser), ...data },
        })),
      updateUser: (data) =>
        set((s) => ({ user: { ...(s.user ?? demoUser), ...data } })),
    }),
    { name: "nurture-auth" },
  ),
);

export { demoUser };
