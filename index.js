/*
Configuration form
*/
/* Theme changes */
const form = document.getElementById('form');
const root = document.documentElement;
//root.style.setProperty('--my-variable', 'new-value'); 
const font_choices = form.querySelectorAll('.setting-card--font input');
font_choices.forEach(elm => {
  //console.log(elm);
  elm.addEventListener('click', () => {
    font_choices.forEach(elm => {
      elm.parentElement.classList.remove('active');
    })
    elm.checked = true;
    elm.parentElement.classList.add('active');
  });
});

const color_choices = form.querySelectorAll('.setting-card--color input');
color_choices.forEach(elm => {
  //console.log(elm);
  elm.addEventListener('click', () => {
    color_choices.forEach(elm => {
      elm.parentElement.classList.remove('active');
    })
    elm.checked = true;
    elm.parentElement.classList.add('active');
  });
});

const intervals = {
  'pomodoro': 25,
  'short-break': 5,
  'long-break': 10
};

form.addEventListener('submit', (e) => {
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  //console.log(data);
  //timer intervals
  for(let key in intervals) {
    intervals[key] = data[key];
  }
  //font choice
  //first clear the choice
  let checked = false;
  //console.log(font_choices);
  for(let choice of font_choices) {
    console.log(choice, choice.checked);
    if(choice.checked) {
      console.log('font choice:', choice.parentNode.style.fontFamily);
      root.style.setProperty('--ff-normal', choice.parentNode.style.fontFamily); 
      checked = true;
      //console.log(root.style, choice.parentElement.style);
    }
  }
  if(!checked) {
    //default
  }
  //font choice
  //first clear the choice
  checked = false;
  for(let choice of color_choices) {
    if(choice.checked) {
      console.log('color choice:', choice.parentNode.style.backgroundColor);
      root.style.setProperty('--color-timer', choice.parentNode.style.backgroundColor); 
      checked = true;
    }
  }
  if(!checked) {
    
  }
  e.preventDefault();
  console.log(intervals, root.style);
  //console.log(intervals, root.style.getPropertyValue('--font-normal'), root.style.getPropertyValue('--color-timer'));
});


/*
  Progress timer
*/
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
    intervalId = setInterval(function update() {
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
      return update;
    }(), 1000);
    console.log('start: interval id = ', intervalId);
  } else {
    timerCommand.innerText = 'restart';
    clearInterval(intervalId);
    console.log('pause: interval id = ', intervalId);
  }
});


// Example: Set to 65%
setProgress(65);



