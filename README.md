
# Live Demo [here](https://biuleung.github.io/transcription-player-frontend/)
- **[About the demo](#demo-mode)**

# [transcription-player-vue] README

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Project setup](#Project-setup)
4. [Demo Mode](#demo-mode)
5. [Disclaimer](#disclaimer)
## Introduction

The web app that is to help users practice language learning by facilitating audio transcription and playback.

## Features

Highlight the key features of your web app:

- **Audio Transcription:** Utilizes the Google Speech to Text API to transcribe uploaded audio files.
- **Automatic Context Splitting:** The app automatically splits the transcribed text based on the Google Speech to Text API output.
- **Selective Playback:** Allows users to select(click) specific time durations for audio playback.
- **A-B Loop Functionality:** Users can play the selected duration in an A-B loop, manually set the loop, and pause or cancel the loop.
- **Speed Control:** Users can adjust the speed of audio playback (e.g., 0.5x, 0.75x, normal speed).

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

## Demo Mode

To demonstrate the app without calling the real `Google Speech to Text` API, you can use the demo mode. If you want to call the real `Google Speech to Text` API, change the `VUE_APP_MODE` variable to anything other than `demonstration` and set up the backend server for calling the API.

## Disclaimer
The demo audio used in this application is sourced from [Zapp! English](https://zappenglish.com/), a part of one of their episode audio files.
