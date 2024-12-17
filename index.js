import express from 'express';
import cors from 'cors'; // Import the cors package
import { HfInference } from "@huggingface/inference";

const app = express();
const PORT = 5000;

// Use CORS middleware
app.use(cors());  // Allow all domains (you can customize this later)

app.use(express.json()); // To parse JSON request bodies

const hf = new HfInference(process.env.HF_TOKEN);

// API endpoint to handle chat requests
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Call Hugging Face API for chat completion
    const chatCompletion = await hf.chatCompletion({
      model: "mistralai/Mistral-Nemo-Instruct-2407",
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 500,
    });

    const botResponse = chatCompletion.choices[0].message.content;

    // Send the bot response back to the client
    res.json({ botMessage: botResponse });
  } catch (error) {
    console.error('Error during chat completion:', error);
    res.status(500).json({ error: 'An error occurred during chat completion' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
