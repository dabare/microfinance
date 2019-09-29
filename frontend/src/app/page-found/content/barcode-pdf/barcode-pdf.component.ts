import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import * as JsBarcode from 'jsbarcode';
import * as jsPDF from 'jspdf';
import * as printJS from 'print-js';

interface BarcodePdfConfig {
  pageLeftMargine: number;
  pageTopMargine: number;
  barcodeWidth: number;
  barcodeHeight: number;
  textFontSize: number;
  boxWidth: number;
  boxHeight: number;
  boxLeftPadding: number;
  boxTopPadding: number;
  maxYCount: number;
  maxXCount: number;
  rotate: boolean;
  previewMultiplier: number;
}

@Component({
  selector: 'app-barcode-pdf',
  templateUrl: './barcode-pdf.component.html',
  styleUrls: ['./barcode-pdf.component.scss']
})
export class BarcodePdfComponent implements OnInit, AfterViewInit {

  constructor(private http: HttpClient) {
  }

  private doc: any;

  @ViewChild('pdfViewerAutoLoad', {static: false}) pdfViewerAutoLoad;

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    // this.sticker(53, 'Aramani- Frock ABX', 11);
    // this.tag(23, 'Aramani- Frock ABX', 5);
    const data = [
      {stockId: '123', description: 'hello bitch', count: 33},
      {stockId: '456', description: 'hello dog', count: 43},
      {stockId: '789', description: 'hello love', count: 53}
    ];
    this.sticker(data);
  }

  sticker(data) {
    const config: BarcodePdfConfig = {
      pageLeftMargine: 6,
      pageTopMargine: 12,
      barcodeWidth: 34,
      barcodeHeight: 18,
      textFontSize: 26,
      boxWidth: 40,
      boxLeftPadding: 0,
      boxTopPadding: 0,
      boxHeight: 23,
      maxYCount: 12,
      maxXCount: 5,
      previewMultiplier: 8,
      rotate: false
    };
    this.drawPdf(data, config);
  }

  tag(data) {
    const config: BarcodePdfConfig = {
      pageLeftMargine: 0,
      pageTopMargine: 0,
      barcodeWidth: 50,
      barcodeHeight: 30,
      textFontSize: 40,
      boxWidth: 62,
      boxLeftPadding: 30,
      boxTopPadding: 0,
      boxHeight: 42,
      maxYCount: 3,
      maxXCount: 5,
      previewMultiplier: 8,
      rotate: true
    };

    this.drawPdf(data, config);
  }

  leftPad(str: string, len: number, ch = '.'): string {
    len = len - str.length + 1;
    return len > 0 ?
      new Array(len).join(ch) + str : str;
  }

  drawCanvas(stockId, description, config: BarcodePdfConfig) {
    const boxPreviewHeight = config.previewMultiplier * config.boxHeight;
    const boxPreviewWidth = config.previewMultiplier * config.boxWidth;
    const barcodePreviewHeight = config.previewMultiplier * config.barcodeHeight;

    stockId = this.leftPad(stockId + '', 10, '0');
    const barcodeoptons = {
      format: 'CODE128',
      height: 50,
      displayValue: true
    };
    JsBarcode('#barcode', stockId, barcodeoptons);

    const barcode = document.getElementById('barcode') as HTMLCanvasElement;
    const preview = document.getElementById('preview') as HTMLCanvasElement;
    const previewCtx = preview.getContext('2d');

    preview.height = boxPreviewHeight;
    preview.width = boxPreviewWidth;

    previewCtx.fillStyle = 'white';
    previewCtx.fillRect(0, 0, preview.width, preview.height);
    previewCtx.drawImage(barcode, 0, 0, boxPreviewWidth, barcodePreviewHeight);
    previewCtx.fillStyle = 'black';
    previewCtx.textAlign = 'center';
    previewCtx.font = config.textFontSize + 'px Arial';
    previewCtx.fillText(description, preview.width / 2, barcodePreviewHeight + (boxPreviewHeight - barcodePreviewHeight) / 2);

    const previewRotated = document.getElementById('previewRotated') as HTMLCanvasElement;
    previewRotated.width = boxPreviewHeight;
    previewRotated.height = boxPreviewWidth;

    const previewRotatedCtx = previewRotated.getContext('2d');

    previewRotatedCtx.translate(previewRotatedCtx.canvas.width, 0);
    previewRotatedCtx.rotate(Math.PI / 2);
    // preview2Ctx.translate(-preview2Ctx.canvas.width / 2, -preview2Ctx.canvas.height / 2);

    previewRotatedCtx.fillStyle = 'white';
    previewRotatedCtx.fillRect(0, 0, preview.width, preview.height);
    previewRotatedCtx.drawImage(barcode, 0, 0, boxPreviewWidth , barcodePreviewHeight);
    previewRotatedCtx.fillStyle = 'black';
    previewRotatedCtx.textAlign = 'center';
    previewRotatedCtx.font = config.textFontSize + 'px Arial';
    previewRotatedCtx.fillText(description, preview.width / 2, barcodePreviewHeight + (boxPreviewHeight - barcodePreviewHeight) / 2);

    let imgData = preview.toDataURL('image/png', 1);
    if (config.rotate) {
      imgData = previewRotated.toDataURL('image/png', 1);
    }
    return imgData;
  }

  drawPdf(data, config: BarcodePdfConfig) {


    this.doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      hotfixes: [] // an array of hotfix strings to enable
    });

    let count = 0;
    for (const item of data) {
      count += item.count;
    }
    let currentItem = 0;
    while (count) {
        for (let y = 0; count; y++) {
          if (y && y % config.maxYCount === 0) {
            this.doc.addPage();
            y = 0;
          }
          for (let x = 0; x < config.maxXCount && count; x++) {
            const imgData = this.drawCanvas(data[currentItem].stockId, data[currentItem].description, config);
            if (config.rotate) {
              this.doc.addImage(imgData, 'PNG',
                config.pageTopMargine + config.boxTopPadding + x * (config.boxHeight + config.boxTopPadding),
                config.pageLeftMargine + config.boxLeftPadding + y * (config.boxWidth + config.boxLeftPadding),
                config.boxHeight, config.boxWidth);
            } else {
              this.doc.addImage(imgData, 'PNG',
                config.pageLeftMargine + config.boxLeftPadding + x * (config.boxWidth + config.boxLeftPadding),
                config.pageTopMargine + config.boxTopPadding + y * (config.boxHeight + config.boxTopPadding),
                config.boxWidth, config.boxHeight);
            }
            count--;
            data[currentItem].count--;
            if (data[currentItem].count === 0) {
              currentItem++;
            }
          }
        }
      }



    // printJS(this.doc.output('bloburl'));
    this.pdfViewerAutoLoad.pdfSrc = this.doc.output('bloburl'); // pdfSrc can be Blob or Uint8Array
    this.pdfViewerAutoLoad.refresh(); // Ask pdf viewer to load/refresh pdf
  }
}


// npm install jsbarcode --save
// npm install ng2-pdfjs-viewer --save
// npm install jspdf --save

// for printing directly
// npm install print-js --save
