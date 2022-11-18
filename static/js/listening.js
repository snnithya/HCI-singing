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
let audioContext;
var buflen = 2048;
var buf = new Float32Array( buflen );
var intTimer = null;
var csv_path = null;
var audio_path = null;
var songName = null;
var audio = null;
var tempoScalingVal = 1;
var yticks = []

var songName_to_path = {
    "Rolling in the Deep": {
        "audio_path": "../../static/audio/3_rolling_in_the_deep/3_rolling_in_the_deep_transpose_0.wav",
        "pitch_path": "../../static/pitch/3_rolling_in_the_deep.csv",
        "tonic": 261.63,
        "ylabels": [ 'C', 'D', 'E', 'Gb', 'Ab', 'Bb', 'C', 'D', 'E', 'Gb', 'Ab', 'Bb',  'C', 'D', 'E', 'Gb', 'Ab', 'Bb',  'C', 'D']
    },
    "Dangerous Woman": {
        "audio_path": "../../static/audio/4_dangerous_woman/4_dangerous_woman_transpose_0.wav",
        "pitch_path": "../../static/pitch/4_dangerous_woman.csv",
        "tonic": 329.63,
        "ylabels": ['E', 'Gb', 'Ab', 'Bb', 'C', 'D', 'E', 'Gb', 'Ab', 'Bb', 'C', 'D', 'E', 'Gb', 'Ab', 'Bb',  'C', 'D', 'E', 'Gb', 'Ab', 'Bb',  'C', 'D']
    },
    "The Scientist": {
        "audio_path": "../../static/audio/2_the_scientist/2_the_scientist_transpose_0.wav",
        "pitch_path": "../../static/pitch/2_the_scientist.csv",
        "tonic": 174.61,
        "ylabels": [ "F", "G", "B", "C#", "D#", "F", "G", "B", "C#", "D#", "F", "G", "B", "C#", "D#", "F", "G",  "B", "C#", "D#"]
    },
    "She Will be Loved": {
        "audio_path": "../../static/audio/1_she_will_be_loved/1_she_will_be_loved_transpose_0.wav",
        "pitch_path": "../../static/pitch/1_she_will_be_loved.csv",
       "tonic": 155.56,
       "ylabels": ["D#", "F", "G", "B", "C#", "D#", "F", "G", "B", "C#", "D#", "F", "G", "B", "C#", "D#", "F", "G"]
    }
}

var pitch_vals = ['0', '-6', '6']
var tempo_vals = ['.wav', '_0.75x.wav', '_1.25x.wav'] // for the name of file
var tempoScaling_vals = [1, 1/0.75, 1/1.25] // to scale the x axis of orig cont. in plot

window.onload = function(){
    localStorage.setItem('songDict', JSON.stringify(songName_to_path));
    localStorage.setItem('pitchVals', JSON.stringify(pitch_vals));
    localStorage.setItem('tempoVals', JSON.stringify(tempo_vals));
    localStorage.setItem('tempoScalingVals', JSON.stringify(tempoScaling_vals));
    
    songName = localStorage.getItem('Song Name')
    
    audio_path = songName_to_path[songName]["audio_path"]
    csv_path = songName_to_path[songName]["pitch_path"]

    localStorage.setItem('csv_path', csv_path);
    localStorage.setItem('tempoScalingVal', tempoScalingVal);
    localStorage.setItem('tonic', songName_to_path[songName]["tonic"]);
    localStorage.setItem('yticks', JSON.stringify(songName_to_path[songName]["ylabels"]));

    yticks = songName_to_path[songName]['ylabels'].slice(3, 15);
}

document.getElementById("start").onclick = () => {
    startPractice();
    console.log('starting practice')
}

document.getElementById("stop").onclick = () => {
    stopPractice();
    console.log('stopping practice');
}

