// ✅ IMPORTAÇÕES NECESSÁRIAS
import express from "express";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

// ✅ INICIALIZA O APP EXPRESS
const app = express();

// ✅ VARIÁVEIS DE AMBIENTE (DO RENDER OU REPLIT)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const REPLIT_TICK_URL = process.env.REPLIT_TICK_URL;

// ✅ CONEXÃO COM O SUPABASE
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("🛰️ Worker Realtime conectado ao Supabase...");

// ✅ INSCRIÇÃO NO CANAL DE TAREFAS
supabase
  .channel("public:agentes_tarefas")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "agentes_tarefas" },
    async (payload) => {
      console.log("🚀 Nova tarefa detectada:", payload.new);

      try {
        const res = await fetch(REPLIT_TICK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload.new),
        });

        if (res.ok) {
          console.log("✅ Tick enviado com sucesso!");
        } else {
          console.error("⚠️ Tick retornou erro HTTP:", res.status);
        }
      } catch (err) {
        console.error("❌ Erro ao enviar tick:", err.message);
      }
    }
  )
  .subscribe();

// ✅ ROTA BASE PARA TESTE
app.get("/", (req, res) => {
  res.send("🚀 Supabase Realtime Worker rodando perfeitamente!");
});

// ✅ SERVIDOR EXPRESS
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
