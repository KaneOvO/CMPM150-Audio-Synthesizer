var audioContext = new AudioContext();

var tone,
  gain,
  pitchModulator,
  pitchModulatorGain,
  volumeModulator,
  volumeModulatorGain;

function createNodes() {
  tone = audioContext.createOscillator();
  gain = audioContext.createGain();
  tone.connect(gain);
  gain.connect(audioContext.destination);

  pitchModulator = audioContext.createOscillator();
  pitchModulatorGain = audioContext.createGain();
  pitchModulator.connect(pitchModulatorGain);
  pitchModulatorGain.connect(tone.frequency);

  volumeModulator = audioContext.createOscillator();
  volumeModulatorGain = audioContext.createGain();
  volumeModulator.connect(volumeModulatorGain);
  volumeModulatorGain.connect(gain.gain);
}

function start() {
  createNodes();

  tone.frequency.value = 440;
  gain.gain.value = 0.1;

  pitchModulator.frequency.value = 1;
  pitchModulatorGain.gain.value = 220;

  volumeModulator.frequency.value = 0.33;
  volumeModulatorGain.gain.value = 0.1;

  tone.start();
  pitchModulator.start();
  volumeModulator.start();
}

function stop() {
  tone.stop();
  pitchModulator.stop();
  volumeModulator.stop();
}

window.onload = function () {
  var startButton = document.getElementById("start");
  var stopButton = document.getElementById("stop");

  startButton.addEventListener("click", function () {
    start();
  });

  stopButton.addEventListener("click", function () {
    stop();
  });

  volumeModulatorFrequency.addEventListener("input", function () {
    var newFrequency = parseFloat(this.value);
    volumeModulator.frequency.linearRampToValueAtTime(
      newFrequency,
      audioContext.currentTime + 0.01
    );
  });

  volumeModulatorDepth.addEventListener("input", function () {
    var newDepth = parseFloat(this.value);
    volumeModulatorGain.gain.linearRampToValueAtTime(
      newDepth,
      audioContext.currentTime + 0.01
    );
  });

  pitchModulatorFrequency.addEventListener("input", function () {
    var newFrequency = parseFloat(this.value);
    pitchModulator.frequency.linearRampToValueAtTime(
      newFrequency,
      audioContext.currentTime + 0.01
    );
  });

  pitchModulatorDepth.addEventListener("input", function () {
    var newDepth = parseFloat(this.value);
    pitchModulatorGain.gain.linearRampToValueAtTime(
      newDepth,
      audioContext.currentTime + 0.01
    );
  });
};
