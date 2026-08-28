'use client';

import { useEffect, useState } from 'react';
import { characters, type Character } from './character-content';

type Section = 'TOP' | 'キャラクター' | 'イラスト（上原）' | 'イラスト（参加者）' | '相関図';
type Artwork = { title: string; src: string };

const nav: Section[] = ['TOP', 'キャラクター', 'イラスト（上原）', 'イラスト（参加者）', '相関図'];
const artworks: Artwork[] = [];
const gifted: { name: string; src: string; url: string }[] = [];
const news = [
  ['2026.08.28', '志雲町立博物館の特設サイトを公開しました'],
  ['2026.08.20', 'キャラクター紹介を追加しました'],
  ['2026.08.12', '展示イラストを更新しました'],
];

export default function Home() {
  const [section, setSection] = useState<Section>('TOP');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [art, setArt] = useState<Artwork | null>(null);
  const [menu, setMenu] = useState(false);
  const selected = characters.find((character) => character.id === selectedId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenu(false);
  }, [section, selectedId]);

  const changeSection = (item: Section) => {
    setSection(item);
    setSelectedId(null);
  };

  return (
    <>
      <header className="site-header">
        <button className="brand" onClick={() => changeSection('TOP')}>志雲町立博物館</button>
        <button className="menu" aria-label={menu ? 'メニューを閉じる' : 'メニューを開く'} aria-expanded={menu} onClick={() => setMenu(!menu)}>MENU</button>
        <nav className={menu ? 'open' : ''} aria-label="メインナビゲーション">
          {nav.map((item) => (
            <button key={item} className={section === item && !selected ? 'active' : ''} onClick={() => changeSection(item)}>{item}</button>
          ))}
        </nav>
      </header>

      <main>
        {section === 'TOP' && <Top />}
        {section === 'キャラクター' && (selected ? (
          <CharacterDetail character={selected} onBack={() => setSelectedId(null)} />
        ) : (
          <CharacterList onSelect={setSelectedId} />
        ))}
        {section === 'イラスト（上原）' && (
          <section className="page-section">
            <Heading en="GALLERY">イラスト（上原）</Heading>
            <p className="lead">作品を選ぶと大きく表示されます。</p>
            <div className="gallery">{artworks.map((item) => <button key={item.src} onClick={() => setArt(item)}><img src={item.src} alt={item.title} /><span>{item.title}</span></button>)}</div>
          </section>
        )}
        {section === 'イラスト（参加者）' && (
          <section className="page-section">
            <Heading en="GUEST WORKS">イラスト（参加者）</Heading>
            <p className="lead">描いていただいた作品へのリンク集です。</p>
            <div className="guest-grid">{gifted.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noreferrer"><img src={item.src} alt="" /><div><b>{item.name} 様</b><span>Xで見る ↗</span></div></a>)}</div>
          </section>
        )}
        {section === '相関図' && <Relationships onSelect={(id) => { setSection('キャラクター'); setSelectedId(id); }} />}
      </main>

      <footer><span>SHIUN MUNICIPAL MUSEUM</span><small>本サイトは架空の博物館を扱う一次創作サイトです。</small></footer>
      {art && <div className="modal" role="dialog" aria-modal="true" aria-label={art.title} onClick={() => setArt(null)}><button aria-label="閉じる">×</button><figure onClick={(event) => event.stopPropagation()}><img src={art.src} alt={art.title} /><figcaption>{art.title}</figcaption></figure></div>}
    </>
  );
}

function Heading({ en, children }: { en: string; children: React.ReactNode }) {
  return <><p className="eyebrow">{en}</p><h1 className="page-title">{children}</h1></>;
}

function Top() {
  return <>
    <section className="hero"><p className="eyebrow">SHIUN MUNICIPAL MUSEUM</p><h1>志雲町立<br />博物館</h1><p className="hero-copy">青い鳥を探して</p></section>
    <section className="panel"><p className="eyebrow">INTRODUCTION</p><h2>初めに</h2><p>志雲町立博物館は上原龍一郎による一次創作「愛館市立郷土資料館」の派生創作です。「愛館市立郷土資料館」の世界観を基盤とした相互限定のうちよそ企画となっています。</p><a href="https://aidate-museum.uehararyuichiro.workers.dev/" target="_blank" rel="noreferrer">「愛館市立郷土資料館」公式サイトを見る ↗</a></section>
    <section className="panel"><p className="eyebrow">CURATOR</p><h2>学芸員とは</h2><p>博物館のスタッフです。</p><p>学芸員の見た目は担当の展示物と動物の要素が入ったものになっています。</p><p>学芸員は元々普通の人間です。死亡すると学芸員として雇用されます。</p><p>学芸員は歳をとりませんが、不死ではなく修復できない程の傷を受けると「破棄」となります。</p></section>
    <section className="news"><div><p className="eyebrow">NEWS</p><h2>お知らせ</h2></div><div className="news-list">{news.map(([date, title]) => <article key={title}><time>{date}</time><span>{title}</span></article>)}</div></section>
  </>;
}

function CharacterList({ onSelect }: { onSelect: (id: string) => void }) {
  return <section className="page-section">
    <Heading en="CHARACTERS">キャラクター</Heading>
    <p className="lead">志雲町立博物館に所属する学芸員をご紹介します。</p>
    <div className="character-grid">
      {characters.map((character) => (
        <button className="character-card" key={character.id} onClick={() => onSelect(character.id)}>
          <span className="portrait-stack"><img className="normal" src={character.listImage} alt={`${character.name}の一覧画像`} /></span>
          <b>{displayName(character)}</b><small>{character.role}</small>
        </button>
      ))}
    </div>
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
    <button className="back" onClick={onBack}>← キャラクター一覧へ</button>
    <div className="profile">
      <div className="profile-art"><img src={character.detailImage} alt={displayName(character)} /></div>
      <div><p className="eyebrow">SHIUN CURATOR</p><h1 className="page-title">{displayName(character)}</h1><p className="lead">{character.role}</p><dl>{fields.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>{character.postUrl && <a className="post-link" href={character.postUrl} target="_blank" rel="noreferrer">作成者のポストを見る ↗</a>}</div>
    </div>
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

  return <section className="page-section">
    <Heading en="RELATIONSHIPS">相関図</Heading><p className="lead">キャラクター同士のつながりを確認できます。</p>
    {characters.length ? <div className="relation-panel">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {links.map((link, index) => {
          const lines = link.text.split('\n');
          const labelX = (link.from.x + link.to.x) / 2;
          const labelY = (link.from.y + link.to.y) / 2 - ((lines.length - 1) * 1.5);
          return <g key={`${link.from.character.id}-${link.to.character.id}-${index}`}>
            <path d={`M${link.from.x} ${link.from.y} L${link.to.x} ${link.to.y}`} />
            <text x={labelX} y={labelY}>{lines.map((line, lineIndex) => <tspan key={lineIndex} x={labelX} dy={lineIndex === 0 ? 0 : 3}>{line}</tspan>)}</text>
          </g>;
        })}
      </svg>
      {nodes.map((node) => <button className="graph-node graph-button" key={node.character.id} style={{ left: `${node.x}%`, top: `${node.y}%` }} onClick={() => onSelect(node.character.id)}><img src={node.character.listImage} alt="" /><b>{node.character.name}</b></button>)}
    </div> : <p className="lead">キャラクターはまだ登録されていません。</p>}
  </section>;
}

function displayName(character: Character) {
  return character.reading ? `${character.name}（${character.reading}）` : character.name;
}
