# Changelog

All notable changes to the English Conversation Simulator project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project follows semantic versioning principles.

---

## [Current] - interaction-with-ai branch - 2024-11-25

### Added
- **Comprehensive README Documentation** (commit: 2d280b7)
  - Complete project overview and feature descriptions
  - Detailed installation instructions with prerequisites
  - Usage guide including controls and interaction instructions
  - Project structure documentation
  - API configuration and Groq integration details
  - Explanation of 3D rendering and AI conversation flow
  - Development timeline across all project phases
  - Contributing guidelines and acknowledgments

- **Enhanced Supermarket Atmosphere** (commit: e6cf625)
  - 3 new NPC shoppers with varied appearances:
    * Red-shirted shopper in left aisle at position [-5, 0, -2]
    * Green-shirted shopper in right aisle at position [6, 0, -6]
    * Orange-shirted shopper in main area at position [-2, 0, 3]
  - Decorative hanging signs for wayfinding:
    * "Produce" sign (green #4CAF50) above left aisle
    * "Snacks" sign (orange #FF9800) above center aisle
    * "Dairy" sign (blue #2196F3) above right aisle
  - 3 shopping carts placed around the store:
    * Cart at [2, 0, 2] with rotation 0.5
    * Cart at [3, 0, 2.5] with rotation 0.2
    * Cart at [-8, 0, 8] with rotation -0.5
  - Extended product inventory system:
    * Added ALL_PRODUCTS array combining original and new products
    * ~12 new product instances on left and right aisle shelves
    * Products include lettuce, tomatoes, and Lay's chips
  - New reusable 3D components:
    * `Shopper` - Customizable NPC with shirt/pants color options
    * `Sign` - Dual-sided hanging sign with text and color
    * `Cart` - Detailed shopping cart with wheels and wireframe basket

---

## [Previous Commits] - 2024-11-24 to 2024-11-25

### Added - Interactive AI Cashier (commit: c95926e)
- **3D Cashier Character**:
  - Fully modeled 3D cashier NPC behind checkout counter
  - Positioned at [0, 0, -1.5] facing player
  - Character includes head, torso, arms, hands, legs, hair, and green apron
  - Scale set to 0.42 for appropriate size relative to environment
  
- **Detailed Checkout Counter**:
  - Realistic checkout counter with wooden surface texture
  - Main body dimensions: [1.5, 0.8, 0.5]
  - Food placement surface at height 0.82
  - Textured with `real_counter.jpg` for realism
  
- **Cash Register with Screen**:
  - Detailed cash register model positioned on counter
  - Register body dimensions: [0.3, 0.2, 0.25]
  - Interactive display screen angled at -0.2 radians
  - Screen textured with `register_screen.jpg`
  - Cash drawer detail with metallic appearance
  - Keyboard area with dark material
  - Positioned at [0.3, 0.94, -0.05] on counter surface
  
- **Texture Assets**:
  - `real_counter.jpg` - Checkout counter texture
  - `register_screen.jpg` - Cash register display texture
  - `cash_register.jpg` - Register body texture
  
- **Enhanced Materials**:
  - Metalness and roughness properties for realistic appearance
  - Emissive screen for active display look
  - Shadow casting enabled for depth

### Added - 3D Supermarket Upgrade (commit: d41780a)
- **Complete 3D Environment**:
  - Upgraded from 2D sprites to full 3D React Three Fiber scene
  - 20x20 unit play area with walls, floor, and ceiling
  - First-person camera view at height 1.7 (eye level)
  - Physics-based movement using @react-three/cannon
  
- **Player Physics System**:
  - Sphere-based player collider (radius 0.5)
  - Gravity set to -50 for realistic feel
  - WASD movement controls with camera-relative direction
  - Jump mechanic with Space key (velocity +5)
  - Velocity-based movement at speed 3
  
- **Detailed 3D Shelving System**:
  - 3 main shelves in center aisle at positions [-3, 0, -5], [0, 0, -5], [3, 0, -5]
  - 3 left aisle shelves rotated 90° at x=-7
  - 3 right aisle shelves rotated -90° at x=7
  - Each shelf structure includes:
    * Back panel: [2, 2.5, 0.1] dimensions
    * 4 shelf levels at heights 0.2, 0.8, 1.4, 2.0
    * Base: [2, 0.2, 0.5] in dark color (#333)
  - Shelves textured with `real_shelf.jpg`
  
- **Product System**:
  - Centralized `PRODUCTS_DATA` array with product metadata
  - Products rendered as physics objects (boxes, spheres, cylinders)
  - 18 products across 3 center shelves:
    * Shelf 1: Lettuce and tomatoes
    * Shelf 2: Lay's chips
    * Shelf 3: Mixed items
  - Each product has unique ID, Spanish name, type, position, and texture key
  
- **Texture System**:
  - Three.js TextureLoader for all textures
  - Repeating floor texture (10x10 tiles)
  - Repeating ceiling texture (10x10 tiles)
  - Product textures:
    * `lechuga_final.jpg` - Lettuce texture
    * `tomate.jpg` - Tomato texture
    * `lays.jpg` - Lay's chips texture
  - Environmental textures:
    * `floor.jpg` - Tiled floor texture
    * `ceiling.jpg` - Ceiling texture
    * `real_shelf.jpg` - Wood shelf material
  
- **Advanced Lighting**:
  - Ambient light (intensity 0.6) with warm color (#fff0e0)
  - Hemisphere light for sky/ground color gradient
  - Main directional light from [5, 10, 5]:
    * Intensity 1.2
    * Shadow mapping (2048x2048 resolution)
    * Shadow camera frustum (-15 to 15 units)
  - 2 point lights for interior ambiance:
    * Position [0, 4, -5] with warm color (#fff5cc)
    * Position [0, 4, 2] with warm color (#fff5cc)
  - Background color: #f0f0f0 (light gray)
  
- **Physics Materials**:
  - Ground-player contact: friction 0.8, restitution 0.1
  - Wall-player contact: friction 0, restitution 0 (sliding walls)
  
- **Interaction System**:
  - Pointer lock controls for FPS-style camera
  - Click to lock mouse cursor
  - ESC to unlock
  - "Click to start" text prompt when not locked

### Changed - Code Internationalization (commit: d103ade)
- **Comment Translation**:
  - Converted all Spanish code comments to English
  - Standardized comment style throughout codebase
  - Examples:
    * "Caja Registradora" → "Cash Register"
    * "Superficie para apoyar alimentos" → "Food placement surface"
    * "Iluminación mejorada" → "Improved Lighting"
  
- **Code Documentation**:
  - Added English section headers
  - Clarified component purposes
  - Maintained inline explanations in English
  
- **Variable Names**:
  - Kept Spanish product names for authenticity (`Lechuga`, `Tomate`, `Papas Lays`)
  - English names translated in AI context via backend mapping

### Fixed - Groq Model Update (commit: 7c1d36d)
- **Model Migration**:
  - Changed from older model to `llama-3.3-70b-versatile`
  - Updated model identifier in backend/server.js line 101
  - Reason: Llama 3.3 70B offers:
    * Better language understanding
    * More accurate grammar corrections
    * Improved conversational flow
    * Better context retention
  
- **Configuration**:
  - Maintained temperature at 0.7 (balanced creativity)
  - Kept max_tokens at 150 (concise responses)
  - No changes to system prompt structure

### Added - Input Fallback System (commit: c9fd5f8)
- **Text Input Capability**:
  - Alternative to voice-only input
  - Text input field in ChatInterface component
  - Submit button for text messages
  - Enter key support for quick sending
  
- **Model Cycling**:
  - Automatic fallback when primary model fails
  - Configurable model list in frontend
  - Error handling with user notification
  - Retry mechanism with next available model
  
- **UI Improvements**:
  - Microphone icon for voice input
  - Keyboard icon for text input
  - Toggle between input modes
  - Visual feedback for active mode

### Removed - Template Cleanup (commit: 32d1d26)
- **Deleted TypeScript Files**:
  - Removed default Vite TypeScript template files
  - Cleaned up unused boilerplate code
  - Simplified project structure to JavaScript-only
  
- **Files Removed**:
  - TypeScript configuration files
  - Example TypeScript components
  - Type definition files not needed for JavaScript

---

## [Initial Release] - 2024-11-24

### Added - Project Foundation (commit: 7d39b8c)
- **Project Initialization**:
  - Created Vite + React project structure
  - Configured build system and dev server
  - Set up ESLint for code quality
  
- **Frontend Setup**:
  - React 18.3.1 as UI framework
  - Vite 7.2.4 for fast development
  - Three.js 0.160.0 for 3D graphics (planned)
  - @react-three/fiber 8.16.8 for React integration
  - @react-three/drei 9.100.0 for 3D helpers
  - @react-three/cannon 6.6.0 for physics
  
- **Backend Setup**:
  - Express 5.1.0 server
  - Groq SDK 0.36.0 for AI integration
  - CORS 2.8.5 for cross-origin requests
  - dotenv 17.2.3 for environment variables
  
- **Core Components**:
  - `App.jsx` - Main application container
  - `SupermarketWithChat.jsx` - Integration component
  - `Supermarket.jsx` - 3D environment (initial version)
  - `ChatInterface.jsx` - Chat UI component
  - `backend/server.js` - Express API server
  
- **API Endpoints**:
  - `POST /api/chat` - AI conversation endpoint
  - Accepts prompt and products array
  - Returns AI cashier response
  - Error handling and validation
  
- **AI Cashier System Prompt**:
  - Role definition as friendly cashier + English teacher
  - Product awareness from dynamic list
  - Grammar correction capabilities
  - Vocabulary teaching
  - Natural conversation flow
  - Shopping scenario simulation
  - Always responds in English
  
- **Configuration Files**:
  - `package.json` - Frontend dependencies
  - `backend/package.json` - Backend dependencies
  - `vite.config.js` - Build configuration
  - `index.html` - HTML entry point
  - `.gitignore` - Git ignore rules
  - `backend/.env` - API key storage (not committed)
  
- **Development Scripts**:
  - `npm run dev` - Start frontend dev server
  - `npm run build` - Build production bundle
  - `npm run preview` - Preview production build
  - Backend: `node server.js` - Start API server

---

## Project Statistics

### Total Commits: 9
- Features: 6
- Fixes: 1
- Chores: 1
- Documentation: 1

### Lines of Code Added:
- Supermarket.jsx: ~634 lines (3D environment)
- server.js: 120 lines (AI backend)
- ChatInterface.jsx: ~180 lines (UI)
- README.md: 323 lines (documentation)
- CHANGELOG.md: This file

### Technologies Used:
- **Frontend**: React, Vite, Three.js, React Three Fiber, React Three Drei, React Three Cannon
- **Backend**: Node.js, Express, Groq SDK
- **AI Model**: Llama 3.3 70B Versatile
- **Tools**: Git, npm, ESLint

### Key Features Implemented:
1. ✅ 3D Supermarket Environment
2. ✅ Physics-based Player Movement
3. ✅ Product Display System
4. ✅ AI-Powered Cashier Conversations
5. ✅ Grammar Correction & Language Teaching
6. ✅ Voice & Text Input
7. ✅ Realistic Textures & Lighting
8. ✅ NPC Characters (Cashier + Shoppers)
9. ✅ Environmental Details (Signs, Carts)
10. ✅ Complete Documentation

---

## Future Roadmap

### Planned Features:
- [ ] Inventory system for player
- [ ] Price calculation in chat
- [ ] More product varieties
- [ ] Additional NPC interactions
- [ ] Conversation scenarios (complaints, returns, etc.)
- [ ] Multi-language support toggle
- [ ] Voice output for AI responses
- [ ] Achievement system for learning milestones
- [ ] Save/load conversation history
- [ ] Mobile device support

### Known Issues:
- None currently reported

---

**Last Updated**: 2024-11-25
**Current Version**: Beta v0.2
**Maintained by**: Development Team
