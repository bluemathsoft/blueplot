
const NS_SVG = 'http://www.w3.org/2000/svg';

type OneDArray = Array<number>;
type TwoDArray = Array<Array<number>>;
type PlotType = 'scatter' | 'line' | 'bar';

interface PlotOptions {
  type? : PlotType;
  dimension? : number;
}


export default class Plot {

  dom : Element;
  width : number;
  height : number;

  constructor(width=400,height=300) {
    this.width = width;
    this.height = height;
    this.dom = document.createElementNS(NS_SVG, 'svg');
    this.dom.setAttribute('width', this.width+'px');
    this.dom.setAttribute('height', this.height+'px');
  }

  add(data:OneDArray|TwoDArray, options?:PlotOptions) {
    if(!options) {
      options = {};
    }
    if(!Array.isArray(data[0])) { // 1-D array
      let type = options.type || 'line';

      if(type === 'line') {
        let polyline = document.createElementNS(NS_SVG, 'polyline');
        let coordStrings = (<Array<number>>data).map((y,i) => `${10*i},${y}`);
        polyline.setAttribute('points', coordStrings.join(' '));
        polyline.setAttribute('style', 'stroke:#000;fill:none' );
        this.dom.appendChild(polyline);
      }

    }

  }
}
