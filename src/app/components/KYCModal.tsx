import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Camera,
  Shield,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Video,
  ChevronDown,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface KYCModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "initial" | "document" | "biometric" | "pending";

export function KYCModal({
  onClose,
  onSuccess,
}: KYCModalProps) {
  const { refreshUser } = useApp();
  const [step, setStep] = useState<Step>("initial");
  const [docType, setDocType] = useState("Passport");
  const [selectedFile, setSelectedFile] = useState<File | null>(
    null,
  );

  const [isMobile, setIsMobile] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setIsMobile(
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    );
    return stopCamera; // Cleanup on unmount
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError(
        "Unable to access camera. Please check permissions.",
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    setIsRecording(true);
    setCountdown(3);

    const mediaRecorder = new MediaRecorder(streamRef.current);
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const videoBlob = new Blob(chunks, {
        type: "video/webm",
      });
      await handleUpload(videoBlob);
    };

    mediaRecorder.start();
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          mediaRecorder.stop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleUpload = async (videoBlob: Blob) => {
    if (!selectedFile) {
      setError("Please upload an ID document first.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("document_type", docType);
      formData.append("document", selectedFile);
      formData.append(
        "video_selfie",
        videoBlob,
        "verification_video.webm",
      );

      const token = localStorage.getItem("access_token");
      const API_URL =
        import.meta.env.VITE_API_URL ||
        "https://api.swiftearn.us";

      const response = await fetch(
        `${API_URL}/api/kyc/submit`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData, // DO NOT set Content-Type header manually when using FormData!
        },
      );

      if (!response.ok)
        throw new Error(
          "Upload failed. Please ensure files are under 10MB.",
        );

      // Tell AppContext to pull the new 'pending' status
      await refreshUser();

      setStep("pending");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to submit KYC data.");
      setStep("document"); // Let them try again
    } finally {
      setIsUploading(false);
      stopCamera();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-white text-xl font-bold">
              Identity Verification
            </h2>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          {step === "initial" && (
            <div className="space-y-6">
              <button
                onClick={() => setStep("document")}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-black py-4 rounded-2xl hover:opacity-90"
              >
                START VERIFICATION
              </button>
            </div>
          )}

          {step === "document" && (
            <div className="space-y-6">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500"
              >
                <option>Passport</option>
                <option>National ID Card</option>
              </select>

              <div className="relative border-2 border-dashed border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-cyan-500/50 bg-slate-800/20">
                <Upload className="w-8 h-8 text-cyan-400 mb-2" />
                <h3 className="text-white font-bold">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to Upload ID"}
                </h3>
                <input
                  type="file"
                  onChange={(e) =>
                    setSelectedFile(e.target.files?.[0] || null)
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".jpg,.jpeg,.png,.pdf"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("initial")}
                  className="flex-1 bg-slate-800 text-slate-400 font-bold py-4 rounded-2xl"
                >
                  BACK
                </button>
                <button
                  disabled={!selectedFile}
                  onClick={() => {
                    setStep("biometric");
                    startCamera();
                  }}
                  className="flex-[2] bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-black py-4 rounded-2xl disabled:opacity-50"
                >
                  NEXT: BIOMETRICS
                </button>
              </div>
            </div>
          )}

          {step === "biometric" && (
            <div className="space-y-6">
              <div className="relative aspect-square max-w-xs mx-auto rounded-full overflow-hidden border-4 border-cyan-500 bg-slate-800">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover -scale-x-100"
                />
                {isRecording && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="text-white text-6xl font-black">
                      {countdown}
                    </div>
                  </div>
                )}
              </div>

              {isUploading ? (
                <div className="flex flex-col items-center py-4">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
                  <p className="text-cyan-400 font-bold text-sm">
                    ENCRYPTING & UPLOADING...
                  </p>
                </div>
              ) : (
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black py-4 rounded-2xl"
                >
                  {isRecording
                    ? "RECORDING..."
                    : "RECORD 3-SECOND VIDEO"}
                </button>
              )}
            </div>
          )}

          {step === "pending" && (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
              <h3 className="text-white text-2xl font-black">
                Under AI Review
              </h3>
              <p className="text-slate-400 text-sm">
                Your documents are being processed by our secure
                AI engine.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl mt-4"
              >
                CLOSE DASHBOARD
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}