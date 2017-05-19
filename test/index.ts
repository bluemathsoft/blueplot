
import {Plot, MathText} from '../src'
import {DataGroup1D, DataGroup2D} from '../src/datagroup'

window.onload = () => {

  let plot = new Plot();
  document.body.appendChild(plot.dom);

  /*
  let dg = new DataGroup1D(plot.width, plot.height);
  dg.add([4,5,1,0,-80,20,43], 'bar');
  dg.add([14,5,21,10,160,-20,-23], 'line');
  */

  let dg = new DataGroup2D(plot.width, plot.height);
  dg.addPoints([
    [2,22],[4,-22],[6,-30],[8,-10]
  ],'line');

  plot.add(dg);
  plot.render();

  let text = new MathText('`x = (-b +- sqrt(b^2-4ac))/(2a)`')
  document.body.appendChild(text.dom);
};
