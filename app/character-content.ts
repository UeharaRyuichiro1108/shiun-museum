export type Character = {
  id: string;
  order: number;
  name: string;
  reading: string;
  gender: string;
  height: string;
  age: string;
  role: string;
  creator: string;
  postUrl: string;
  animal: string;
  personality: string;
  skill: string;
  ability: string;
  background: string;
  other: string;
  fa: string;
  threeL: string;
  deepRelationship: string;
  ng: string;
  creatorComment: string;
  listImage: string;
  detailImage: string;
  designImage: string;
  relationships: string[];
  description: string;
};

const markdownFiles = import.meta.glob('../content/characters/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const unquote = (value: string) => {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).replace(/\\n/g, '\n');
  }
  return trimmed;
};

function parseCharacter(source: string): Character {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!match) throw new Error('キャラクターMarkdownに --- で囲んだ設定欄がありません。');

  const values: Record<string, string | string[]> = {};
  let listKey = '';
  for (const rawLine of match[1].split(/\r?\n/)) {
    const listItem = rawLine.match(/^\s+-\s+(.+)$/);
    if (listItem && listKey) {
      (values[listKey] as string[]).push(unquote(listItem[1]));
      continue;
    }
    const field = rawLine.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!field) continue;
    const [, key, rawValue] = field;
    if (!rawValue.trim()) {
      values[key] = [];
      listKey = key;
    } else {
      values[key] = unquote(rawValue);
      listKey = '';
    }
  }

  const text = (key: string, fallback = '未設定') => String(values[key] || fallback);
  return {
    id: text('id', ''),
    order: Number(text('order', '9999')),
    name: text('name'),
    reading: text('reading', ''),
    gender: text('gender'),
    height: text('height'),
    age: text('age'),
    role: text('role'),
    creator: text('creator'),
    postUrl: text('postUrl', ''),
    animal: text('animal'),
    personality: text('personality'),
    skill: text('skill'),
    ability: text('ability'),
    background: text('background'),
    other: text('other'),
    fa: text('fa'),
    threeL: text('threeL'),
    deepRelationship: text('deepRelationship'),
    ng: text('ng'),
    creatorComment: text('creatorComment'),
    listImage: text('listImage', '/images/chibi.png'),
    detailImage: text('detailImage', text('listImage', '/images/chibi.png')),
    designImage: text('designImage', text('detailImage', text('listImage', '/images/chibi.png'))),
    relationships: Array.isArray(values.relationships) ? values.relationships : [],
    description: match[2].trim(),
  };
}

export const characters = Object.values(markdownFiles)
  .map(parseCharacter)
  .filter((character) => character.id)
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'ja'));
