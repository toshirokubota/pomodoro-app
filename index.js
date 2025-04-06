const intervals = {
  'pomodoro': 25,
  'short-break': 5,
  'long-break': 10
};

const nav_tabs = document.querySelectorAll('nav button');
let timer_name = getTimerName();
let interval_seconds = intervals[timer_name] * 60;
/*************************/
/* Navigation callbacks  */
/*************************/
function getTimerName() {
  console.log('getTimerName:', nav_tabs);
  for(let tab of nav_tabs) {
    console.log('aria-selected:', tab.getAttribute('aria-selected'), tab.dataset.timerName);
    if(tab.getAttribute('aria-selected')=='true') {
      console.log(tab.dataset.timerName);
      return tab.dataset.timerName;
    }
  }
  return null;
}

nav_tabs.forEach(elm => {
  elm.addEventListener('click', () => {
    for(let tab of nav_tabs) {
      tab.setAttribute('aria-selected', 'false');
    }
    elm.setAttribute('aria-selected', 'true');
    timer_name = elm.dataset.timerName;
  });
});

/***********************/
/* Configuration form  */
/***********************/

/* updating the timer intervals */
const findParentLabel = (elm)=> {
  while(elm && elm.tagName != 'LABEL'){
    elm = elm.parentNode;
  }
  return elm;
}
const up_icons = document.querySelectorAll('.up-icon');
up_icons.forEach(elm => {
  let label = findParentLabel(elm);
  let input = label.querySelector('input');
  elm.addEventListener('click', (e)=> {
    let value = parseInt(input.value);
    let max = parseInt(input.max);
    let step = parseInt(input.step);
    if( value <= max - step) {
      input.value = (value + step).toString();
    }
  });
});
const down_icons = document.querySelectorAll('.down-icon');
down_icons.forEach(elm => {
  let label = findParentLabel(elm);
  let input = label.querySelector('input');
  elm.addEventListener('click', (e)=> {
    let value = parseInt(input.value);
    let min = parseInt(input.min);
    let step = parseInt(input.step);
    if( value >= min + step) {
      input.value = (value - step).toString();
    }
  });
});

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

/*********************************/
/* Configuration form submission */
/*********************************/

form.addEventListener('submit', (e) => {
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  console.log(data);
  //timer intervals
  for(let key in intervals) {
    intervals[key] = data[key];
  }
  //font choice
  //console.log(font_choices);
  for(let choice of font_choices) {
    console.log(choice, choice.checked);
    if(choice.checked) {
      root.style.setProperty('--ff-normal', choice.parentNode.style.fontFamily); 
    }
  }
  //font choice
  //first clear the choice
  for(let choice of color_choices) {
    if(choice.checked) {
      root.style.setProperty('--color-timer', choice.parentNode.style.backgroundColor); 
    }
  }
  setting_dialog.setAttribute('aria-hidden', true);
  e.preventDefault();
});


/*********************************/
/* Progress Timer                */
/*********************************/

const progress = document.getElementById('progress-container');
const circle = progress.querySelector('.progress-ring__circle');
const circle2 = progress.querySelector('.progress-ring__hazycircle');
const radius = getRadius(circle); //circle.r.baseVal.value;
const progressText = progress.querySelector('.progress-label-perc');
const timerCommand = progress.querySelector('.progress-label-command');
const circumference = 2 * Math.PI * radius;
// Initialize
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;


function getRadius(circle) {
  const style = getComputedStyle(circle); // Get computed styles
  const propertyValue = style.getPropertyValue('r'); // Get the width value (e.g., "150px")
  return parseFloat(propertyValue); // Extract the numeric part
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60); // Get the whole number of minutes
  const remainingSeconds = seconds % 60;  // Get the remaining seconds
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`; // Pad seconds to ensure two digits
}

function setProgress(seconds) {
  const percent = 100 * seconds / interval_seconds;
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  progressText.textContent = formatTime(seconds);

  let angle = 360 * percent / 100;
  let aoffset = angle / 2;
  circle2.style.background = `conic-gradient(from ${aoffset}deg, #2E325A 0deg, #0E112A ${aoffset}deg, #0E112A 180deg, #0E112A ${360-aoffset}deg, #2E325A 360deg)`;
}

let intervalId;
let time_left = interval_seconds;
progress.addEventListener('click', ()=> {
  timer_name = getTimerName();
  interval_seconds = intervals[timer_name] * 60;
  //console.log(timer_name, interval_seconds);
  if(timerCommand.innerText == 'start' || timerCommand.innerText == 'restart') {
    if(timerCommand.innerText == 'start') {
      time_left = interval_seconds;
    }
    timerCommand.innerText = 'pause'

    function update() {
      let perc = time_left * 100 / interval_seconds;
      setProgress(time_left);
      if(time_left <= 0) {
          clearInterval(intervalId);
          time_left = interval_seconds;
          timerCommand.innerText = 'start'
          console.log('Done!');
      } else {
          time_left --;
      }
      return update; //return the function itself
    }

    intervalId = setInterval(update(), //run it once immediately and then use it as a callback
        1000);
  } else {
    timerCommand.innerText = 'restart';
    clearInterval(intervalId);
  }
});

/***************************************************/
/* Configuration setting open/close                */
/***************************************************/
const setting_dialog = document.getElementById('setting-dialog');
document.getElementById('setting-button').addEventListener('click', () => {
  setting_dialog.setAttribute('aria-hidden', false);
});
document.getElementById('setting-dialog-close').addEventListener('click', () => {
  setting_dialog.setAttribute('aria-hidden', true);
});

