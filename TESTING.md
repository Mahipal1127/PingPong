# 🎮 Testing Multiplayer - Quick Guide

## How to Test the Multiplayer Functionality

Since you need two separate instances to test multiplayer, here are your options:

### Option 1: Two Browser Windows (Same Computer)
This is the easiest way to test locally:

1. **Open the game in two different browser windows:**
   - Window 1: `http://localhost:5173/`
   - Window 2: `http://localhost:5173/` (open in a new window, not a tab)

2. **In Window 1 (Host):**
   - Click "Host Game"
   - Copy the 6-digit room code

3. **In Window 2 (Client):**
   - Click "Join Game"
   - Enter the room code from Window 1
   - Click "Connect to Game"

4. **Play the game:**
   - Window 1 controls: W (up) / S (down)
   - Window 2 controls: Arrow Up / Arrow Down

### Option 2: Two Different Browsers
For better isolation:

1. Open in Chrome: `http://localhost:5173/`
2. Open in Edge/Firefox: `http://localhost:5173/`
3. Follow the same host/join process

### Option 3: Two Different Devices (Same Network)
To test on different devices:

1. **Find your local IP address:**
   ```bash
   # On Windows (PowerShell):
   ipconfig
   # Look for "IPv4 Address" (e.g., 192.168.1.100)
   ```

2. **Run Vite with host flag:**
   ```bash
   npm run dev -- --host
   ```

3. **On Device 1 (Host):**
   - Open `http://YOUR_IP:5173/` (e.g., `http://192.168.1.100:5173/`)
   - Click "Host Game"
   - Note the room code

4. **On Device 2 (Client):**
   - Open `http://YOUR_IP:5173/`
   - Click "Join Game"
   - Enter the room code

### Option 4: Over the Internet
To play with a friend remotely:

1. **Use a tunneling service like ngrok:**
   ```bash
   # Install ngrok: https://ngrok.com/download
   ngrok http 5173
   ```

2. **Share the ngrok URL** with your friend (e.g., `https://abc123.ngrok.io`)

3. **Host player:**
   - Open the ngrok URL
   - Click "Host Game"
   - Share the room code

4. **Client player:**
   - Open the same ngrok URL
   - Click "Join Game"
   - Enter the room code

## Expected Behavior

### When Hosting:
- ✅ Room code appears immediately (6 digits)
- ✅ Status shows "Waiting for player 2..."
- ✅ When client connects, status changes to "Player 2 connected!"
- ✅ Game starts automatically after 1 second

### When Joining:
- ✅ Enter 6-digit code
- ✅ "Connect to Game" button becomes enabled
- ✅ Status shows "Connecting..."
- ✅ On success: "Connected! Starting game..."
- ✅ Game starts automatically after 1 second

### During Gameplay:
- ✅ Both players see the same ball position
- ✅ Paddles move smoothly in real-time
- ✅ Scores update simultaneously
- ✅ Ball physics feel responsive
- ✅ No noticeable lag (on good connection)

### When Game Ends:
- ✅ Game over screen shows for both players
- ✅ Correct winner is displayed
- ✅ Final scores match
- ✅ "Play Again" restarts the game for both
- ✅ "Main Menu" disconnects and returns to menu

## Troubleshooting

### "Failed to connect" Error
- **Check:** Is the room code correct? (6 digits)
- **Try:** Refresh both browsers and try again
- **Check:** Are both browsers on the same page?

### Game Doesn't Start
- **Wait:** Give it 2-3 seconds after connection
- **Check:** Look at browser console for errors (F12)
- **Try:** Refresh and create a new room

### Paddles Not Moving
- **Check:** Click on the game canvas first
- **Check:** Are you using the correct keys?
  - Host (left paddle): W/S
  - Client (right paddle): Arrow Up/Down

### Ball Position Desynced
- **This shouldn't happen** - the host controls all physics
- **If it does:** Report it as a bug and refresh both browsers

## Performance Tips

For the best experience:

1. **Use a modern browser** (Chrome, Edge, Firefox)
2. **Close unnecessary tabs** to free up resources
3. **Ensure stable internet** for remote play
4. **Use wired connection** if possible for lowest latency

## What to Look For

When testing, verify:

- [ ] Room code generation works
- [ ] Copy code button works
- [ ] Connection establishes successfully
- [ ] Game starts for both players
- [ ] Both paddles move smoothly
- [ ] Ball bounces correctly
- [ ] Scores update properly
- [ ] Game ends at 10 points
- [ ] Winner is displayed correctly
- [ ] Play again works
- [ ] Quit returns to menu
- [ ] Disconnect handling works

## Demo Flow

Here's a complete test flow:

1. ✅ Open two browser windows
2. ✅ Window 1: Click "Host Game"
3. ✅ Copy the room code (e.g., "123456")
4. ✅ Window 2: Click "Join Game"
5. ✅ Enter "123456" and click "Connect"
6. ✅ Both windows show the game screen
7. ✅ Window 1: Press W/S to move left paddle
8. ✅ Window 2: Press ↑/↓ to move right paddle
9. ✅ Play until someone reaches 10 points
10. ✅ Game over screen appears
11. ✅ Click "Play Again" or "Main Menu"

Enjoy testing! 🎮
