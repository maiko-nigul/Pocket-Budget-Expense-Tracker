import express from "express"
import { requireAuth } from "./supabaseClient.js";

const router = express.Router();

router.get("/items", requireAuth, async (req, res) => {
    try {
        const { data, error } = await req.db
            .from("items")
            .select("*")
            .order("created_at", { ascending: true });
        if (error) return res.status(400).json({ error: error.message })
        res.json(data)
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/items", requireAuth, async (req, res) => {
    try {
        const { description, amount_euros } = req.body ?? {};

        if (typeof description !== "string") {
            return res.status(400).json({ error: "description is required" });
        }
        const text = description.trim();
        if (text.length < 1 || text.length > 80) {
            return res.status(400).json({ error: "description must be 1–80 characters" });
        }
        if (!Number.isInteger(amount_euros) || amount_euros < 1 || amount_euros > 1000) {
            return res.status(400).json({ error: "amount_euros must be a whole number from 1 to 1000" });
        }

        const { data, error } = await req.db
            .from("items")
            .insert([
                {
                    owner_id: req.user.id,
                    description: text,
                    amount_euros: amount_euros
                }
            ])
            .select()
            .single();
        if (error) return res.status(400).json({ error: error.message })
        res.status(201).json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.delete("/items/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await req.db
      .from("items")
      .delete()
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Sellise ID-ga kirjet ei leitud" });
    }

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router
