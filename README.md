# Sonos CLI Controller

Simple CLI tool hack to control sonos speaker

## Commands

```bash
sonos play              # Resume playback
sonos pause             # Pause playback
sonos vol-up            # Increase volume by 1
sonos vol-down          # Decrease volume by 1
sonos default           # Start default playlist
sonos <url or id>       # Play any Spotify playlist or track
sonos next              # Skip to next track
sonos queue <url/id>    # Add track to queue
sonos current           # Show currently playing track
sonos set-ip <ip>       # Set your Sonos IP address
sonos get-ip            # Show current IP address
```

## Setup

### 1. Install
```bash
npm install
npm link
```

### 2. Set your Sonos IP address
```bash
sonos set-ip 192.168.1.100  # Replace with your Sonos IP
```

To find your Sonos IP: Open the Sonos app → Settings → System → About My System

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