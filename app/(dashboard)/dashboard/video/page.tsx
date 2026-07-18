"use client";

import { useRef, useState } from "react";
import { Download, Loader2, Video as VideoIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/primitives";
import { Label, Textarea } from "@/components/ui/primitives";
import { Select } from "@/components/ui/select-native";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const VOICES = [
  { id: "autumn", label: "Autumn (Female)" },
  { id: "diana", label: "Diana (Female)" },
  { id: "hannah", label: "Hannah (Female)" },
  { id: "austin", label: "Austin (Male)" },
  { id: "daniel", label: "Daniel (Male)" },
  { id: "troy", label: "Troy (Male)" },
];

const WIDTH = 720;
const HEIGHT = 1280;

export default function VideoPage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("autumn");
  const [status, setStatus] = useState<"idle" | "generating-audio" | "recording" | "done">("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const supported =
    typeof window !== "undefined" &&
    typeof HTMLCanvasElement !== "undefined" &&
    "captureStream" in HTMLCanvasElement.prototype &&
    typeof MediaRecorder !== "undefined";

  async function handleGenerate() {
    if (!text.trim() || !supported) return;
    setStatus("generating-audio");
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed: 1 }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Voice generation failed");
      }
      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      await recordVideo(audioUrl, text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Video generation failed");
      setStatus("idle");
    }
  }

  async function recordVideo(audioUrl: string, fullText: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const audio = new Audio(audioUrl);
    audio.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      audio.onloadedmetadata = () => resolve();
      audio.onerror = () => reject(new Error("Could not load generated audio"));
    });

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaElementSource(audio);
    const dest = audioCtx.createMediaStreamDestination();
    source.connect(dest);
    source.connect(audioCtx.destination);

    const canvasStream = canvas.captureStream(30);
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ]);

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : "video/webm";
    const recorder = new MediaRecorder(combinedStream, { mimeType });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const words = fullText.trim().split(/\s+/);

    function draw(currentTime: number, duration: number) {
      if (!ctx) return;
      const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      gradient.addColorStop(0, "#0b0d10");
      gradient.addColorStop(1, "#1a1410");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Progress bar
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(60, HEIGHT - 100, WIDTH - 120, 6);
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(60, HEIGHT - 100, (WIDTH - 120) * progress, 6);

      // Logo mark
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PromptForge", WIDTH / 2, 80);

      // Caption word
      const idx = Math.min(words.length - 1, Math.floor(progress * words.length));
      const word = words[idx] || "";
      ctx.fillStyle = "#f5f5f4";
      ctx.font = "bold 56px sans-serif";
      ctx.textAlign = "center";
      wrapText(ctx, word, WIDTH / 2, HEIGHT / 2, WIDTH - 100, 64);
    }

    function wrapText(c: CanvasRenderingContext2D, txt: string, x: number, y: number, maxWidth: number, lineHeight: number) {
      const wordsArr = txt.split(" ");
      let line = "";
      const lines: string[] = [];
      for (const w of wordsArr) {
        const test = line ? `${line} ${w}` : w;
        if (c.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      lines.push(line);
      const startY = y - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((l, i) => c.fillText(l, x, startY + i * lineHeight));
    }

    setStatus("recording");
    recorder.start();
    audio.play();

    let raf = 0;
    function loop() {
      draw(audio.currentTime, audio.duration || 1);
      raf = requestAnimationFrame(loop);
    }
    loop();

    await new Promise<void>((resolve) => {
      audio.onended = () => resolve();
    });

    cancelAnimationFrame(raf);
    recorder.stop();
    audioCtx.close();

    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });

    const finalBlob = new Blob(chunks, { type: "video/webm" });
    const finalUrl = URL.createObjectURL(finalBlob);
    setVideoUrl(finalUrl);
    setStatus("done");
    URL.revokeObjectURL(audioUrl);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">Text to Video</h1>
        <p className="mt-1 text-sm text-forge-400">
          Turns your text into a narrated caption video — free, rendered right in your browser.
        </p>
      </div>

      {!supported && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-forge-400">
            Your browser doesn&apos;t support in-browser video recording. Try the latest Chrome or Edge.
          </CardContent>
        </Card>
      )}

      {supported && (
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-1.5">
              <Label htmlFor="videoText">Text</Label>
              <Textarea
                id="videoText"
                rows={5}
                maxLength={600}
                placeholder="Keep it short — a sentence or two works best for a caption video..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <p className="text-right text-xs text-forge-500">{text.length}/600 characters</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="videoVoice">Voice</Label>
              <Select id="videoVoice" value={voice} onChange={(e) => setVoice(e.target.value)}>
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!text.trim() || status === "generating-audio" || status === "recording"}
              className="w-full"
            >
              {status === "generating-audio" && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating voice...
                </>
              )}
              {status === "recording" && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Recording video...
                </>
              )}
              {(status === "idle" || status === "done") && (
                <>
                  <VideoIcon className="h-4 w-4" /> Generate video
                </>
              )}
            </Button>

            <canvas
              ref={canvasRef}
              width={WIDTH}
              height={HEIGHT}
              className="mx-auto w-full max-w-[280px] rounded-xl border border-forge-800 bg-forge-950"
            />

            {videoUrl && status === "done" && (
              <div className="space-y-3 rounded-xl border border-forge-800 bg-forge-900/40 p-4">
                <video src={videoUrl} controls className="mx-auto w-full max-w-[280px] rounded-lg" />
                <Button variant="secondary" asChild className="w-full">
                  <a href={videoUrl} download="promptforge-video.webm">
                    <Download className="h-4 w-4" /> Download video (.webm)
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}