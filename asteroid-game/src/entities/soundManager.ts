export class SoundManager {
  #audioContext: AudioContext;
  #shootBuffer?: AudioBuffer;
  #powerUpBuffer?: AudioBuffer;
  #asteroidCollisionBuffer?: AudioBuffer;
  #playerDestructionBuffer?: AudioBuffer;

  static #instance: SoundManager;

  private constructor() {
    this.#audioContext = new AudioContext();

    this.#init();
  }

  async #init(): Promise<void> {
    window.addEventListener("keydown", () => this.#audioContext.resume(), {
      once: true,
    });
    await this.#preloadAudio();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.#instance) {
      SoundManager.#instance = new SoundManager();
    }
    return SoundManager.#instance;
  }

  async #preloadAudio(): Promise<void> {
    const loadBuffer = async (url: string) => {
      const data = await fetch(url).then((r) => r.arrayBuffer());
      return await this.#audioContext.decodeAudioData(data);
    };

    this.#shootBuffer = await loadBuffer(
      "assets/projectile/projectile_audio.ogg"
    );
    this.#powerUpBuffer = await loadBuffer(
      "assets/power_ups/power_up_audio.ogg"
    );
    this.#asteroidCollisionBuffer = await loadBuffer(
      "assets/obstacles/asteroid_hit.m4a"
    );
    this.#playerDestructionBuffer = await loadBuffer(
      "assets/ship/player_destruction.m4a"
    );
  }

  public playShoot(): void {
    if (!this.#shootBuffer) return;

    const source = this.#audioContext.createBufferSource();
    source.buffer = this.#shootBuffer;

    const gain = this.#audioContext.createGain();
    gain.gain.value = 0.7;

    source.connect(gain).connect(this.#audioContext.destination);
    source.start(0, 4.18);
  }

  public playPowerUp(): void {
    if (!this.#powerUpBuffer) return;

    const source = this.#audioContext.createBufferSource();
    source.playbackRate.value = 1.6;
    source.buffer = this.#powerUpBuffer;

    const gain = this.#audioContext.createGain();
    gain.gain.value = 0.4;
    source.connect(gain).connect(this.#audioContext.destination);
    source.start(0, 1.7);
  }

  public playAsteroidHit(volume: number, speed: number = 1): void {
    if (!this.#asteroidCollisionBuffer) return;
    const src = this.#audioContext.createBufferSource();
    src.buffer = this.#asteroidCollisionBuffer;

    const gain = this.#audioContext.createGain();
    gain.gain.value = volume;
    src.connect(gain).connect(this.#audioContext.destination);
    src.start(0, speed);
  }

  public playPlayerDestruction(): void {
    if (!this.#playerDestructionBuffer) return;

    const source = this.#audioContext.createBufferSource();
    source.buffer = this.#playerDestructionBuffer;

    const gain = this.#audioContext.createGain();
    gain.gain.value = 0.7;

    source.connect(gain).connect(this.#audioContext.destination);
    source.start(0, 0, 1.3);
  }
}
