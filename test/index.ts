
import {Plot, MathText} from '../src'
import DataGroup1D from '../src/datagroup1d'
import DataGroup2D from '../src/datagroup2d'

window.onload = () => {

  let plot = new Plot();
  document.body.appendChild(plot.dom);

  let dg1 = new DataGroup1D(plot.width, plot.height);
  dg1.add([4,5,1,0,-80,20,43], {type:'bar',style:'fill:#55a;stroke:none'});
  dg1.add([14,5,21,10,160,-20,-23], {type:'line', style:'fill:none;stroke:#444;stroke-width:1'});

  let dg2 = new DataGroup2D(plot.width, plot.height);
  dg2.addPoints([
    [2,22],[4,-22],[6,-30],[8,-10]
  ],{type:'bar',style:'stroke:#800;fill:none;stroke-width:1'});

  plot.add(dg1);
  plot.add(dg2);
  plot.render();

  let text = new MathText('`x = (-b +- sqrt(b^2-4ac))/(2a)`')
  document.body.appendChild(text.dom);
};
