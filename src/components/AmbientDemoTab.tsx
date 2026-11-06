import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Upload,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Cpu,
  FileText,
  Volume2,
  Sparkles,
  ShieldAlert,
  Loader2,
  FileCheck2,
  Database,
  Clock,
  Timer
} from 'lucide-react';
import { decodeAudioToMono16kHz } from '../utils/audioProcessing';
import { parseTranscriptDeterministically, StructuredDraft } from '../utils/rulesParser';

export const AmbientDemoTab: React.FC = () => {
  // 1. Synthetic Trial Consent
  const [hasConfirmedTrial, setHasConfirmedTrial] = useState(false);

  // 2. Model Loading State (Worker)
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState<{ file?: string; progress?: number; status?: string } | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);

  // 3. Audio Recording, Permission, Finalizing & Web Audio Playback State
  const [isWaitingForMicPermission, setIsWaitingForMicPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFinalizingRecording, setIsFinalizingRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [decodedDuration, setDecodedDuration] = useState<number | null>(null);
  const [audioSourceType, setAudioSourceType] = useState<'mic' | 'file' | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'ar' | 'en'>('ar');
  const [audioError, setAudioError] = useState<string | null>(null);

  // Web Audio API Primary Playback State
  const [isPlayingWebAudio, setIsPlayingWebAudio] = useState(false);
  const [isPreparingWebAudio, setIsPreparingWebAudio] = useState(false);

  // 4. Transcription & Benchmark State
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [rawAsrText, setRawAsrText] = useState<string>('');
  const [editedTranscript, setEditedTranscript] = useState<string>('');
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [inferenceElapsedSeconds, setInferenceElapsedSeconds] = useState<string | null>(null);

  // 5. Deterministic Rules Draft State
  const [structuredDraft, setStructuredDraft] = useState<StructuredDraft | null>(null);
  const [isReviewedLocally, setIsReviewedLocally] = useState(false);

  // 6. Isolated Simulation Scenario Preview State (does not touch real recording flow)
  const [showSimScenario, setShowSimScenario] = useState(false);
  const [simSoap, setSimSoap] = useState({
    s: 'المريض يشكو من كحة ناشفة وصداع منذ ٣ أيام، مع إرهاق عام. ينفي وجود سخونية أو ضيق تنفس أو ألم بالصدر (معنديش سخونية ولا نهجان).',
    o: 'العلامات الحيوية (تجريبي): الضغط 120/80 mmHg | النبض 76 bpm | الحرارة 37.1 °C | السكر العشوائي 108 mg/dL. فحص الصدر: التهاب بسيط بالشعب الهوائية الهوائية العليا دون أزيز.',
    a: 'التهاب حاد في الجهاز التنفسي العلوي وتهيج شعبي بسيط (Acute Upper Respiratory Tract Infection - Simulated ICD-10: J06.9).',
    p: '١. راحة تامة وشرب سوائل دافئة بكثرة.\n٢. باراسيتامول 500 ملجم قرص عند اللزوم (تجريبي).\n٣. طلب صورة دم كاملة CBC في حال استمرار الأعراض أكثر من ٥ أيام، ومتابعة بعد أسبوع (استشارة).'
  });

  // Ref-backed state for safe cleanup avoiding stale closures and post-unmount setState
  const isMountedRef = useRef<boolean>(true);
  const workerRef = useRef<Worker | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const micPermissionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const micRequestIdRef = useRef<number>(0);
  const activeMicRequestRef = useRef<number | null>(null);
  const stopRecordingRef = useRef<() => void>(() => {});
  const audioChunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const decodedPcmRef = useRef<Float32Array | null>(null);
  const playbackAudioCtxRef = useRef<AudioContext | null>(null);
  const playbackSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const inferenceStartRef = useRef<number | null>(null);

  // Composite busy flag (includes permission wait and recording finalization/decode)
  const isBusy =
    isWaitingForMicPermission ||
    isRecording ||
    isFinalizingRecording ||
    isTranscribing ||
    isModelLoading;

  const clearMicPermissionWaitTimer = () => {
    if (micPermissionTimeoutRef.current) {
      clearTimeout(micPermissionTimeoutRef.current);
      micPermissionTimeoutRef.current = null;
    }
  };

  const stopWebAudioPlayback = () => {
    if (playbackSourceRef.current) {
      try {
        playbackSourceRef.current.onended = null;
        playbackSourceRef.current.stop();
        playbackSourceRef.current.disconnect();
      } catch {}
      playbackSourceRef.current = null;
    }
    if (playbackAudioCtxRef.current) {
      try {
        if (playbackAudioCtxRef.current.state !== 'closed') {
          playbackAudioCtxRef.current.close();
        }
      } catch {}
      playbackAudioCtxRef.current = null;
    }
    if (isMountedRef.current) {
      setIsPlayingWebAudio(false);
      setIsPreparingWebAudio(false);
    }
  };

  const stopAnyActiveRecording = () => {
    clearMicPermissionWaitTimer();
    activeMicRequestRef.current = null;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Initialize Web Worker with ref-backed cleanup
  useEffect(() => {
    isMountedRef.current = true;

    try {
      const worker = new Worker(
        new URL('../workers/asrWorker.ts', import.meta.url),
        { type: 'module' }
      );

      worker.onmessage = (event: MessageEvent) => {
        if (!isMountedRef.current) return;
        const { type, payload, error } = event.data;

        if (type === 'loading_started') {
          setIsModelLoading(true);
          setModelError(null);
        } else if (type === 'download_progress') {
          setModelProgress(payload);
        } else if (type === 'model_ready') {
          setIsModelLoading(false);
          setIsModelLoaded(true);
          setModelProgress(null);
          setModelError(null);
        } else if (type === 'model_error') {
          setIsModelLoading(false);
          setIsModelLoaded(false);
          setModelError(error || 'فشل في تحميل النموذج من المزود الخارجي / CDN.');
        } else if (type === 'transcribe_started') {
          setIsTranscribing(true);
          setTranscribeError(null);
        } else if (type === 'transcribe_success') {
          setIsTranscribing(false);

          // Calculate elapsed inference time around decode + model inference
          if (inferenceStartRef.current !== null) {
            const elapsed = (performance.now() - inferenceStartRef.current) / 1000;
            setInferenceElapsedSeconds(elapsed.toFixed(2));
            inferenceStartRef.current = null;
          }

          const text = (payload?.text || '').trim();
          setRawAsrText(text);
          setEditedTranscript(text);
          setIsReviewedLocally(false);

          if (!text) {
            setTranscribeError('لم يتم التقاط أي نص صوتي واضح (صمت أو دقة منخفضة). يرجى التحدث بوضوح وإعادة المحاولة.');
          }
        } else if (type === 'transcribe_error') {
          setIsTranscribing(false);
          inferenceStartRef.current = null;
          setTranscribeError(error || 'حدث خطأ أثناء معالجة الصوت محلياً على الجهاز.');
        }
      };

      // Add worker.onerror to clear loading/transcribing flags on unexpected worker failure
      worker.onerror = (err) => {
        if (!isMountedRef.current) return;
        setIsModelLoading(false);
        setIsTranscribing(false);
        inferenceStartRef.current = null;
        setModelError(`خطأ في معالج Web Worker: ${err.message || 'فشل غير متوقع في المعالج المحلي'}`);
        setTranscribeError('تعذرت معالجة الصوت في Web Worker.');
      };

      workerRef.current = worker;
    } catch (e: any) {
      if (isMountedRef.current) {
        setModelError(`تعذر تهيئة Web Worker في هذا المتصفح: ${e?.message}`);
      }
    }

    return () => {
      // Safe cleanup on unmount
      isMountedRef.current = false;
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      stopWebAudioPlayback();
      stopAnyActiveRecording();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  // Explicit Model Load Trigger with immediate double-click lock
  const handleLoadModel = () => {
    if (isBusy || isModelLoaded || !workerRef.current) return;
    setIsModelLoading(true); // Immediate lock to prevent double clicks
    setModelError(null);
    workerRef.current.postMessage({ type: 'load_model' });
  };

  // Cancel waiting for microphone permission
  const handleCancelMicPermission = () => {
    clearMicPermissionWaitTimer();
    activeMicRequestRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (isMountedRef.current) {
      setIsWaitingForMicPermission(false);
      setAudioError('تم إلغاء انتظار إذن الميكروفون.');
    }
  };

  // Stop Recording logic relying on mediaRecorderRef state (not stale React state)
  const handleStopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      if (isMountedRef.current) {
        setIsFinalizingRecording(true);
        setIsRecording(false);
      }
      try {
        recorder.stop();
      } catch {
        if (isMountedRef.current) {
          setIsFinalizingRecording(false);
        }
      }
    } else {
      if (isMountedRef.current) {
        setIsRecording(false);
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Keep stopRecordingRef updated on every render so the 30s interval always calls fresh stop logic
  stopRecordingRef.current = handleStopRecording;

  // Start Mic Recording with 20s permission timeout, cancel button, and leak-proof stream cleanup
  const handleStartRecording = async () => {
    if (isBusy || !hasConfirmedTrial) {
      if (!hasConfirmedTrial && isMountedRef.current) {
        setAudioError('يرجى تأكيد إقرار التجربة التمثيلية قبل تشغيل الميكروفون.');
      }
      return;
    }

    // Stop any active playback before recording
    stopWebAudioPlayback();

    // Clear prior states
    setAudioError(null);
    setTranscribeError(null);
    setRawAsrText('');
    setEditedTranscript('');
    setStructuredDraft(null);
    setIsReviewedLocally(false);
    setInferenceElapsedSeconds(null);
    setDecodedDuration(null);
    decodedPcmRef.current = null;

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setAudioSourceType('mic');
    setSelectedFileName(null);
    setRecordSeconds(0);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setAudioError('متصفحك لا يدعم تسجيل الصوت أو أن إذن الميكروفون غير مفعل في هذا الإطار (iframe).');
      return;
    }

    const requestId = ++micRequestIdRef.current;
    activeMicRequestRef.current = requestId;
    setIsWaitingForMicPermission(true);

    clearMicPermissionWaitTimer();
    micPermissionTimeoutRef.current = setTimeout(() => {
      if (activeMicRequestRef.current === requestId) {
        activeMicRequestRef.current = null;
        micPermissionTimeoutRef.current = null;
        if (isMountedRef.current) {
          setIsWaitingForMicPermission(false);
          setAudioError(
            'انتهت مهلة انتظار إذن الميكروفون (20 ثانية). يرجى الموافقة على إذن الميكروفون من المتصفح ثم المحاولة مجدداً، أو استخدام خيار اختيار ملف محلي.'
          );
        }
      }
    }, 20000);

    let acquiredStream: MediaStream | null = null;

    try {
      acquiredStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      clearMicPermissionWaitTimer();

      // If unmounted, cancelled, or timed out while getUserMedia was pending, stop all tracks immediately
      if (!isMountedRef.current || activeMicRequestRef.current !== requestId) {
        acquiredStream.getTracks().forEach((track) => track.stop());
        return;
      }

      activeMicRequestRef.current = null;
      setIsWaitingForMicPermission(false);
      streamRef.current = acquiredStream;

      const mediaRecorder = new MediaRecorder(acquiredStream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (!isMountedRef.current) return;

        setIsRecording(false);
        setIsFinalizingRecording(true);

        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });

        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
        }
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;

        if (!isMountedRef.current) {
          URL.revokeObjectURL(url);
          audioUrlRef.current = null;
          return;
        }

        setAudioBlob(blob);
        setAudioUrl(url);

        // Accurately decode recorded blob to obtain true duration and cache PCM for Web Audio playback
        try {
          const { audioData, duration } = await decodeAudioToMono16kHz(blob);
          if (!isMountedRef.current) return;
          decodedPcmRef.current = audioData;
          setDecodedDuration(duration);
        } catch (decodeErr: any) {
          if (!isMountedRef.current) return;
          decodedPcmRef.current = null;
          setAudioError(decodeErr?.message || 'تعذر فك تشفير المقطع الصوتي المسجل.');
        } finally {
          if (isMountedRef.current) {
            setIsFinalizingRecording(false);
          }
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordSeconds(0);

      // 30 seconds auto-stop timer invoking stopRecordingRef.current
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        if (!isMountedRef.current) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return;
        }
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordSeconds(elapsed);
        if (elapsed >= 30) {
          stopRecordingRef.current();
        }
      }, 250);
    } catch (err: any) {
      clearMicPermissionWaitTimer();

      // Clean up stream if MediaRecorder creation or start failed
      if (acquiredStream) {
        acquiredStream.getTracks().forEach((track) => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (!isMountedRef.current) return;

      // If request was already cancelled or timed out, do not overwrite message
      if (activeMicRequestRef.current !== requestId) {
        return;
      }

      activeMicRequestRef.current = null;
      setIsWaitingForMicPermission(false);
      setIsRecording(false);
      setIsFinalizingRecording(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setAudioError('تم رفض إذن الوصول للميكروفون من قِبل المتصفح أو الإطار (iframe). يمكنك تجربة "اختيار ملف تمثيلي من جهازك" أدناه كبديل محلي يعمل فوراً.');
      } else if (err.name === 'NotFoundError') {
        setAudioError('لم يتم العثور على ميكروفون متصل بجهازك. يمكنك استخدام خيار اختيار ملف محلي.');
      } else {
        setAudioError(`خطأ في الوصول للميكروفون: ${err.message || err.name}. يمكنك تجربة خيار اختيار ملف محلي.`);
      }
    }
  };

  // Primary Web Audio API Playback (AudioBufferSourceNode)
  const handlePlayWebAudio = async () => {
    if (!audioBlob || isPreparingWebAudio) return;

    // Stop any previous Web Audio playback
    stopWebAudioPlayback();

    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) {
      if (isMountedRef.current) {
        setAudioError('متصفحك لا يدعم Web Audio API لتشغيل الصوت.');
      }
      return;
    }

    setIsPreparingWebAudio(true);
    setAudioError(null);

    try {
      let pcmData = decodedPcmRef.current;
      if (!pcmData || pcmData.length === 0) {
        const decoded = await decodeAudioToMono16kHz(audioBlob);
        if (!isMountedRef.current) return;
        pcmData = decoded.audioData;
        decodedPcmRef.current = pcmData;
        setDecodedDuration(decoded.duration);
      }

      const audioCtx: AudioContext = new AudioCtxClass();
      playbackAudioCtxRef.current = audioCtx;

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      if (!isMountedRef.current || playbackAudioCtxRef.current !== audioCtx) {
        try {
          audioCtx.close();
        } catch {}
        return;
      }

      const sampleRate = 16000;
      const audioBuffer = audioCtx.createBuffer(1, pcmData.length, sampleRate);
      audioBuffer.getChannelData(0).set(pcmData);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);

      source.onended = () => {
        if (playbackSourceRef.current === source) {
          stopWebAudioPlayback();
        }
      };

      playbackSourceRef.current = source;
      source.start(0);

      if (isMountedRef.current) {
        setIsPreparingWebAudio(false);
        setIsPlayingWebAudio(true);
      }
    } catch (err: any) {
      stopWebAudioPlayback();
      if (isMountedRef.current) {
        setAudioError(err?.message || 'تعذر تشغيل المقطع الصوتي عبر Web Audio API.');
      }
    }
  };

  // Local File Fallback Handler with immediate state reset to prevent stale data
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Immediately stop playback and clear prior audio and all result states before any validation
    stopWebAudioPlayback();
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    decodedPcmRef.current = null;
    setAudioUrl(null);
    setAudioBlob(null);
    setDecodedDuration(null);
    setSelectedFileName(null);
    setAudioSourceType(null);
    setRawAsrText('');
    setEditedTranscript('');
    setStructuredDraft(null);
    setIsReviewedLocally(false);
    setTranscribeError(null);
    setAudioError(null);
    setInferenceElapsedSeconds(null);

    const file = e.target.files?.[0];
    // Reset file input so selecting the same file again triggers onChange
    e.target.value = '';

    if (!file) return;

    if (!hasConfirmedTrial) {
      setAudioError('يرجى تأكيد إقرار التجربة التمثيلية قبل اختيار الملف.');
      return;
    }

    // 10MB size limit check
    if (file.size > 10 * 1024 * 1024) {
      setAudioError(`حجم الملف (${(file.size / (1024 * 1024)).toFixed(1)} ميجابايت) يتجاوز الحد الأقصى المسموح به وهو 10 ميجابايت.`);
      return;
    }

    setIsFinalizingRecording(true);
    try {
      // Decode file immediately to verify decode support and check duration <= 30 sec
      const { audioData, duration } = await decodeAudioToMono16kHz(file);
      if (!isMountedRef.current) return;

      decodedPcmRef.current = audioData;
      setAudioBlob(file);
      setAudioSourceType('file');
      setDecodedDuration(duration);
      setSelectedFileName(`${file.name} (${(file.size / 1024).toFixed(0)} KB)`);

      const url = URL.createObjectURL(file);
      audioUrlRef.current = url;
      setAudioUrl(url);
    } catch (err: any) {
      if (!isMountedRef.current) return;
      decodedPcmRef.current = null;
      setAudioError(err.message || 'تعذر فك تشفير هذا الملف الصوتي محلياً.');
    } finally {
      if (isMountedRef.current) {
        setIsFinalizingRecording(false);
      }
    }
  };

  // Perform Local Speech-to-Text via Worker with performance.now() benchmark
  const handleTranscribeAudio = async () => {
    if (isBusy || !audioBlob) {
      if (!audioBlob && isMountedRef.current) {
        setTranscribeError('لا يوجد مقطع صوتي لتحويله. يرجى التسجيل أولاً أو اختيار ملف.');
      }
      return;
    }

    if (!isModelLoaded) {
      setTranscribeError('يرجى تحميل نموذج Whisper المحلي أولاً بالضغط على زر "تحميل النموذج المحلي".');
      return;
    }

    if (!workerRef.current) {
      setTranscribeError('محرك التفريغ غير متوفر.');
      return;
    }

    // Starting transcription clears old transcript/draft/review before work
    setRawAsrText('');
    setEditedTranscript('');
    setStructuredDraft(null);
    setIsReviewedLocally(false);
    setTranscribeError(null);
    setInferenceElapsedSeconds(null);
    setIsTranscribing(true);

    try {
      // Start inference timer around decode + model inference
      inferenceStartRef.current = performance.now();

      // Decode audio to 16kHz mono Float32Array in main thread
      const { audioData } = await decodeAudioToMono16kHz(audioBlob);
      if (!isMountedRef.current || !workerRef.current) return;

      // Copy buffer for worker transfer so cached decodedPcmRef stays intact for Web Audio playback
      decodedPcmRef.current = new Float32Array(audioData);

      // Post Float32Array to worker (zero-copy transfer)
      workerRef.current.postMessage(
        {
          type: 'transcribe',
          payload: {
            audioData,
            language: selectedLanguage,
          },
        },
        [audioData.buffer]
      );
    } catch (err: any) {
      if (!isMountedRef.current) return;
      setIsTranscribing(false);
      inferenceStartRef.current = null;
      setTranscribeError(err.message || 'حدث خطأ أثناء فك تشفير الصوت وتحويله إلى 16kHz.');
    }
  };

  // Parse transcript using deterministic rules
  const handleGenerateRulesDraft = () => {
    if (!editedTranscript.trim()) return;
    const draft = parseTranscriptDeterministically(editedTranscript);
    setStructuredDraft(draft);
    setIsReviewedLocally(false);
  };

  // Clear / Reset All in-memory state
  const handleResetAll = () => {
    if (isBusy) return;
    stopWebAudioPlayback();
    stopAnyActiveRecording();
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    decodedPcmRef.current = null;
    setAudioUrl(null);
    setAudioBlob(null);
    setDecodedDuration(null);
    setAudioSourceType(null);
    setSelectedFileName(null);
    setRawAsrText('');
    setEditedTranscript('');
    setTranscribeError(null);
    setAudioError(null);
    setInferenceElapsedSeconds(null);
    setStructuredDraft(null);
    setIsReviewedLocally(false);
    setIsWaitingForMicPermission(false);
    setIsRecording(false);
    setIsFinalizingRecording(false);
    setRecordSeconds(0);
  };

  return (
    <div className="space-y-6 font-sans text-gray-800" dir="rtl">
      
      {/* 1. PERSISTENT VISIBLE WARNING */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm text-xs leading-relaxed text-amber-950 flex items-start gap-3">
        <ShieldAlert size={26} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-amber-900">
              تنبيه قانوني وطبي: تجربة تمثيلية وافتراضية فقط (Fictional Roleplay ONLY)
            </span>
            <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              بيانات افتراضية
            </span>
          </div>
          <p>
            هذه الخاصية <strong>مخصصة لاختبار التقنية محلياً</strong> دون استخدام أي بيانات لمرضى حقيقيين.
            النموذج غير معتمد طبياً وليس مخصصاً للاستخدام الإكلينيكي في الإنتاج.
            <strong> الصوت والنصوص تبقى في ذاكرة المتصفح المؤقتة (in-memory) فقط</strong> ولا يتم حفظها في localStorage أو إرسالها إلى أي خادم عبر الإنترنت.
            المتصفح يقوم فقط بتحميل أوزان النموذج من مستودعات Hugging Face / CDN لتشغيلها على معالج جهازك محلياً دون رفع الصوت.
          </p>
        </div>
      </div>

      {/* 2. SYNTHETIC-ONLY TRIAL CONFIRMATION CHECKBOX */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between gap-4">
        <label className="flex items-center gap-3 cursor-pointer select-none text-xs sm:text-sm font-bold text-gray-800">
          <input
            type="checkbox"
            checked={hasConfirmedTrial}
            disabled={isBusy}
            onChange={(e) => setHasConfirmedTrial(e.target.checked)}
            className="w-5 h-5 rounded text-sky-600 focus:ring-sky-400 cursor-pointer"
          />
          <span>
            أقر بأن هذه تجربة تمثيلية بافتراضات غير حقيقية ولا تحتوي على أي بيانات مرضى سرية أو واقعية (Confirm synthetic trial)
          </span>
        </label>
        {hasConfirmedTrial ? (
          <span className="text-sky-700 bg-sky-50 px-3 py-1 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 border border-sky-200">
            <CheckCircle2 size={14} className="text-sky-600" /> تم التأكيد
          </span>
        ) : (
          <span className="text-sky-800 bg-sky-50 px-3 py-1 rounded-full text-xs font-bold shrink-0 border border-sky-200">
            مطلوب التأكيد لتفعيل التسجيل
          </span>
        )}
      </div>

      {/* 3. MODEL DOWNLOAD & LOCAL ENGINE CARD */}
      <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-sky-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-sky-950">
                محرك التعرف الصوتي المحلي (In-Browser Whisper ASR)
              </h3>
              <p className="text-xs text-sky-700/70">
                نموذج Xenova/whisper-tiny متعدد اللغات عبر Web Worker و ONNX WASM أحادي المسار
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isModelLoaded ? (
              <span className="bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 size={14} className="text-sky-600" />
                النموذج جاهز محلياً على الجهاز
              </span>
            ) : isModelLoading ? (
              <span className="bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <Loader2 size={14} className="animate-spin text-sky-600" />
                جارٍ تحميل النموذج...
              </span>
            ) : (
              <span className="bg-sky-50/50 text-sky-700 border border-sky-100 px-3 py-1.5 rounded-xl text-xs font-medium">
                النموذج غير محمل بعد
              </span>
            )}
          </div>
        </div>

        {/* Egyptian Arabic Transparent Notice */}
        <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl text-xs leading-relaxed text-sky-950">
          <p className="font-bold mb-1 flex items-center gap-1 text-sky-900">
            <Info size={14} className="text-sky-500" /> إشعار مهم باللغة العربية قبل التحميل:
          </p>
          <p>
            النموذج يتم تحميله من Hugging Face / CDN، قد يتراوح حجمه بين عشرات إلى مئات الميجابايت، التحميل يستهلك من باقة الإنترنت، والتفريغ الصوتي يتم بالكامل على معالج وذاكرة جهازك (CPU/RAM) وقد يكون بطيئاً بالأخص على الهواتف. لا يوجد أي مفتاح API مدفوع ولا يتم رفع الصوت لأي خادم إطلاقاً، ولا نضمن دقة طبية كاملة أو عملاً بدون إنترنت في المرة الأولى.
          </p>
        </div>

        {/* Download Progress Bar */}
        {modelProgress && (
          <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-sky-800">
              <span className="font-medium truncate max-w-[280px]">
                {modelProgress.file || 'ملفات النموذج المحلي'}
              </span>
              <span className="font-mono font-bold">
                {modelProgress.progress ? `${Math.round(modelProgress.progress)}%` : 'تحضير...'}
              </span>
            </div>
            <div className="w-full bg-sky-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${modelProgress.progress || 10}%` }}
              ></div>
            </div>
          </div>
        )}

        {modelError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between gap-2">
            <span>{modelError}</span>
            <button
              onClick={handleLoadModel}
              disabled={isBusy}
              className="px-3 py-1 bg-red-600 text-white rounded-lg font-bold text-[11px] shrink-0 hover:bg-red-700 transition cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Model Load Action Button */}
        {!isModelLoaded && (
          <button
            onClick={handleLoadModel}
            disabled={isBusy}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isModelLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                جارٍ تحميل أوزان النموذج محلياً من CDN...
              </>
            ) : (
              <>
                <Cpu size={16} />
                تحميل النموذج المحلي (Load local model)
              </>
            )}
          </button>
        )}
      </div>

      {/* 4. AUDIO CAPTURE & HONEST FALLBACK */}
      <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-sky-100 pb-4">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-sky-950 flex items-center gap-2">
              <Volume2 size={18} className="text-sky-500" />
              التقاط الصوت التمثيلي (Microphone or Local File)
            </h3>
            <p className="text-xs text-sky-700/70">
              التسجيل المباشر عبر المتصفح (حد أقصى 30 ثانية) أو اختيار ملف صوتي محلي
            </p>
          </div>

          {/* Language Selector for ASR */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-600">لغة التفريغ:</label>
            <select
              value={selectedLanguage}
              disabled={isBusy}
              onChange={(e) => setSelectedLanguage(e.target.value as 'ar' | 'en')}
              className="p-1.5 border border-gray-300 rounded-lg text-xs bg-white font-medium disabled:opacity-50"
            >
              <option value="ar">العربية (Arabic)</option>
              <option value="en">الإنجليزية (English)</option>
            </select>
          </div>
        </div>

        {audioError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 leading-relaxed">
            {audioError}
          </div>
        )}

        {/* Capture Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Method A: Microphone Recording */}
          <div className={`p-5 rounded-2xl border transition-all ${isRecording ? 'bg-red-50 border-red-300 animate-pulse' : isWaitingForMicPermission ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className="font-bold text-xs text-gray-800 mb-2 flex items-center gap-2">
              <Mic size={16} className={isRecording ? 'text-red-600' : isWaitingForMicPermission ? 'text-amber-600' : 'text-gray-600'} />
              التسجيل بالميكروفون (Direct Mic)
            </h4>
            <p className="text-[11px] text-gray-500 mb-4">
              إيقاف تلقائي بعد 30 ثانية كحد أقصى مع فك تشفير دقيق للمدة بعد الإيقاف.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {isWaitingForMicPermission ? (
                <>
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <Loader2 size={15} className="animate-spin text-amber-600" />
                    جاري انتظار إذن الميكروفون…
                  </span>
                  <button
                    type="button"
                    onClick={handleCancelMicPermission}
                    className="px-3.5 py-2 bg-gray-800 hover:bg-black text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
                  >
                    إلغاء
                  </button>
                </>
              ) : isFinalizingRecording ? (
                <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5 py-2">
                  <Loader2 size={15} className="animate-spin text-blue-600" />
                  جاري تجهيز ومعالجة التسجيل الصوتي…
                </span>
              ) : !isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  disabled={!hasConfirmedTrial || isBusy}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Mic size={14} /> بدء التسجيل (Start)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-2 cursor-pointer"
                >
                  <Square size={14} className="fill-current" /> إيقاف التسجيل ({recordSeconds}/30 ثانية)
                </button>
              )}

              {isRecording && (
                <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <Clock size={13} />
                  00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}
                </span>
              )}
            </div>
          </div>

          {/* Method B: Local File Input Fallback */}
          <div className="p-5 rounded-2xl border bg-sky-50/50 border-sky-100">
            <h4 className="font-bold text-xs text-sky-950 mb-2 flex items-center gap-2">
              <Upload size={16} className="text-sky-500" />
              اختيار ملف تمثيلي من جهازك (محلي فقط)
            </h4>
            <p className="text-[11px] text-sky-700/70 mb-4">
              يقبل WAV, MP3, WebM بحجم أقصى 10MB ومدة أقصاها 30 ثانية (يعمل حتى لو حُجب الميكروفون).
            </p>

            <label className={`inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-sky-200 hover:bg-sky-50 rounded-xl text-xs font-bold text-sky-800 shadow-sm transition cursor-pointer ${(!hasConfirmedTrial || isBusy) ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Upload size={14} className="text-sky-500" />
              <span>اختيار ملف صوتي محلي</span>
              <input
                type="file"
                accept="audio/wav,audio/mp3,audio/mpeg,audio/webm,audio/ogg"
                onChange={handleFileSelect}
                disabled={!hasConfirmedTrial || isBusy}
                className="hidden"
              />
            </label>

            {selectedFileName && (
              <p className="text-xs text-sky-700 font-medium mt-2 truncate">
                الملف المختار: {selectedFileName}
              </p>
            )}
          </div>
        </div>

        {/* Audio Player Preview (Primary Web Audio API + Optional <audio> element) & True Decoded Duration */}
        {audioUrl && (
          <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-xl flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-900">المقطع المسجل:</span>
                  <span className="text-[11px] text-sky-600/80 font-mono">
                    {audioSourceType === 'mic' ? 'تسجيل ميكروفون محلي' : 'ملف تمثيلي من الجهاز'}
                  </span>
                </div>
                {decodedDuration !== null && (
                  <div className="text-xs text-sky-800 font-medium flex items-center gap-1">
                    <Timer size={13} className="text-sky-500" />
                    <span>المدة الدقيقة المستخرجة: <strong>{decodedDuration.toFixed(1)} ثانية</strong></span>
                  </div>
                )}
              </div>

              {/* Primary Playback via Web Audio API */}
              <div className="flex flex-wrap items-center gap-2">
                {!isPlayingWebAudio ? (
                  <button
                    type="button"
                    onClick={handlePlayWebAudio}
                    disabled={isPreparingWebAudio || isRecording || isFinalizingRecording}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isPreparingWebAudio ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        جاري تجهيز الصوت...
                      </>
                    ) : (
                      <>
                        <Play size={14} className="fill-current" />
                        تشغيل الصوت (Web Audio)
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopWebAudioPlayback}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Square size={14} className="fill-current" />
                    إيقاف التشغيل (Stop)
                  </button>
                )}
              </div>
            </div>

            {/* Secondary standard HTML5 audio element */}
            <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-[11px] text-gray-500">
                مشغل المتصفح الإضافي (احتياطي):
              </span>
              <audio controls src={audioUrl} className="h-8 w-full sm:w-72" />
            </div>
          </div>
        )}

        {/* Transcribe Trigger Button */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleTranscribeAudio}
            disabled={!audioBlob || isBusy || !isModelLoaded}
            className="px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 disabled:opacity-40 cursor-pointer"
          >
            {isTranscribing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                جارٍ فك التشفير والتفريغ الصوتي محلياً على جهازك...
              </>
            ) : (
              <>
                <Play size={16} className="fill-current" />
                تحويل الصوت لنص محليا (Transcribe Audio Locally)
              </>
            )}
          </button>

          {(audioBlob || editedTranscript) && (
            <button
              type="button"
              onClick={handleResetAll}
              disabled={isBusy}
              className="px-4 py-3 text-xs text-red-600 hover:bg-red-50 rounded-xl font-bold transition mr-auto flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw size={14} /> مسح كل المخرجات المؤقتة
            </button>
          )}
        </div>
      </div>

      {/* 5. ASR TRANSCRIPTION RESULT & BENCHMARK DURATION */}
      <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-sky-100 pb-3">
          <h3 className="font-bold text-sm sm:text-base text-sky-950 flex items-center gap-2">
            <FileText size={18} className="text-sky-500" />
            مخرجات التفريغ الصوتي والتعديل الطبي (Transcript)
          </h3>

          {/* Genuine Inference Duration Badge (Decode + Inference) */}
          {inferenceElapsedSeconds && (
            <span className="bg-sky-50 text-sky-900 border border-sky-200 text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Clock size={13} className="text-sky-600" />
              زمن المعالجة والتفريغ: {inferenceElapsedSeconds}s
            </span>
          )}
        </div>

        {transcribeError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 leading-relaxed">
            {transcribeError}
          </div>
        )}

        {/* Raw ASR Output (Unedited Model Output) */}
        {rawAsrText && (
          <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-xl text-xs space-y-1">
            <span className="font-bold text-sky-700 block">
              النص الخام المستخرج من النموذج المحلي (Raw Model Output):
            </span>
            <p className="font-mono text-sky-950 leading-relaxed dir-auto">
              {rawAsrText}
            </p>
          </div>
        )}

        {/* Doctor Correction Textarea */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-sky-900">
            النص الخاضع لمراجعة وتصحيح الطبيب (Editable Transcript):
          </label>
          <textarea
            rows={4}
            value={editedTranscript}
            disabled={isBusy}
            onChange={(e) => {
              setEditedTranscript(e.target.value);
              setIsReviewedLocally(false); // editing clears review
            }}
            placeholder="سيظهر النص المفرغ هنا تلقائياً بعد تحويل الصوت، ويمكنك تصحيحه وإضافة التعديلات قبل توليد المسودة النمطية..."
            className="w-full p-3.5 border border-sky-200 rounded-xl text-xs sm:text-sm text-sky-950 focus:ring-2 focus:ring-sky-400 outline-none transition leading-relaxed dir-auto disabled:opacity-60"
          />
        </div>

        {editedTranscript.trim() && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleGenerateRulesDraft}
              disabled={isBusy}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <Sparkles size={14} className="text-sky-200" />
              توليد المسودة الهيكلية بالقواعد النمطية (Generate Rules Draft)
            </button>
          </div>
        )}
      </div>

      {/* 5B. SIMULATED SCENARIO PREVIEW & SOAP CARDS (Isolated from real recording flow) */}
      <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-sky-300 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-extrabold px-3 py-1 rounded-full">
              <AlertTriangle size={13} className="text-sky-600" />
              بيانات تجريبية للعرض فقط - محاكاة
            </span>
            <h3 className="font-bold text-sm sm:text-base text-sky-950 flex items-center gap-2 pt-1">
              <Sparkles size={18} className="text-sky-500" />
              معاينة مسودة الكشف المقسمة (كروت S / O / A / P) — بدون التأثير على التسجيل الفعلي
            </h3>
            <p className="text-xs text-sky-700/70">
              يمكنك استعراض سيناريو جاهز منسق في كروت منفصلة (S / O / A / P) دون المساس بحالة الميكروفون أو التسجيل الحقيقي أعلاه.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowSimScenario((prev) => !prev)}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={14} className="text-sky-200" />
              <span>{showSimScenario ? 'إخفاء السيناريو التجريبي' : 'جرّب بسيناريو جاهز (محاكاة)'}</span>
            </button>
          </div>
        </div>

        {showSimScenario && (
          <div className="space-y-4 pt-3 border-t border-sky-100">
            {/* Mandatory simulation disclaimer above any ICD / dosage / drug alert */}
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sky-950">
              <div className="flex items-center gap-2 font-bold">
                <ShieldAlert size={16} className="text-sky-600 shrink-0" />
                <span>بيانات تجريبية للعرض فقط - محاكاة (لا تمثل توصية طبية أو تشخيصاً حقيقياً)</span>
              </div>
              <span className="text-[11px] font-mono bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-md font-bold">
                Simulated SOAP + ICD-10 Preview
              </span>
            </div>

            {/* 4 Separate S / O / A / P Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* S — Subjective */}
              <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sky-950 text-xs flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-sky-500 text-white font-mono text-xs flex items-center justify-center">S</span>
                    Subjective — شكوى المريض والأعراض
                  </span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full border border-sky-200">
                    بيانات تجريبية للعرض فقط - محاكاة
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={simSoap.s}
                  onChange={(e) => setSimSoap({ ...simSoap, s: e.target.value })}
                  className="w-full p-2.5 bg-white border border-sky-200 rounded-xl text-xs text-sky-950 leading-relaxed focus:ring-2 focus:ring-sky-400 outline-none"
                />
              </div>

              {/* O — Objective */}
              <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-900 text-xs flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-mono text-xs flex items-center justify-center">O</span>
                    Objective — العلامات الحيوية والفحص
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    بيانات تجريبية للعرض فقط - محاكاة
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={simSoap.o}
                  onChange={(e) => setSimSoap({ ...simSoap, o: e.target.value })}
                  className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              {/* A — Assessment */}
              <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-purple-900 text-xs flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-purple-700 text-white font-mono text-xs flex items-center justify-center">A</span>
                    Assessment — التقييم المبدئي وكود ICD
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    بيانات تجريبية للعرض فقط - محاكاة
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={simSoap.a}
                  onChange={(e) => setSimSoap({ ...simSoap, a: e.target.value })}
                  className="w-full p-2.5 bg-white border border-purple-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:ring-2 focus:ring-purple-700 outline-none"
                />
              </div>

              {/* P — Plan */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-amber-700 text-white font-mono text-xs flex items-center justify-center">P</span>
                    Plan — الخطة العلاجية والفحوصات
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    بيانات تجريبية للعرض فقط - محاكاة
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={simSoap.p}
                  onChange={(e) => setSimSoap({ ...simSoap, p: e.target.value })}
                  className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:ring-2 focus:ring-amber-700 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. DETERMINISTIC RULES STRUCTURED DRAFT */}
      {structuredDraft && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                <FileCheck2 size={18} className="text-emerald-600" />
                المسودة الهيكلية بقواعد نمطية قطعية (Deterministic Rules Parser) + كروت S / O / A / P
              </h3>
              <p className="text-xs text-gray-500">
                تصنيف مبني على كلمات مفتاحية نصية محددة — ليس استنتاجاً ذكياً أو طبياً
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isReviewedLocally ? (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={13} /> Reviewed locally (تمت المراجعة محلياً)
                </span>
              ) : (
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
                  بانتظار مراجعة واعتماد الطبيب
                </span>
              )}
            </div>
          </div>

          {/* Explicit Warning regarding deterministic keyword classification */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2">
            <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>تحذير صريح:</strong> الكلمات المفتاحية البسيطة قد تخطئ في فهم السياق أو تركيب الجمل في اللغتين العربية والإنجليزية. يجب على الطبيب مراجعة كل تصنيف بنفسه قبل اعتماده. لا يتم افتراض أي تشخيصات أو جرعات من العدم.
            </p>
          </div>

          {/* Separate S / O / A / P Summary Cards for the Active Draft */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-sky-950">
                توزيع المسودة في كروت S / O / A / P منفصلة:
              </h4>
              <span className="text-[10px] bg-sky-50 text-sky-800 font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                بيانات تجريبية للعرض فقط - محاكاة
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/30 space-y-1.5">
                <span className="font-extrabold text-sky-950 block">S — Subjective (الشكوى والنفي)</span>
                <p className="text-gray-700 leading-relaxed">
                  {[
                    ...structuredDraft.complaints.map((c) => `• ${c.extractedText}`),
                    ...structuredDraft.negated.map((n) => `• [نفي] ${n.extractedText}`)
                  ].join('\n') || 'لا توجد عبارات مصنفة'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-1.5">
                <span className="font-extrabold text-emerald-900 block">O — Objective (الفحوصات)</span>
                <p className="text-gray-700 leading-relaxed">
                  {structuredDraft.tests.map((t) => `• ${t.extractedText}`).join('\n') || 'بانتظار إدخال العلامات الحيوية والفحص'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/30 space-y-1.5">
                <span className="font-extrabold text-purple-900 block">A — Assessment (التقييم/المراجعة)</span>
                <p className="text-gray-700 leading-relaxed">
                  {structuredDraft.unclassified.map((u) => `• ${u.extractedText}`).join('\n') || 'يحدد بواسطة الطبيب المعالج'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 space-y-1.5">
                <span className="font-extrabold text-amber-900 block">P — Plan (الأدوية والتوصيات)</span>
                <p className="text-gray-700 leading-relaxed">
                  {[
                    ...structuredDraft.medications.map((m) => `• [دواء] ${m.extractedText}`),
                    ...structuredDraft.clinicianInstructions.map((i) => `• [توصية] ${i.extractedText}`)
                  ].join('\n') || 'لا توجد خطة مصنفة'}
                </p>
              </div>
            </div>
          </div>

          {/* Categorized Buckets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* 1. Complaints & Symptoms */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
              <span className="font-bold text-blue-900 block text-xs">
                1. الشكاوى والأعراض المذكورة ({structuredDraft.complaints.length})
              </span>
              {structuredDraft.complaints.length > 0 ? (
                structuredDraft.complaints.map((item) => (
                  <div key={item.id} className="p-2.5 bg-white border border-blue-100 rounded-lg space-y-1">
                    <p className="font-bold text-gray-900">{item.extractedText}</p>
                    <span className="text-[10px] text-gray-400 block font-mono">الجملة الأصلية: "{item.sourceSentence}"</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">لا توجد أعراض صريحة متطابقة مع القواعد</p>
              )}
            </div>

            {/* 2. Negated Statements */}
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-2">
              <span className="font-bold text-red-900 block text-xs">
                2. نفي أعراض / استبعاد صريح ({structuredDraft.negated.length})
              </span>
              {structuredDraft.negated.length > 0 ? (
                structuredDraft.negated.map((item) => (
                  <div key={item.id} className="p-2.5 bg-white border border-red-100 rounded-lg space-y-1">
                    <p className="font-bold text-gray-900">{item.extractedText}</p>
                    <span className="text-[10px] text-gray-400 block font-mono">الجملة الأصلية: "{item.sourceSentence}"</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">لا توجد جمل نفي مطابقة</p>
              )}
            </div>

            {/* 3. Clinician Instructions */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <span className="font-bold text-emerald-900 block text-xs">
                3. تعليمات وتوصيات الطبيب ({structuredDraft.clinicianInstructions.length})
              </span>
              {structuredDraft.clinicianInstructions.length > 0 ? (
                structuredDraft.clinicianInstructions.map((item) => (
                  <div key={item.id} className="p-2.5 bg-white border border-emerald-100 rounded-lg space-y-1">
                    <p className="font-bold text-gray-900">{item.extractedText}</p>
                    <span className="text-[10px] text-gray-400 block font-mono">الجملة الأصلية: "{item.sourceSentence}"</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">لا توجد توصيات مطابقة</p>
              )}
            </div>

            {/* 4. Requested Tests */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
              <span className="font-bold text-purple-900 block text-xs">
                4. الفحوصات والتحاليل المطلوبة ({structuredDraft.tests.length})
              </span>
              {structuredDraft.tests.length > 0 ? (
                structuredDraft.tests.map((item) => (
                  <div key={item.id} className="p-2.5 bg-white border border-purple-100 rounded-lg space-y-1">
                    <p className="font-bold text-gray-900">{item.extractedText}</p>
                    <span className="text-[10px] text-gray-400 block font-mono">الجملة الأصلية: "{item.sourceSentence}"</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">لا توجد فحوصات مطابقة</p>
              )}
            </div>

            {/* 5. Medications Mentioned */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <span className="font-bold text-amber-900 block text-xs">
                5. الأدوية المذكورة ({structuredDraft.medications.length})
              </span>
              {structuredDraft.medications.length > 0 ? (
                structuredDraft.medications.map((item) => (
                  <div key={item.id} className="p-2.5 bg-white border border-amber-100 rounded-lg space-y-1">
                    <p className="font-bold text-gray-900">{item.extractedText}</p>
                    <span className="text-[10px] text-gray-400 block font-mono">الجملة الأصلية: "{item.sourceSentence}"</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">لا توجد أدوية مطابقة</p>
              )}
            </div>

            {/* 6. Unclassified */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2">
              <span className="font-bold text-gray-700 block text-xs">
                6. غير مصنف (بحاجة لتحديد الطبيب) ({structuredDraft.unclassified.length})
              </span>
              {structuredDraft.unclassified.length > 0 ? (
                structuredDraft.unclassified.map((item) => (
                  <div key={item.id} className="p-2.5 bg-white border border-gray-200 rounded-lg space-y-1">
                    <p className="text-gray-700">{item.extractedText}</p>
                    <span className="text-[10px] text-gray-400 block font-mono">الجملة الأصلية: "{item.sourceSentence}"</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">تم تصنيف كافة الجمل بالقواعد</p>
              )}
            </div>

          </div>

          {/* Review Checkbox & Disabled EMR Button */}
          <div className="p-4 bg-gray-50 border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <label className="flex items-center gap-2.5 text-xs font-bold text-gray-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isReviewedLocally}
                onChange={(e) => setIsReviewedLocally(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-400 cursor-pointer"
              />
              <span>راجعت هذه المسودة النمطية شخصياً وأقرت محتواها محلياً (Review locally)</span>
            </label>

            {/* Disabled EMR Sync Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                className="px-4 py-2 bg-gray-200 text-gray-500 font-bold rounded-xl text-xs cursor-not-allowed border border-gray-300 flex items-center gap-1.5"
                title="integration_not_configured"
              >
                <Database size={14} />
                حفظ في السجل الطبي (EMR Sync)
              </button>
              <span className="text-[10px] text-gray-500 font-mono">
                integration_not_configured
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
