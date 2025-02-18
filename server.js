import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.TOGETHER_API_KEY) {
  console.error("Error: TOGETHER_API_KEY no está definido en el archivo .env");
  process.exit(1);
}

const app = express();  // ← ¡IMPORTANTE! Definir `app` antes de usarlo.
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: "https://api.together.xyz/v1",
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "meta-llama/Llama-3-8b-chat-hf",
      messages: [
        { role: "system", content: "Eres un asistente que ayuda a practicar español. Solo hablas en presente de indicativo. Haces preguntas sobre la rutina diaria y corriges errores." },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error en la solicitud a Together AI:", error);
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
app.post("/corregir", async (req, res) => {
  try {
    const { texto } = req.body;

    const response = await openai.chat.completions.create({
      model: "meta-llama/Llama-3-8b-chat-hf", // Modelo usado para corrección
      messages: [
        { role: "system", content: "Corrige errores gramaticales y ortográficos del siguiente texto en español, sin cambiar su significado." },
        { role: "user", content: texto },
      ],
    });

    res.json({ correccion: response.choices[0].message.content });
  } catch (error) {
    console.error("Error en la solicitud de corrección:", error);
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
});
app.post("/rellena-huecos", async (req, res) => {
  try {
    const { oraciones } = req.body;

    const response = await openai.chat.completions.create({
      model: "meta-llama/Llama-3-8b-chat-hf",
      messages: [
        { 
          role: "system", 
          content: `Corrige los verbos en presente de indicativo en los siguientes huecos y devuelve SOLO un JSON en este formato:
{
  "1": "Yo hablo (hablar)",
  "2": "María come (comer)"
}
No añadas explicaciones ni comentarios, solo el JSON puro.` 
        },
        { role: "user", content: JSON.stringify(oraciones) }
      ],
      temperature: 0,
      max_tokens: 300
    });

    // Extraer respuesta de la IA y limpiarla
    let respuestaIA = response.choices[0].message.content.trim();

    console.log("Respuesta completa de la IA:", respuestaIA); // <-- DEBUG: Mostrar la respuesta de la IA en los logs

    // Intentar encontrar la parte JSON correcta
    const inicioJSON = respuestaIA.indexOf("{");
    const finJSON = respuestaIA.lastIndexOf("}") + 1;

    if (inicioJSON === -1 || finJSON === 0) {
      console.error("Error: La IA no devolvió un JSON válido. Respuesta recibida:", respuestaIA);
      return res.status(500).json({ error: "La IA no devolvió un JSON válido.", rawResponse: respuestaIA });
    }

    const jsonLimpio = respuestaIA.substring(inicioJSON, finJSON);

    // Intentar parsear el JSON
    let correcciones;
    try {
      correcciones = JSON.parse(jsonLimpio);
    } catch (error) {
      console.error("Error al parsear la respuesta. Respuesta recibida:", respuestaIA);
      return res.status(500).json({ error: "Error al convertir la respuesta en JSON.", rawResponse: respuestaIA });
    }

    res.json({ correcciones });
    
  } catch (error) {
    console.error("Error en la autocorrección:", error);
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
});
