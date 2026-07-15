import fs from 'node:fs';
import path from 'node:path';

export interface Testimonial {
  slug: string;
  name: string;
  title: string;
  photo: string;
  quote: string;
}

const testimonialsDirectory = path.join(process.cwd(), 'content/testimonials');

function parseFrontmatter(fileContent: string, slug: string): Testimonial {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`Testimonial ${slug} is missing frontmatter.`);
  }

  const [, rawFrontmatter, body] = match;
  const fields = new Map<string, string>();

  for (const line of rawFrontmatter.split('\n')) {
    const fieldMatch = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (!fieldMatch) continue;
    const [, key, rawValue] = fieldMatch;
    fields.set(key, rawValue.trim().replace(/^"|"$/g, ''));
  }

  return {
    slug,
    name: fields.get('name') ?? '',
    title: fields.get('title') ?? '',
    photo: fields.get('photo') ?? '',
    quote: fields.get('quote') ?? body.trim().replace(/^"|"$/g, ''),
  };
}

export function getTestimonialBySlug(slug: string): Testimonial | null {
  const fullPath = path.join(testimonialsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  return parseFrontmatter(fs.readFileSync(fullPath, 'utf8'), slug);
}

const TESTIMONIAL_MARKER = /^\[\[testimonial:\s*([a-z0-9-]+)\s*\]\]$/i;

export function parseTestimonialMarker(paragraph: string): string | null {
  const match = paragraph.trim().match(TESTIMONIAL_MARKER);
  return match ? match[1] : null;
}
