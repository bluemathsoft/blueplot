
import {Plot} from '../src'

window.onload = () => {

  let plot = new Plot();
  plot.add([4,5,1,0,20,43]);

  document.body.appendChild(plot.dom);
};
