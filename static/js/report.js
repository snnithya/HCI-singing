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
let currentTime = 0;
let startTime = 0;
let audioContext;
var recorder;
var buflen = 2048;
var buf = new Float32Array( buflen );
var pitchTimer = null;
var drawTimer = null;
var path = "../static/pitch/RITD-100-0.csv";
var x = [];
var y = [];
var plot_ind = 1;
var counter = 3;
var incorrect = 0;
var correct = 0;

window.onload = function() {
    csv_path = localStorage.getItem('csv_path');
    tempoScalingVal = localStorage.getItem('tempoScalingVal');
    tonic = parseFloat(localStorage.getItem('tonic'));
    yticks = JSON.parse(localStorage.getItem('yticks'));
    setup();
}

// Pitch Detection

let mic;
let pitch;
let stream;

async function setup() {
    
    // initialise plots
    await Plotly.newPlot('myDiv', 
    [{ // correct plots
        type: 'scatter',
        mode: 'lines',
        x:Array.from(Array(10).keys()),
        y:Array(10).fill(null),
        line: {
            color: 'rgb(0, 128, 0)'
        }

    },
        { // incorrect plots
        mode: 'lines',
        x:Array.from(Array(10).keys()),
        y:Array(10).fill(null),
        line: {
            color: 'rgb(128, 0, 0)'
        }
       
    },
    {
    mode: 'lines',
        x:Array.from(Array(10).keys()),
        y:Array(10).fill(null),
        text: Array(10).fill('lala'),
        textposition: top,
        line: {
            color: 'rgb(128, 128, 128)'
        }
    },
    {
    mode: 'text',
    x:Array.from(Array(10).keys()),
    y:Array(10).fill(null),
        text: Array(10).fill('lala')
    },
    ], 
    {
        xaxis: {
            width: 3
        },
        yaxis: {
            range: [-500, 1900],
            tickvals: [-400, -200, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800],
            ticktext: yticks
        }
    });
   
    plotPitch();
}

function plotOrigPitch(path) {
    Plotly.d3.csv(path, function(data){ processData(data) } );
}

function plotPitch() {
    // read data from csv and plot the OG contour
    plotOrigPitch(csv_path);
    data = JSON.parse(localStorage.getItem('stored_data'));
    Plotly.extendTraces('myDiv', {
                    x: [data["x"]], 
                    y: [data["y"]]
            }, [0]);
            for (var i = 0; i < data["x"].length; i++) { 
                // console.log(i)
                time_ind = x.findIndex(element => {
                if (element >= data["x"][i]) {
                    return true;
                  }
                  return false;
                })
                orig_y = y[time_ind]
                // if (typeof orig_y === 'string' && orig_y.length !== 0 && !!data["y"][i]) {
                console.log(time_ind, orig_y, data["y"][i], (Math.abs(orig_y - data["y"][i]) <= 100))
                // if (counter >0) {
                //     // counter = 3;
                if ((Math.abs(orig_y - data["y"][i]) <= 200)) {
                    // plot_ind = 1
                    // Plotly.extendTraces('myDiv', {
                    //         x: [[data["x"][i]]], 
                    //         y: [[data["y"][i]]]
                    // }, [1]);
                    Plotly.extendTraces('myDiv', {
                            x: [[data["x"][i]]], 
                            y: [[null]]
                    }, [1]);
                    correct++;
                }
                else {
                    incorrect++;
                    Plotly.extendTraces('myDiv', {
                            x: [[data["x"][i]]], 
                            y: [[data["y"][i]]]
                    }, [1]);

                }}
                counter--;
                console.log(counter, plot_ind)

            
            document.getElementById('score').innerHTML = 'Score: ' + String(Math.min(Math.round(((correct)/(correct + incorrect))*10) + 5, 10)) + '/10'

            Plotly.relayout('myDiv', {
                xaxis: {
                    width: 3
                }
            });
        }


function processData(allRows) {

//    console.log(allRows);
   x = [], y = []
   var words = [], ytext = [], xtext = [];
   prev_y = 500;

   for (var i=0; i<allRows.length; i++) {
       row = allRows[i];
       x.push( parseFloat(row['time']) * tempoScalingVal);
       y.push( row['pitch'] );
    //    console.log(row['pitch'], (row['pitch'] !== null))
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
    // mode: 'lines+text',
    x: [x], // the model detects pitches at every 0.01s by default
    y: [y],
   }, [2]);
//    Plotly.extendTraces('myDiv', {
//     // mode: 'lines+text',
//     x: [xtext], // the model detects pitches at every 0.01s by default
//     y: [ytext],
//     text: [words]
//    }, [3]);
}


