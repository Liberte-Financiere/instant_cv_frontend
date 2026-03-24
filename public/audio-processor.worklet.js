class AudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this._buffer = [];
    this._inputSampleRate = options.processorOptions?.sampleRate || 48000;
    this._targetSampleRate = 16000;
    this._ratio = this._inputSampleRate / this._targetSampleRate;
    
    // VAD (Voice Activity Detection) state using AudioContext currentTime (in seconds)
    this._lastVoiceTime = currentTime;
    this._isSilent = false;
    this._silenceThreshold = 0.01; // Tune based on mic sensitivity
  }

  process(inputs) {
    const input = inputs[0]?.[0];
    if (!input) return true;

    // 1. Calculate RMS for VAD
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
      sum += input[i] * input[i];
    }
    const rms = Math.sqrt(sum / input.length);

    const wasSilent = this._isSilent;

    if (rms >= this._silenceThreshold) {
      this._lastVoiceTime = currentTime;
      this._isSilent = false;
    } else if (currentTime - this._lastVoiceTime > 1.5) { // 1.5 seconds of silence
      this._isSilent = true;
    }

    // 2. Downsample from input sample rate to 16kHz
    for (let i = 0; i < input.length; i += this._ratio) {
      this._buffer.push(input[Math.floor(i)]);
    }

    const forceFlush = wasSilent && !this._isSilent && this._buffer.length > 0;
    
    // 3. Adaptive Buffering Thresholds
    // Speaking: send every ~250ms (4000 samples at 16kHz) for low latency
    // Silent: send every ~1000ms (16000 samples at 16kHz) to reduce network spam
    const flushThreshold = this._isSilent ? 16000 : 4000;

    if (this._buffer.length >= flushThreshold || forceFlush) {
      const chunk = new Float32Array(this._buffer.splice(0, this._buffer.length));
      this.port.postMessage({ pcm: chunk });
    }

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
