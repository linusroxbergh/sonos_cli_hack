# Sonos CLI Controller

Simple CLI tool hack to control sonos speaker

## Commands

```bash
sonos play              # Resume playback
sonos pause             # Pause playback
sonos default           # Start default playlist
sonos <url or id>       # Play any Spotify playlist or track
sonos next              # Skip to next track
sonos current           # Show currently playing track
sonos queue <url/id>    # Add track to queue
sonos vol-up            # Increase volume by 1
sonos vol-down          # Decrease volume by 1
```

## Setup

### 1. Find your Sonos IP address
- Open the Sonos app on your phone or desktop
- Go to Settings → System → About My System
- Note your speaker's IP address
- Update line 5 in `sonos.js` with your IP:
  ```javascript
  const SONOS_IP = '192.168.5.22'; // <- Your IP here
  ```

### 2. Install
```bash
npm install
npm link
```

Boom! Now you can use `sonos` commands from anywhere.


## Playing Spotify Content

You can play playlists or tracks using either the full URL or just the ID:

```bash
# Play with full URL (just paste it!)
sonos https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
sonos https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT

# Or just the ID
sonos 37i9dQZF1DXcBWIGoYBM5M
sonos 4cOdK2wGLETKBW3PvgPWqT

# Queue a track to play next
sonos queue https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
sonos queue 4cOdK2wGLETKBW3PvgPWqT
```

### How to get Spotify URLs
1. Open Spotify
2. Right-click any playlist or track → Share → Copy link
3. Just paste the whole link as a command: `sonos <paste-url-here>`


## Troubleshooting

- **Connection error**: Check that your Sonos IP is correct and you're on the same network
- **Command not found**: Run `npm link` again
- **Spotify not working**: Make sure Spotify is connected in your Sonos app