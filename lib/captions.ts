import type { WordTimestamp } from './types';

/**
 * Generate WebVTT blob URL from word-level timestamps.
 * Groups words into ~8-word caption lines with proper timing.
 */
export function generateVttUrl(words: WordTimestamp[]): string {
  if (!words?.length) return '';

  const lines: string[] = ['WEBVTT', ''];
  const WORDS_PER_LINE = 8;

  for (let i = 0; i < words.length; i += WORDS_PER_LINE) {
    const chunk = words.slice(i, i + WORDS_PER_LINE);
    const start = formatVttTime(chunk[0].start);
    const end = formatVttTime(chunk[chunk.length - 1].end);
    const text = chunk.map(w => w.text).join(' ');

    lines.push(`${start} --> ${end}`);
    lines.push(text);
    lines.push('');
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/vtt' });
  return URL.createObjectURL(blob);
}

function formatVttTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const remainder_ms = ms % 1000;
  return `${pad(h)}:${pad(m % 60)}:${pad(s % 60)}.${pad3(remainder_ms)}`;
}

function pad(n: number): string { return n.toString().padStart(2, '0'); }
function pad3(n: number): string { return n.toString().padStart(3, '0'); }
