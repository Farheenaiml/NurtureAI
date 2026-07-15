import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getCurrentUserServerFn,
  signupServerFn,
  loginServerFn,
  logoutServerFn,
  updateUserServerFn,
} from "../backend/authServer";

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
  login: (email: string, password?: string) => Promise<void>;
  signup: (fullName: string, email: string, phone?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (data: Partial<NurtureUser>) => Promise<void>;
  updateUser: (data: Partial<NurtureUser>) => Promise<void>;
  setStoreUser: (user: (NurtureUser & { onboarded: boolean }) | null) => void;
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
      login: async (email, password) => {
        try {
          const user = await loginServerFn({ data: { email, password } });
          set({
            isAuthenticated: true,
            onboarded: user.onboarded,
            user,
          });
        } catch (error: any) {
          throw new Error(error.message || "Failed to log in.");
        }
      },
      signup: async (fullName, email, phone, password) => {
        try {
          const user = await signupServerFn({ data: { fullName, email, phone, password } });
          set({
            isAuthenticated: true,
            onboarded: user.onboarded,
            user,
          });
        } catch (error: any) {
          throw new Error(error.message || "Failed to sign up.");
        }
      },
      logout: async () => {
        try {
          await logoutServerFn();
        } catch (e) {
          console.error("Logout failed on server", e);
        } finally {
          set({ isAuthenticated: false, onboarded: false, user: null });
        }
      },
      completeOnboarding: async (data) => {
        try {
          const user = await updateUserServerFn({ data: { ...data, onboarded: true } });
          set({
            onboarded: true,
            user,
          });
        } catch (error: any) {
          throw new Error(error.message || "Failed to complete onboarding.");
        }
      },
      updateUser: async (data) => {
        try {
          const user = await updateUserServerFn({ data });
          set({
            user,
          });
        } catch (error: any) {
          throw new Error(error.message || "Failed to update profile.");
        }
      },
      setStoreUser: (user) => {
        if (user) {
          set({
            isAuthenticated: true,
            onboarded: user.onboarded,
            user,
          });
        } else {
          set({
            isAuthenticated: false,
            onboarded: false,
            user: null,
          });
        }
      },
    }),
    { name: "nurture-auth" },
  ),
);

export { demoUser };
