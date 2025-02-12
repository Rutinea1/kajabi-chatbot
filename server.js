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
Rellena los huecos con la forma correcta del verbo en presente de indicativo:
1.	Yo ___ (hablar) con mis amigos todos los días.
2.	María ___ (comer) frutas por la mañana.
3.	Nosotros ___ (vivir) en una ciudad muy bonita.
4.	¿Tú ___ (entender) lo que dice el profesor?
5.	Ellos ___ (escribir) una carta para su abuela.
6.	Pedro siempre ___ (hacer) la tarea después de la cena.
7.	Yo ___ (salir) de casa temprano para evitar el tráfico.
8.	¿Vosotros ___ (trabajar) los fines de semana?
9.	Mi hermano ___ (jugar) al fútbol todos los sábados.
10.	Nosotros ___ (tener) una reunión importante esta tarde.
11.	¿Tú ___ (decir) siempre la verdad?
12.	Laura ___ (estudiar) mucho para sus exámenes.
13.	Mis amigos y yo ___ (ir) al cine los viernes por la noche.
14.	Yo ___ (poner) la mesa antes de cenar.
15.	¿Tú ___ (querer) venir a la fiesta esta noche?
16.	Mi madre ___ (cocinar) platos deliciosos los domingos.
17.	Nosotros ___ (saber) que esa respuesta es correcta.
18.	Ellos ___ (leer) muchos libros interesantes.
19.	¿Quién ___ (venir) contigo al concierto?
20.	Tú siempre ___ (pedir) un café después de comer.
21.	Yo ___ (caminar) por el parque todas las mañanas.
22.	Mis padres ___ (comprar) pan fresco en la panadería.
23.	¿Tú ___ (abrir) las ventanas cuando hace calor?
24.	Nosotros ___ (beber) mucha agua durante el día.
25.	Ella ___ (dormir) ocho horas todas las noches.
26.	Los niños ___ (jugar) en el patio después de la escuela.
27.	Yo siempre ___ (venir) a tiempo a las reuniones.
28.	¿Vosotros ___ (escuchar) música mientras estudiáis?
29.	El perro ___ (correr) rápido cuando ve una pelota.
30.	Mi hermana ___ (preferir) las frutas antes que los dulces.
31.	Nosotros ___ (pensar) que esta idea es interesante.
32.	¿Tú ___ (conducir) todos los días al trabajo?
33.	Ellos ___ (cerrar) la puerta antes de salir de casa.
34.	Yo ___ (buscar) información para el proyecto de clase.
35.	¿Quién ___ (traer) los refrescos a la fiesta?
36.	Tú ___ (recordar) siempre los cumpleaños de tus amigos.
37.	Nosotros ___ (comenzar) a leer un libro nuevo esta semana.
38.	Ella ___ (oír) ruidos extraños en la casa por la noche.
39.	Vosotros ___ (llegar) tarde a la reunión con frecuencia.
40.	Los estudiantes ___ (aprender) mucho en la clase de ciencias.
