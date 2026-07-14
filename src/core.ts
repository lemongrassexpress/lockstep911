import { Audio } from "./sound";
export interface ScheduledSound {
  t?: number;
  beat: number;
  offset?: number;
  sound: Audio;
}
export type Track = ScheduledSound[];
export class Song {
  private audio;
  readonly bpm;
  readonly offset;
  readonly spb;
  private readonly track;
  private currentIndex = 0;
  private startTime = 0;
  constructor({
    audio,
    bpm,
    offset,
    track,
  }: {
    audio: Audio;
    bpm: number;
    offset: number;
    track: Track;
  }) {
    this.audio = audio;
    this.bpm = bpm;
    this.offset = offset;
    this.spb = 60 / this.bpm;
    this.track = track
      .map((x) => ({
        ...x,
        t: x.t || x.beat * this.spb + this.offset - (x.offset || 0),
      }))
      .sort((a, b) => a.t - b.t);
  }
  async play(offset: number = 0) {
    this.startTime = this.audio.context.currentTime - offset;
    const song = await this.audio.play(this.startTime);
    this.track.forEach(({ t, sound }) => sound.play(this.startTime + t));
    const interval = setInterval(() => this.tick(), 50);
    song.addEventListener("ended", () => clearInterval(interval));
  }

  getBeat(): number {
    return (this.audio.context.currentTime - this.startTime) / this.spb;
  }

  /* handles all sfx that are supposed to play */
  private tick() {
    const now = this.audio.context.currentTime - this.startTime;
    while (
      this.currentIndex < this.track.length &&
      this.track[this.currentIndex].t < now
    ) {
      //   this.track[this.currentIndex].sound.play();
      ++this.currentIndex;
    }
  }
}
