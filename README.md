# V Recap App

A modern, privacy-focused video editing application built with React + TypeScript.

![V Recap](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178c6)

## Features

- 🎬 **Video Editing** - Upload, trim, and edit videos with an intuitive interface
- 📝 **Subtitle Creation** - Create and customize subtitles with multiple styling options
- 🌐 **AI Translation** - Translate subtitles to multiple languages using AI
- 📱 **Mobile Responsive** - Works great on both desktop and mobile devices
- 🔒 **Privacy First** - All processing happens locally, your videos never leave your device

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: React Context, Zustand
- **Routing**: React Router v6
- **Icons**: React Icons (Feather Icons)
- **File Handling**: React Dropzone

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd v-recap-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The app will be available at `http://localhost:3000`

## Project Structure

```
v-recap-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Common/          # Reusable UI components
│   │   ├── Video/           # Video editing components
│   │   ├── Subtitles/       # Subtitle components
│   │   ├── Dashboard/       # Dashboard components
│   │   └── Output/          # Export components
│   ├── pages/               # Page components
│   ├── contexts/            # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services
│   ├── types/               # TypeScript types
│   └── styles/              # Global styles
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Pages

1. **Get Started** - Initial setup and permission request
2. **Main Page** - Overview with quick actions and recent projects
3. **Dashboard** - View and manage all video projects
4. **Video Editing** - Edit videos with trimming, effects, and audio
5. **Subtitles Editing** - Create and style subtitles
6. **Create Video** - Render final video with subtitles
7. **About** - App information and features

## API Integration

The app is structured to integrate with:
- **Gemini** - For translation services
- **ElevenLabs** - For voice synthesis
- **Groq** - For fast AI inference
- **Claude** - For advanced AI tasks

Configure API keys in `.env` file:
```env
VITE_GEMINI_API_KEY=your_key
VITE_ELEVENLABS_API_KEY=your_key
VITE_GROQ_API_KEY=your_key
VITE_CLAUDE_API_KEY=your_key
```

## Mobile Optimization

The app is fully responsive and optimized for mobile devices:
- Touch-friendly controls
- Safe area padding for notched devices
- Smooth animations using Framer Motion

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

Made with ❤️ using React & TypeScript