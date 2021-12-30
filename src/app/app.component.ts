import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LegofyService } from './legofy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef | null = null;

  width = 300;

  constructor(private _legofy: LegofyService) {}

  ngAfterViewInit() {
    if (!this.canvas) {
      return;
    }

    this._drawImage()
      .then((canvas: HTMLCanvasElement) => this._legofy.process(canvas));
  }

  private _drawImage(): Promise<HTMLCanvasElement> {
    const {nativeElement}: {nativeElement: HTMLCanvasElement | null} = this.canvas!;
    if (!nativeElement) {
      return Promise.reject();
    }
    nativeElement.width = this.width;
    const context = nativeElement.getContext('2d');
    const img = new Image();
    img.src = '/assets/ladies.jpg';
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const ratio = img.width / img.height;
        nativeElement.height = this.width / ratio;
        context?.drawImage(img, 0, 0, img.width, img.height, 0, 0, nativeElement.width, nativeElement.height);
        return resolve(nativeElement);
      };
      img.onerror = reject;
    });
  }
}
