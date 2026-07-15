import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';
import type { NurtureUser } from '../store/authStore';

// Interfaces
interface SignupInput {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
}

interface LoginInput {
  email: string;
  password?: string;
}

// 1. Get Current User Server Function
export const getCurrentUserServerFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const sessionId = getCookie('nurture_session');
    if (!sessionId) return null;
    
    try {
      const { getUserBySession } = await import('./serverHelpers');
      const user = await getUserBySession(sessionId);
      if (!user) return null;
      
      const { passwordHash, ...safeUser } = user;
      return safeUser as NurtureUser & { id: number; onboarded: boolean };
    } catch (e) {
      console.error('Error fetching current user:', e);
      return null;
    }
  });

// 2. Signup Server Function
export const signupServerFn = createServerFn({ method: 'POST' })
  .validator((data: SignupInput) => data)
  .handler(async ({ data }) => {
    const { fullName, email, phone, password } = data;
    
    try {
      const { signupUser, createSession } = await import('./serverHelpers');
      const user = await signupUser(fullName, email, phone, password);
      
      // Create session and set cookie
      const sessionId = await createSession(user.id);
      setCookie('nurture_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
      
      const { passwordHash, ...safeUser } = user;
      return safeUser as NurtureUser & { id: number; onboarded: boolean };
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  });

// 3. Login Server Function
export const loginServerFn = createServerFn({ method: 'POST' })
  .validator((data: LoginInput) => data)
  .handler(async ({ data }) => {
    const { email, password } = data;
    
    try {
      const { loginUser, createSession } = await import('./serverHelpers');
      const user = await loginUser(email, password);
      
      // Create session and set cookie
      const sessionId = await createSession(user.id);
      setCookie('nurture_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
      
      const { passwordHash, ...safeUser } = user;
      return safeUser as NurtureUser & { id: number; onboarded: boolean };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  });

// 4. Logout Server Function
export const logoutServerFn = createServerFn({ method: 'POST' })
  .handler(async () => {
    const sessionId = getCookie('nurture_session');
    
    try {
      if (sessionId) {
        const { sql } = await import('./db');
        await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
      }
    } catch (e) {
      console.error('Database error in logout:', e);
    } finally {
      // Always clear the cookie
      setCookie('nurture_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: -1,
      });
    }
    
    return { success: true };
  });

// 5. Update/Onboard User Server Function
export const updateUserServerFn = createServerFn({ method: 'POST' })
  .validator((data: Partial<NurtureUser> & { onboarded?: boolean }) => data)
  .handler(async ({ data }) => {
    const sessionId = getCookie('nurture_session');
    if (!sessionId) {
      throw new Error('Unauthorized');
    }
    
    try {
      const { getUserBySession, updateUserProfile } = await import('./serverHelpers');
      const user = await getUserBySession(sessionId);
      if (!user) {
        throw new Error('Unauthorized');
      }
      
      const updatedUser = await updateUserProfile(user.id, data);
      const { passwordHash, ...safeUser } = updatedUser;
      return safeUser as NurtureUser & { id: number; onboarded: boolean };
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  });
