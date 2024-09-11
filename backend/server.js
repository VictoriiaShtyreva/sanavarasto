const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS to allow requests from the Chrome extension
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Backend proxy server is running.");
});

// Translation Route
app.post("/translate", async (req, res) => {
  const { text, targetLang } = req.body;

  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(
      text
    )}&target=${targetLang}&source=fi`;

    const response = await axios.get(url);
    const translatedText = response.data.data.translations[0].translatedText;

    res.json({ translation: translatedText });
  } catch (error) {
    console.error("Error during translation:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

// Text-to-Speech Route
app.post("/tts", async (req, res) => {
  const { text } = req.body;

  try {
    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    const requestBody = {
      input: { text: text },
      voice: { languageCode: "fi-FI", ssmlGender: "FEMALE" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const response = await axios.post(url, requestBody);
    const audioContent = response.data.audioContent;

    res.json({ audioContent });
  } catch (error) {
    console.error("Error during TTS:", error);
    res.status(500).json({ error: "Text-to-Speech failed" });
  }
});

// Grammar Check Route 
app.post("/grammar", async (req, res) => {
  const { word } = req.body;

  try {
    // Example: Call external grammar API
    const response = await axios.get(
      `https://your-grammar-api.com/analyze?word=${word}&lang=fi`
    );
    const grammar = response.data.grammar;
    const partOfSpeech = response.data.partOfSpeech;

    res.json({ grammar, partOfSpeech });
  } catch (error) {
    console.error("Error during grammar check:", error);
    res.status(500).json({ error: "Grammar check failed" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
