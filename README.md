# 🎮 Neon Pong - Multiplayer Ping Pong Game

A stunning, neon-themed multiplayer ping pong game built with WebRTC peer-to-peer connections. Play with friends using simple room codes!

![Neon Pong](https://img.shields.io/badge/Status-Ready%20to%20Play-00f0ff?style=for-the-badge)
![Multiplayer](https://img.shields.io/badge/Multiplayer-WebRTC-ff00ff?style=for-the-badge)

## ✨ Features

- 🌟 **Premium Neon Design** - Vibrant gradients, glassmorphism, and smooth animations
- 🎯 **Real-time Multiplayer** - WebRTC peer-to-peer connections for lag-free gameplay
- 🔑 **Simple Room Codes** - Easy 6-digit codes to connect with friends
- 🎨 **Stunning Visuals** - Glowing paddles, dynamic ball physics, and neon effects
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- ⚡ **Smooth Gameplay** - 60 FPS game loop with realistic physics

## 🚀 How to Play

### Starting the Game

1. **Run the development server:**
   ```bash
   npm run dev
   ```

2. **Open in browser:**
   - Navigate to `http://localhost:5173/`

### Multiplayer Setup

#### Option 1: Host a Game
1. Click **"Host Game"** on the main menu
2. A 6-digit room code will be generated
3. Share this code with your friend
4. Wait for them to join
5. Game starts automatically when both players are connected!

#### Option 2: Join a Game
1. Click **"Join Game"** on the main menu
2. Enter the 6-digit room code from your friend
3. Click **"Connect to Game"**
4. Game starts automatically when connected!

### Controls

- **Player 1 (Left Paddle - Cyan):**
  - `W` - Move Up
  - `S` - Move Down

- **Player 2 (Right Paddle - Magenta):**
  - `↑` (Arrow Up) - Move Up
  - `↓` (Arrow Down) - Move Down

### Winning

- First player to score **10 points** wins!
- Points are scored when your opponent misses the ball
- Ball speed increases slightly with each paddle hit for more excitement

## 🛠️ Technical Details

### Technologies Used

- **HTML5 Canvas** - For smooth game rendering
- **CSS3** - Premium design with gradients and animations
- **Vanilla JavaScript** - Game logic and physics
- **PeerJS** - WebRTC peer-to-peer connections
- **Vite** - Fast development server

### Game Architecture

```
┌─────────────────────────────────────────┐
│           Player 1 (Host)               │
│  - Runs game physics                    │
│  - Generates room code                  │
│  - Broadcasts game state                │
└──────────────┬──────────────────────────┘
               │
               │ WebRTC Connection
               │ (PeerJS)
               │
┌──────────────▼──────────────────────────┐
│           Player 2 (Client)             │
│  - Receives game state                  │
│  - Sends paddle position                │
│  - Renders synchronized game            │
└─────────────────────────────────────────┘
```

### Key Components

1. **Host System:**
   - Generates unique 6-digit room codes
   - Manages game physics and ball movement
   - Handles collision detection
   - Broadcasts game state to client

2. **Client System:**
   - Connects using room code
   - Sends paddle movements to host
   - Receives and renders game state

3. **Game Engine:**
   - 60 FPS game loop
   - Realistic ball physics with angle-based bouncing
   - Smooth paddle controls
   - Score tracking and win conditions

## 🎨 Design Features

- **Neon Color Palette:**
  - Cyan (#00f0ff) - Player 1
  - Magenta (#ff00ff) - Player 2
  - Purple (#b000ff) - Accents
  - Dynamic gradients throughout

- **Visual Effects:**
  - Glowing neon text
  - Glassmorphism cards
  - Smooth hover animations
  - Pulsing status indicators
  - Shadow effects on game elements

- **Typography:**
  - Orbitron - Futuristic headings
  - Inter - Clean body text

## 🔧 Configuration

You can customize game settings in `game.js`:

```javascript
const CONFIG = {
    CANVAS_WIDTH: 1200,      // Game canvas width
    CANVAS_HEIGHT: 600,      // Game canvas height
    PADDLE_WIDTH: 15,        // Paddle width
    PADDLE_HEIGHT: 100,      // Paddle height
    BALL_SIZE: 15,          // Ball diameter
    PADDLE_SPEED: 8,        // Paddle movement speed
    BALL_SPEED: 5,          // Initial ball speed
    WINNING_SCORE: 10,      // Points needed to win
    FPS: 60                 // Frames per second
};
```

## 🌐 Network Requirements

- **STUN Servers:** Uses Google's public STUN servers for NAT traversal
- **Firewall:** May need to allow WebRTC connections
- **Same Network:** Not required - works over the internet!

## 📝 Troubleshooting

### Connection Issues

**Problem:** Can't connect to room code
- **Solution:** 
  - Verify the 6-digit code is correct
  - Check your internet connection
  - Try refreshing both browsers
  - Ensure WebRTC is enabled in your browser

**Problem:** Opponent disconnected
- **Solution:**
  - Check internet stability
  - Refresh and create a new room
  - Try a different browser

### Performance Issues

**Problem:** Game is laggy
- **Solution:**
  - Close other browser tabs
  - Check CPU usage
  - Ensure stable internet connection
  - Try a different browser (Chrome/Edge recommended)

## 🎯 Future Enhancements

Potential features for future versions:

- [ ] Power-ups and special abilities
- [ ] Different game modes (speed mode, obstacle mode)
- [ ] Tournament bracket system
- [ ] Leaderboard and statistics
- [ ] Custom paddle colors and themes
- [ ] Sound effects and background music
- [ ] Replay system
- [ ] AI opponent for single-player

## 📄 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- Add sound effects
- Create new visual themes
- Implement power-ups
- Add chat functionality
- Create mobile touch controls

## 🎮 Enjoy the Game!

Have fun playing Neon Pong with your friends! May the best player win! 🏆

---

**Made with ❤️ and lots of neon**
