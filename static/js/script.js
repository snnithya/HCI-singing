// import Sequencer from './sequencer'; 
var vizPlayer = new mm.Player();


//globals
let envelope;
let buttons = new Map();
let notes = new Map();
let current_tab;
// let notes = undefined;
let current_col;
let prev;
let score = 0;
let current_note;
let detected;
let runPitch = false;

// function practice1_notes(){
//     return {notes: [
//             { pitch: 60, startTime: 0.0, endTime: 2.0 },
//             { pitch: 62, startTime: 2.0, endTime: 4.0 },
//             { pitch: 64, startTime: 4.0, endTime: 6.0 },
//             { pitch: 62, startTime: 6.0, endTime: 8.0 },
//             { pitch: 60, startTime: 8.0, endTime: 10.0 },
//             { pitch: 62, startTime: 10.0, endTime: 12.0 },
//             { pitch: 64, startTime: 12.0, endTime: 14.0 },
//         ],
//         tempos: [{
//             time: 0, 
//             qpm: 120
//             }],
//             totalTime: 14.0
//         };
// }


// function practice2_notes(){
//     return {notes: [
//             { pitch: 60, startTime: 0.0, endTime: 3.0 },
//             { pitch: 62, startTime: 3.0, endTime: 6.0 },
//             { pitch: 64, startTime: 6.0, endTime: 9.0 },
//             { pitch: 60, startTime: 9.0, endTime: 12.0 },
//             { pitch: 62, startTime: 12.0, endTime: 15.0 },
//             { pitch: 64, startTime: 15.0, endTime: 18.0 },
//         ],
//         tempos: [{
//             time: 0, 
//             qpm: 120
//             }],
//             totalTime: 18.0
//         };
// }

// function practice3_notes(){
//     return {notes: [
//             { pitch: 60, startTime: 0.0, endTime: 3.0 },
//             { pitch: 62, startTime: 3.0, endTime: 6.0 },
//             { pitch: 64, startTime: 6.0, endTime: 9.0 },
//             { pitch: 62, startTime: 9.0, endTime: 12.0 },
//             { pitch: 60, startTime: 12.0, endTime: 15.0 },
//             { pitch: 62, startTime: 15.0, endTime: 18.0 },
//             { pitch: 64, startTime: 18.0, endTime: 21.0 },
//             { pitch: 62, startTime: 21.0, endTime: 24.0 },
//             { pitch: 60, startTime: 24.0, endTime: 27.0 },
//         ],
//         tempos: [{
//             time: 0, 
//             qpm: 120
//             }],
//             totalTime: 27.0
//         };
// }

// async function generateNotes(sequencer) {
//     await rnnLoaded;
//     let seed = {
//         notes: [
//             { pitch: 60, startTime: 0.0, endTime: 4.0 },
//             { pitch: 62, startTime: 4.0, endTime: 8.0 },
//             { pitch: 64, startTime: 8.0, endTime: 12.0 },
//             { pitch: 62, startTime: 12.0, endTime: 16.0 },
//             { pitch: 60, startTime: 16.0, endTime: 20.0 },
//             { pitch: 62, startTime: 4.0, endTime: 8.0 },
//             { pitch: 64, startTime: 8.0, endTime: 12.0 },
//             { pitch: 62, startTime: 12.0, endTime: 16.0 },
//             { pitch: 60, startTime: 16.0, endTime: 20.0 },
//         ],
//         tempos: [{
//         time: 0, 
//         qpm: 120
//         }],
//         totalTime: 3.0
//     };
    
//     var rnn_steps = 124; // (time span detection: rnn_steps-10)
//     var rnn_temp = 0;
//     var chord_prog = ['C'];
//     const qns = mm.sequences.quantizeNoteSequence(seed, 1);

//     var notes = await melodyRnn.continueSequence(qns, rnn_steps, rnn_temp, chord_prog);
//     return notes
// };

document.getElementById("practice-test").onclick = () => {;
    // current_tab = "test1";
    startPractice()
    console.log('starting practice')
}

// document.getElementById("practice-2").onclick = () => {
//     current_tab = "test4";
//     startPractice("test4")
// }

// document.getElementById("practice-3").onclick = () => {
//     current_tab = "test5";
//     startPractice("test5")
// }

function startPractice() {
    // sequencer = sequencers.get(sequencer_id);
    // envelope = new Envelope('envelope');
    // sequencerStop();
    // sequencer.resetSequencer();
    // sequencer.resetCounter(); 
    runPitch = true;
    setup();
    // vizPlayer = new mm.Player(false, {
    // run: (note) => {
    //     current_col += 1;
    //     sequencer.next();
    //     detected = false;
    //     current_note = note;
    // },
    // stop: () => {
    //     sequencerStop();
    // }
    // });

    // vizPlayer.start(notes.get(current_tab));
};

