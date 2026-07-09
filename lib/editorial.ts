import fs from 'node:fs';
import path from 'node:path';

export interface EditorialArticle {
  title: string;
  slug: string;
  dek: string;
  leaderSlug: string;
  leaderName: string;
  leaderRole: string;
  category: string;
  publishedAt: string;
  readTime: string;
  heroImage: string;
  pullQuotes: string[];
  topics: string[];
  body: string;
}

const editorialDirectory = path.join(process.cwd(), 'content/editorial');

function parseList(value: string): string[] {
  return value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '))
    .map(line => line.slice(2).trim().replace(/^"|"$/g, ''));
}

function parseFrontmatter(fileContent: string): EditorialArticle {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Editorial article is missing frontmatter.');
  }

  const [, rawFrontmatter, body] = match;
  const fields = new Map<string, string>();
  const lists = new Map<string, string[]>();
  const lines = rawFrontmatter.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fieldMatch = line.match(/^([A-Za-z]+):(?:\s*(.*))?$/);
    if (!fieldMatch) continue;

    const [, key, rawValue = ''] = fieldMatch;
    const value = rawValue.trim();

    if (value) {
      fields.set(key, value.replace(/^"|"$/g, ''));
      continue;
    }

    const listLines: string[] = [];
    while (lines[index + 1]?.startsWith('  - ')) {
      index += 1;
      listLines.push(lines[index]);
    }
    lists.set(key, parseList(listLines.join('\n')));
  }

  return {
    title: fields.get('title') ?? '',
    slug: fields.get('slug') ?? '',
    dek: fields.get('dek') ?? '',
    leaderSlug: fields.get('leaderSlug') ?? '',
    leaderName: fields.get('leaderName') ?? '',
    leaderRole: fields.get('leaderRole') ?? '',
    category: fields.get('category') ?? '',
    publishedAt: fields.get('publishedAt') ?? '',
    readTime: fields.get('readTime') ?? '',
    heroImage: fields.get('heroImage') ?? '',
    pullQuotes: lists.get('pullQuotes') ?? [],
    topics: lists.get('topics') ?? [],
    body: body.trim(),
  };
}

function readArticleFile(fileName: string): EditorialArticle {
  const fullPath = path.join(editorialDirectory, fileName);
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  return parseFrontmatter(fileContent);
}

export function getAllEditorialArticles(): EditorialArticle[] {
  if (!fs.existsSync(editorialDirectory)) return [];

  return fs
    .readdirSync(editorialDirectory)
    .filter(fileName => fileName.endsWith('.md'))
    .map(readArticleFile)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getEditorialArticleBySlug(slug: string): EditorialArticle | null {
  return getAllEditorialArticles().find(article => article.slug === slug) ?? null;
}

export function getAllEditorialSlugs(): string[] {
  return getAllEditorialArticles().map(article => article.slug);
}

export function getEditorialArticleForLeader(leaderSlug: string): EditorialArticle | null {
  return getAllEditorialArticles().find(article => article.leaderSlug === leaderSlug) ?? null;
}

export function renderArticleParagraphs(body: string): string[] {
  return body.split(/\n{2,}/).map(paragraph => paragraph.trim()).filter(Boolean);
}
