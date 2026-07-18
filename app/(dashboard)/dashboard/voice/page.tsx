"use client";

import { useRef, useState } from "react";
import { Play, Pause, Download, Loader2, Volume2 } from "lucide-react";
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

export default function VoicePage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("autumn");
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handleGenerate() {
    if (!text.trim()) return;
    setLoading(true);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Voice generation failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Voice generation failed");
    } finally {
      setLoading(false);
    }
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">Text to Voice</h1>
        <p className="mt-1 text-sm text-forge-400">Type anything and turn it into real, downloadable audio.</p>
      </div>

      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-1.5">
            <Label htmlFor="voiceText">Text</Label>
            <Textarea
              id="voiceText"
              rows={6}
              maxLength={2000}
              placeholder="Paste or type anything you want turned into speech..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="text-right text-xs text-forge-500">{text.length}/2000 characters</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="voiceSelect">Voice</Label>
              <Select id="voiceSelect" value={voice} onChange={(e) => setVoice(e.target.value)}>
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="speed">Speed: {speed.toFixed(1)}x</Label>
              <input
                id="speed"
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-ember-500"
              />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={!text.trim() || loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating voice...
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4" /> Generate voice
              </>
            )}
          </Button>

          {audioUrl && (
            <div className="space-y-3 rounded-xl border border-forge-800 bg-forge-900/40 p-4">
              <audio
                ref={audioRef}
                src={audioUrl}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                controls
                className="w-full"
              />
              <div className="flex gap-3">
                <Button variant="secondary" onClick={togglePlay}>
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {playing ? "Pause" : "Play"}
                </Button>
                <Button variant="secondary" asChild>
                  <a href={audioUrl} download="voice.mp3">
                    <Download className="h-4 w-4" /> Download MP3
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}