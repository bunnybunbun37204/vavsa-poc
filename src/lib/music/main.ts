import * as Tone from "tone";
// import { Piano } from "@tonejs/piano/build/piano/Piano";
import { ambience } from "./background";
import { playKeys, playKeys2, stopKeys } from "./play";
import {
  setBluesScale,
  setMajorScale,
  setMelodicMinorScale,
  setMinorScale,
  setMixolydianScale,
  setPentatonicMinorScale,
  setPentatonicScale,
} from "./scales";
import { arpPart } from "./synths";

let isStarted = false;

const allowedKeys = ["a", "s", "d", "f", "g", "h", "j", "k"];
const keysPressed = new Map<string, boolean>();

// export let piano: Piano;

// Function to get the value of a specific query parameter
function getQueryParamValue(parameter : any) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(parameter);
}

// Get the value of 'songId' parameter from the URL
const songId = getQueryParamValue('params');
console.log('Song Note:', songId);

window?.addEventListener("touchstart", async (event) => {
  if (!isStarted) {
    isStarted = true;
    await init();
  }

  if (!keysPressed.get(event.key) && allowedKeys.includes(event.key)) {
    keysPressed.set(event.key, true);
    //playKeys(keysPressed);
    if (typeof songId === "string") {
      const notes = songId.split(",");
      playKeys2(notes);
    }
  }
});

window?.addEventListener("keyup", (event) => {
  if (allowedKeys.includes(event.key)) {
    keysPressed.set(event.key, false);
    stopKeys(event.key, keysPressed);
  }
});

// utils

async function init() {
  const soundPromise = Tone.start().then(() => {
    console.log("audio is ready");
  });

  await soundPromise;

  randomizeTempo();
  ambience();
  setMajorScale();
}

function randomizeTempo() {
  // randomly change tempo from 80 to 100 to 120 every 4 measures
  const tempoPattern = new Tone.Pattern({
    callback: function (time, value) {
      if (value) Tone.Transport.bpm.value = value;
    },
    values: [95, 100, 110, 120],
    pattern: "randomWalk",
    interval: "4m",
  }).start(0);

  Tone.Transport.start();
}

function startPlayingKeys() {
  if (!isStarted) {
    isStarted = true;
    init(); // No need to await here
  }

  if (typeof songId === "string") {
    const notes = songId.split(",");
    playKeys2(notes);
  }
}

function playKeysOnClick() {
  if (!isStarted) {
    isStarted = true;
    init(); // No need to await here
  }

  if (typeof songId === "string") {
    const notes = songId.split(",");
    playKeys2(notes);
  }
}

// Event listener for click event

document.getElementById("playButton")?.addEventListener("click", playKeysOnClick);

// Event listener for touch event
// document.getElementById("playButton")?.addEventListener("touchstart", async (event) => {
//   if (!isStarted) {
//     isStarted = true;
//     await init();
//   }

//   if (typeof songId === "string") {
//     const notes = songId.split(",");
//     playKeys2(notes);
//   }
// });


async function exportAudio() {
  // export as wav
  const buffer = await Tone.Offline(() => {
    ambience();
    setMajorScale();
  }, 5).then((buffer) => {
    // save to file
    download("music.wav", buffer.get());
    return buffer;
  });

  // record for 30 seconds
}

function download(filename: string, data: AudioBuffer | undefined) {
  if (!data) return;
  const element = document.createElement("a");
  // wav
  const url = URL.createObjectURL(
    new Blob([data.toString()], { type: "audio/wav" })
  );
  element.setAttribute("href", url);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
