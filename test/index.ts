
import {Plot, MathText} from '../src'

window.onload = () => {

  let plot = new Plot();
  plot.add([4,5,1,0,-5,20,43],{type:'bar'});

  let text = new MathText('`x = (-b +- sqrt(b^2-4ac))/(2a)`')

  document.body.appendChild(plot.dom);
  document.body.appendChild(text.dom);
};
