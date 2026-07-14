import "./style.css";
import { sounds } from "./sound";
import { Song, type Track } from "./core";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<button>hi</button>
`;

// document
//   .querySelector<HTMLDivElement>("#app")!
//   .addEventListener("click", () => {
//     sounds.cowbell.play();
//   });

const track: Track = [];
for (let i = 0; i < 4; ++i) track.push({ beat: 12 + i, sound: sounds.cowbell });
for (let i = 0; i < 40; ++i) track.push({ beat: 16 + i, sound: sounds.step });
for (let i = 0; i < 40; ++i)
  track.push({ beat: 16 + i + 0.5, sound: sounds.step2 });
const song = new Song({ audio: sounds.song, bpm: 162, offset: 0, track });
await song.play();
