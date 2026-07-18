import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const text = body?.text?.trim();
  const voice = body?.voice || "autumn";
  const speed = body?.speed ?? 1;

  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: "Text is too long (max 2000 characters)" }, { status: 400 });
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "canopylabs/orpheus-v1-english",
        input: text,
        voice,
        response_format: "wav",
        speed,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("[voice] groq error", errText);
      return NextResponse.json({ error: `Groq error: ${errText.slice(0, 300)}` }, { status: 502 });
    }

    const audioBuffer = await groqRes.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: { "Content-Type": "audio/wav" },
    });
  } catch (err) {
    console.error("[voice] failed", err);
    return NextResponse.json({ error: "Voice generation failed. Please try again." }, { status: 500 });
  }
}