/**
 * Audio decoding and mono 16kHz resampling utilities
 * Uses browser Web Audio API (AudioContext & OfflineAudioContext)
 * Transfers Float32Array without server uploads
 */

export interface DecodedAudioResult {
  audioData: Float32Array;
  duration: number;
}

export async function decodeAudioToMono16kHz(audioBlob: Blob): Promise<DecodedAudioResult> {
  const arrayBuffer = await audioBlob.arrayBuffer();

  const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtxClass) {
    throw new Error('متصفحك لا يدعم Web Audio API المطلوب لمعالجة الصوت محلياً.');
  }

  const audioCtx = new AudioCtxClass();
  let decodedBuffer: AudioBuffer;

  try {
    decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (decodeErr: any) {
    audioCtx.close();
    throw new Error('تعذر فك تشفير الملف الصوتي. يرجى التأكد من أن الملف بصيغة مدعومة (WAV, MP3, WebM).');
  }

  const duration = decodedBuffer.duration;
  if (duration > 30.5) {
    audioCtx.close();
    throw new Error(`مدة المقطع الصوتي (${duration.toFixed(1)} ثانية) تتجاوز الحد الأقصى المسموح به محلياً وهو 30 ثانية.`);
  }

  // Resample and downmix to 16kHz mono using OfflineAudioContext
  const targetSampleRate = 16000;
  const targetLength = Math.ceil(duration * targetSampleRate);

  const offlineCtx = new OfflineAudioContext(1, targetLength, targetSampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = decodedBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  const renderedBuffer = await offlineCtx.startRendering();
  const monoChannel = renderedBuffer.getChannelData(0);

  audioCtx.close();

  return {
    audioData: monoChannel,
    duration,
  };
}
