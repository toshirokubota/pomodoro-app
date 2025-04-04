
const progress_bar = document.getElementById('circular-progress');
const progress_ctrl = document.getElementById('progress-ctrl');
const interval_seconds = 10;
let intervalId;
let time_left = interval_seconds;

console.log(progress_bar, progress_ctrl);
progress_ctrl.addEventListener('click', ()=> {
    if(progress_ctrl.innerText == 'start' || progress_ctrl.innerText == 'restart') {
        progress_ctrl.innerText = 'pause'
        intervalId = setInterval(()=> {
            time_left --;
            console.log(time_left);
            let perc = time_left * 100 / interval_seconds;
            progress_bar.style.background = `conic-gradient(#7d2ae8 0%, ${perc}%, #ededed ${perc}%)`;
            if(time_left <= 0) {
                clearInterval(intervalId);
                time_left = interval_seconds;
                progress_ctrl.innerText = 'start'
                console.log('Done!');
            } else {
                //console.log(time_left, `conic-gradient(#7d2ae8 0%, ${perc}%, #ededed ${perc}%)`);
            }
        }, 1000);
    } else {
        progress_ctrl.innerText = 'restart';
        clearInterval(intervalId);
    }
})

