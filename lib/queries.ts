import { supabase } from './supabase';
import type { Leader, Topic, Segment, LeaderWithTopics, ThreadItemWithContent, TopicWithStats } from './types';

// ── Homepage ──────────────────────────────────────────

export async function getLeadersWithTopics(): Promise<LeaderWithTopics[]> {
  const { data: leaders } = await supabase
    .from('cincy_voices_leaders')
    .select('*')
    .order('name');

  if (!leaders?.length) return [];

  // Get each leader's topic threads via thread_items
  const { data: threadItems } = await supabase
    .from('cincy_voices_thread_items')
    .select('leader_id, topic_id');

  const { data: topics } = await supabase
    .from('cincy_voices_topics')
    .select('id, slug, name, color')
    .order('sort_order');

  const topicMap = new Map(topics?.map(t => [t.id, t]) ?? []);

  return leaders.map(leader => {
    const leaderTopicIds = new Set(
      threadItems?.filter(ti => ti.leader_id === leader.id).map(ti => ti.topic_id) ?? []
    );
    const topic_tags = Array.from(leaderTopicIds)
      .map(id => topicMap.get(id))
      .filter(Boolean)
      .map(t => ({ slug: t!.slug, name: t!.name, color: t!.color }));

    return { ...leader, topic_tags };
  });
}

export async function getTopicsWithStats(): Promise<TopicWithStats[]> {
  const { data: topics } = await supabase
    .from('cincy_voices_topics')
    .select('*')
    .order('sort_order');

  if (!topics?.length) return [];

  const { data: threadItems } = await supabase
    .from('cincy_voices_thread_items')
    .select('topic_id, leader_id, quote_id');

  const { data: quotes } = await supabase
    .from('cincy_voices_quotes')
    .select('id, text');

  const quoteMap = new Map(quotes?.map(q => [q.id, q.text]) ?? []);

  return topics.map(topic => {
    const items = threadItems?.filter(ti => ti.topic_id === topic.id) ?? [];
    const leaderIds = new Set(items.map(ti => ti.leader_id));
    const firstQuoteId = items.find(ti => ti.quote_id)?.quote_id;

    return {
      ...topic,
      leader_count: leaderIds.size,
      item_count: items.length,
      lead_quote: firstQuoteId ? quoteMap.get(firstQuoteId) ?? null : null,
    };
  });
}

// ── Leader Profile ────────────────────────────────────

export async function getLeaderBySlug(slug: string): Promise<Leader | null> {
  const { data } = await supabase
    .from('cincy_voices_leaders')
    .select('*')
    .eq('slug', slug)
    .single();

  return data;
}

export async function getLeaderSegments(leaderId: string): Promise<Segment[]> {
  const { data } = await supabase
    .from('cincy_voices_segments')
    .select('*')
    .eq('leader_id', leaderId)
    .not('mux_playback_id', 'is', null)
    .order('clip_quality_score', { ascending: false })
    .limit(5);

  return data ?? [];
}

export async function getHeroSegment(segmentId: string): Promise<Segment | null> {
  const { data } = await supabase
    .from('cincy_voices_segments')
    .select('*')
    .eq('id', segmentId)
    .single();

  return data;
}

export async function getRelatedLeaders(leaderId: string): Promise<{ leader: Leader; shared_source: string }[]> {
  const { data: participations } = await supabase
    .from('cincy_voices_source_participants')
    .select('source_id')
    .eq('leader_id', leaderId);

  if (!participations?.length) return [];

  const sourceIds = participations.map(p => p.source_id);

  const { data: coParticipants } = await supabase
    .from('cincy_voices_source_participants')
    .select('leader_id, source_id')
    .in('source_id', sourceIds)
    .neq('leader_id', leaderId);

  if (!coParticipants?.length) return [];

  const uniqueLeaderIds = Array.from(new Set(coParticipants.map(cp => cp.leader_id)));

  const { data: leaders } = await supabase
    .from('cincy_voices_leaders')
    .select('*')
    .in('id', uniqueLeaderIds);

  const { data: sources } = await supabase
    .from('cincy_voices_sources')
    .select('id, title')
    .in('id', sourceIds);

  const sourceMap = new Map(sources?.map(s => [s.id, s.title]) ?? []);

  return (leaders ?? []).map(leader => {
    const sharedSourceId = coParticipants.find(cp => cp.leader_id === leader.id)?.source_id;
    return {
      leader,
      shared_source: sourceMap.get(sharedSourceId!) ?? 'a conversation',
    };
  });
}

