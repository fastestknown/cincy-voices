import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, type, message } = body;

  if (!name || !email || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Save lead to Supabase
  const { error } = await supabase
    .from('cincy_voices_leads')
    .insert({ name, email, type, message: message || null });

  if (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }

  const typeLabel = type === 'business' ? 'Business Owner' : 'Fractional Leader';
  const [firstName, ...rest] = name.trim().split(' ');
  const lastName = rest.join(' ') || '';

  // Subscribe to Beehiiv newsletter
  try {
    await fetch(
      `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'cincy-voices',
          utm_medium: 'connect-form',
          utm_campaign: type,
          custom_fields: [
            { name: 'type', value: typeLabel },
            { name: 'message', value: message || '' },
          ],
        }),
      }
    );
  } catch {
    // Beehiiv failure is non-fatal
  }

  // Notify Ford via email
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Cincy Voices <notifications@voices.workwithmean.ing>',
        to: 'ford@workwithmean.ing',
        subject: `New lead: ${name} (${typeLabel})`,
        text: `Name: ${name}\nEmail: ${email}\nType: ${typeLabel}\nMessage: ${message || '(none)'}\n\nAlso subscribed to Beehiiv newsletter.\n\nReply directly to ${email} to follow up.`,
        reply_to: email,
      }),
    });
  } catch {
    // Email failure is non-fatal
  }

  return NextResponse.json({ success: true });
}
