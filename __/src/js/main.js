import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import { Chart } from 'chart.js/auto';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Draggable from 'gsap/Draggable'; 


document.addEventListener("DOMContentLoaded", function (event) {

  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(ScrollToPlugin);
  gsap.registerPlugin(Draggable);

  const container = document.querySelector('.layout-animated');
  const imageBottle = document.querySelector('.image-bottle');

  ScrollTrigger.create({
    trigger: container,
    start: 'top top',
    end: 'bottom bottom',
    // markers: true,
    onEnter: () => imageBottle.classList.add('onmove'),
    onLeave: () => {
      imageBottle.classList.remove('onmove');
      imageBottle.classList.add('stop-bottom');
    },
    onEnterBack: () => {
      imageBottle.classList.remove('stop-bottom');
      imageBottle.classList.add('onmove');
    },
    onLeaveBack: () => {
      imageBottle.classList.remove('onmove');
    }
  });
  
});