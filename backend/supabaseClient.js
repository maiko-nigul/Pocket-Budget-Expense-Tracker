import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

// 1. Üldine klient (avalike päringute või tavaliste toimingute jaoks)
export const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Eriline auth-klient (kasutatakse ainult tokenite valideerimiseks)
const authClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// 3. Autentimise vahetarkvara (middleware) kaitstud marsruutidele
export async function requireAuth(req, res, next) {
  const match = req.get('authorization')?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = match[1];

  try {
    // Kontrollime tokenit Supabase Auth teenusega
    const { data, error } = await authClient.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired access token' });
    }

    // Lisame kasutaja andmed päringu külge
    req.user = data.user;

    // Loome selle kasutaja õigustega Supabase kliendi (RLS turvalisuse jaoks)
    req.db = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    next();
  } catch (error) {
    next(error);
  }
}