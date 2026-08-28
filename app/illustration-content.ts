export type UeharaArtwork = {
  id: string;
  order: number;
  title: string;
  src: string;
};

export type ParticipantArtwork = {
  id: string;
  order: number;
  name: string;
  src: string;
  url: string;
};

const ueharaFiles = import.meta.glob('../content/illustrations/uehara/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const participantFiles = import.meta.glob('../content/illustrations/participants/*.md', {
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

function parseFields(path: string, source: string) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`イラストMarkdown（${path}）に --- で囲んだ設定欄がありません。`);

  const values: Record<string, string> = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const field = rawLine.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (field) values[field[1]] = unquote(field[2]);
  }
  return {
    id: path.split('/').pop()?.replace(/\.md$/, '') || path,
    values,
  };
}

export const ueharaArtworks: UeharaArtwork[] = Object.entries(ueharaFiles)
  .map(([path, source]) => {
    const { id, values } = parseFields(path, source);
    return { id, order: Number(values.order || '9999'), title: values.title || '無題', src: values.image || '' };
  })
  .filter((item) => item.src)
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'ja'));

export const participantArtworks: ParticipantArtwork[] = Object.entries(participantFiles)
  .map(([path, source]) => {
    const { id, values } = parseFields(path, source);
    return { id, order: Number(values.order || '9999'), name: values.creator || '匿名', src: values.image || '', url: values.postUrl || '' };
  })
  .filter((item) => item.src)
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'ja'));