// Pitch Detection
let audioContext;
let mic;
let pitch;
let stream;

async function setup() {
    const audioContext = new AudioContext();
    console.log('sample rate', audioContext.sampleRate)
    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    console.log(audioContext, stream);
    
    //console.log(orig_x, orig_y);
    await Plotly.newPlot('myDiv', 
    [{
        x:Array.from(Array(10).keys()),
        y:Array(10).fill(null)
    },
{
    x:Array.from(Array(10).keys()),
    y:Array(10).fill(null)
}], 
{
    yaxis: {
        range: [-500, 1900]
    },
    xaxis: {
        range: [0, 10]
    }
});
   
    startPitch(stream, audioContext);
}

function startPitch(stream, audioContext) {
   
    Plotly.d3.csv("static/pitch/Rolling In The Deep.csv", function(data){ processData(data) } );
    pitch = ml5.pitchDetection('static/js/model', audioContext , stream, modelLoaded); // not sure what the sample rate is
}

function modelLoaded() {
    ind = 300
    console.log('in callback')
    getPitch(ind);
}
   
function processData(allRows) {

   console.log(allRows);
   var x = [], y = [];

   for (var i=0; i<allRows.length; i++) {
       row = allRows[i];
       x.push( parseFloat(row['time']) + 3);
       y.push( row['pitch'] );
   }
   console.log( 'X',x, 'Y',y );
   Plotly.extendTraces('myDiv', {
       x: [x], // the model detects pitches at every 0.01s by default
     y: [y]
   }, [1]);
}

function getPitch(ind) {
    pitch.getPitch(function(err, frequency) {
        tonic = 261.63
        console.log(err, frequency)
        ind++;
        if (frequency) {
            Plotly.extendTraces('myDiv', {
                x: [[(ind*0.01)]], // the model detects pitches at every 0.01s by default
              y: [[1200*Math.log2(frequency/tonic)*(100/100)]]
            }, [0]);
        }
        else{
            Plotly.extendTraces('myDiv', {
                x: [[(ind*0.01)]],
              y: [[null]]
            }, [0]);
        }
        if (ind % 100) {
            console.log('ind update', ind)
            Plotly.relayout('myDiv', {
                xaxis: {
                    range: [(ind/100)-3, (ind/100)+7]
                }
            });
        }
        if(runPitch) getPitch(ind);
    })
}


document.getElementById("stop").onclick = async () => {
    sequencerStop();
    vizPlayer.stop();
};

document.getElementById("stop-2").onclick = async () => {
    sequencerStop();
    vizPlayer.stop();
};

document.getElementById("stop-3").onclick = async () => {
    sequencerStop();
    vizPlayer.stop();
};

function toggleButton(id){
    var x = document.getElementById(id);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function sequencerStop(){
    localStorage.setItem(score_label(), score);
    current_col = 0;
    prev = null;
    runPitch = false;
    score = 0;
    toggleButton(buttons.get(current_tab)["stop"]);
    toggleButton(buttons.get(current_tab)["practice"]);
}

function score_label(){
    return `#${current_tab}-score`
}

// Lesson Sections
var el = document.querySelector('.tabs');
var instance = M.Tabs.init(el, {});

document.getElementById("tabs-button-1").onclick = () => { 
    document.getElementById('tab2').classList.remove("disabled")
    var el = document.querySelector('.tabs');
    var instance = M.Tabs.init(el, {});
    instance.select('tab2');
    instance.updateTabIndicator();
}
document.getElementById("tabs-button-2").onclick = () => { 
    document.getElementById('tab3').classList.remove("disabled")
    var el = document.querySelector('.tabs');
    var instance = M.Tabs.init(el, {});
    instance.select('tab3');
    instance.updateTabIndicator();
}
document.getElementById("tabs-button-3").onclick = () => { 
    document.getElementById('tab4').classList.remove("disabled")
    var el = document.querySelector('.tabs');
    var instance = M.Tabs.init(el, {});
    instance.select('tab4');
    instance.updateTabIndicator();
}
document.getElementById("tabs-button-4").onclick = () => { 
    document.getElementById('tab5').classList.remove("disabled")
    var el = document.querySelector('.tabs');
    var instance = M.Tabs.init(el, {});
    instance.select('tab5');
    instance.updateTabIndicator();
}
