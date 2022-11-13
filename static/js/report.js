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
var path = "static/pitch/RITD.csv";

window.onload = function () {
    $.get( "/getmethod/<javascript_data>" );
}

document.getElementById("practice-test").onclick = () => {
    startPractice()
    console.log('starting practice')
}

document.getElementById("stop").onclick = () => {
    stopPractice();
    // console.log('stopping practice');
}

function stopPractice() {
    runPitch = false;
    stored_data = document.getElementById("myDiv").data[0]
    
    const file = createBlob(stored_data);
    saveAs(file, "static/myFile.txt");
    // console.log(recorder);
    // recorder.stopRecording();
    // let blob = recorder.getBlob();
    // invokeSaveAsDialog(blob);
}

function startPractice() {
    runPitch = true;
    setup();
};

// Pitch Detection

let mic;
let pitch;
let stream;

async function setup() {
    audioContext = new AudioContext();
    console.log('sample rate', audioContext.sampleRate)
    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    
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

    let recordStream = await navigator.mediaDevices.getUserMedia({canvas: true, audio: true});
    recorder = new RecordRTCPromisesHandler(document.getElementById('myDiv'), {
        type: 'audio'
    });
   
    startPitch(stream);
    requestAnimationFrame(draw);
}

function plotOrigPitch(path) {
    Plotly.d3.csv(path, function(data){ processData(data) } );
}

function startPitch(stream) {
    // read data from csv and plot the OG contour
    console.log('in startPitch');
    recorder.startRecording();
    plotOrigPitch(path);
    startTime = new Date();
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    setInterval(shiftPlot, 250);    // call to shift the plot every 500 ms
    pitch = ml5.pitchDetection('static/js/model', audioContext , stream, modelLoaded); // pitch detection
    
}

// function autoCorrelate( buf, sampleRate ) {
// 	// Implements the ACF2+ algorithm
// 	var SIZE = buf.length;
//     console.log('size', SIZE);
// 	var rms = 0;

// 	for (var i=0;i<SIZE;i++) {
// 		var val = buf[i];
// 		rms += val*val;
// 	}
// 	rms = Math.sqrt(rms/SIZE);
// 	if (rms<0.01) // not enough signal
// 		return -1;

// 	var r1=0, r2=SIZE-1, thres=0.2;
// 	for (var i=0; i<SIZE/2; i++)
// 		if (Math.abs(buf[i])<thres) { r1=i; break; }
// 	for (var i=1; i<SIZE/2; i++)
// 		if (Math.abs(buf[SIZE-i])<thres) { r2=SIZE-i; break; }

// 	buf = buf.slice(r1,r2);
// 	SIZE = buf.length;

// 	var c = new Array(SIZE).fill(0);
// 	for (var i=0; i<SIZE; i++)
// 		for (var j=0; j<SIZE-i; j++)
// 			c[i] = c[i] + buf[j]*buf[j+i];

// 	var d=0; while (c[d]>c[d+1]) d++;
// 	var maxval=-1, maxpos=-1;
// 	for (var i=d; i<SIZE; i++) {
// 		if (c[i] > maxval) {
// 			maxval = c[i];
// 			maxpos = i;
// 		}
// 	}
//     // console.log('maxpos', maxpos);
// 	var T0 = maxpos;

// 	var x1=c[T0-1], x2=c[T0], x3=c[T0+1];
// 	a = (x1 + x3 - 2*x2)/2;
// 	b = (x3 - x1)/2;
// 	if (a) T0 = T0 - b/(2*a);
//     // console.log('T0', T0);
// 	return sampleRate/T0;
// }

// function updatePitch() {
//     console.log('in updatePitch', audioContext, currentPitch, currentTime);
//     if (runPitch) {
//         tonic = 261.63;
//         pitchLims = [196, 783.99]
//         analyser.getFloatTimeDomainData( buf );
//         var ac = autoCorrelate( buf, audioContext.sampleRate );
//         // var ac = 0
//         // TODO: Paint confidence meter on canvasElem here.

//         if (ac == -1) {
//             currentPitch = null;
//             currentTime = (new Date() - startTime)/1000;
//         } else {
//     currentPitch = 1200*Math.log2(ac/tonic);
    
//     //if ((currentPitch < pitchLims[0]) | (currentPitch > pitchLims[1]))   currentPitch = null;
//     currentTime = (new Date() - startTime)/1000;
//         }
//         console.log('ac', ac, 'currentPitch', currentPitch, 'currentTime', currentTime);
    
// 	//rafID = window.requestAnimationFrame( updatePitch );
//     if (runPitch) setTimeout(function(){
//         updatePitch();
//     }, 10);
// }
// else{
//     clearInterval(pitchTimer);
//     // clearInterval(drawTimer);
// }
// }

function modelLoaded() {
    console.log('in callback')
    getPitch();
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

function draw() {
    
    Plotly.extendTraces('myDiv', {
                x: [[currentTime]], // the model detects pitches at every 0.01s by default
              y: [[currentPitch]]
            }, [0]);
    if (runPitch) {
        request = requestAnimationFrame(draw);
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
    pitch.getPitch(function(err, frequency) {
        tonic = 261.63; // hardcoded tonic for now, needs to be read from file
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


