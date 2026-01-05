export class BaseEntity {
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;

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

  protected drawHitBox(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }

  protected drawRelativeImage(ctx: CanvasRenderingContext2D) {
    if (!this.img) return;
    ctx.drawImage(this.img, -this.width / 2, -this.height / 2);
  }
}
