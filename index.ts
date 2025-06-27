import express, { Request, Response } from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// CREATE
app.post("/items", async (req: Request, res: Response) => {
  const { nome, descricao } = req.body;
  const { data, error } = await supabase
    .from("items")
    .insert([{ nome, descricao }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// READ
app.get("/items", async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from("items").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// UPDATE
app.put("/items/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nome, descricao } = req.body;

  const { data, error } = await supabase
    .from("items")
    .update({ nome, descricao })
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE
app.delete("/items/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const { data, error } = await supabase.from("items").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Item deletado com sucesso!", data });
});

// ROTA RAIZ
app.get("/", (_req: Request, res: Response) => {
  res.send("API Supabase CRUD está funcionando!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
