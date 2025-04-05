
const progress = document.getElementById('progress-container');
//const progress_ctrl = document.getElementById('progress-ctrl');
const circle = progress.querySelector('.progress-ring__circle');
const circle2 = progress.querySelector('.progress-ring__hazycircle');
const radius = circle.r.baseVal.value;
const progressText = progress.querySelector('.progress-label-perc');
const timerCommand = progress.querySelector('.progress-label-command');

const circumference = 2 * Math.PI * radius;
// Initialize
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

const interval_seconds = 10;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  progressText.textContent = `${percent}%`;
  //console.log('offset: ', offset, circumference, percent);

  let angle = 360 * percent / 100;
  let aoffset = angle / 2;
  circle2.style.background = `conic-gradient(from ${aoffset}deg, #2E325A 0deg, #0E112A ${aoffset}deg, #0E112A 180deg, #0E112A ${360-aoffset}deg, #2E325A 360deg)`;
  //console.log(`conic-gradient(from ${aoffset}deg, #FFF 0deg, #000 90deg, #000 180deg, #000 270deg, #FFF 360deg)`);
}

let intervalId;
let time_left = interval_seconds  ;
//console.log(progress_bar, progress_ctrl);
progress.addEventListener('click', ()=> {

  if(timerCommand.innerText == 'start' || timerCommand.innerText == 'restart') {
    timerCommand.innerText = 'pause'
    intervalId = setInterval(()=> {
      //progress_bar.style.background = `conic-gradient(#7d2ae8 0%, ${perc}%, #ededed ${perc}%)`;
      console.log(time_left);
      let perc = time_left * 100 / interval_seconds;
      setProgress(perc);
      if(time_left <= 0) {
          clearInterval(intervalId);
          time_left = interval_seconds;
          timerCommand.innerText = 'start'
          console.log('Done!');
      } else {
          //console.log(time_left, `conic-gradient(#7d2ae8 0%, ${perc}%, #ededed ${perc}%)`);
          time_left --;
      }
    }, 3000);
    console.log('start: interval id = ', intervalId);
  } else {
    timerCommand.innerText = 'restart';
    clearInterval(intervalId);
    console.log('pause: interval id = ', intervalId);
  }
});

/* Theme changes */
const root = document.documentElement;
root.style.setProperty('--my-variable', 'new-value'); 


// Example: Set to 65%
setProgress(65);




