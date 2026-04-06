import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, type, message } = body;

  if (!name || !email || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { error } = await supabase
    .from('cincy_voices_leads')
    .insert({ name, email, type, message: message || null });

  if (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }

  // Fire-and-forget notification email to Ford
  try {
    const typeLabel = type === 'business' ? 'Business Owner' : 'Fractional Leader';
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Cincy Voices <notifications@voices.workwithmean.ing>',
        to: 'ford@workwithmean.ing',
        subject: `New Cincy Voices lead: ${name} (${typeLabel})`,
        text: `Name: ${name}\nEmail: ${email}\nType: ${typeLabel}\nMessage: ${message || '(none)'}\n\nReply directly to ${email} to follow up.`,
        reply_to: email,
      }),
    });
  } catch {
    // Email failure is non-fatal
  }

  return NextResponse.json({ success: true });
}
