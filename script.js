var audioContext = new AudioContext();
var isStop = false;
var isStart = false;
var isPlay = false;

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
  if (isStop || isStart || isPlay) {
    return;
  }

  createNodes();
  isStart = true;
  isPlay = true;
  updateStatus("Fade in...");

  tone.frequency.value = 440;
  gain.gain.value = 0.0001;

  pitchModulator.frequency.value = 1;
  pitchModulatorGain.gain.value = 0.0001;

  volumeModulator.frequency.value = 0.33;
  volumeModulatorGain.gain.value = 0.0001;

  tone.start();
  pitchModulator.start();
  volumeModulator.start();

  var fadeInDuration = 2;
  gain.gain.setTargetAtTime(0.1, audioContext.currentTime, fadeInDuration / 5);

  volumeModulatorGain.gain.setTargetAtTime(
    volumeModulatorDepth.value,
    audioContext.currentTime,
    fadeInDuration / 5
  );

  pitchModulatorGain.gain.setTargetAtTime(
    pitchModulatorDepth.value,
    audioContext.currentTime,
    fadeInDuration / 5
  )

  setTimeout(() => {
    isStart = false;
    updateStatus("Audio Playing");
  }, fadeInDuration * 1000);
}

function stop() {
  if (isStop || isStart || !isPlay) {
    return;
  }

  isStop = true;
  updateStatus("Fade out...");

  var fadeOutDuration = 3;

  gain.gain.setTargetAtTime(
    0.0001,
    audioContext.currentTime,
    fadeOutDuration / 5
  );

  volumeModulatorGain.gain.setTargetAtTime(
    0.0001,
    audioContext.currentTime,
    fadeOutDuration / 5
  );

  pitchModulatorGain.gain.setTargetAtTime(
    0.0001,
    audioContext.currentTime,
    fadeOutDuration / 5
  );

  setTimeout(() => {
    isStop = false;
    isPlay = false;
    updateStatus("Audio Stopped");
    tone.stop();
    pitchModulator.stop();
    volumeModulator.stop();
  }, (fadeOutDuration + 0.1) * 1000);
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
    if (isStart || isStop) {
      return;
    }
    var newFrequency = parseFloat(this.value);
    volumeModulator.frequency.linearRampToValueAtTime(
      newFrequency,
      audioContext.currentTime + 0.01
    );

    console.log(newFrequency);
  });

  volumeModulatorDepth.addEventListener("input", function () {
    if (isStart || isStop) {
      return;
    }
    var newDepth = parseFloat(this.value);

    volumeModulatorGain.gain.setTargetAtTime(
      newDepth, 
      audioContext.currentTime, 
      0.01
    );
    console.log(newDepth);
    
  });

  pitchModulatorFrequency.addEventListener("input", function () {
    if (isStart || isStop) {
      return;
    }
    var newFrequency = parseFloat(this.value);
    pitchModulator.frequency.linearRampToValueAtTime(
      newFrequency,
      audioContext.currentTime + 0.01
    );

    console.log(newFrequency);
  });

  pitchModulatorDepth.addEventListener("input", function () {
    if (isStart || isStop) {
      return;
    }
    var newDepth = parseFloat(this.value);
    pitchModulatorGain.gain.linearRampToValueAtTime(
      newDepth,
      audioContext.currentTime + 0.05
    );

    pitchModulatorGain.gain.setTargetAtTime(
      newDepth, 
      audioContext.currentTime, 
      0.01
    );

    console.log(newDepth);
  });
};

function updateStatus(statusText) {
  var statusElement = document.getElementById("status");
  statusElement.textContent = statusText;
}
