'use client';

import { useEffect, useState } from 'react';
import { characters, type Character } from './character-content';

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = characters.find((character) => character.id === selectedId);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [selectedId]);

  return <>
    <header className="site-header"><button className="brand" onClick={() => setSelectedId(null)}>志雲町立博物館</button></header>
    <main>{selected ? <CharacterDetail character={selected} onBack={() => setSelectedId(null)} /> : <Top onSelect={setSelectedId} />}</main>
    <footer><span>SHIUN MUNICIPAL MUSEUM</span><small>本サイトは架空の博物館を扱う一次創作サイトです。</small></footer>
  </>;
}

function Heading({ en, children }: { en: string; children: React.ReactNode }) {
  return <><p className="eyebrow">{en}</p><h2 className="page-title">{children}</h2></>;
}

function Top({ onSelect }: { onSelect: (id: string) => void }) {
  return <>
    <section className="hero"><p className="eyebrow">SHIUN MUNICIPAL MUSEUM</p><h1>志雲町立<br />博物館</h1><p className="hero-copy">青い鳥を探して</p></section>
    <section className="panel"><p className="eyebrow">INTRODUCTION</p><h2>初めに</h2><p>志雲町立博物館は上原龍一郎による一次創作「愛館市立郷土資料館」の派生創作です。「愛館市立郷土資料館」の世界観を基盤とした相互限定のうちよそ企画となっています。</p><a href="https://aidate-museum.uehararyuichiro.workers.dev/" target="_blank" rel="noreferrer">「愛館市立郷土資料館」公式サイトを見る ↗</a></section>
    <section className="panel"><p className="eyebrow">CURATOR</p><h2>学芸員とは</h2><p>博物館のスタッフです。</p><p>学芸員の見た目は担当の展示物と動物の要素が入ったものになっています。</p><p>学芸員は元々普通の人間です。死亡すると学芸員として雇用されます。</p><p>学芸員は歳をとりませんが、不死ではなく修復できない程の傷を受けると「破棄」となります。</p></section>
    <CharacterList onSelect={onSelect} />
    <Relationships onSelect={onSelect} />
  </>;
}

function CharacterList({ onSelect }: { onSelect: (id: string) => void }) {
  return <section className="content-section">
    <Heading en="CHARACTERS">キャラクター</Heading><p className="lead">志雲町立博物館に所属する学芸員をご紹介します。</p>
    <div className="character-grid">{characters.map((character) => <button className="character-card" key={character.id} onClick={() => onSelect(character.id)}><span className="portrait-stack"><img src={character.listImage} alt={`${character.name}の一覧画像`} /></span><b>{displayName(character)}</b><small>{character.role}</small></button>)}</div>
  </section>;
}

function CharacterDetail({ character, onBack }: { character: Character; onBack: () => void }) {
  const fields = [
    ['作成者', character.creator], ['性別', character.gender], ['身長', character.height], ['年齢', character.age], ['役職', character.role],
    ['動物', character.animal], ['性格', character.personality], ['特技', character.skill], ['能力', character.ability],
    ['生い立ち', character.background], ['その他', character.other], ['FA', character.fa], ['3L', character.threeL],
    ['深い関係', character.deepRelationship], ['NG', character.ng], ['作者からひと言', character.creatorComment],
  ];
  return <section className="page-section">
    <button className="back" onClick={onBack}>← TOPへ戻る</button>
    <div className="profile"><div className="profile-art"><img src={character.detailImage} alt={displayName(character)} /></div><div><p className="eyebrow">SHIUN CURATOR</p><h1 className="page-title">{displayName(character)}</h1><p className="lead">{character.role}</p><dl>{fields.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}<div className="design-art-field"><dt>デザイン画</dt><dd><img src={character.designImage} alt={`${displayName(character)}のデザイン画`} /></dd></div></dl>{character.postUrl && <a className="post-link" href={character.postUrl} target="_blank" rel="noreferrer">作成者のポストを見る ↗</a>}</div></div>
    {character.description && <div className="panel markdown-body">{character.description.split(/\r?\n\s*\r?\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>}
  </section>;
}

function Relationships({ onSelect }: { onSelect: (id: string) => void }) {
  const nodes = characters.map((character, index) => {
    const angle = (-90 + (360 / Math.max(characters.length, 1)) * index) * Math.PI / 180;
    return { character, x: 50 + Math.cos(angle) * 34, y: 50 + Math.sin(angle) * 34 };
  });
  const byId = new Map(nodes.map((node) => [node.character.id, node]));
  const links = nodes.flatMap((from) => from.character.relationships.map((entry) => {
    const [targetId, ...textParts] = entry.split('|');
    const to = byId.get(targetId.trim());
    return to ? { from, to, text: textParts.join('|').trim() } : null;
  }).filter((link): link is NonNullable<typeof link> => Boolean(link)));

  return <section className="content-section relationships-section">
    <Heading en="RELATIONSHIPS">相関図</Heading><p className="lead">キャラクター同士のつながりを確認できます。</p>
    {characters.length ? <div className="relation-panel"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="relation-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path className="arrow-head" d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>{links.map((link, index) => {
      const lines = link.text.split('\n');
      const dx = link.to.x - link.from.x;
      const dy = link.to.y - link.from.y;
      const distance = Math.hypot(dx, dy) || 1;
      const unitX = dx / distance;
      const unitY = dy / distance;
      const normalX = -unitY;
      const normalY = unitX;
      const reciprocal = links.some((other) => other.from.character.id === link.to.character.id && other.to.character.id === link.from.character.id);
      const curveOffset = reciprocal ? 6 : 0;
      const startX = link.from.x + unitX * 7;
      const startY = link.from.y + unitY * 7;
      const endX = link.to.x - unitX * 7;
      const endY = link.to.y - unitY * 7;
      const controlX = (startX + endX) / 2 + normalX * curveOffset;
      const controlY = (startY + endY) / 2 + normalY * curveOffset;
      const labelX = (startX + 2 * controlX + endX) / 4 + normalX * (reciprocal ? 2 : 0);
      const labelY = (startY + 2 * controlY + endY) / 4 + normalY * (reciprocal ? 2 : 0) - ((lines.length - 1) * 1.5);
      return <g key={`${link.from.character.id}-${link.to.character.id}-${index}`}><path markerEnd="url(#relation-arrow)" d={`M${startX} ${startY} Q${controlX} ${controlY} ${endX} ${endY}`} /><text x={labelX} y={labelY}>{lines.map((line, lineIndex) => <tspan key={lineIndex} x={labelX} dy={lineIndex === 0 ? 0 : 3}>{line}</tspan>)}</text></g>;
    })}</svg>{nodes.map((node) => <button className="graph-node" key={node.character.id} style={{ left: `${node.x}%`, top: `${node.y}%` }} onClick={() => onSelect(node.character.id)}><img src={node.character.listImage} alt="" /><b>{node.character.name}</b></button>)}</div> : <p className="lead">キャラクターはまだ登録されていません。</p>}
  </section>;
}

function displayName(character: Character) {
  return character.reading ? `${character.name}（${character.reading}）` : character.name;
}
