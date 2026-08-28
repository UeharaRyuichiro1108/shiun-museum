export type NewsItem = {
  id: string;
  date: string;
  title: string;
};

const markdownFiles = import.meta.glob('../content/news/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const unquote = (value: string) => {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

function parseNews(path: string, source: string): NewsItem {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`お知らせMarkdown（${path}）に --- で囲んだ設定欄がありません。`);

  const values: Record<string, string> = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const field = rawLine.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (field) values[field[1]] = unquote(field[2]);
  }

  const id = path.split('/').pop()?.replace(/\.md$/, '') || path;
  return {
    id,
    date: values.date || '',
    title: values.title || match[2].trim() || 'お知らせ',
  };
}

export const newsItems = Object.entries(markdownFiles)
  .map(([path, source]) => parseNews(path, source))
  .filter((item) => item.date && item.title)
  .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
