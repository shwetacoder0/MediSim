# MediSim

![MediSim](assets/images/icon.png)

## Overview

MediSim is an innovative mobile application that transforms complex medical reports into interactive 3D visualizations, making healthcare information more accessible and understandable for patients. The app uses advanced AI to interpret medical reports, generate visual representations, and provide conversational AI assistance to explain findings in simple terms.

## Key Features

### 1. Medical Report Processing
- Upload medical reports through camera or file selection
- AI-powered text extraction and analysis
- Automatic identification of key medical findings

### 2. 3D Visualizations
- Interactive 3D models of human anatomy
- Customized visualizations based on medical report findings
- Zoom, rotate, and explore detailed anatomical structures

### 3. AI Doctor Consultation
- Two AI consultation options:
  - **Tavus Video Consultation**: Video-based AI doctor with realistic avatar
  - **ElevenLabs Voice Consultation**: Voice-based conversational AI assistant
- Get personalized explanations of medical reports
- Ask questions about findings, treatments, and health concerns

### 4. Educational Content
- Browse library of medical treatments with explanations
- Explore common diseases with detailed information
- Access comprehensive 3D models of human body systems

### 5. Data Visualization
- Interactive charts displaying medical metrics
- Comparative analysis with normal ranges
- Visual representation of findings (e.g., kidney stones, abnormalities)

## Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL database, authentication, storage)
- **AI Services**:
  - Gemini API for medical report analysis
  - Tavus API for video AI consultations
  - ElevenLabs for voice AI interactions
  - Three.js for 3D model rendering
  - Google Vision API for document analysis
  - OpenAI for image generation
- **Other Technologies**:
  - WebView for embedded video consultations
  - Expo GLView for 3D model display
  - React Native Charts for data visualization
  - RevenueCat for subscription management

## AI Integrations

### Google Vision API
MediSim uses Google Vision API to extract text from uploaded medical reports. The integration:
- Performs OCR (Optical Character Recognition) on report images
- Identifies document structure and layout
- Extracts text with high accuracy, even from complex medical documents
- Handles different document formats and image qualities

Implementation can be found in `lib/googleVision.ts`.

### Gemini AI
Gemini AI powers the medical report analysis capabilities:
- Interprets extracted medical text using advanced NLP
- Identifies key medical findings and abnormalities
- Generates plain-language summaries of complex medical terminology
- Provides contextual information about medical conditions

The implementation is in `lib/geminiService.ts`, which connects to Google's Generative Language API.

### OpenAI Image Generation
The app uses OpenAI's DALL-E model to create custom medical visualizations:
- Generates personalized anatomical illustrations based on report findings
- Creates visual representations of medical conditions
- Produces educational images to help patients understand their diagnosis
- Customizes visualizations based on patient-specific data

See `lib/imageGeneration.ts` for implementation details.

### ElevenLabs Voice AI
ElevenLabs provides the conversational voice AI capabilities:
- Natural-sounding voice interaction with patients
- Real-time responses to medical questions
- Custom voice model trained for medical terminology
- Multi-turn conversations with context awareness

The integration is implemented in `components/ConversationalAI.tsx` and configured according to `ELEVENLABS_SETUP_INSTRUCTIONS.md`.

## Backend Services

### Supabase Integration
Supabase serves as the complete backend solution for MediSim:
- **Authentication**: Secure user authentication and session management
- **Database**: PostgreSQL database with medical report storage and analysis results
- **Storage**: Secure storage for medical reports, generated images, and 3D models
- **Real-time subscriptions**: Live updates for report processing status
- **Row-level security**: Ensures patients only access their own medical data
- **Edge Functions**: Serverless functions for processing reports and generating insights

The database schema is defined in `medisim_schema.sql` and the Supabase client is configured in `lib/supabase.js`.

### RevenueCat
RevenueCat handles all subscription management for premium features:
- Manages free and premium subscription tiers
- Processes in-app purchases across iOS and Android
- Tracks subscription status and entitlements
- Provides analytics on subscription performance
- Handles subscription lifecycle events (trials, renewals, cancellations)

Premium features include unlimited AI doctor consultations, advanced 3D models, and personalized medical illustrations.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo CLI
- Supabase account
- API keys for Tavus and ElevenLabs (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MediSim.git
   cd MediSim
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL commands in `medisim_schema.sql` to set up the database schema
   - Update the Supabase URL and anon key in `config/constants.ts`

4. Configure API keys:
   - Update the API keys in `config/constants.ts` for any services you plan to use

5. Start the development server:
   ```bash
   npx expo start
   ```

### Setting up AI Doctor Features

#### Tavus Video Consultation
See `components/AIDoctorChat.tsx` for implementation details. You'll need:
- Tavus API key
- Replica ID (for the AI doctor avatar)
- Persona ID (for the AI personality)

Update these in the `TAVUS_CONFIG` section of `config/constants.ts`.

#### ElevenLabs Voice Consultation
Follow the instructions in `ELEVENLABS_SETUP_INSTRUCTIONS.md` to set up the ElevenLabs integration. You'll need:
- ElevenLabs account with API access
- Custom agent configured for medical consultations
- Agent ID updated in `components/ConversationalAI.tsx`

## Project Structure

- `/app`: Main application screens using Expo Router
- `/components`: Reusable React components
- `/lib`: Utility functions and service integrations
- `/assets`: Static assets (images, 3D models)
- `/config`: Configuration files and constants
- `/types`: TypeScript type definitions

## Features in Detail

### 3D Model Viewer
The app includes a custom GLBViewer component that renders 3D models using Three.js and Expo GL. Models can be loaded from local assets or remote URLs, with support for zooming, rotating, and exploring the models.

### Report Processing
Medical reports are processed using a combination of OCR (for image-based reports) and NLP to extract key findings. The app generates visualizations based on the extracted data and provides AI-generated summaries.

### AI Doctor Consultations
The app offers two types of AI consultations:
1. **Video consultation** using Tavus API, which renders a realistic doctor avatar that can discuss medical findings
2. **Voice consultation** using ElevenLabs, which provides a voice-based conversation about medical reports

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
