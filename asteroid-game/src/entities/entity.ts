export class BaseEntity {
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;

  protected vx: number = 0;
  protected vy: number = 0;
  protected mass: number = 1;
  protected img?: HTMLImageElement;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }

  public getVelocity(): { vx: number; vy: number } {
    return { vx: this.vx, vy: this.vy };
  }

  public getMass(): number {
    return this.mass;
  }

  public getCoordinates(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  public getSize(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  public reflectVelocity(nx: number, ny: number) {
    const dot = this.vx * nx + this.vy * ny;
    return {
      vx: this.vx - 2 * dot * nx,
      vy: this.vy - 2 * dot * ny,
    };
  }

  protected drawHitBox(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }

  protected drawRelativeImage(ctx: CanvasRenderingContext2D) {
    if (!this.img) return;
    ctx.drawImage(this.img, -this.width / 2, -this.height / 2);
  }

  protected handleOutOfBounds(width: number, height: number): void {
    if (this.x >= width) {
      this.x = -this.width;
    } else if (this.x < -this.width) {
      this.x = width;
    }
    if (this.y >= height) {
      this.y = -this.height;
    } else if (this.y < -this.height) {
      this.y = height;
    }
  }
}
