import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

// 🔧 VARIÁVEIS DE AMBIENTE
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const REPLIT_TICK_URL = process.env.REPLIT_TICK_URL;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("🛰️ Worker Realtime conectado ao Supabase...");

supabase
  .channel("public:agentes_tarefas")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "agentes_tarefas" }, async (payload) => {
    console.log("🚀 Nova tarefa detectada:", payload.new);

    try {
      const res = await fetch(REPLIT_TICK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.new)
      });
      console.log("✅ Tick enviado:", res.status);
    } catch (err) {
      console.error("❌ Erro ao enviar tick:", err);
    }
  })
  .subscribe();
