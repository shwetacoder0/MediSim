# ElevenLabs Integration Setup Guide for MediSim

This guide will walk you through the necessary steps to set up and configure the ElevenLabs conversational AI feature in the MediSim app.

## Prerequisites

- An ElevenLabs account with API access
- Expo development environment set up
- MediSim app codebase

## Step 1: Create an ElevenLabs Agent

1. Sign in to your ElevenLabs account at [elevenlabs.io](https://elevenlabs.io)
2. Navigate to **Conversational AI > Agents** in the dashboard
3. Create a new agent from the blank template

## Step 2: Configure the Agent

### Set the First Message

In the agent configuration, set the first message with dynamic variables for the medical report:

```
Hi there! I'm your AI Medical Assistant. I've analyzed your kidney scan report and can explain the findings to you. What would you like to know about your results?
```

### Set the System Prompt

Set a system prompt that uses the dynamic variables for personalized context:

```
You are a helpful medical assistant specializing in explaining kidney scan reports to patients.

You have access to the following report data through the getReportData tool:
- Patient information
- Kidney measurements and condition
- Stone details if present
- Other medical findings

Always explain medical terms in simple language. Be empathetic and reassuring, but honest about findings. If asked about treatment options, remind the patient to consult with their doctor for personalized medical advice.

When the conversation begins, introduce yourself briefly and ask how you can help explain their results.
```

### Set Up Client Tools

Add a client tool to access report data:

- **Name:** getReportData
- **Description:** Gets the detailed medical report data for the current patient
- **Wait for response:** true
- **Response timeout (seconds):** 3
- **Parameters:** None

## Step 3: Set Your Agent ID

1. In the ElevenLabs dashboard, go to your agent's settings
2. Copy the Agent ID
3. Open `components/ConversationalAI.tsx`
4. Replace `'YOUR_AGENT_ID'` with your actual Agent ID:

```javascript
await conversation.startSession({
  agentId: 'YOUR_ACTUAL_AGENT_ID_HERE', // Replace this line
  // rest of the code...
});
```

## Step 4: Set Up Development Environment

Ensure you have all required dependencies by running:

```bash
npx expo install @elevenlabs/react react-native-webview react-dom react-native-web @expo/metro-runtime
```

## Step 5: Running the App

To properly test the ElevenLabs integration:

1. Start the Expo server with tunnel support:
   ```bash
   npx expo start --tunnel
   ```
   This is required for WebView microphone access.

2. For a production build:
   ```bash
   npx expo prebuild --clean
   npx expo build:android
   npx expo build:ios
   ```

## Step 6: Testing the Integration

1. Open the MediSim app
2. Navigate to a report results screen
3. Tap on "AI Doctor Explanation"
4. Tap "Start Call" to begin the conversation
5. Ask questions about the report and verify that the AI responds appropriately

## Troubleshooting

### Microphone Permission Issues

- Ensure microphone permissions are properly set in app.json
- For iOS simulators, physical devices may be required for microphone testing
- For Android emulators, enable "Virtual microphone uses host audio input" in settings

### Connection Problems

- Verify your ElevenLabs API key is valid
- Check that you're using the correct Agent ID
- Ensure you're using `--tunnel` mode when testing locally

### Response Quality

- If responses lack specificity about medical reports, refine your agent's system prompt
- Add more detailed example conversations in the ElevenLabs agent configuration
- Enhance the `getReportData` function to return more comprehensive report data

## Next Steps

- Consider implementing voice customization options
- Add conversation history storage for continuity between sessions
- Implement feedback collection to improve the AI's responses

For further assistance, refer to the [ElevenLabs API documentation](https://docs.elevenlabs.io/).
