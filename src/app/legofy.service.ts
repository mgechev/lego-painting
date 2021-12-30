import { Injectable } from "@angular/core";
import { legofy } from "./legofy";

@Injectable({ providedIn: 'root' })
export class LegofyService {
  process(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d')!;
    const data = context.getImageData(0, 0, canvas.width, canvas.height);
    context.putImageData(legofy(data), 0, 0);
  }
}