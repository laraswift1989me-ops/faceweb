import React, { useState, useRef, useEffect } from "react";
import {
  X, Upload, ShieldCheck, Smartphone, AlertCircle,
  CheckCircle2, Loader2, ChevronRight, ChevronLeft, Video, RefreshCw,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useApp } from "../../context/AppContext";

interface KYCModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type DocType = "passport" | "id_card" | "driving_license" | "other";
type VideoMode = "record" | "upload";
type ModalStep = "gate" | "doc" | "selfie" | "pending";

const DOC_OPTIONS: { value: DocType; label: string; desc: string }[] = [
  { value: "passport", label: "Passport", desc: "Photo page with your name and photo visible" },
  { value: "id_card", label: "ID Card", desc: "Front side with full name in English" },
  { value: "driving_license", label: "Driving License", desc: "Front side showing your photo and name" },
  { value: "other", label: "Other", desc: "Government-issued photo ID" },
];

const API_BASE = "https://api.swiftearn.us";

export function KYCModal({ onClose, onSuccess }: KYCModalProps) {
  const { refreshUser } = useApp();

  const [isMobile, setIsMobile] = useState(false);
  const [continueOnDesktop, setContinueOnDesktop] = useState(false);
  const [step, setStep] = useState<ModalStep>("gate");

  // Form state
  const [docType, setDocType] = useState<DocType>("passport");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [videoMode, setVideoMode] = useState<VideoMode>("record");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Camera / recording state
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [countdown, setCountdown] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mobileUrl = `${window.location.origin}/profile?kyc=open`;
  const showForm = isMobile || continueOnDesktop;

  // Auto-advance to doc step on mobile
  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
    if (mobile) setStep("doc");
    return stopCamera;
  }, []);

  // Start camera only when on selfie step with record mode
  useEffect(() => {
    if (step === "selfie" && videoMode === "record") {
      startCamera();
    } else {
      stopCamera();
    }
  }, [step, videoMode]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }
      setCameraReady(true);
    } catch {
      setVideoMode("upload");
      setError("Camera access denied. Please upload a video instead.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraReady(false);
  }

  function startRecording() {
    if (!streamRef.current) return;
    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(streamRef.current);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      setRecordedBlob(new Blob(chunks, { type: "video/webm" }));
      setIsRecording(false);
    };

    recorder.start();
    setIsRecording(true);
    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          recorder.stop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function retakeVideo() {
    setRecordedBlob(null);
    setCountdown(0);
  }

  function handleDocChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) { setError("Only JPG, PNG or PDF files are allowed."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Document must be under 10 MB."); return; }
    setError(null);
    setDocFile(file);
  }

  function handleVideoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
    if (!validTypes.includes(file.type)) { setError("Only MP4, MOV or WebM videos are allowed."); return; }
    if (file.size > 20 * 1024 * 1024) { setError("Video must be under 20 MB."); return; }
    setError(null);
    setVideoFile(file);
  }

  async function handleSubmit() {
    const selfiePayload = videoMode === "record" ? recordedBlob : videoFile;
    if (!docFile) { setError("Please go back and upload your document."); return; }
    if (!selfiePayload) { setError("Please record or upload your selfie video."); return; }

    setIsUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const form = new FormData();
      form.append("document_type", docType);
      form.append("document", docFile);
      form.append(
        "video_selfie",
        selfiePayload instanceof File ? selfiePayload : new File([selfiePayload], "selfie.webm", { type: "video/webm" }),
      );

      const res = await fetch(`${API_BASE}/api/kyc/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Submission failed.");

      stopCamera();
      await refreshUser();
      setStep("pending");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "KYC submission failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  const hasSelfie = videoMode === "record" ? !!recordedBlob : !!videoFile;

  // Handle "Continue on desktop" → go to doc step
  function handleContinueOnDesktop() {
    setContinueOnDesktop(true);
    setStep("doc");
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            </div>
            <div>
              <h2 className="text-slate-900 dark:text-white text-lg font-black uppercase italic tracking-tight">Identity Verification</h2>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase">
                {step === "gate" && "KYC · Required for Full Access"}
                {step === "doc" && "Step 1 of 2 · Document"}
                {step === "selfie" && "Step 2 of 2 · Selfie Video"}
                {step === "pending" && "Verification Submitted"}
              </p>
            </div>
          </div>
          <button onClick={() => { stopCamera(); onClose(); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator — only for doc/selfie steps */}
        {(step === "doc" || step === "selfie") && (
          <div className="px-6 pt-5 pb-2 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${step === "doc" || step === "selfie" ? "bg-cyan-500" : "bg-slate-200 dark:bg-slate-700"}`} />
              </div>
              <div className="flex-1">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${step === "selfie" ? "bg-cyan-500" : "bg-slate-200 dark:bg-slate-700"}`} />
              </div>
            </div>
          </div>
        )}

        <div className="overflow-y-auto p-6 space-y-6">

          {/* ── GATE: Desktop QR / Mobile redirect ── */}
          {step === "gate" && !showForm && (
            <div className="space-y-6 text-center">
              <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex items-start gap-3 text-left">
                <Smartphone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-amber-700 dark:text-amber-300 text-xs font-medium leading-relaxed">
                  KYC requires your phone camera for document and selfie capture. Scan the QR code with your mobile device to continue.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Scan with your phone</p>
                <div className="p-4 bg-white rounded-3xl shadow-2xl">
                  <QRCodeSVG value={mobileUrl} size={180} />
                </div>
                <p className="text-slate-400 dark:text-slate-600 text-[10px] font-mono">{mobileUrl}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
                <span className="text-slate-400 dark:text-slate-600 text-xs font-bold px-2">or</span>
                <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
              </div>

              <button onClick={handleContinueOnDesktop}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-tight hover:border-slate-400 dark:hover:border-slate-500 transition-all">
                <ChevronRight className="w-4 h-4" /> Continue on this device
              </button>
            </div>
          )}

          {/* ── STEP 1: Document Upload ── */}
          {step === "doc" && (
            <>
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              <div className="text-center pb-2">
                <h3 className="text-slate-900 dark:text-white text-xl font-black italic uppercase tracking-tight mb-1">Upload Your Document</h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs">Select the type of government-issued ID and upload a clear photo</p>
              </div>

              {/* Document type cards */}
              <div className="grid grid-cols-2 gap-3">
                {DOC_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => setDocType(opt.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      docType === opt.value
                        ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}>
                    <p className={`font-bold text-sm ${docType === opt.value ? "text-cyan-600 dark:text-cyan-400" : "text-slate-700 dark:text-white"}`}>{opt.label}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-1 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {/* Document upload area */}
              <label className={`relative block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                docFile ? "border-emerald-400 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/5" : "border-slate-300 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500/50 bg-slate-50 dark:bg-slate-800/20"
              }`}>
                {docFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
                    <div>
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm truncate max-w-[260px]">{docFile.name}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-1">{(docFile.size / 1024 / 1024).toFixed(2)} MB · tap to change</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20">
                      <Upload className="w-7 h-7 text-cyan-500 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-slate-700 dark:text-white font-bold text-sm">Click or drag to upload</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">JPG, PNG or PDF · Max 10 MB</p>
                    </div>
                  </div>
                )}
                <input type="file" onChange={handleDocChange} className="absolute inset-0 opacity-0 cursor-pointer" accept=".jpg,.jpeg,.png,.pdf" />
              </label>

              {/* Next button */}
              <button onClick={() => { if (!docFile) { setError("Please upload your document first."); return; } setError(null); setStep("selfie"); }}
                disabled={!docFile}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white dark:text-slate-900 font-black py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:opacity-90">
                Continue to Selfie Video <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* ── STEP 2: Selfie Video ── */}
          {step === "selfie" && (
            <>
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              <div className="text-center pb-2">
                <h3 className="text-slate-900 dark:text-white text-xl font-black italic uppercase tracking-tight mb-1">Record Selfie Video</h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs">Record a quick 5-second selfie or upload a pre-recorded video</p>
              </div>

              {/* Mode toggle */}
              <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <button onClick={() => { setVideoMode("record"); setVideoFile(null); setRecordedBlob(null); }}
                  className={`flex-1 px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                    videoMode === "record" ? "bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}>
                  <Video className="w-4 h-4" /> Record
                </button>
                <button onClick={() => { setVideoMode("upload"); stopCamera(); setRecordedBlob(null); }}
                  className={`flex-1 px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                    videoMode === "upload" ? "bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}>
                  <Upload className="w-4 h-4" /> Upload
                </button>
              </div>

              {/* Record mode */}
              {videoMode === "record" && (
                <div className="space-y-3">
                  {!recordedBlob ? (
                    <>
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
                        {isRecording && countdown > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="text-white text-6xl font-black">{countdown}</span>
                          </div>
                        )}
                        {!cameraReady && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                          </div>
                        )}
                      </div>
                      <button onClick={startRecording} disabled={!cameraReady || isRecording}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-widest disabled:opacity-40 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all">
                        <Video className="w-4 h-4" />
                        {isRecording ? `Recording... ${countdown}s` : "Record 5-Second Selfie"}
                      </button>
                    </>
                  ) : (
                    <div className="p-5 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">Video recorded successfully</p>
                          <p className="text-slate-400 dark:text-slate-500 text-[10px]">{(recordedBlob.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button onClick={retakeVideo} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase hover:border-slate-400 dark:hover:border-slate-600 transition-all">
                        <RefreshCw className="w-3 h-3" /> Retake
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Upload mode */}
              {videoMode === "upload" && (
                <label className={`relative block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  videoFile ? "border-emerald-400 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/5" : "border-slate-300 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500/50 bg-slate-50 dark:bg-slate-800/20"
                }`}>
                  {videoFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
                      <div>
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm truncate max-w-[260px]">{videoFile.name}</p>
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-1">{(videoFile.size / 1024 / 1024).toFixed(2)} MB · tap to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20">
                        <Video className="w-7 h-7 text-cyan-500 dark:text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-slate-700 dark:text-white font-bold text-sm">Click or drag to upload</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">MP4, MOV or WebM · Max 20 MB</p>
                      </div>
                    </div>
                  )}
                  <input type="file" onChange={handleVideoFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept=".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm" />
                </label>
              )}

              {/* Back + Submit buttons */}
              <div className="flex gap-3">
                <button onClick={() => { setError(null); stopCamera(); setStep("doc"); }}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-black text-sm uppercase tracking-tight hover:border-slate-400 dark:hover:border-slate-500 transition-all">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleSubmit} disabled={isUploading || !hasSelfie}
                  className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white dark:text-slate-900 font-black py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:opacity-90">
                  {isUploading
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                    : <><ShieldCheck className="w-5 h-5" /> Submit for Verification</>
                  }
                </button>
              </div>
            </>
          )}

          {/* ── Success / Pending ── */}
          {step === "pending" && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="text-slate-900 dark:text-white text-2xl font-black italic uppercase tracking-tighter">Submitted!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Your documents are under AI review. You'll be notified within 24 hours.
              </p>
              <button onClick={onClose}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-black py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors uppercase tracking-tight">
                Back to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
