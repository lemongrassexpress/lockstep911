import "./style.css";
import { sounds } from "./sound";
import { Song, type Track } from "./core";
import Background from "./assets/background.png";
import Foreground from "./assets/foreground.png";
import Tower1 from "./assets/left.png";
import Tower2 from "./assets/right.png";
import Tower2a from "./assets/right2.png";
import Plane from "./assets/plane.png";
import Boom from "./assets/200w.gif";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<img src=${Background} class="fullscreen">
<img src=${Tower1} id="t1" class="lower fullscreen">
<img src=${Tower2} id="t2" class="lower fullscreen">
<img src=${Tower2a} id="t2a" class="fullscreen">
<img src=${Foreground} class="fullscreen">
<img src=${Plane} id="plane" class="absolute">
<img src=${Boom} id="boom" class="absolute boom">
<div>Press any key or click.</div>
<a href="https://www.youtube.com/watch?v=kZqfcEhBQ2c">based on this</a>
`;

const tower1 = document.querySelector<HTMLImageElement>("#t1")!;
const tower2 = document.querySelector<HTMLImageElement>("#t2")!;
const tower2a = document.querySelector<HTMLImageElement>("#t2a")!;
const plane = document.querySelector<HTMLImageElement>("#plane")!;
const boom = document.querySelector<HTMLImageElement>("#boom")!;

function animateOnce(
  element: HTMLElement,
  className: string,
  remove: string[] = [],
) {
  element.classList.remove(className, ...remove);
  void element.offsetWidth;
  element.classList.add(className);
}

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

const hits = track
  .filter((x) => [sounds.cowbell, sounds.t2n].indexOf(x.sound) === -1)
  .map((x) => x.beat);
const song = new Song({
  audio: sounds.song,
  bpm: 162,
  offset: 0,
  track,
  hits,
  beats: [
    ...hits,
    ...track.filter((x) => x.sound === sounds.cowbell).map((x) => x.beat),
    0,
    2,
    4,
    6,
    8,
    10,
  ],
});
await song.play(
  undefined,
  () => {
    // animateOnce(tower1, "bounce");
    if (Math.round(song.getBeat() * 2) % 2 == 0) {
      animateOnce(tower1, "bounce", ["bounce2"]);
    } else {
      animateOnce(plane, "planeFlying");
      animateOnce(tower1, "bounce2", ["bounce"]);
    }
  },
  () => {
    animateOnce(boom, "boom");
    boom.src = boom.src;
  },
  (x) => console.log(x),
);

animateOnce(tower1, "bounce");
animateOnce(tower2, "tempHide");
animateOnce(tower2a, "shift");
let keys = new Set<string>();
const app = document.querySelector<HTMLDivElement>("#app")!;
app.addEventListener("click", () => hit());
window.addEventListener("keydown", ({ key }) => {
  if (!keys.has(key)) hit();
  keys.add(key);
});
window.addEventListener("keyup", ({ key }) => keys.delete(key));

function hit() {
  const beat = (song.getBeat() * 2) % 2;
  const hitGood = song.hit();
  if (Math.round(beat) % 2 == 0) {
    if (!hitGood || Math.min(beat, 2 - beat) > 0.2) sounds.step.play(); // avoid dupe
    animateOnce(tower2, "bounce");
  } else {
    sounds.step2.play();
    animateOnce(tower2, "tempHide");
    animateOnce(tower2a, "shift");
  }
  console.log(hitGood);
}
