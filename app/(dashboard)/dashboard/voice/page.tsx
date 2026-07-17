"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Square, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/primitives";
import { Label, Textarea } from "@/components/ui/primitives";
import { Select } from "@/components/ui/select-native";
import { Button } from "@/components/ui/button";

export default function VoicePage() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    function loadVoices() {
      const available = window.speechSynthesis.getVoices();
      if (available.length) setVoices(available);
    }

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  function handlePlay() {
    if (!text.trim() || !supported) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[voiceIndex]) utterance.voice = voices[voiceIndex];
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => {
      setSpeaking(true);
      setPaused(false);
    };
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function handlePauseResume() {
    if (!supported) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }

  function handleStop() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">Text to Voice</h1>
        <p className="mt-1 text-sm text-forge-400">Type anything and hear it read aloud. Runs right in your browser.</p>
      </div>

      {!supported && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-forge-400">
            Your browser doesn&apos;t support text-to-speech. Try Chrome or Edge.
          </CardContent>
        </Card>
      )}

      {supported && (
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-1.5">
              <Label htmlFor="voiceText">Text</Label>
              <Textarea
                id="voiceText"
                rows={6}
                placeholder="Paste or type anything you want read out loud..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <p className="text-right text-xs text-forge-500">{text.length} characters</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="voiceSelect">Voice</Label>
                <Select
                  id="voiceSelect"
                  value={voiceIndex}
                  onChange={(e) => setVoiceIndex(Number(e.target.value))}
                >
                  {voices.length === 0 && <option value={0}>Loading voices...</option>}
                  {voices.map((v, i) => (
                    <option key={`${v.name}-${i}`} value={i}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rate">Speed: {rate.toFixed(1)}x</Label>
                <input
                  id="rate"
                  type="range"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-ember-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pitch">Pitch: {pitch.toFixed(1)}</Label>
              <input
                id="pitch"
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full accent-ember-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!speaking && (
                <Button onClick={handlePlay} disabled={!text.trim()}>
                  <Play className="h-4 w-4" /> Play
                </Button>
              )}
              {speaking && (
                <Button onClick={handlePauseResume} variant="secondary">
                  {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {paused ? "Resume" : "Pause"}
                </Button>
              )}
              {speaking && (
                <Button onClick={handleStop} variant="secondary">
                  <Square className="h-4 w-4" /> Stop
                </Button>
              )}
              {speaking && (
                <span className="flex items-center gap-1.5 text-sm text-forge-400">
                  <Volume2 className="h-4 w-4 animate-pulse text-ember-500" />
                  {paused ? "Paused" : "Speaking..."}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}