document.getElementById("pitch").onchange = () => {
    var pitch_ind = document.getElementById("pitch").selectedIndex;
    var tempo_ind = document.getElementById("tempo").selectedIndex;
    console.log(pitch_ind, tempo_ind)
    audio_path = songName_to_path[songName]["audio_path"].slice(0, -5) + pitch_vals[pitch_ind] +  tempo_vals[tempo_ind];
    if (pitch_ind != 0) {
        yticks = songName_to_path[songName]['ylabels'].slice(0, 12);
    }
    else{
        yticks = songName_to_path[songName]['ylabels'].slice(3, 15);
    }
    Plotly.relayout('myDiv', {
        yaxis: {
            range: [-1200, 2400],
            tickvals: [-400, -200, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800],
            ticktext: yticks
        }
    });
    stopPractice();
}

document.getElementById("tempo").onchange = () => {
    var pitch_ind = document.getElementById("pitch").selectedIndex;
    var tempo_ind = document.getElementById("tempo").selectedIndex;
    // console.log(pitch_val, tempo_val)
    audio_path = songName_to_path[songName]["audio_path"].slice(0, -5) + pitch_vals[pitch_ind] + tempo_vals[tempo_ind];
    tempoScalingVal = tempoScaling_vals[tempo_ind];
    localStorage.setItem('tempoScalingVal', tempoScalingVal);
    resetGraph(0, 'line');
    resetGraph(1, 'text');
    stopPractice();
    plotOrigPitch(csv_path);
}
function resetGraph(traceId, mode) {
    document.getElementById('myDiv').data[traceId] = {
        mode: mode,
        x:Array.from(Array(10).keys()),
        y:Array(10).fill(null),
        text: Array(10).fill('lala')
    }
}
function stopPractice() {
    if(runPitch) {
        clearInterval(intTimer);
        audio.pause();
        audio.currentTime = 0;
    }
    runPitch = false;
}

function startPractice() {
    runPitch = true;
    startTime = new Date();
    setup();
    play(audio_path);
};

// Pitch Detection

let mic;
let pitch;
let stream;

async function setup() {
    
    document.getElementById("songName").innerHTML = songName;
    // initialise plots
    await Plotly.newPlot('myDiv', 
    [{
    mode: 'lines',
        x:Array.from(Array(10).keys()),
        y:Array(10).fill(null),
        text: Array(10).fill('lala'),
        textposition: top
    },
    {
    mode: 'text',
    x:Array.from(Array(10).keys()),
    y:Array(10).fill(null),
        text: Array(10).fill('lala')
    },
    ],
    {
        yaxis: {
            range: [-1200, 2400],
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
}

function plotOrigPitch(path) {
    Plotly.d3.csv(path, function(data){ processData(data) } );
}
   
function processData(allRows) {

//    console.log(allRows);
   var x = [], y = [], words = [], ytext = [], xtext = [];
   prev_y = 500;

   for (var i=0; i<allRows.length; i++) {
       row = allRows[i];
       x.push( parseFloat(row['time']) * tempoScalingVal);
       y.push( row['pitch'] );
    //    console.log(i, row)
    //     console.log('logging word: ', row['word'])
        if (row['pitch'] == ''){
        if(row['word'] != ''){
            xtext.push(row['time'] * tempoScalingVal)
            ytext.push(prev_y);
            words.push(row['word']);
        }
    }
    else {
        prev_y = row['pitch'];
        if(row['word'] != '') {
        xtext.push(row['time'] * tempoScalingVal)
        ytext.push(parseFloat(prev_y) + 100);
        words.push(row['word']);
    }
    }

   }
//    console.log( 'X',x, 'Y',y, 'words', words );
   Plotly.extendTraces('myDiv', {
    // mode: 'lines+text',
    x: [x], // the model detects pitches at every 0.01s by default
    y: [y],
   }, [0]);
   console.log(ytext)
   Plotly.extendTraces('myDiv', {
    
    // mode: 'lines+text',
    x: [xtext], // the model detects pitches at every 0.01s by default
    y: [ytext],
    text: [words]
   }, [1]);
}

async function play(audio_path) {
    console.log('in play');
    audio = await new Audio(audio_path);
    audio.play();
    intTimer = setInterval(shiftPlot, 5);

}

function shiftPlot() {
    // shifts plot
    console.log('in shiftplot', new Date() - startTime);
    if(runPitch) {
        var secs = (new Date() - startTime)/1000;
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


