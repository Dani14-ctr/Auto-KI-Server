const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID
});
const openai = new OpenAIApi(configuration);

app.post('/ask', async (req, res) => {
  const userInput = req.body.query;

  const prompt = `
Du bist ein intelligenter Auto-KI-Assistent. Analysiere die folgende Nutzereingabe und beantworte sie entweder direkt oder leite eine passende Aktion ab. Gib die Antwort als JSON zurück, mit zwei Feldern: "intent" und "response".

Mögliche Intents: info, call, navigate, message, music.

Input: "${userInput}"
`;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const gptResponse = completion.data.choices[0].message.content;
  try {
    const json = JSON.parse(gptResponse);
    res.json(json);
  } catch (e) {
    res.json({
      intent: "info",
      response: gptResponse,
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
