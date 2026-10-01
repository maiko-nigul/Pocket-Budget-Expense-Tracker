import express from "express"
import { supabase, requireAuth } from "./supabaseClient.js";

const router = express.Router();

router.get("/items", requireAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("items")
            .select("*");
        if (error) return res.status(400).json({ error: error.message })
        res.json(data)
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/items", requireAuth, async (req, res) => {
    try {
        const { description, amount_euros } = req.body;

        if (!description || !amount_euros) {
            return res.status(400).json({ error: "data is missing" });
        }

        const { data, error } = await supabase
            .from("items")
            .insert([
                {
                    owner_id: req.user.id,
                    description: description,
                    amount_euros: Number(amount_euros)
                }
            ])
            .select;
        if (error) return res.status(400).json({ error: error.message })
        res.status(201).json({
            message: "Kirje edukalt lisatud!",
            item: data[0]
        });
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

    res.json({
      message: "Kirje edukalt kustutatud!",
      deletedItem: data[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router