import express from "express";
import cors from "cors";
import OpenAI from "openai"; // Importación correcta de OpenAI
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY no está definido en el archivo .env");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Clave de OpenAI desde variables de entorno
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres un asistente que ayuda a practicar español. Solo hablas en presente de indicativo. Si el usuario comete un error, lo corriges y sigues la conversación." },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error en la solicitud a OpenAI:", error);
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
});

app.listen(3000, () => console.log("Servidor funcionando en http://localhost:3000"));
