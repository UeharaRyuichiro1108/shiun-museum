'use client';

import { type FormEvent, useRef, useState } from 'react';
import { serialResults } from './serial-results';
import styles from './halloween.module.css';

type TicketStage = 'idle' | 'ready' | 'printing' | 'snap' | 'revealed';

const prizes = [
  ['3Dムービー', '1%'], ['等身イラスト', '2%'], ['ミニキャラ', '4%'],
  ['簡易イラスト', '6%'], ['アイコン', '7%'], ['もちキャラ', '10%'],
  ['キャンディ×3', '10%'], ['キャンディ×2', '20%'], ['キャンディ×1', '40%'],
];

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export default function HalloweenPage() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const [stage, setStage] = useState<TicketStage>('idle');
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const draw = async (event: FormEvent) => {
    event.preventDefault();
    clearTimers();
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setStage('idle'); setResult(''); setMessage('シリアルコードを入力してください。'); return;
    }
    const prize = serialResults[await sha256(normalized)];
    if (!prize) {
      setStage('idle'); setResult(''); setMessage('シリアルコードが一致しません。入力内容をご確認ください。'); return;
    }

    setMessage('コードを確認しました。チケットを発券しています…');
    setResult(prize);
    setStage('ready');
    timers.current.push(window.setTimeout(() => setStage('printing'), 60));
    timers.current.push(window.setTimeout(() => setStage('snap'), 1500));
    timers.current.push(window.setTimeout(() => {
      setStage('revealed');
      setMessage('抽選結果が確定しました。同じコードでは何度抽選しても同じ結果になります。');
    }, 1850));
  };

  return <div className={styles.page}>
    <header className={styles.header}><a href="/">← 志雲町立博物館へ戻る</a><span>HALLOWEEN SPECIAL EXHIBITION</span></header>
    <main className={styles.main}>
      <section className={styles.hero}>
        <p className={styles.kicker}>志雲町立博物館ハロウィン企画</p>
        <h1>Trick or Treat<br /><small>～お菓子をよこせ上原～</small></h1>
      </section>

      <section className={styles.rules}>
        <p>Xで「愛館市立郷土資料館」または「志雲町立博物館」に関するイラスト・小説を投稿するたびに、一度抽選へ参加できます。</p>
        <p className={styles.important}>対象となるのは、<strong>#愛館特別展示室</strong> または <strong>#志雲町立博物館</strong> のタグを付けて投稿された作品のみです。</p>
        <p>投稿内容は問いません。志雲町立博物館で自作したキャラクター、FA、ハロウィンに関係のない内容でも問題ありません。</p>
        <p>投稿を確認後、DMでシリアルコードをお送りします。このページの発券機へコードを入力すると抽選できます。抽選結果はコードごとに固定され、同じコードでは何度試しても同じ結果になります。</p>
        <p>イラスト景品では、描くキャラクターをご指定いただきます。志雲町立博物館以外のキャラクターでも問題ありません。</p>
        <p>投稿1件につき、シリアルコードとは別に「キャンディ」を1個受け取れます。キャンディを10個集めると、等身イラストを確定で描かせていただきます。</p>
        <p><strong>キャンディブースト：</strong>FAを投稿した場合は、通常分に加えてキャンディを受け取れます。複数のキャラクターを描いた作品は、描かれたFAキャラクターの人数分を追加で受け取れます。</p>
      </section>

      <section className={styles.prizeSection}>
        <p className={styles.kicker}>PRIZE LIST</p><h2>景品一覧</h2>
        <div className={styles.prizeList}>{prizes.map(([name, rate]) => <div key={name}><span>{name}</span><b>{rate}</b></div>)}</div>
      </section>

      <section className={styles.lottery}>
        <div className={styles.machine}>
          <div className={styles.machineTop}><span>SHIUN TICKET MACHINE</span><i /></div>
          <form onSubmit={draw} className={styles.form}>
            <label htmlFor="serial-code">シリアルコード</label>
            <input id="serial-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="SHIUN-XXXX-XXXX-XXXX" autoComplete="off" spellCheck={false} disabled={stage === 'printing' || stage === 'snap'} />
            <button type="submit" disabled={stage === 'printing' || stage === 'snap'}>抽選を開始する</button>
          </form>
          <p className={styles.message} role="status" aria-live="polite">{message || 'コードを入力し、抽選開始ボタンを押してください。'}</p>
          <div className={styles.slot}><span /></div>
          <div className={styles.ticketViewport}>
            {stage !== 'idle' && <article className={`${styles.ticket} ${styles[stage]}`}>
              <div className={styles.ticketHead}>志雲町立博物館<br /><small>HALLOWEEN LOTTERY TICKET</small></div>
              <div className={styles.ticketBody}>
                <p>抽選結果</p>
                <strong>{stage === 'revealed' ? result : '？？？？？？'}</strong>
                <small>{stage === 'revealed' ? 'おめでとうございます！' : '発券中'}</small>
              </div>
              <div className={styles.ticketCode}>{code.trim().toUpperCase()}</div>
            </article>}
          </div>
        </div>
      </section>
    </main>
  </div>;
}
