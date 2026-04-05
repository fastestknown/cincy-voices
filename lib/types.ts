export interface Leader {
  id: string;
  name: string;
  slug: string;
  role: string | null;
  company: string | null;
  headshot_drive_folder_id: string | null;
  bio_summary: string | null;
  expertise_tags: string[] | null;
  hero_quote: string | null;
  hero_segment_id: string | null;
  micro_clip_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  created_at: string;
}

export interface Topic {
  id: string;
  slug: string;
  name: string;
  color: string;
  description: string | null;
  sort_order: number;
}

export interface Segment {
  id: string;
  source_id: string;
  leader_id: string;
  text: string;
  start_time_ms: number;
  end_time_ms: number;
  mux_playback_id: string | null;
  topic_thread_id: string | null;
  clip_quality_score: number | null;
  words: WordTimestamp[] | null;
  trim_start_ms: number | null;
  trim_end_ms: number | null;
  created_at: string;
}

export interface WordTimestamp {
  text: string;
  start: number;
  end: number;
  confidence: number;
}

export interface Quote {
  id: string;
  leader_id: string;
  quote_text: string;
  source_segment_id: string | null;
  suggested_uses: string[] | null;
  created_at: string;
}

export interface ThreadItem {
  id: string;
  topic_id: string;
  segment_id: string | null;
  quote_id: string | null;
  content_type: 'video_clip' | 'quote';
  sort_order: number;
  leader_id: string;
  created_at: string;
}

// Joined types for page queries
export interface LeaderWithTopics extends Leader {
  topic_tags: { slug: string; name: string; color: string }[];
}

export interface ThreadItemWithContent extends ThreadItem {
  segment: Segment | null;
  quote: Quote | null;
  leader: Leader;
}

export interface VaultSource {
  id: string;
  title: string;
  source_type: string;
  mux_master_playback_id: string;
  duration_seconds: number | null;
}

export interface VaultSegment extends Segment {
  topic_name: string | null;
  topic_slug: string | null;
  topic_color: string | null;
  duration_ms: number | null;
}

export interface TopicWithStats extends Topic {
  leader_count: number;
  item_count: number;
  lead_quote: string | null;
}
