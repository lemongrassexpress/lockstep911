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

function onbeat(startbeat: number, endbeat: number) {
  for (let i = startbeat; i < endbeat; ++i) {
    track.push({ beat: i, sound: sounds.step });
  }
}
function offbeat(startbeat: number, endbeat: number) {
  track.push({ beat: startbeat, sound: sounds.t1hai });
  track.push({ beat: startbeat + 1, sound: sounds.t1hai });
  track.push({ beat: startbeat + 2, sound: sounds.t1hai });
  track.push({ beat: startbeat + 3, sound: sounds.t1ha });
  track.push({ beat: startbeat + 3.5, sound: sounds.t1haii });
  for (let i = startbeat + 4; i + 0.5 < endbeat - 2; ++i) {
    track.push({
      beat: i + 0.5,
      sound: i < startbeat + 8 ? sounds.t1ho : sounds.step,
    });
  }
  track.push({ beat: endbeat - 2, sound: sounds.t2n });
  track.push({ beat: endbeat - 1.5, sound: sounds.t2ha });
  track.push({ beat: endbeat - 1, sound: sounds.t2n });
  track.push({ beat: endbeat - 0.5, sound: sounds.t2ha });
  track.push({ beat: endbeat, sound: sounds.t1hai });

  for (let i = 0; i < 4; ++i) {
    track.push({
      beat: startbeat + i,
      sound: sounds.step,
    });
  }
  for (let i = startbeat + 3; i < endbeat; ++i) {
    if (i >= startbeat + 8 && i + 0.5 < endbeat - 2) continue;
    track.push({
      beat: i + 0.5,
      sound: sounds.step,
    });
  }
}

function onoffbeat(x: number, y: number, z: number) {
  onbeat(x, y - 4);
  offbeat(y - 4, z);
}

function measure(g: number, x: number) {
  return (g * 16 + (x + 4)) * 4;
}
onoffbeat(measure(0, 0), measure(0, 4), measure(0, 8));
onoffbeat(measure(0, 8), measure(0, 12), measure(0, 16));
onoffbeat(measure(1, 0), measure(1, 2), measure(1, 4));
onoffbeat(measure(1, 4), measure(1, 6), measure(1, 8));
// gave up and went to osu to sync
const offbeat2 = (x: number, y: number) => offbeat(16 + 64 + x, 16 + 64 + y);
offbeat2(32, 40);
offbeat2(40, 48);
offbeat2(48, 60);
const onoffbeat2 = (x: number, y: number, z: number) =>
  onoffbeat(x + 80, y + 80, z + 80);
onoffbeat2(60, 72, 78);
onoffbeat2(78, 88, 94);
onoffbeat2(94, 112, 128);
onbeat(16 + 64 + 128, 16 + 64 + 160);

const song = new Song({ audio: sounds.song, bpm: 162, offset: 0, track });
await song.play();
