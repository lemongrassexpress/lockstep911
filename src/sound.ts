import _cowbell from "./assets/GROUP_COMMON_00000006.wav";
import _mistake from "./assets/GROUP_COMMON_00000022.wav";
import _step from "./assets/GROUP_NTR_BACKBEAT_EN_00000000.wav";
import _1hai from "./assets/GROUP_NTR_BACKBEAT_EN_00000001.wav";
import _1ha from "./assets/GROUP_NTR_BACKBEAT_EN_00000002.wav";
import _1haii from "./assets/GROUP_NTR_BACKBEAT_EN_00000003.wav";
import _1ho from "./assets/GROUP_NTR_BACKBEAT_EN_00000004.wav";
import _2n from "./assets/GROUP_NTR_BACKBEAT_EN_00000005.wav";
import _2ha from "./assets/GROUP_NTR_BACKBEAT_EN_00000006.wav";
import _step2 from "./assets/GROUP_COMMON_00000064.wav";
import _song from "./assets/lockstep.mp3";

const contextClass =
  window.AudioContext ||
  (window as any).webkitAudioContext ||
  (window as any).mozAudioContext ||
  (window as any).oAudioContext ||
  (window as any).msAudioContext;
if (!contextClass) {
  alert("Web Audio API is not available. Please use a different browser.");
  throw new Error("Web Audio API is not available.");
}
const context = new contextClass() as AudioContext;

/**
 * https://webaudioapi.com/book/Web_Audio_API_Boris_Smus_html/ch01.html#s01_8
 * https://webaudioapi.com/book/Web_Audio_API_Boris_Smus_html/ch02.html
 */
export class Audio {
  readonly url;
  readonly context;
  private buffer: AudioBuffer | null = null;
  constructor(context: AudioContext, url: string) {
    this.context = context;
    this.url = url;
  }
  async load() {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open("GET", this.url, true);
      request.responseType = "arraybuffer";
      request.onload = () => {
        this.context.decodeAudioData(
          request.response,
          (x) => {
            console.info(`Load audio ${this.url}`, x);
            this.buffer = x;
            resolve(this);
          },
          reject,
        );
      };
      request.send();
    });
  }
  async play(offset: number = 0) {
    if (!this.buffer) {
      throw new Error("Buffer is not loaded. Call load() first.");
    }
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.context.destination);
    if (offset >= 0) source.start(offset);
    else source.start(0, -offset);
    return source;
  }
}

const sounds = {
  cowbell: new Audio(context, _cowbell),
  mistake: new Audio(context, _mistake),
  step: new Audio(context, _step),
  step2: new Audio(context, _step2),
  song: new Audio(context, _song),
  t1hai: new Audio(context, _1hai),
  t1ha: new Audio(context, _1ha),
  t1haii: new Audio(context, _1haii),
  t1ho: new Audio(context, _1ho),
  t2n: new Audio(context, _2n),
  t2ha: new Audio(context, _2ha),
};

await Promise.all(Object.values(sounds).map((x) => x.load()));

export { sounds };
