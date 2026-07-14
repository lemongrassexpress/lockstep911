import { Audio, sounds } from "./sound";

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
  private readonly hits; // in seconds (passed by beats)
  private readonly beats; // in seconds (passed by beats)
  private beatCurrentIndex = 0;
  private currentIndex = 0;
  private startTime = 0;
  private onHit: (delta: number) => void = (_) => {};
  private onFail: () => void = () => {};
  constructor({
    audio,
    bpm,
    offset,
    track,
    hits = [],
    beats = [],
  }: {
    audio: Audio;
    bpm: number;
    offset: number;
    track: Track;
    hits?: number[]; // in beat unit
    beats?: number[]; // in beat unit
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
    this.hits = [
      ...new Set(
        hits.map((x) => x * this.spb + this.offset).sort((a, b) => a - b),
      ),
    ];
    this.beats = [
      ...new Set(
        beats.map((x) => x * this.spb + this.offset).sort((a, b) => a - b),
      ),
    ];
  }
  async play(
    offset: number = 0,
    onBeat: () => void,
    onFail: () => void,
    onHit: (delta: number) => void,
  ) {
    this.startTime = this.audio.context.currentTime - offset;
    const song = await this.audio.play(this.startTime);
    this.track.forEach(({ t, sound }) => sound.play(this.startTime + t));
    const interval = setInterval(() => this.tick(onBeat, onFail), 5);
    song.addEventListener("ended", () => clearInterval(interval));
    this.onHit = onHit;
    this.onFail = onFail;
  }

  getBeat(): number {
    return (this.audio.context.currentTime - this.startTime) / this.spb;
  }

  private now() {
    return this.audio.context.currentTime - this.startTime;
  }

  /* handles all sfx that are supposed to play */
  private tick(onBeat: () => void, onFail: () => void) {
    const now = this.now();
    // update missed
    const latestWindow = 0.1; // each eighth note is about 180ms
    while (
      this.currentIndex < this.hits.length &&
      this.hits[this.currentIndex] + latestWindow < now
    ) {
      if (Math.round((this.hits[this.currentIndex] * 2) / this.spb) % 2) {
        onFail();
      }
      sounds.mistake.play();
      ++this.currentIndex;
      this.onHit(latestWindow);
    }

    while (
      this.beatCurrentIndex < this.beats.length &&
      this.beats[this.beatCurrentIndex] < now
    ) {
      onBeat();
      ++this.beatCurrentIndex;
    }
  }
  // returns whether good or not
  public hit(): boolean {
    const now = this.now();
    if (this.currentIndex >= this.hits.length) return false;
    const t = this.hits[this.currentIndex];
    const tooEarly = 0.18;
    this.onHit(now - t);
    if (now < t - 1) {
      // hit nothing
      return false;
    } else if (now < t - tooEarly) {
      // way too early (doesn't match window)
      sounds.mistake.play();
      return false;
    } else if (now < t - 0.08 || now > t + 0.06) {
      // tad early
      if (Math.round((this.hits[this.currentIndex] * 2) / this.spb) % 2) {
        this.onFail();
      } else {
        sounds.mistake.play();
      }
      ++this.currentIndex;
      return false;
    } else {
      ++this.currentIndex;
      return true;
    }
  }
}
