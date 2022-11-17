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
var path = "static/pitch/RITD-100-0.csv";
var x = [];
var y = [];
var plot_ind = 1;
var counter = 3;
var incorrect = 0;
var correct = 0;

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
        yaxis: {
            range: [-500, 1900]
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

            
            document.getElementById('score').innerHTML = 'Score: ' + String(Math.round(((correct)/(correct + incorrect))*10)) + '/10'
        }
            // plot singer's pitch
    // fetch("/getmethod")
    // .then((response) => response.json())
    // .then((data) => { 
    //     Plotly.extendTraces('myDiv', {
    //             x: [data["x"]], 
    //             y: [data["y"]]
    //     }, [0]);
    //     for (var i = 0; i < data["x"].length; i++) { 
    //         // console.log(i)
    //         time_ind = x.findIndex(element => {
    //         if (element >= data["x"][i]) {
    //             return true;
    //           }
    //           return false;
    //         })
    //         orig_y = y[time_ind]
    //         // if (typeof orig_y === 'string' && orig_y.length !== 0 && !!data["y"][i]) {
    //         console.log(time_ind, orig_y, data["y"][i], (Math.abs(orig_y - data["y"][i]) <= 100))
    //         // if (counter >0) {
    //         //     // counter = 3;
    //         if ((Math.abs(orig_y - data["y"][i]) <= 200)) {
    //             // plot_ind = 1
    //             // Plotly.extendTraces('myDiv', {
    //             //         x: [[data["x"][i]]], 
    //             //         y: [[data["y"][i]]]
    //             // }, [1]);
    //             Plotly.extendTraces('myDiv', {
    //                     x: [[data["x"][i]]], 
    //                     y: [[null]]
    //             }, [1]);
    //             correct++;
    //         }
    //         else {
    //             incorrect++;
    //             Plotly.extendTraces('myDiv', {
    //                     x: [[data["x"][i]]], 
    //                     y: [[data["y"][i]]]
    //             }, [1]);
                
    //         }}
            // counter--;
            // console.log(counter, plot_ind)
            
        // }
//         document.getElementById('score').innerHTML = 'Score: ' + String(Math.round(((correct)/(correct + incorrect))*10)) + '/10'
//             // console.log(plot_ind, orig_y, data["y"][i], x[time_ind], data["x"][i])
// });

function processData(allRows) {

//    console.log(allRows);
   x = [], y = []
   var words = [], ytext = [], xtext = [];
   prev_y = 500;

   for (var i=0; i<allRows.length; i++) {
       row = allRows[i];
       x.push( parseFloat(row['time']));
       y.push( row['pitch'] );
    //    console.log(row['pitch'], (row['pitch'] !== null))
    //    console.log(i, row)
        // console.log('logging word: ', row['word'])
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
   }, [2]);
   Plotly.extendTraces('myDiv', {
    // mode: 'lines+text',
    x: [xtext], // the model detects pitches at every 0.01s by default
    y: [ytext],
    text: [words]
   }, [3]);
}


