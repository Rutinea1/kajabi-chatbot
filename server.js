import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY no está definido en el archivo .env");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Clave de OpenAI desde las variables de entorno
  })
);

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres un asistente que ayuda a practicar español. Solo hablas en presente de indicativo. Si el usuario comete un error, lo corriges y sigues la conversación." },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
});

app.listen(3000, () => console.log("Servidor funcionando en http://localhost:3000"));
