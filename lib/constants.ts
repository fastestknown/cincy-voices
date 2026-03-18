// lib/constants.ts

export const TOPIC_COLORS: Record<string, { hex: string; name: string }> = {
  'trust-relationships': { hex: '#7a9e7e', name: 'Sage' },
  'origin-stories': { hex: '#c4724e', name: 'Terracotta' },
  'client-impact': { hex: '#d4a843', name: 'Gold' },
  'culture-people': { hex: '#5b8ba0', name: 'Soft Blue' },
  'fractional-model': { hex: '#c94c60', name: 'Rose' },
  'growth-change': { hex: '#6b4c6e', name: 'Plum' },
  'collaboration': { hex: '#b0884c', name: 'Amber' },
} as const;

export const SITE = {
  name: 'Cincy Voices',
  tagline: 'Real conversations from Cincinnati\'s fractional leaders',
  url: 'https://voices.workwithmeaning.com',
} as const;

// Analytics event names — canonical contract
export const ANALYTICS_EVENTS = {
  LEADER_CARD_OPEN: 'leader_card_open',
  TOPIC_CARD_OPEN: 'topic_card_open',
  MONTAGE_START: 'montage_start',
  MONTAGE_COMPLETE: 'montage_complete',
  HERO_UNMUTE: 'hero_unmute',
  VIDEO_PLAY: 'video_play',
  VIDEO_COMPLETE: 'video_complete',
  CLIP_FOCUS_OPEN: 'inline_clip_focus_open',
  CLIP_FOCUS_CLOSE: 'inline_clip_focus_close',
  THREAD_LEADER_JUMP: 'thread_leader_jump',
  OUTBOUND_CLICK: 'outbound_click',
  MONTAGE_REPLAY: 'montage_replay',
  CTA_CLICK: 'outbound_profile_cta_click',
} as const;
