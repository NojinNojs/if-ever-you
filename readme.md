# Music Player Documentation

## Overview
This project is a simple music player application that allows users to play a song, view its lyrics in sync with the audio, and control playback features such as shuffle and repeat. The application is built using HTML, CSS, and JavaScript, providing a responsive and interactive user interface.

## File Structure
- `index.html`: The main HTML file that contains the structure of the music player.
- `style.css`: The CSS file that styles the music player, including layout, colors, and animations.
- `script.js`: The JavaScript file that implements the functionality of the music player, including audio controls and lyric synchronization.
- `readme.md`: This documentation file.

## Features
- **Audio Playback**: Users can play, pause, and control the volume of the audio.
- **Lyrics Display**: The lyrics of the song are displayed in sync with the audio playback.
- **Responsive Design**: The player is designed to be responsive and works well on various screen sizes.
- **Shuffle and Repeat**: Users can shuffle the playlist and repeat the current song.

## Getting Started
To run the music player, follow these steps:
1. Clone the repository to your local machine.
2. Open `index.html` in a web browser.
3. Ensure that the audio file `if-ever-you.mp3` is in the same directory as the HTML file.

## Code Explanation

### HTML (`index.html`)
The HTML file sets up the structure of the music player. It includes:
- A container for the player with sections for music information, lyrics, and controls.
- SVG graphics for the album art.
- Font Awesome icons for buttons.

### CSS (`style.css`)
The CSS file styles the player, providing:
- A modern look with a dark gradient background.
- Flexbox layout for responsive design.
- Animations for the vinyl record and sound waves.

### JavaScript (`script.js`)
The JavaScript file contains two main classes:
1. **LyricSync**: This class handles the synchronization of lyrics with the audio playback. It parses the lyrics, updates the displayed line based on the current playback time, and adjusts the display on window resize.
2. **MusicPlayer**: This class manages the audio playback, including play/pause functionality, volume control, and progress tracking. It also updates the UI based on the current state of the audio.

### Example Usage
To initialize the music player, the following code is used in `script.js`:
