const express = require('express');
const axios = require('axios');
const responses = require('./responses'); // Import the responses

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const botToken = '6656617867:AAHSfZrLJRmuLme0-M8hSRwmwHnrypzbFOQ';

// Ngrok URL
const ngrokUrl = 'https://justice-companion-bot-telegram.onrender.com';

// Webhook route
app.post(`/webhook/${botToken}`, (req, res) => {
    const { message } = req.body;
    console.log('Received message:', message);
    
    // Respond based on user input
    if (message.text) {
        const response = getLocalResponse(message.text);
        sendMessage(message.chat.id, response);
    }

    res.sendStatus(200);
});

// Function to get a local response based on user input
function getLocalResponse(inputText) {
    return responses[inputText.toLowerCase()] || responses['default'];
}

// Function to send a message to Telegram API
function sendMessage(chatId, text) {
    axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: text
    })
    .then(response => {
        console.log('Message sent:', response.data);
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}

// Set the webhook
axios.post(`https://api.telegram.org/bot${botToken}/setWebhook`, {
    url: `${ngrokUrl}/webhook/${botToken}`
})
.then(response => {
    console.log('Webhook set:', response.data);
})
.catch(error => {
    console.error('Error setting webhook:', error);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
