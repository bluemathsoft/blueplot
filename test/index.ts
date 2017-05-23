
import {Plot, MathText} from '../src'
import DataGroupN from '../src/datagroupN'
import DataGroup2N from '../src/datagroup2N'
import DataGroupMN from '../src/datagroupMN'

window.onload = () => {

  let plot = new Plot();
  document.body.appendChild(plot.dom);

  /*
  let dg1 = new DataGroupN(plot.width, plot.height, {
    markerDisplay:'hidden',
    axisDisplay:'hidden'
  });
  dg1.add([4,5,1,0,-80,20,43], {type:'bar',style:'fill:#55a;stroke:none'});
  dg1.add([14,5,21,10,160,-20,-23], {type:'line', style:'fill:none;stroke:#444;stroke-width:1'});
  plot.add(dg1);

  let dg2 = new DataGroup2N(plot.width, plot.height, {
    markerDisplay:'visible',
    axisDisplay:'visible'
  });
  dg2.fromPoints([
    [2,22],[4,-22],[6,-30],[8,-10]
  ],{type:'bar',style:'stroke:#800;fill:none;stroke-width:1'});
  plot.add(dg2);
  */


  let dg3 = new DataGroupMN(plot.width, plot.height);
  dg3.from2DData([
    [2,6,7,8],
    [12,6,0,9],
    [1,8,7,9.45609],
    [12,0,0,-2]
  ], {type:'grid'});
  plot.add(dg3);

  for(let i=0; i<10; i++) {
    dg3.from2DData([
      [2,6,7,8],
      [12,6,0,3*i],
      [1,i/3,7,9.45609],
      [12,0,0,-2]
    ],{type:'grid', timetrail:true});
  }

  let text = new MathText('`x = (-b +- sqrt(b^2-4ac))/(2a)`')
  document.body.appendChild(text.dom);
};
