import crypto from 'crypto';
import sql from './db';
import { generateAIResponse, type AIResponse } from './mockFallback';
import type { NurtureUser } from '../store/authStore';

async function queryGemini(apiKey: string, body: any): Promise<string> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }
  
  const resJson = await response.json();
  const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini');
  }
  return text;
}

// 1. Password Hashing
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  } catch (error) {
    return false;
  }
}

// 2. Session Management
export async function getUserBySession(sessionId: string) {
  if (!sessionId) return null;
  const sessions = await sql`
    SELECT user_id, expires_at FROM sessions WHERE id = ${sessionId}
  `;
  if (sessions.length === 0) return null;
  
  const session = sessions[0];
  if (new Date(session.expiresAt) < new Date()) {
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
    return null;
  }
  
  const users = await sql`
    SELECT * FROM users WHERE id = ${session.userId}
  `;
  return users.length > 0 ? users[0] : null;
}

export async function createSession(userId: number) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  await sql`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${sessionId}, ${userId}, ${expiresAt})
  `;
  return sessionId;
}

// 3. User Operations
export async function signupUser(fullName: string, email: string, phone?: string, password?: string) {
  const existing = await sql`
    SELECT id FROM users WHERE email = ${email.toLowerCase()}
  `;
  if (existing.length > 0) {
    throw new Error('An account with this email already exists.');
  }
  
  const pwHash = hashPassword(password || 'password');
  const users = await sql`
    INSERT INTO users (email, password_hash, full_name, phone, stage, onboarded)
    VALUES (${email.toLowerCase()}, ${pwHash}, ${fullName}, ${phone || null}, 'pregnant', false)
    RETURNING *
  `;
  return users[0];
}

export async function loginUser(email: string, password?: string) {
  const users = await sql`
    SELECT * FROM users WHERE email = ${email.toLowerCase()}
  `;
  if (users.length === 0) {
    throw new Error('Invalid email or password.');
  }
  const user = users[0];
  if (password && !verifyPassword(password, user.passwordHash)) {
    throw new Error('Invalid email or password.');
  }
  return user;
}

export async function updateUserProfile(userId: number, data: any) {
  const updates: Record<string, any> = {};
  const allowedKeys = [
    'fullName', 'phone', 'age', 'country', 'language', 'stage',
    'currentWeek', 'dueDate', 'previousPregnancy', 'babyName',
    'babyBirthDate', 'babyAgeWeeks', 'deliveryType', 'breastfeeding',
    'height', 'weight', 'bloodGroup', 'conditions', 'allergies',
    'medications', 'doctor', 'hospital', 'emergencyContact',
    'emergencyRelationship', 'onboarded'
  ];
  
  for (const key of allowedKeys) {
    if (key in data) {
      const val = data[key];
      updates[key] = val === undefined ? null : val;
    }
  }
  
  if (Object.keys(updates).length === 0) {
    const users = await sql`SELECT * FROM users WHERE id = ${userId}`;
    return users[0];
  }
  
  const updated = await sql`
    UPDATE users 
    SET ${sql(updates)}
    WHERE id = ${userId}
    RETURNING *
  `;
  return updated[0];
}

// 4. Group Helper
function getGroup(dateStr: string | Date): "Today" | "Yesterday" | "Last Week" {
  const date = new Date(dateStr);
  const now = new Date();
  const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = nowMidnight.getTime() - dateMidnight.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return 'Last Week';
}

// 5. Conversation Operations
export async function getUserConversations(userId: number) {
  const convos = await sql`
    SELECT * FROM conversations 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
  `;
  return convos.map((c) => ({
    id: c.id,
    title: c.title,
    pinned: c.pinned,
    group: getGroup(c.createdAt)
  }));
}

export async function getConversationMessages(userId: number, conversationId: string) {
  const convoCheck = await sql`
    SELECT id FROM conversations WHERE id = ${conversationId} AND user_id = ${userId}
  `;
  if (convoCheck.length === 0) {
    throw new Error('Conversation not found');
  }
  
  const msgs = await sql`
    SELECT * FROM messages 
    WHERE conversation_id = ${conversationId} 
    ORDER BY created_at ASC
  `;
  
  return msgs.map((m) => {
    const time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      id: m.id,
      role: m.role as 'user' | 'assistant',
      text: m.text,
      ai: m.ai as AIResponse | undefined,
      fileName: m.fileName,
      fileType: m.fileType,
      fileData: m.fileData,
      time
    };
  });
}

