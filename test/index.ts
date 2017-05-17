
import {Plot, MathText} from '../src'
import DataGroup from '../src/datagroup'

window.onload = () => {

  let plot = new Plot();
  // plot.add([4,5,1,0,-80,20,43],{type:'line'});
  document.body.appendChild(plot.dom);

  let text = new MathText('`x = (-b +- sqrt(b^2-4ac))/(2a)`')

  let dg = new DataGroup(plot.width, plot.height);
  dg.add([4,5,1,0,-80,20,43], 'line');
  dg.add([14,5,21,10,160,-20,-23], 'line');

  plot.add(dg);
  plot.render();

  // document.body.appendChild(text.dom);
};
