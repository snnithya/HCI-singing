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
var recorder;
var buflen = 2048;
var buf = new Float32Array( buflen );
var pitchTimer = null;
var drawTimer = null;
var path = "static/pitch/RITD-100-0.csv";

window.onload = function() {
    setup();
}

// Pitch Detection

let mic;
let pitch;
let stream;

async function setup() {
    
    // initialise plots
    await Plotly.newPlot('myDiv', 
    [{
        
        x:Array.from(Array(10).keys()),
        y:Array(10).fill(null)
       
    },
    {
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
        }
        // shapes: [

        // //line vertical

        // {
        // type: 'line',
        // x0: 0,
        // y0: -500,
        // x1: 0,
        // y1: 1900,
        // line: {
        //     color: 'rgb(55, 128, 191)',
        //     width: 3
        // }
        // }]
    });
   
    plotPitch();
}

function plotOrigPitch(path) {
    Plotly.d3.csv(path, function(data){ processData(data) } );
}

function plotPitch() {
    // read data from csv and plot the OG contour
    plotOrigPitch(path);

    // plot singer's pitch
    fetch("/getmethod")
    .then((response) => response.json())
    .then((data) => Plotly.extendTraces('myDiv', {
        x: [data["x"]], 
      y: [data["y"]]
    }, [0]));

    
}

function processData(allRows) {

   console.log(allRows);
   var x = [], y = [], words = [], ytext = [], xtext = [];
   prev_y = 500;

   for (var i=0; i<allRows.length; i++) {
       row = allRows[i];
       x.push( parseFloat(row['time']));
       y.push( row['pitch'] );
       console.log(i, row)
        console.log('logging word: ', row['word'])
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
   console.log( 'X',x, 'Y',y, 'words', words );
   Plotly.extendTraces('myDiv', {
    // mode: 'lines+text',
    x: [x], // the model detects pitches at every 0.01s by default
    y: [y],
   }, [1]);
   Plotly.extendTraces('myDiv', {
    // mode: 'lines+text',
    x: [xtext], // the model detects pitches at every 0.01s by default
    y: [ytext],
    text: [words]
   }, [2]);
}