export async function sendAIMessage(
  userId: number,
  prompt: string,
  conversationId?: string,
  file?: { base64: string; mimeType: string; name: string }
) {
  let activeConvoId = conversationId;
  
  if (!activeConvoId) {
    activeConvoId = crypto.randomUUID();
    const firstWords = prompt.split(' ').slice(0, 4).join(' ');
    const title = firstWords.length > 25 ? firstWords.slice(0, 25) + '...' : firstWords || 'New Chat';
    
    await sql`
      INSERT INTO conversations (id, user_id, title, pinned)
      VALUES (${activeConvoId}, ${userId}, ${title}, false)
    `;
  } else {
    const convoCheck = await sql`
      SELECT id FROM conversations WHERE id = ${activeConvoId} AND user_id = ${userId}
    `;
    if (convoCheck.length === 0) {
      throw new Error('Conversation not found');
    }
  }
  
  const history = await sql`
    SELECT role, text, ai FROM messages 
    WHERE conversation_id = ${activeConvoId} 
    ORDER BY created_at ASC 
    LIMIT 10
  `;
  
  const userMsgId = crypto.randomUUID();
  await sql`
    INSERT INTO messages (id, conversation_id, role, text, file_name, file_type, file_data)
    VALUES (
      ${userMsgId}, 
      ${activeConvoId}, 
      'user', 
      ${prompt}, 
      ${file?.name || null}, 
      ${file?.mimeType || null}, 
      ${file?.base64 || null}
    )
  `;
  
  let aiResponse: AIResponse;
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (apiKey && apiKey.trim() !== '') {
    try {
      console.log(`[TypeScript Server] Sending prompt to Python Agentic Backend...`);
      
      // Fetch user profile metrics from Postgres
      const users = await sql`SELECT * FROM users WHERE id = ${userId}`;
      const user = users.length > 0 ? users[0] : null;
      
      const patientProfile = user ? {
        fullName: user.fullName || null,
        stage: user.stage || null,
        currentWeek: user.currentWeek || null,
        dueDate: user.dueDate || null,
        conditions: user.conditions || null,
        allergies: user.allergies || null,
        language: user.language || null,
        postpartum: user.stage === 'postpartum'
      } : null;
      
      const requestPayload = {
        prompt,
        conversationId: activeConvoId,
        history: history.map((m) => ({
          role: m.role,
          text: m.role === 'user' ? m.text : (m.ai as any)?.main || ''
        })),
        file: file ? {
          base64: file.base64,
          mimeType: file.mimeType,
          name: file.name
        } : null,
        patientProfile
      };

      const response = await fetch(`http://127.0.0.1:8000/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Python Agentic Backend error: ${response.statusText} - ${errText}`);
      }

      const resJson = await response.json();
      aiResponse = resJson as AIResponse;
      console.log(`[TypeScript Server] Agentic response received successfully from Python!`);
    } catch (error) {
      console.error('[TypeScript Server] Python Agentic Backend call failed, falling back to mock response:', error);
      aiResponse = generateAIResponse(prompt);
    }
  } else {
    aiResponse = generateAIResponse(prompt);
  }
  
  const assistantMsgId = crypto.randomUUID();
  await sql`
    INSERT INTO messages (id, conversation_id, role, ai)
    VALUES (${assistantMsgId}, ${activeConvoId}, 'assistant', ${sql.json(aiResponse as any)})
  `;
  
  const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return {
    conversationId: activeConvoId,
    message: {
      id: assistantMsgId,
      role: 'assistant' as const,
      ai: aiResponse,
      time: assistantTime
    }
  };
}

export async function deleteConversation(userId: number, conversationId: string) {
  await sql`
    DELETE FROM conversations 
    WHERE id = ${conversationId} AND user_id = ${userId}
  `;
}

export async function togglePinConversation(userId: number, conversationId: string) {
  const convos = await sql`
    SELECT pinned FROM conversations 
    WHERE id = ${conversationId} AND user_id = ${userId}
  `;
  if (convos.length === 0) throw new Error('Conversation not found');
  const nextPinned = !convos[0].pinned;
  await sql`
    UPDATE conversations 
    SET pinned = ${nextPinned} 
    WHERE id = ${conversationId}
  `;
  return nextPinned;
}
