// Things left to do:
// 1. Create a separate listening page
// 2. Create the option to display lyrics on the side
// 3. Create more pitch contours for the songs
// 4. Implement other functionality - record, slow down, transpose etc.

//globals
let envelope;
let buttons = new Map();
let notes = new Map();
let current_tab;
let current_col;
let prev;
let score = 0;
let current_note;
let detected;
let runPitch = false;
let currentPitch = 0;
let currentTime = 0;
let startTime = 0;
var recorder;
var buflen = 2048;
var buf = new Float32Array( buflen );
var pitchTimer = null;
var drawTimer = null;
var csv_path = null;
var x = [];
var y = [];
var pitch;
var mic;
let audioContext;
var songName_to_path;
var pitch_vals;
var tempo_vals;
var tempoScaling_vals;
var tonic;

window.onpageshow = function() {
    setup;
    csv_path = localStorage.getItem('csv_path');
    tempoScalingVal = localStorage.getItem('tempoScalingVal');
    tonic = parseFloat(localStorage.getItem('tonic'));
    yticks = JSON.parse(localStorage.getItem('yticks'));
    console.log(yticks)
}

document.getElementById("practice-test").addEventListener("click", micListen);
document.getElementById("stop").onclick = () => {
    stopPractice();
    // console.log('stopping practice');
}

function stopPractice() {
    runPitch = false;
    stored_data = document.getElementById("myDiv").data[0];
    console.log('in stop')
    localStorage.setItem('stored_data', JSON.stringify(stored_data));
}


function startPractice() {
    // runPitch = true;
    setup();
};

// Pitch Detection

async function setup() {
    console.log('in setup')
    // initialise plots
    await Plotly.newPlot('myDiv', 
    [{// correctly sung parts
        
        x:Array.from(Array(10).keys()),
        y:Array(10).fill(null),
       
    },
    {// contour of original song
    mode: 'lines',
        x:Array.from(Array(10).keys()),
        y:Array(10).fill(null),
        text: Array(10).fill('lala'),
        textposition: top,
        // line: {
        //     color: 'rgb(128, 128, 128)'
        // }
    },
    {// words from the song
    mode: 'text',
    x:Array.from(Array(10).keys()),
    y:Array(10).fill(null),
        text: Array(10).fill('lala')
    },
    ], 
    {
        yaxis: {
            range: [-500, 1900],
            tickvals: [-400, -200, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800],
            ticktext: yticks
        },
        xaxis: {
            range: [-3, 7]
        },
        shapes: [

        //line vertical

        {
        type: 'line',
        x0: 0,
        y0: -500,
        x1: 0,
        y1: 1900,
        line: {
            color: 'rgb(55, 128, 191)',
            width: 3
        }
        }]
    });
    plotOrigPitch(csv_path);
    audioContext = getAudioContext();
    mic = await new p5.AudioIn();
    // mic.start(startPitch);
}

function plotOrigPitch(csv_path) {
    // console.log('in plot orgi pitch', csv_path);
    Plotly.d3.csv(csv_path, function(data){ processData(data) } );
}

function micListen() {
    mic.start(startPitch);
    runPitch = true;
    startTime = new Date();
}

async function startPitch() {
    console.log('in startPitch');

    // let audioContext = new AudioContext();
    // console.log('sample rate', audioContext.sampleRate)
    // let stream = navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    
    // mediaStreamSource = audioContext.createMediaStreamSource(stream);

    setInterval(shiftPlot, 250);    // call to shift the plot every 500 ms
    // console.log(audioContext, stream);
    pitch = ml5.pitchDetection('../static/js/model', audioContext , mic.stream, modelLoaded); // pitch detection
    console.log(pitch)
    requestAnimationFrame(true_draw);
}

function modelLoaded() {
    console.log('in callback')
    getPitch();
}
   
function processData(allRows) {

    console.log(allRows);
   var words = [], ytext = [], xtext = [];
   prev_y = 500;

   for (var i=0; i<allRows.length; i++) {
       row = allRows[i];
       x.push( parseFloat(row['time']) * tempoScalingVal);
       y.push( row['pitch'] );
    //    console.log(i, row)
        // console.log('logging word: ', row['word'])
        if (row['pitch'] == ''){
        if(row['word'] != ''){
            xtext.push(parseFloat(row['time']) * tempoScalingVal)
            ytext.push(prev_y);
            words.push(row['word']);
        }
    }
    else {
        prev_y = row['pitch'];
        if(row['word'] != '') {
        xtext.push(parseFloat(row['time']) * tempoScalingVal)
        ytext.push(prev_y);
        words.push(row['word']);
    }
    }

   }
//    console.log( 'X',x, 'Y',y, 'words', words );
   Plotly.extendTraces('myDiv', {
    x: [x], 
    y: [y],
   }, [1]);
   Plotly.extendTraces('myDiv', {
    // mode: 'lines+text',
    x: [xtext], // the model detects pitches at every 0.01s by default
    y: [ytext],
    text: [words]
   }, [2]);
}

function true_draw() {
    // console.log('in draw', runPitch)
    // time_ind = x.findIndex(element => {
    //   if (element >= currentTime) {
    //     return true;
    //   }

    //   return false;
    // })
    // orig_y = y[time_ind]
    // console.log(time_ind, orig_y, currentPitch, (currentPitch >= orig_y - 30 && currentPitch <= orig_y + 30))
    // if (currentPitch >= orig_y - 30 && currentPitch <= orig_y + 30) {
    //     plot_ind = 0 
    // }
    // else {
    //     plot_ind = 1
    // }
    // console.log(plot_ind, orig_y, time_ind)
    Plotly.extendTraces('myDiv', {
                x: [[currentTime]], // the model detects pitches at every 0.01s by default
              y: [[currentPitch]],
            }, [0]);
    if (runPitch) {
        request = requestAnimationFrame(true_draw);
    }
}

function shiftPlot() {
    // shifts plot
    if(runPitch) {
        var secs = currentTime;
        Plotly.update('myDiv', {},{
            shapes: [

            //line vertical

            {
              type: 'line',
              x0: secs,
              y0: -500,
              x1: secs,
              y1: 1900,
              line: {
                color: 'rgba(55, 128, 191, 0.5)',
                width: 3
              }
            }, []]
        })
        Plotly.relayout('myDiv', {
            xaxis: {
                range: [secs-3, secs + 7]
            }
        });
    }
}

function getPitch() {
    // gets pitch
    console.log('in getPitch', runPitch, pitch)
    pitch.getPitch(function(err, frequency) {
         // hardcoded tonic for now, needs to be read from file
        console.log(err, frequency, currentTime);
        if (frequency) {
            currentPitch = 1200*Math.log2(frequency/tonic);
            currentTime = (new Date() - startTime)/1000;
        }
        else{
            currentPitch = null;
            currentTime = (new Date() - startTime)/1000;
        }
        if(runPitch) getPitch();
    })
}


