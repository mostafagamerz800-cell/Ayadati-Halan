import { pipeline, env } from '@xenova/transformers';

// Configure transformers.js for client-side single-threaded browser WASM execution
// Single threaded is critical for iframe execution without cross-origin isolation (SharedArrayBuffer)
env.allowLocalModels = false;
env.useBrowserCache = true;

if (env.backends && env.backends.onnx && env.backends.onnx.wasm) {
  env.backends.onnx.wasm.numThreads = 1;
}

let transcriber: any = null;
let isLoading = false;

self.addEventListener('message', async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === 'load_model') {
    if (transcriber) {
      self.postMessage({ type: 'model_ready' });
      return;
    }

    if (isLoading) {
      return;
    }

    isLoading = true;
    self.postMessage({ type: 'loading_started' });

    try {
      // Use multilingual Xenova/whisper-tiny (NOT .en), quantized: true
      transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-tiny',
        {
          quantized: true,
          progress_callback: (progressData: any) => {
            self.postMessage({
              type: 'download_progress',
              payload: progressData,
            });
          },
        }
      );

      isLoading = false;
      self.postMessage({ type: 'model_ready' });
    } catch (err: any) {
      isLoading = false;
      transcriber = null;
      self.postMessage({
        type: 'model_error',
        error: err?.message || 'فشل في تحميل النموذج من المزود الخارجي / CDN',
      });
    }
  }

  if (type === 'transcribe') {
    if (!transcriber) {
      self.postMessage({
        type: 'transcribe_error',
        error: 'النموذج غير محمل بعد. يرجى تحميل النموذج أولاً.',
      });
      return;
    }

    const { audioData, language } = payload; // audioData is Float32Array at 16kHz

    try {
      self.postMessage({ type: 'transcribe_started' });

      // Run local whisper pipeline on Float32Array with task: 'transcribe'
      const result = await transcriber(audioData, {
        language: language || 'ar',
        task: 'transcribe',
        chunk_length_s: 30,
        return_timestamps: false,
      });

      const rawText = (result?.text || '').trim();

      self.postMessage({
        type: 'transcribe_success',
        payload: {
          text: rawText,
        },
      });
    } catch (err: any) {
      self.postMessage({
        type: 'transcribe_error',
        error: err?.message || 'حدث خطأ أثناء معالجة الصوت محلياً على الجهاز.',
      });
    }
  }
});
