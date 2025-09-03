#!/usr/bin/env node

const { Sonos, SpotifyRegion } = require('sonos');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DEFAULT_SONOS_IP = '192.168.5.22';
const DEFAULT_PLAYLIST = '37i9dQZEVXcNbkRhyotquq';
const CONFIG_FILE = path.join(__dirname, 'sonos-config.json');

const command = process.argv[2];
const arg = process.argv[3];

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      return config.ip || DEFAULT_SONOS_IP;
    }
  } catch (error) {
    console.warn('⚠️  Could not read config file, using default IP');
  }
  return DEFAULT_SONOS_IP;
}

function saveConfig(ip) {
  try {
    const config = { ip };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error(`❌ Could not save config: ${error.message}`);
    return false;
  }
}

const SONOS_IP = loadConfig();

function parseSpotifyUrl(input) {
  // Handle full URLs
  if (input.startsWith('https://open.spotify.com/')) {
    const urlParts = input.split('/');
    const type = urlParts[3]; // 'playlist' or 'track'
    const id = urlParts[4].split('?')[0]; // Get ID before query params
    return { type, id };
  }
  
  // Otherwise assume it's just an ID
  // Spotify track IDs are 22 chars, playlist IDs are also 22 chars
  // We'll assume it's a track if being queued, playlist otherwise
  return { type: 'playlist', id: input };
}

async function executeSonosCommand() {
  // Handle config commands that don't need Sonos connection
  if (command === 'set-ip') {
    if (!arg) {
      console.log('❌ Please provide an IP address');
      console.log('Usage: sonos set-ip <ip-address>');
      process.exit(1);
    }
    // Basic IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(arg)) {
      console.log('❌ Invalid IP address format');
      console.log('Example: sonos set-ip 192.168.1.100');
      process.exit(1);
    }
    if (saveConfig(arg)) {
      console.log(`✅ Sonos IP saved: ${arg}`);
      console.log(`📁 Config file: ${CONFIG_FILE}`);
    }
    return;
  }

  if (command === 'get-ip') {
    console.log(`🏠 Current Sonos IP: ${SONOS_IP}`);
    if (fs.existsSync(CONFIG_FILE)) {
      console.log(`   (from config: ${CONFIG_FILE})`);
    } else {
      console.log('   (using default IP - no config file)');
    }
    return;
  }

  const sonos = new Sonos(SONOS_IP);
  sonos.setSpotifyRegion(SpotifyRegion.EU);

  try {
    switch (command) {
      case 'play':
        await sonos.play();
        console.log('▶️  Playing');
        break;
      
      case 'pause':
        await sonos.pause();
        console.log('⏸️  Paused');
        break;
      
      case 'default':
        await sonos.play(`spotify:playlist:${DEFAULT_PLAYLIST}`);
        console.log(`🎵 Started default playlist: ${DEFAULT_PLAYLIST}`);
        break;
      
      case 'next':
        await sonos.next();
        console.log('⏭️  Next track');
        break;
      
      case 'current':
        const track = await sonos.currentTrack();
        if (track && track.title) {
          console.log(`🎵 Now playing:`);
          console.log(`   ${track.title}`);
          console.log(`   ${track.artist} - ${track.album}`);
          if (track.position && track.duration) {
            const posMin = Math.floor(track.position / 60);
            const posSec = track.position % 60;
            const durMin = Math.floor(track.duration / 60);
            const durSec = track.duration % 60;
            console.log(`   ${posMin}:${posSec.toString().padStart(2, '0')} / ${durMin}:${durSec.toString().padStart(2, '0')}`);
          }
        } else {
          console.log('⏸️  No track currently playing');
        }
        break;
      
      case 'queue':
        if (!arg) {
          console.log('❌ Please provide a track URL or ID to queue');
          console.log('Usage: sonos queue <spotify-url/id>');
          process.exit(1);
        }
        const { type: queueType, id: queueId } = parseSpotifyUrl(arg);
        if (queueType !== 'track') {
          console.log('❌ Queue only works with tracks, not playlists');
          console.log('Use: sonos queue <track-url/id>');
          process.exit(1);
        }
        const queueUri = `spotify:track:${queueId}`;
        await sonos.queue(queueUri);
        console.log(`➕ Queued track: ${queueId}`);
        break;
      
      case 'vol-up':
        const currentVolumeUp = await sonos.getVolume();
        const newVolumeUp = Math.min(currentVolumeUp + 1, 100);
        await sonos.setVolume(newVolumeUp);
        console.log(`🔊 Volume: ${newVolumeUp}`);
        break;
      
      case 'vol-down':
        const currentVolumeDown = await sonos.getVolume();
        const newVolumeDown = Math.max(currentVolumeDown - 1, 0);
        await sonos.setVolume(newVolumeDown);
        console.log(`🔉 Volume: ${newVolumeDown}`);
        break;
      
      case 'help':
        console.log(`
Sonos CLI Commands:

Configuration:
  sonos set-ip <ip>       - Set Sonos IP address
  sonos get-ip            - Show current Sonos IP address

Playback Control:
  sonos play              - Resume playback
  sonos pause             - Pause playback
  sonos next              - Skip to next track
  sonos current           - Show currently playing track
  sonos default           - Start default playlist
  
Volume Control:
  sonos vol-up            - Increase volume by 1
  sonos vol-down          - Decrease volume by 1

Spotify:
  sonos <spotify-url/id>  - Play playlist or track (accepts full URL or just ID)
  sonos queue <url/id>    - Add track to queue
  
Other:
  sonos help              - Show this help message

Examples:
  sonos set-ip 192.168.1.100
  sonos https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
  sonos https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
  sonos queue https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
  sonos 37i9dQZF1DXcBWIGoYBM5M

More info: https://www.notion.so/mentimeter/Sonos-Workaround-24ef6da7abe08000825ce8a907b7c13c
        `);
        break;
      
      default:
        // Check if it's a Spotify URL or ID
        if (command && (command.startsWith('https://') || command.match(/^[a-zA-Z0-9]{22}$/))) {
          const { type, id } = parseSpotifyUrl(command);
          const spotifyUri = `spotify:${type}:${id}`;
          await sonos.play(spotifyUri);
          console.log(`🎵 Started ${type}: ${id}`);
        } else {
          console.log(`Unknown command: ${command}`);
          console.log('Run "sonos help" for available commands');
        }
        break;
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (!command) {
  console.log('Usage: sonos <command>');
  console.log('Run "sonos help" for available commands');
  process.exit(1);
}

executeSonosCommand();