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
var pitchTimer = null;
var drawTimer = null;
var csv_path = "static/pitch/RITD-100-0.csv";
var audio_path = "static/audio/RITD-100-0.wav";
var songName = "Rolling in the deep";
var audio = null;


document.getElementById("start").onclick = () => {
    startPractice();
    console.log('starting practice')
}

document.getElementById("stop").onclick = () => {
    stopPractice();
    console.log('stopping practice');
}

function stopPractice() {
    runPitch = false;
    audio.pause();
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
            range: [-500, 1900]
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
       x.push( parseFloat(row['time']));
       y.push( row['pitch'] );
    //    console.log(i, row)
    //     console.log('logging word: ', row['word'])
        if (row['pitch'] == ''){
        if(row['word'] != ''){
            xtext.push(row['time'])
            ytext.push(prev_y);
            words.push(row['word']);
        }
    }
    else {
        prev_y = row['pitch'];
        if(row['word'] != '') {
        xtext.push(row['time'])
        ytext.push(prev_y);
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
    setInterval(shiftPlot, 250);

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