export async function getLeaderTopicCounts(leaderId: string): Promise<{ topic: Topic; count: number }[]> {
  const { data: items } = await supabase
    .from('cincy_voices_thread_items')
    .select('topic_id')
    .eq('leader_id', leaderId);

  if (!items?.length) return [];

  const counts = new Map<string, number>();
  items.forEach(i => counts.set(i.topic_id, (counts.get(i.topic_id) ?? 0) + 1));

  const { data: topics } = await supabase
    .from('cincy_voices_topics')
    .select('*')
    .in('id', Array.from(counts.keys()))
    .order('sort_order');

  return (topics ?? []).map(topic => ({
    topic,
    count: counts.get(topic.id) ?? 0,
  }));
}

// ── Topic Thread ──────────────────────────────────────

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const { data } = await supabase
    .from('cincy_voices_topics')
    .select('*')
    .eq('slug', slug)
    .single();

  return data;
}

export async function getThreadItems(topicId: string): Promise<ThreadItemWithContent[]> {
  const { data: items } = await supabase
    .from('cincy_voices_thread_items')
    .select('*')
    .eq('topic_id', topicId)
    .order('sort_order');

  if (!items?.length) return [];

  const segmentIds = items.filter(i => i.segment_id).map(i => i.segment_id!);
  const quoteIds = items.filter(i => i.quote_id).map(i => i.quote_id!);
  const leaderIds = Array.from(new Set(items.map(i => i.leader_id)));

  const [segments, quotes, leaders] = await Promise.all([
    segmentIds.length ? supabase.from('cincy_voices_segments').select('*').in('id', segmentIds).then(r => r.data ?? []) : [],
    quoteIds.length ? supabase.from('cincy_voices_quotes').select('*').in('id', quoteIds).then(r => r.data ?? []) : [],
    supabase.from('cincy_voices_leaders').select('*').in('id', leaderIds).then(r => r.data ?? []),
  ]);

  const segMap = new Map((segments as Segment[]).map(s => [s.id, s]));
  const quoteMap = new Map((quotes as { id: string; text: string }[]).map(q => [q.id, q]));
  const leaderMap = new Map((leaders as Leader[]).map(l => [l.id, l]));

  return items.map(item => ({
    ...item,
    segment: item.segment_id ? segMap.get(item.segment_id) ?? null : null,
    quote: item.quote_id ? quoteMap.get(item.quote_id) ?? null : null,
    leader: leaderMap.get(item.leader_id)!,
  }));
}

export async function getTopicLeaders(topicId: string): Promise<Leader[]> {
  const { data: items } = await supabase
    .from('cincy_voices_thread_items')
    .select('leader_id')
    .eq('topic_id', topicId);

  if (!items?.length) return [];

  const uniqueIds = Array.from(new Set(items.map(i => i.leader_id)));
  const { data: leaders } = await supabase
    .from('cincy_voices_leaders')
    .select('*')
    .in('id', uniqueIds)
    .order('name');

  return leaders ?? [];
}

// ── All topics (for nav, footer) ──────────────────────

export async function getAllTopics(): Promise<Topic[]> {
  const { data } = await supabase
    .from('cincy_voices_topics')
    .select('*')
    .order('sort_order');

  return data ?? [];
}

// ── All slugs (for static params) ─────────────────────

export async function getAllLeaderSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('cincy_voices_leaders')
    .select('slug')
    .not('slug', 'is', null);

  return data?.map(l => l.slug).filter(Boolean) ?? [];
}

export async function getAllTopicSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('cincy_voices_topics')
    .select('slug');

  return data?.map(t => t.slug) ?? [];
}
