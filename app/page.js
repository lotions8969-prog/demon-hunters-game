'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/* ═══════════════════════════════════════════════════════
   IMAGES — official r2.kpopdemon.com CDN
═══════════════════════════════════════════════════════ */
const IMG = {
  rumi: {
    profile:     'https://r2.kpopdemon.com/gallery/huntrix/rumi/rumi-profile.jpg',
    performance: 'https://r2.kpopdemon.com/gallery/huntrix/rumi/rumi-performance.jpg',
    demon:       'https://r2.kpopdemon.com/gallery/huntrix/rumi/rumi-demon-form.jpg',
    roof:        'https://r2.kpopdemon.com/gallery/huntrix/rumi/rumi-on-roof.jpg',
    sword:       'https://r2.kpopdemon.com/gallery/huntrix/rumi/rumi-holding-saingeom.jpg',
  },
  mira: {
    profile:     'https://r2.kpopdemon.com/gallery/huntrix/mira/mira-profile.jpg',
    dance:       'https://r2.kpopdemon.com/gallery/huntrix/mira/mira-dance.jpg',
    weapon:      'https://r2.kpopdemon.com/gallery/huntrix/mira/mira-holding-woldo.jpg',
    stool:       'https://r2.kpopdemon.com/gallery/huntrix/mira/mira-dancing-on-stool.jpg',
  },
  zoey: {
    profile:     'https://r2.kpopdemon.com/gallery/huntrix/zoey/zoey-profile.jpg',
    performance: 'https://r2.kpopdemon.com/gallery/huntrix/zoey/zoey-performance.jpg',
    stage:       'https://r2.kpopdemon.com/gallery/huntrix/zoey/zoey-singing-on-stage.jpg',
    closeup:     'https://r2.kpopdemon.com/gallery/huntrix/zoey/zoey-face-close-up.jpg',
    determined:  'https://r2.kpopdemon.com/gallery/huntrix/zoey/zoey-looks-forward-with-determined-look.jpg',
  },
}

/* ═══════════════════════════════════════════════════════
   CHARACTER DATA
═══════════════════════════════════════════════════════ */
const CHARS = [
  {
    id: 'rumi', name: 'ルミ', nameEn: 'RUMI', role: 'リーダー', emoji: '👑',
    color: '#C084FC', dark: '#6D28D9', light: '#F3E8FF',
    bg: 'linear-gradient(160deg,#0f0720 0%,#2a0855 55%,#5b21b6 100%)',
    img: IMG.rumi, desc: 'つよくてやさしいリーダー！',
  },
  {
    id: 'mira', name: 'ミラ', nameEn: 'MIRA', role: 'ダンサー', emoji: '🔥',
    color: '#FB7185', dark: '#BE123C', light: '#FFF1F2',
    bg: 'linear-gradient(160deg,#1c0507 0%,#4c0519 55%,#9f1239 100%)',
    img: IMG.mira, desc: 'おどりのてんさいダンサー！',
  },
  {
    id: 'zoey', name: 'ゾーイ', nameEn: 'ZOEY', role: 'ラッパー', emoji: '🎤',
    color: '#38BDF8', dark: '#0369A1', light: '#E0F2FE',
    bg: 'linear-gradient(160deg,#020c1a 0%,#0c2d4c 55%,#075985 100%)',
    img: IMG.zoey, desc: 'クールでかわいいラッパー！',
  },
]

/* ═══════════════════════════════════════════════════════
   GAME CATALOGUE
═══════════════════════════════════════════════════════ */
const GAMES = [
  { id: 'starCatch',    label: 'スターキャッチ',   emoji: '⭐', desc: '落ちてくる星をタップ！' },
  { id: 'memoryCards',  label: 'メモリーカード',   emoji: '🃏', desc: 'おなじ写真をさがそう！' },
  { id: 'bubblePop',    label: 'バブルポップ',     emoji: '🫧', desc: 'うかぶバブルをはじこう！' },
  { id: 'hideSeek',     label: 'かくれんぼ',       emoji: '👀', desc: 'でてきたらすぐタップ！' },
  { id: 'rhythmTap',    label: 'リズムタップ',     emoji: '🎵', desc: 'おんぷがきたらタップ！' },
  { id: 'puzzle',       label: 'パズル',           emoji: '🧩', desc: 'しゃしんをあわせよう！' },
  { id: 'demonShoot',   label: 'デーモンシュート', emoji: '🗡️', desc: 'デーモンをたおせ！' },
  { id: 'janken',       label: 'じゃんけん',       emoji: '✊', desc: 'キャラとじゃんけん！' },
  { id: 'simonSays',    label: 'サイモンセズ',     emoji: '🎮', desc: 'おなじじゅんばんでタップ！' },
  { id: 'numberTouch',  label: 'ナンバータッチ',   emoji: '🔢', desc: '1からじゅんにタップ！' },
  { id: 'slot',         label: 'スロット',         emoji: '🎰', desc: 'キャラをそろえよう！' },
  { id: 'ballCatch',    label: 'ボールキャッチ',   emoji: '🏀', desc: 'おちものをキャッチ！' },
  { id: 'speedTap',     label: 'スピードタップ',   emoji: '⚡', desc: 'できるだけはやくタップ！' },
  { id: 'movingTarget', label: '的当て',           emoji: '🎯', desc: 'ちょうどいいときにタップ！' },
  { id: 'quickDraw',    label: 'クイックドロー',   emoji: '🔔', desc: 'シグナルがでたらすぐタップ！' },
  { id: 'demonAvoid',   label: 'デーモンアボイド', emoji: '🏃', desc: 'デーモンをよけろ！' },
  { id: 'photoSnap',    label: 'フォトスナップ',   emoji: '📸', desc: 'いいしゃしんをとろう！' },
]

const DROP_ITEMS = [
  { emoji:'⭐',pts:10,glow:'#FFD700' }, { emoji:'💜',pts:10,glow:'#C084FC' },
  { emoji:'❤️',pts:10,glow:'#FB7185' }, { emoji:'💙',pts:10,glow:'#38BDF8' },
  { emoji:'🌟',pts:15,glow:'#FFD700' }, { emoji:'💫',pts:15,glow:'#F0ABFC' },
  { emoji:'✨',pts:10,glow:'#E0F2FE' }, { emoji:'🎵',pts:10,glow:'#A78BFA' },
  { emoji:'💎',pts:20,glow:'#93C5FD' }, { emoji:'🌸',pts:10,glow:'#FBB6CE' },
]
const SPECIAL_ITEMS = [
  { emoji:'🌈',pts:50,glow:'#FFD700' }, { emoji:'🏆',pts:50,glow:'#FFD700' },
  { emoji:'🎊',pts:40,glow:'#FB923C' },
]

/* ═══════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════ */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ═══════════════════════════════════════════════════════
   AUDIO ENGINE — BGM: YouTube (Huntrix "Golden") + SFX: Web Audio
═══════════════════════════════════════════════════════ */
// YouTube video IDs for Huntrix / KPop Demon Hunters OST
const YT_PLAYLIST = ['-JStINmfSbk', 'AzCAwdp1uIQ']

function makeAudio(getYtPlayer) {
  let ctx = null, master = null

  function init() {
    if (ctx) return
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    master = ctx.createGain(); master.gain.value = 0.38; master.connect(ctx.destination)
  }
  function tone(t,freq,dur,vol=.2) {
    if(!freq||!ctx)return
    const o=ctx.createOscillator(),g=ctx.createGain()
    o.type='sine';o.connect(g);g.connect(master)
    o.frequency.value=freq
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.04)
    g.gain.setValueAtTime(vol,t+dur*.82);g.gain.linearRampToValueAtTime(.001,t+dur)
    o.start(t);o.stop(t+dur)
  }
  function sfx(freqs,durs,vols) {
    if(!ctx||ctx.state!=='running')return
    const t=ctx.currentTime
    freqs.forEach((f,i)=>tone(t+(durs[i]||0),f,.18+(durs[i]||0),vols?vols[i]:.4))
  }
  function ytPlay() {
    try {
      const p=getYtPlayer?.()
      if(!p||!p.playVideo)return
      p.setVolume(38)
      if(p.getPlayerState&&p.getPlayerState()!==1)p.playVideo()
    } catch(e){}
  }
  function ytStop() {
    try { const p=getYtPlayer?.(); if(p?.stopVideo)p.stopVideo() } catch(e){}
  }
  return {
    start(){init();if(ctx.state==='suspended')ctx.resume();ytPlay()},
    stop(){ytStop();ctx?.suspend()},
    resume(){ctx?.state==='suspended'&&ctx.resume()},
    sfxCatch(){ sfx([880,1760],[0,.1]) },
    sfxCombo(){ sfx([880,1046.5,1318.5],[0,.09,.18]) },
    sfxSpecial(){ sfx([523.25,659.25,783.99,1046.5],[0,.07,.14,.21]) },
    sfxGameOver(){ if(!ctx)return;if(ctx.state==='suspended')ctx.resume();const t=ctx.currentTime+.1;[[523.25,0],[659.25,.18],[783.99,.36],[1046.5,.54]].forEach(([f,d])=>tone(t+d,f,.4,.3)) },
    sfxCardFlip(){ sfx([600,800],[0,.05],[.25,.2]) },
    sfxCardMatch(){ sfx([880,1046.5,1318.5,1760],[0,.06,.12,.18],[.35,.35,.35,.35]) },
    sfxBubble(){ sfx([1200,800],[0,.08],[.3,.25]) },
    sfxAppear(){ sfx([660,880],[0,.08]) },
    sfxHide(){ sfx([440,330],[0,.08],[.2,.2]) },
    sfxRhythmGood(){ sfx([880,1046.5],[0,.08]) },
    sfxRhythmMiss(){ sfx([220,180],[0,.12],[.2,.2]) },
    sfxPieceMove(){ sfx([600],[0],[.3]) },
    sfxPuzzleDone(){ sfx([523.25,659.25,783.99,880,1046.5],[0,.08,.16,.24,.32],[.35,.35,.35,.35,.4]) },
    sfxHit(){ sfx([160,110],[0,.1],[.5,.5]) },
  }
}

/* ═══════════════════════════════════════════════════════
   SHARED UI HELPERS
═══════════════════════════════════════════════════════ */
function CharImg({ src, size, style={}, className='', radius='50%' }) {
  return (
    <img
      src={src}
      style={{ width:size, height:size, objectFit:'cover', borderRadius:radius, display:'block', ...style }}
      className={className}
      draggable={false}
      onError={e => { e.target.style.display='none' }}
    />
  )
}

function HUD({ char, score, timeLeft, combo=0, urgent=false }) {
  return (
    <div style={{
      position:'absolute', top:0, left:0, right:0,
      padding:'.6rem .9rem', display:'flex', alignItems:'center', gap:'.8rem',
      background:'rgba(0,0,0,.5)', backdropFilter:'blur(8px)', zIndex:30,
    }}>
      <div style={{flex:1}}>
        <div style={{color:'rgba(255,255,255,.5)',fontSize:'.65rem'}}>スコア</div>
        <div style={{color:'#FFD700',fontSize:'clamp(1.3rem,5vw,2rem)',fontWeight:900,lineHeight:1}}>
          {score.toLocaleString()}
        </div>
      </div>
      <div style={{textAlign:'center',flexShrink:0}}>
        <div style={{fontSize:'1.5rem'}}>{char.emoji}</div>
        <div style={{color:char.color,fontSize:'.75rem',fontWeight:700}}>{char.name}</div>
      </div>
      <div style={{flex:1,textAlign:'right'}}>
        <div style={{color:'rgba(255,255,255,.5)',fontSize:'.65rem'}}>のこり</div>
        <div style={{
          color:urgent?'#F87171':'white',
          fontSize:'clamp(1.3rem,5vw,2rem)',fontWeight:900,lineHeight:1,
          animation:urgent?'urgentPulse .5s ease-in-out infinite':'none',
        }}>
          {timeLeft}
        </div>
      </div>
      {combo>=2&&(
        <div style={{
          position:'absolute',top:'100%',left:'50%',transform:'translateX(-50%)',
          background:`${char.color}25`,border:`1.5px solid ${char.color}88`,
          borderRadius:'100px',padding:'.15rem .8rem',color:char.color,
          fontSize:'.85rem',fontWeight:700,zIndex:30,whiteSpace:'nowrap',
          animation:'comboFlash .35s ease-in-out infinite',
        }}>
          {combo} コンボ！✨
        </div>
      )}
    </div>
  )
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      position:'absolute',top:8,left:8,zIndex:50,
      background:'rgba(0,0,0,.5)',border:'1.5px solid rgba(255,255,255,.3)',
      borderRadius:'100px',color:'white',padding:'.3rem .9rem',
      fontSize:'.85rem',cursor:'pointer',backdropFilter:'blur(4px)',
    }}>← もどる</button>
  )
}

function Confetti() {
  const p = useRef(Array.from({length:60},(_,i)=>({
    id:i, x:Math.random()*100,
    color:['#C084FC','#FB7185','#38BDF8','#FFD700','#4ADE80','#FB923C','#F472B6'][i%7],
    size:7+Math.random()*11, dur:2.2+Math.random()*2.8, delay:Math.random()*1.8,
    round:Math.random()>.5,
  })))
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:0}}>
      {p.current.map(c=>(
        <div key={c.id} style={{
          position:'absolute',left:`${c.x}%`,top:'-20px',
          width:c.size,height:c.size,background:c.color,
          borderRadius:c.round?'50%':'2px',
          animation:`confettiFall ${c.dur}s ease-in ${c.delay}s infinite`,
        }}/>
      ))}
    </div>
  )
}

function ScoreParticle({ p }) {
  return (
    <div style={{
      position:'fixed',left:p.x-40,top:p.y-20,
      color:p.color,fontSize:p.big?'1.9rem':'1.4rem',fontWeight:900,
      pointerEvents:'none',animation:'floatUp .85s ease-out forwards',
      textShadow:'0 2px 10px rgba(0,0,0,.9)',zIndex:200,whiteSpace:'nowrap',
    }}>{p.text}</div>
  )
}

/* ═══════════════════════════════════════════════════════
   TITLE SCREEN
═══════════════════════════════════════════════════════ */
function TitleScreen({ onStart }) {
  const stars = useRef(Array.from({length:20},(_,i)=>({
    id:i, x:Math.random()*100, y:Math.random()*100,
    size:10+Math.random()*16,
    color:['#C084FC','#FB7185','#38BDF8','#FFD700'][i%4],
    dur:1.8+Math.random()*2.8, delay:Math.random()*3,
  })))
  return (
    <div style={{
      position:'fixed',inset:0,
      background:'linear-gradient(160deg,#0a0320 0%,#180840 45%,#0d1535 100%)',
      display:'flex',flexDirection:'column',alignItems:'center',
      justifyContent:'center',overflow:'hidden',padding:'1rem',
    }}>
      {stars.current.map(s=>(
        <div key={s.id} style={{
          position:'absolute',left:`${s.x}%`,top:`${s.y}%`,
          fontSize:`${s.size}px`,color:s.color,
          animation:`starTwinkle ${s.dur}s ease-in-out infinite`,
          animationDelay:`${s.delay}s`,pointerEvents:'none',
        }}>✦</div>
      ))}

      {/* Character trio with real images */}
      <div style={{display:'flex',gap:'clamp(.5rem,3vw,1.5rem)',alignItems:'flex-end',marginBottom:'1.5rem',zIndex:1}}>
        {CHARS.map((c,i) => (
          <div key={c.id} style={{textAlign:'center',animation:`titleFloat ${2.2+i*.3}s ease-in-out infinite`,animationDelay:`${i*.2}s`}}>
            <div style={{
              width:'clamp(80px,18vw,120px)',height:'clamp(80px,18vw,120px)',
              borderRadius:'50%',overflow:'hidden',
              border:`3px solid ${c.color}`,
              boxShadow:`0 0 24px ${c.color}88`,margin:'0 auto',
            }}>
              <img src={c.img.profile} style={{width:'100%',height:'100%',objectFit:'cover'}} draggable={false}/>
            </div>
            <div style={{color:c.color,fontSize:'.9rem',fontWeight:700,marginTop:'4px'}}>{c.name}</div>
          </div>
        ))}
      </div>

      <div style={{color:'#E50914',fontSize:'1rem',letterSpacing:'.15em',fontWeight:900,marginBottom:'.4rem',zIndex:1}}>
        NETFLIX ✦ KPOP
      </div>
      <div style={{animation:'titleFloat 3s ease-in-out infinite',textAlign:'center',zIndex:1,marginBottom:'1.5rem'}}>
        <h1 style={{
          fontSize:'clamp(2rem,9vw,4.5rem)',fontWeight:900,lineHeight:1.05,
          background:'linear-gradient(135deg,#F0ABFC 0%,#818CF8 40%,#38BDF8 70%,#C084FC 100%)',
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
          animation:'titleGlow 2.5s ease-in-out infinite',letterSpacing:'.02em',
        }}>
          デーモン<br/>ハンターズ
        </h1>
        <div style={{color:'#94A3B8',fontSize:'clamp(.8rem,2.5vw,1rem)',letterSpacing:'.3em',marginTop:'.4rem'}}>
          ★ DEMON HUNTERS ★
        </div>
      </div>

      <button onClick={onStart} style={{
        padding:'clamp(.9rem,3vw,1.2rem) clamp(2rem,6vw,3.5rem)',
        fontSize:'clamp(1.2rem,4vw,1.6rem)',fontWeight:900,border:'none',
        borderRadius:'100px',
        background:'linear-gradient(135deg,#C084FC 0%,#818CF8 50%,#38BDF8 100%)',
        color:'white',cursor:'pointer',animation:'btnPulse 2s ease-in-out infinite',
        letterSpacing:'.08em',zIndex:1,boxShadow:'0 8px 32px rgba(192,132,252,.5)',
      }}>▶ あそぼう！</button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CHARACTER SELECT
═══════════════════════════════════════════════════════ */
function SelectScreen({ onSelect }) {
  const [hov, setHov] = useState(null)
  return (
    <div style={{
      position:'fixed',inset:0,
      background:'linear-gradient(160deg,#0a0320 0%,#180840 100%)',
      display:'flex',flexDirection:'column',alignItems:'center',
      justifyContent:'center',padding:'clamp(.5rem,2vw,1.5rem)',overflow:'hidden',
    }}>
      <h2 style={{color:'#F0ABFC',fontWeight:700,textAlign:'center',
        fontSize:'clamp(1.2rem,5vw,2.2rem)',marginBottom:'clamp(1rem,3vw,2rem)',
        animation:'titleFloat 3s ease-in-out infinite'}}>
        ✨ だれといっしょにあそぶ？ ✨
      </h2>
      <div style={{display:'flex',gap:'clamp(.5rem,2vw,1.2rem)',flexWrap:'wrap',justifyContent:'center',maxWidth:960}}>
        {CHARS.map(c => (
          <button key={c.id} onClick={()=>onSelect(c)}
            onMouseEnter={()=>setHov(c.id)} onMouseLeave={()=>setHov(null)}
            style={{
              background:hov===c.id?`linear-gradient(160deg,${c.dark}cc,${c.color}33)`:'rgba(255,255,255,.04)',
              border:`2.5px solid ${hov===c.id?c.color:'rgba(255,255,255,.1)'}`,
              borderRadius:'28px',padding:'clamp(1rem,3vw,1.8rem) clamp(.8rem,2vw,1.4rem)',
              cursor:'pointer',transition:'all .3s cubic-bezier(.34,1.56,.64,1)',
              display:'flex',flexDirection:'column',alignItems:'center',gap:'.5rem',
              minWidth:'clamp(140px,25vw,220px)',
              transform:hov===c.id?'translateY(-10px) scale(1.04)':'translateY(0) scale(1)',
              boxShadow:hov===c.id?`0 20px 56px ${c.color}44`:'0 4px 20px rgba(0,0,0,.3)',
            }}>
            <div style={{
              width:'clamp(110px,22vw,160px)',height:'clamp(130px,26vw,190px)',
              borderRadius:'16px',overflow:'hidden',
              border:`2px solid ${c.color}55`,
              boxShadow:`0 0 ${hov===c.id?'20px':'8px'} ${c.color}55`,
              transition:'box-shadow .3s',
            }}>
              <img src={c.img.profile} style={{width:'100%',height:'100%',objectFit:'cover'}} draggable={false}/>
            </div>
            <div style={{color:c.color,fontSize:'clamp(1.4rem,5vw,2rem)',fontWeight:900}}>{c.name}</div>
            <div style={{background:c.color,color:'white',padding:'.25rem .9rem',borderRadius:'100px',fontSize:'.8rem',fontWeight:700}}>
              {c.emoji} {c.role}
            </div>
            <div style={{color:'rgba(255,255,255,.65)',fontSize:'.82rem',textAlign:'center'}}>{c.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME HUB
═══════════════════════════════════════════════════════ */
function GameHub({ char, highScores, onSelectGame, onBack }) {
  const [hov, setHov] = useState(null)
  return (
    <div style={{
      position:'fixed',inset:0,background:char.bg,
      display:'flex',flexDirection:'column',alignItems:'center',
      padding:'clamp(.5rem,2vw,1rem)',overflowY:'auto',
    }}>
      <BackBtn onClick={onBack}/>

      {/* Character strip */}
      <div style={{display:'flex',alignItems:'center',gap:'1rem',marginTop:'2.5rem',marginBottom:'1rem'}}>
        <div style={{width:60,height:60,borderRadius:'50%',overflow:'hidden',border:`2.5px solid ${char.color}`,boxShadow:`0 0 16px ${char.color}88`}}>
          <img src={char.img.profile} style={{width:'100%',height:'100%',objectFit:'cover'}} draggable={false}/>
        </div>
        <div>
          <div style={{color:char.color,fontSize:'1.4rem',fontWeight:900}}>{char.name}</div>
          <div style={{color:'rgba(255,255,255,.6)',fontSize:'.8rem'}}>といっしょにあそぼう！</div>
        </div>
      </div>

      <h2 style={{color:'white',fontSize:'clamp(1rem,4vw,1.6rem)',fontWeight:700,marginBottom:'1rem',textAlign:'center'}}>
        🎮 ゲームをえらんでね！
      </h2>

      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill,minmax(clamp(140px,28vw,200px),1fr))',
        gap:'clamp(.5rem,2vw,1rem)',
        width:'100%',maxWidth:720,paddingBottom:'1rem',
      }}>
        {GAMES.map(g => (
          <button key={g.id}
            onClick={()=>onSelectGame(g.id)}
            onMouseEnter={()=>setHov(g.id)} onMouseLeave={()=>setHov(null)}
            style={{
              background:hov===g.id?`${char.color}25`:'rgba(255,255,255,.06)',
              border:`2px solid ${hov===g.id?char.color:'rgba(255,255,255,.12)'}`,
              borderRadius:'20px',padding:'1rem .8rem',cursor:'pointer',
              transition:'all .25s ease',
              transform:hov===g.id?'translateY(-4px) scale(1.03)':'scale(1)',
              boxShadow:hov===g.id?`0 12px 32px ${char.color}33`:'none',
              display:'flex',flexDirection:'column',alignItems:'center',gap:'.4rem',
            }}>
            <div style={{fontSize:'2.5rem'}}>{g.emoji}</div>
            <div style={{color:'white',fontWeight:700,fontSize:'clamp(.85rem,3vw,1rem)'}}>{g.label}</div>
            <div style={{color:'rgba(255,255,255,.55)',fontSize:'.72rem',textAlign:'center'}}>{g.desc}</div>
            {highScores[g.id]>0&&(
              <div style={{color:char.color,fontSize:'.72rem',fontWeight:700}}>
                ベスト: {highScores[g.id].toLocaleString()}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   RESULT SCREEN
═══════════════════════════════════════════════════════ */
function ResultScreen({ char, score, highScore, gameLabel, onReplay, onHub }) {
  const stars = score>=700?3:score>=300?2:1
  const msgs = ['がんばった！','すごい！！','かんぺき！✨']
  return (
    <div style={{position:'fixed',inset:0,background:char.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:1,overflow:'hidden'}}>
      <Confetti/>
      <div style={{position:'relative',zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:'.9rem',padding:'1rem',animation:'slideInUp .5s ease-out'}}>
        {/* Big character image */}
        <div style={{width:'clamp(100px,25vw,160px)',height:'clamp(120px,30vw,200px)',borderRadius:'20px',overflow:'hidden',border:`3px solid ${char.color}`,boxShadow:`0 0 32px ${char.color}99`}}>
          <img src={char.img.performance||char.img.profile} style={{width:'100%',height:'100%',objectFit:'cover'}} draggable={false}/>
        </div>
        <div style={{fontSize:'clamp(1.8rem,7vw,3rem)',letterSpacing:'.3rem'}}>
          {Array.from({length:3},(_,i)=><span key={i} style={{opacity:i<stars?1:.18,filter:i<stars?'drop-shadow(0 0 8px #FFD700)':'none'}}>⭐</span>)}
        </div>
        <div style={{color:'white',fontSize:'clamp(1.6rem,6vw,2.5rem)',fontWeight:900,animation:'titleFloat 2s ease-in-out infinite',textShadow:`0 0 24px ${char.color}`}}>
          {msgs[stars-1]}
        </div>
        <div style={{background:'rgba(255,255,255,.08)',borderRadius:24,padding:'1rem 2rem',border:`2px solid ${char.color}44`,backdropFilter:'blur(8px)'}}>
          <div style={{color:'rgba(255,255,255,.55)',fontSize:'.8rem',marginBottom:4}}>{gameLabel}</div>
          <div style={{color:'#FFD700',fontSize:'clamp(2rem,9vw,3.5rem)',fontWeight:900,lineHeight:1}}>
            {score.toLocaleString()}
          </div>
          {highScore>0&&(
            <div style={{color:char.color,fontSize:'.82rem',marginTop:4}}>
              {score>=highScore?'🏆 新記録！':`ハイスコア: ${highScore.toLocaleString()}`}
            </div>
          )}
        </div>
        <div style={{display:'flex',gap:'.8rem',flexWrap:'wrap',justifyContent:'center'}}>
          <button onClick={onReplay} style={{padding:'.85rem 1.8rem',fontSize:'clamp(1rem,3.5vw,1.2rem)',fontWeight:900,border:'none',borderRadius:'100px',background:`linear-gradient(135deg,${char.color},${char.dark})`,color:'white',cursor:'pointer',animation:'btnPulse 2s ease-in-out infinite',boxShadow:`0 8px 32px ${char.color}55`}}>
            🔄 もう一度！
          </button>
          <button onClick={onHub} style={{padding:'.85rem 1.8rem',fontSize:'clamp(1rem,3.5vw,1.2rem)',fontWeight:900,border:`2px solid ${char.color}`,borderRadius:'100px',background:'transparent',color:char.color,cursor:'pointer'}}>
            🎮 ゲームえらぶ
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 1: スターキャッチ
═══════════════════════════════════════════════════════ */
function StarCatch({ char, audio, onEnd, onBack }) {
  const [score,    setScore]    = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [items,    setItems]    = useState([])
  const [combo,    setCombo]    = useState(0)
  const [particles,setParticles]= useState([])
  const [showTap,  setShowTap]  = useState(true)

  const scoreRef=useRef(0),comboRef=useRef(0),timeRef=useRef(60)
  const itemsRef=useRef([]),nextId=useRef(0)
  const rafRef=useRef(null),timerRef=useRef(null),spawnRef=useRef(null)
  const activeRef=useRef(true)

  const endGame=useCallback(()=>{
    if(!activeRef.current)return
    activeRef.current=false
    audio.stop()
    cancelAnimationFrame(rafRef.current)
    clearTimeout(spawnRef.current)
    clearInterval(timerRef.current)
    setTimeout(()=>{audio.sfxGameOver();onEnd(scoreRef.current)},80)
  },[audio,onEnd])

  useEffect(()=>{
    setTimeout(()=>setShowTap(false),3000)
    audio.start()
    const H=window.innerHeight
    function loop(){
      if(!activeRef.current)return
      itemsRef.current=itemsRef.current.map(i=>({...i,y:i.y+i.speed})).filter(i=>i.y<H+80)
      setItems([...itemsRef.current])
      rafRef.current=requestAnimationFrame(loop)
    }
    rafRef.current=requestAnimationFrame(loop)
    timerRef.current=setInterval(()=>{
      const n=timeRef.current-1;timeRef.current=n;setTimeLeft(n)
      if(n<=0){clearInterval(timerRef.current);endGame()}
    },1000)
    function spawn(){
      if(!activeRef.current)return
      const prog=1-timeRef.current/60
      const rate=Math.max(550,1400-prog*850)
      const sp=Math.random()<.08?SPECIAL_ITEMS:DROP_ITEMS
      const pk=sp[Math.floor(Math.random()*sp.length)]
      const sz=74+Math.random()*14
      const W=window.innerWidth
      itemsRef.current=[...itemsRef.current,{
        id:nextId.current++,x:Math.max(0,Math.random()*(W-sz-8)),y:-sz-10,
        size:sz,emoji:pk.emoji,pts:pk.pts,glow:pk.glow,
        speed:1.6+prog*2.4+Math.random()*.4,special:sp===SPECIAL_ITEMS,
      }]
      spawnRef.current=setTimeout(spawn,rate)
    }
    spawnRef.current=setTimeout(spawn,600)
    return()=>{
      activeRef.current=false
      cancelAnimationFrame(rafRef.current)
      clearTimeout(spawnRef.current)
      clearInterval(timerRef.current)
    }
  },[audio,endGame])

  const catchItem=useCallback((id,pts,cx,cy,special)=>{
    if(!itemsRef.current.find(i=>i.id===id))return
    itemsRef.current=itemsRef.current.filter(i=>i.id!==id)
    setItems([...itemsRef.current])
    const nc=comboRef.current+1;comboRef.current=nc;setCombo(nc)
    const mult=nc>=5?3:nc>=3?2:1;const earned=pts*mult
    scoreRef.current+=earned;setScore(scoreRef.current)
    const pid=Date.now()+Math.random()
    setParticles(p=>[...p,{id:pid,x:cx,y:cy,text:nc>=3?`+${earned} コンボ！！`:`+${earned}`,color:special?'#FFD700':nc>=3?'#FB923C':'white',big:nc>=3}])
    setTimeout(()=>setParticles(p=>p.filter(x=>x.id!==pid)),900)
    if(special)audio.sfxSpecial();else if(nc>=3)audio.sfxCombo();else audio.sfxCatch()
  },[audio])

  return (
    <div style={{position:'fixed',inset:0,background:char.bg,overflow:'hidden'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <HUD char={char} score={score} timeLeft={timeLeft} combo={combo} urgent={timeLeft<=10}/>
      <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:'rgba(255,255,255,.1)',zIndex:30}}>
        <div style={{width:`${(timeLeft/60)*100}%`,height:'100%',background:timeLeft<=10?'#F87171':char.color,transition:'width 1s linear',boxShadow:`0 0 10px ${char.color}`}}/>
      </div>
      {showTap&&<div style={{position:'absolute',top:'42%',left:'50%',transform:'translate(-50%,-50%)',color:'white',fontSize:'clamp(1.4rem,5vw,2.2rem)',fontWeight:900,textAlign:'center',pointerEvents:'none',zIndex:25,textShadow:`0 0 20px ${char.color}`,animation:'comboFlash .6s ease-in-out infinite'}}>⬇ タップして！ ⬇</div>}
      {items.map(item=>(
        <div key={item.id} onPointerDown={e=>{e.stopPropagation();catchItem(item.id,item.pts,e.clientX,e.clientY,item.special)}}
          style={{position:'absolute',left:item.x,top:item.y,width:item.size,height:item.size,fontSize:`${item.size*.66}px`,lineHeight:`${item.size}px`,textAlign:'center',cursor:'pointer',animation:'itemSpin 1.2s ease-in-out infinite',filter:`drop-shadow(0 0 10px ${item.glow})`,zIndex:10,touchAction:'none',userSelect:'none'}}>
          {item.emoji}
        </div>
      ))}
      {particles.map(p=><ScoreParticle key={p.id} p={p}/>)}
      {/* Character real image at bottom */}
      <div style={{position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',zIndex:5,filter:`drop-shadow(0 0 20px ${char.color}88)`}}>
        <img src={char.img.profile} style={{width:'clamp(80px,18vw,130px)',height:'clamp(90px,22vw,160px)',objectFit:'cover',objectPosition:'top',borderRadius:'12px 12px 0 0'}} draggable={false}/>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 2: メモリーカード
═══════════════════════════════════════════════════════ */
const CARD_BASE = [
  {key:'rumi_p',   src:IMG.rumi.profile,     label:'ルミ',   charColor:'#C084FC'},
  {key:'mira_p',   src:IMG.mira.profile,     label:'ミラ',   charColor:'#FB7185'},
  {key:'zoey_p',   src:IMG.zoey.profile,     label:'ゾーイ', charColor:'#38BDF8'},
  {key:'rumi_s',   src:IMG.rumi.sword,       label:'ルミ⚔️', charColor:'#C084FC'},
  {key:'mira_d',   src:IMG.mira.dance,       label:'ミラ💃', charColor:'#FB7185'},
  {key:'zoey_s',   src:IMG.zoey.stage,       label:'ゾーイ🎤',charColor:'#38BDF8'},
]

function MemoryCards({ char, audio, onEnd, onBack }) {
  const [cards] = useState(()=>shuffle(CARD_BASE.flatMap((c,i)=>[{...c,uid:i*2},{...c,uid:i*2+1}])))
  const [flipped,  setFlipped]  = useState([])   // card indices currently face-up (pending check)
  const [matched,  setMatched]  = useState(new Set())   // uids of matched cards
  const [moves,    setMoves]    = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const lockRef=useRef(false),timerRef=useRef(null),activeRef=useRef(true)
  const timeRef=useRef(90),moveRef=useRef(0)

  const endGame=useCallback((matched_count)=>{
    if(!activeRef.current)return
    activeRef.current=false
    clearInterval(timerRef.current)
    audio.stop()
    const tBonus=timeRef.current*4,mBonus=Math.max(0,300-moveRef.current*8),pBonus=matched_count*60
    setTimeout(()=>{audio.sfxGameOver();onEnd(tBonus+mBonus+pBonus)},200)
  },[audio,onEnd])

  useEffect(()=>{
    audio.start()
    timerRef.current=setInterval(()=>{
      const n=timeRef.current-1;timeRef.current=n;setTimeLeft(n)
      if(n<=0){clearInterval(timerRef.current);endGame(matched.size/2)}
    },1000)
    return()=>{activeRef.current=false;clearInterval(timerRef.current)}
  },[])// eslint-disable-line

  function flipCard(idx) {
    if(!activeRef.current||lockRef.current)return
    if(matched.has(cards[idx].uid))return
    if(flipped.includes(idx))return
    const nf=[...flipped,idx]
    setFlipped(nf)
    audio.sfxCardFlip()
    if(nf.length===2){
      lockRef.current=true
      moveRef.current+=1;setMoves(moveRef.current)
      const [a,b]=nf
      if(cards[a].key===cards[b].key){
        setTimeout(()=>{
          setMatched(prev=>{
            const nx=new Set(prev);nx.add(cards[a].uid);nx.add(cards[b].uid)
            if(nx.size===cards.length){setTimeout(()=>endGame(nx.size/2),400)}
            return nx
          })
          setFlipped([]);lockRef.current=false;audio.sfxCardMatch()
        },600)
      }else{
        setTimeout(()=>{setFlipped([]);lockRef.current=false},1100)
      }
    }
  }

  const cols=4,rows=Math.ceil(cards.length/cols)
  const cardW=Math.min(Math.floor((window.innerWidth-32)/(cols+.5)),110)
  const cardH=Math.round(cardW*1.35)

  return (
    <div style={{position:'fixed',inset:0,background:char.bg,display:'flex',flexDirection:'column',alignItems:'center',overflow:'hidden'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      {/* HUD */}
      <div style={{paddingTop:'52px',paddingBottom:'8px',display:'flex',gap:'2rem',color:'white',fontSize:'clamp(.9rem,3vw,1.1rem)',fontWeight:700}}>
        <span>⏱ {timeLeft}s</span>
        <span style={{color:'#FFD700'}}>✅ {matched.size/2}/{cards.length/2}</span>
        <span style={{color:'rgba(255,255,255,.6)'}}>👆 {moves}</span>
      </div>
      {/* Grid */}
      <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},${cardW}px)`,gap:8,padding:'4px 12px',overflowY:'auto'}}>
        {cards.map((card,idx)=>{
          const isUp=flipped.includes(idx)||matched.has(card.uid)
          const isMatched=matched.has(card.uid)
          return (
            <div key={card.uid} onPointerDown={()=>flipCard(idx)} style={{
              width:cardW,height:cardH,borderRadius:12,overflow:'hidden',cursor:'pointer',
              border:`2.5px solid ${isMatched?'#FFD700':isUp?card.charColor:'rgba(255,255,255,.2)'}`,
              boxShadow:isMatched?'0 0 16px #FFD700':isUp?`0 0 12px ${card.charColor}88`:'none',
              background:'rgba(0,0,0,.5)',transition:'box-shadow .2s',
              animation:isMatched?'cardMatch .4s ease-out':'none',
              position:'relative',
            }}>
              {isUp?(
                <img src={card.src} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top',animation:'cardIn .2s ease-out'}} draggable={false}/>
              ):(
                <div style={{
                  width:'100%',height:'100%',
                  background:`linear-gradient(135deg,${char.dark},${char.color}66)`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:cardW*.45,
                }}>
                  {char.emoji}
                </div>
              )}
              {isMatched&&<div style={{position:'absolute',top:4,right:4,fontSize:'1rem'}}>✅</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 3: バブルポップ
═══════════════════════════════════════════════════════ */
function BubblePop({ char, audio, onEnd, onBack }) {
  const [score,    setScore]    = useState(0)
  const [timeLeft, setTimeLeft] = useState(50)
  const [bubbles,  setBubbles]  = useState([])
  const [pops,     setPops]     = useState([])   // popped animation {id,x,y,color}

  const scoreRef=useRef(0),timeRef=useRef(50),bubblesRef=useRef([])
  const nextId=useRef(0),rafRef=useRef(null),timerRef=useRef(null),spawnRef=useRef(null)
  const activeRef=useRef(true)

  const BIMGS=[
    {src:IMG.rumi.profile,     color:CHARS[0].color},
    {src:IMG.mira.profile,     color:CHARS[1].color},
    {src:IMG.zoey.profile,     color:CHARS[2].color},
    {src:IMG.rumi.performance, color:CHARS[0].color},
    {src:IMG.mira.dance,       color:CHARS[1].color},
    {src:IMG.zoey.closeup,     color:CHARS[2].color},
  ]

  const endGame=useCallback(()=>{
    if(!activeRef.current)return
    activeRef.current=false;audio.stop()
    cancelAnimationFrame(rafRef.current);clearTimeout(spawnRef.current);clearInterval(timerRef.current)
    setTimeout(()=>{audio.sfxGameOver();onEnd(scoreRef.current)},80)
  },[audio,onEnd])

  useEffect(()=>{
    audio.start()
    const H=window.innerHeight
    function loop(){
      if(!activeRef.current)return
      bubblesRef.current=bubblesRef.current.map(b=>({...b,y:b.y-b.speed})).filter(b=>b.y>-b.size-20)
      setBubbles([...bubblesRef.current]);rafRef.current=requestAnimationFrame(loop)
    }
    rafRef.current=requestAnimationFrame(loop)
    timerRef.current=setInterval(()=>{
      const n=timeRef.current-1;timeRef.current=n;setTimeLeft(n)
      if(n<=0){clearInterval(timerRef.current);endGame()}
    },1000)
    function spawn(){
      if(!activeRef.current)return
      const prog=1-timeRef.current/50
      const rate=Math.max(550,1500-prog*950)
      const pick=BIMGS[Math.floor(Math.random()*BIMGS.length)]
      const size=68+Math.random()*28
      const W=window.innerWidth
      bubblesRef.current=[...bubblesRef.current,{
        id:nextId.current++,x:Math.max(0,Math.random()*(W-size)),y:H+10,
        size,src:pick.src,color:pick.color,speed:1.4+prog*1.6+Math.random()*.4,pts:10,
      }]
      spawnRef.current=setTimeout(spawn,rate)
    }
    spawnRef.current=setTimeout(spawn,500)
    return()=>{activeRef.current=false;cancelAnimationFrame(rafRef.current);clearTimeout(spawnRef.current);clearInterval(timerRef.current)}
  },[])// eslint-disable-line

  function popBubble(id,x,y,color,pts){
    if(!bubblesRef.current.find(b=>b.id===id))return
    bubblesRef.current=bubblesRef.current.filter(b=>b.id!==id)
    setBubbles([...bubblesRef.current])
    scoreRef.current+=pts;setScore(scoreRef.current)
    const pid=Date.now()+Math.random()
    setPops(p=>[...p,{id:pid,x,y,color}])
    setTimeout(()=>setPops(p=>p.filter(x=>x.id!==pid)),400)
    audio.sfxBubble()
  }

  return (
    <div style={{position:'fixed',inset:0,background:char.bg,overflow:'hidden'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <div style={{position:'absolute',top:0,left:0,right:0,padding:'.6rem 1rem',background:'rgba(0,0,0,.45)',backdropFilter:'blur(6px)',zIndex:30,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{color:'#FFD700',fontSize:'clamp(1.3rem,5vw,2rem)',fontWeight:900}}>{score.toLocaleString()}</div>
        <div style={{color:char.color,fontSize:'1.1rem',fontWeight:700}}>{char.emoji} {char.name}</div>
        <div style={{color:timeLeft<=10?'#F87171':'white',fontSize:'clamp(1.3rem,5vw,2rem)',fontWeight:900,animation:timeLeft<=10?'urgentPulse .5s infinite':'none'}}>{timeLeft}s</div>
      </div>
      {/* Bubbles */}
      {bubbles.map(b=>(
        <div key={b.id} onPointerDown={e=>{e.stopPropagation();popBubble(b.id,e.clientX,e.clientY,b.color,b.pts)}}
          style={{
            position:'absolute',left:b.x,top:b.y,width:b.size,height:b.size,
            borderRadius:'50%',overflow:'hidden',cursor:'pointer',touchAction:'none',
            border:`3px solid ${b.color}`,boxShadow:`0 0 20px ${b.color}66`,
            animation:'bubbleWobble 1.5s ease-in-out infinite',
          }}>
          <img src={b.src} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}} draggable={false}/>
        </div>
      ))}
      {/* Pop effects */}
      {pops.map(p=>(
        <div key={p.id} style={{position:'fixed',left:p.x-30,top:p.y-30,width:60,height:60,borderRadius:'50%',background:p.color,animation:'bubblePop .4s ease-out forwards',pointerEvents:'none',zIndex:100,opacity:.8}}/>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 4: かくれんぼ
═══════════════════════════════════════════════════════ */
const SPOTS=[
  {x:'18%',y:'45%'},{x:'50%',y:'38%'},{x:'82%',y:'45%'}
]
const HIDE_EMOJIS=['⭐','🌙','🔮']

function HideSeek({ char, audio, onEnd, onBack }) {
  const [score,    setScore]    = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [active,   setActive]   = useState(null)   // {spotIdx, charObj, appeared}
  const [justPopped, setJustPopped] = useState(null)

  const scoreRef=useRef(0),timeRef=useRef(60),activeRef2=useRef(true)
  const activeDataRef=useRef(null),timerRef=useRef(null),showTimer=useRef(null),nextTimer=useRef(null)

  const endGame=useCallback(()=>{
    if(!activeRef2.current)return
    activeRef2.current=false;audio.stop()
    clearInterval(timerRef.current);clearTimeout(showTimer.current);clearTimeout(nextTimer.current)
    setTimeout(()=>{audio.sfxGameOver();onEnd(scoreRef.current)},80)
  },[audio,onEnd])

  function scheduleNext(delay){
    clearTimeout(nextTimer.current)
    nextTimer.current=setTimeout(()=>{
      if(!activeRef2.current)return
      const prog=1-timeRef.current/60
      const duration=Math.max(750,1600-prog*850)
      const waitAfter=Math.max(350,900-prog*550)
      const c=CHARS[Math.floor(Math.random()*3)]
      const s=Math.floor(Math.random()*3)
      const data={spotIdx:s,charObj:c,appeared:Date.now()}
      activeDataRef.current=data;setActive(data);audio.sfxAppear()
      showTimer.current=setTimeout(()=>{
        if(activeDataRef.current===data){setActive(null);activeDataRef.current=null;audio.sfxHide()}
        scheduleNext(waitAfter)
      },duration)
    },delay)
  }

  useEffect(()=>{
    audio.start()
    timerRef.current=setInterval(()=>{
      const n=timeRef.current-1;timeRef.current=n;setTimeLeft(n)
      if(n<=0){clearInterval(timerRef.current);endGame()}
    },1000)
    scheduleNext(1000)
    return()=>{activeRef2.current=false;clearInterval(timerRef.current);clearTimeout(showTimer.current);clearTimeout(nextTimer.current)}
  },[])// eslint-disable-line

  function tapSpot(spotIdx){
    if(!activeDataRef.current||activeDataRef.current.spotIdx!==spotIdx)return
    const data=activeDataRef.current
    clearTimeout(showTimer.current)
    activeDataRef.current=null;setActive(null)
    const elapsed=Date.now()-data.appeared
    const pts=elapsed<500?40:elapsed<900?25:12
    scoreRef.current+=pts;setScore(scoreRef.current)
    setJustPopped({spotIdx,pts})
    setTimeout(()=>setJustPopped(null),500)
    audio.sfxCatch()
    scheduleNext(600)
  }

  return (
    <div style={{position:'fixed',inset:0,background:char.bg,overflow:'hidden'}}>
      <BackBtn onClick={()=>{activeRef2.current=false;audio.stop();onBack()}}/>
      <div style={{position:'absolute',top:0,left:0,right:0,padding:'.6rem 1rem',background:'rgba(0,0,0,.45)',backdropFilter:'blur(6px)',zIndex:30,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{color:'#FFD700',fontSize:'clamp(1.3rem,5vw,2rem)',fontWeight:900}}>{score.toLocaleString()}</div>
        <div style={{color:'rgba(255,255,255,.7)',fontSize:'.9rem',fontWeight:600}}>👀 でてきたらタップ！</div>
        <div style={{color:timeLeft<=10?'#F87171':'white',fontSize:'clamp(1.3rem,5vw,2rem)',fontWeight:900}}>{timeLeft}s</div>
      </div>

      {/* Background decoration */}
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',opacity:.06,fontSize:'8rem',pointerEvents:'none'}}>✦</div>

      {/* Hiding spots */}
      {SPOTS.map((spot,idx)=>{
        const isActive=active?.spotIdx===idx
        const isPopped=justPopped?.spotIdx===idx
        return (
          <div key={idx} onPointerDown={()=>tapSpot(idx)} style={{
            position:'absolute',left:spot.x,top:spot.y,
            transform:'translate(-50%,-50%)',
            cursor:'pointer',userSelect:'none',touchAction:'none',
          }}>
            {/* Hiding object */}
            <div style={{
              fontSize:'clamp(80px,18vw,120px)',lineHeight:1,textAlign:'center',
              animation:'hideSpotGlow 3s ease-in-out infinite',
              filter:isActive?`drop-shadow(0 0 24px ${active.charObj.color})`:`drop-shadow(0 0 8px rgba(255,255,255,.15))`,
              transition:'filter .2s',
            }}>
              {HIDE_EMOJIS[idx]}
            </div>
            {/* Character peeking out */}
            {isActive&&(
              <div style={{
                position:'absolute',bottom:'55%',left:'50%',
                animation:'peekOut .15s ease-out',
                pointerEvents:'none',
              }}>
                <div style={{
                  width:'clamp(60px,14vw,90px)',height:'clamp(60px,14vw,90px)',
                  borderRadius:'50%',overflow:'hidden',
                  border:`3px solid ${active.charObj.color}`,
                  boxShadow:`0 0 20px ${active.charObj.color}cc`,
                }}>
                  <img src={active.charObj.img.profile} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}} draggable={false}/>
                </div>
              </div>
            )}
            {/* Popped score */}
            {isPopped&&(
              <div style={{
                position:'absolute',top:'-20px',left:'50%',
                color:'#FFD700',fontWeight:900,fontSize:'1.6rem',
                animation:'hidePop .5s ease-out forwards',
                pointerEvents:'none',whiteSpace:'nowrap',
              }}>
                +{justPopped.pts}
              </div>
            )}
          </div>
        )
      })}

      {/* Instruction at start */}
      <div style={{position:'absolute',bottom:'1.5rem',left:'50%',transform:'translateX(-50%)',color:'rgba(255,255,255,.55)',fontSize:'.85rem',textAlign:'center',pointerEvents:'none',whiteSpace:'nowrap'}}>
        キャラクターがでてきたら すばやくタップ！⚡
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 5: リズムタップ
═══════════════════════════════════════════════════════ */
function RhythmTap({ char, audio, onEnd, onBack }) {
  const [score,    setScore]    = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [notes,    setNotes]    = useState([])
  const [feedback, setFeedback] = useState(null)  // {col,text,color}
  const [colFlash, setColFlash] = useState(null)

  const scoreRef=useRef(0),timeRef=useRef(60),notesRef=useRef([])
  const nextId=useRef(0),rafRef=useRef(null),timerRef=useRef(null),spawnRef=useRef(null)
  const activeRef=useRef(true),fbTimer=useRef(null)
  // Target zone: bottom 100px of game area
  const GAME_H=useRef(0),TARGET_Y=useRef(0)

  const endGame=useCallback(()=>{
    if(!activeRef.current)return
    activeRef.current=false;audio.stop()
    cancelAnimationFrame(rafRef.current);clearTimeout(spawnRef.current);clearInterval(timerRef.current)
    setTimeout(()=>{audio.sfxGameOver();onEnd(scoreRef.current)},80)
  },[audio,onEnd])

  useEffect(()=>{
    const H=window.innerHeight
    GAME_H.current=H;TARGET_Y.current=H-130
    audio.start()
    function loop(){
      if(!activeRef.current)return
      notesRef.current=notesRef.current.map(n=>({...n,y:n.y+n.speed})).filter(n=>{
        if(n.y>GAME_H.current+20){return false}
        return true
      })
      setNotes([...notesRef.current]);rafRef.current=requestAnimationFrame(loop)
    }
    rafRef.current=requestAnimationFrame(loop)
    timerRef.current=setInterval(()=>{const n=timeRef.current-1;timeRef.current=n;setTimeLeft(n);if(n<=0){clearInterval(timerRef.current);endGame()}},1000)
    function spawn(){
      if(!activeRef.current)return
      const prog=1-timeRef.current/60
      const rate=Math.max(450,1100-prog*650)
      const col=Math.floor(Math.random()*3)
      notesRef.current=[...notesRef.current,{
        id:nextId.current++,col,y:-50,
        speed:2.2+prog*2.2+Math.random()*.4,pts:10,
      }]
      spawnRef.current=setTimeout(spawn,rate)
    }
    spawnRef.current=setTimeout(spawn,600)
    return()=>{activeRef.current=false;cancelAnimationFrame(rafRef.current);clearTimeout(spawnRef.current);clearInterval(timerRef.current)}
  },[])// eslint-disable-line

  function tapCol(col){
    setColFlash(col);setTimeout(()=>setColFlash(null),150)
    const inZone=notesRef.current.filter(n=>n.col===col&&n.y>TARGET_Y.current-70&&n.y<TARGET_Y.current+60)
    if(!inZone.length)return
    const closest=inZone.reduce((a,b)=>Math.abs(a.y-TARGET_Y.current)<Math.abs(b.y-TARGET_Y.current)?a:b)
    const off=Math.abs(closest.y-TARGET_Y.current)
    const type=off<22?'かんぺき！':off<50?'グッド！':'OK'
    const pts=off<22?30:off<50?20:10
    notesRef.current=notesRef.current.filter(n=>n.id!==closest.id)
    scoreRef.current+=pts;setScore(scoreRef.current)
    clearTimeout(fbTimer.current)
    setFeedback({col,text:type,color:off<22?'#FFD700':off<50?CHARS[col].color:'rgba(255,255,255,.7)'})
    fbTimer.current=setTimeout(()=>setFeedback(null),500)
    if(off<22)audio.sfxCombo();else audio.sfxRhythmGood()
  }

  const colW=Math.floor((window.innerWidth-24)/3)
  return (
    <div style={{position:'fixed',inset:0,background:char.bg,overflow:'hidden'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      {/* Score + Timer */}
      <div style={{position:'absolute',top:0,left:0,right:0,padding:'.6rem 1rem',background:'rgba(0,0,0,.45)',backdropFilter:'blur(6px)',zIndex:30,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{color:'#FFD700',fontSize:'clamp(1.3rem,5vw,2rem)',fontWeight:900}}>{score.toLocaleString()}</div>
        <div style={{color:'rgba(255,255,255,.7)',fontSize:'.9rem'}}>🎵 リズムタップ</div>
        <div style={{color:timeLeft<=10?'#F87171':'white',fontSize:'clamp(1.3rem,5vw,2rem)',fontWeight:900}}>{timeLeft}s</div>
      </div>

      {/* Lane headers */}
      <div style={{position:'absolute',top:52,left:0,right:0,display:'flex',zIndex:20}}>
        {CHARS.map((c,i)=>(
          <div key={c.id} style={{flex:1,textAlign:'center',padding:'.3rem 0',borderBottom:`2px solid ${c.color}44`,background:`${c.color}10`}}>
            <div style={{width:36,height:36,borderRadius:'50%',overflow:'hidden',margin:'0 auto',border:`2px solid ${c.color}`}}>
              <img src={c.img.profile} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}} draggable={false}/>
            </div>
          </div>
        ))}
      </div>

      {/* Lane dividers */}
      {[1,2].map(i=>(
        <div key={i} style={{position:'absolute',top:52,bottom:0,left:`${(100/3)*i}%`,width:'1px',background:'rgba(255,255,255,.1)',zIndex:1}}/>
      ))}

      {/* Notes */}
      {notes.map(n=>(
        <div key={n.id} style={{
          position:'absolute',
          left:n.col*(colW+8)+12,
          top:n.y,
          width:colW-8,height:44,
          borderRadius:22,
          background:`linear-gradient(135deg,${CHARS[n.col].dark},${CHARS[n.col].color})`,
          boxShadow:`0 0 16px ${CHARS[n.col].color}88`,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:'1.3rem',
          zIndex:10,pointerEvents:'none',
        }}>
          <img src={CHARS[n.col].img.profile} style={{width:36,height:36,objectFit:'cover',objectPosition:'top',borderRadius:'50%',border:`2px solid white`}} draggable={false}/>
        </div>
      ))}

      {/* Hit zone line */}
      <div style={{position:'absolute',bottom:120,left:0,right:0,height:3,background:'rgba(255,255,255,.25)',zIndex:5,boxShadow:'0 0 8px rgba(255,255,255,.3)'}}/>

      {/* Feedback labels */}
      {feedback&&(
        <div style={{
          position:'absolute',
          left:`calc(${feedback.col*(100/3)}% + ${(100/3)/2}% - 40px)`,
          bottom:160,color:feedback.color,fontWeight:900,fontSize:'1.4rem',
          animation:'feedbackPop .5s ease-out forwards',
          pointerEvents:'none',zIndex:20,whiteSpace:'nowrap',
        }}>
          {feedback.text}
        </div>
      )}

      {/* Tap buttons */}
      <div style={{position:'absolute',bottom:16,left:0,right:0,display:'flex',gap:8,padding:'0 12px',zIndex:20}}>
        {CHARS.map((c,i)=>(
          <button key={c.id} onPointerDown={()=>tapCol(i)} style={{
            flex:1,height:90,borderRadius:16,border:`3px solid ${c.color}`,
            background:colFlash===i?`${c.color}55`:`${c.color}20`,
            cursor:'pointer',touchAction:'none',
            transition:'background .1s',
            display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,
            boxShadow:colFlash===i?`0 0 24px ${c.color}`:'none',
          }}>
            <div style={{width:44,height:44,borderRadius:'50%',overflow:'hidden',border:`2px solid ${c.color}`,boxShadow:`0 0 12px ${c.color}88`}}>
              <img src={c.img.profile} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}} draggable={false}/>
            </div>
            <div style={{color:c.color,fontSize:'.7rem',fontWeight:700}}>{c.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 6: パズル
═══════════════════════════════════════════════════════ */
const PUZZLE_IMGS=[
  {src:IMG.rumi.performance, label:'ルミ',   color:CHARS[0].color},
  {src:IMG.mira.stool,       label:'ミラ',   color:CHARS[1].color},
  {src:IMG.zoey.stage,       label:'ゾーイ', color:CHARS[2].color},
]
// 2x3 grid = 6 pieces
const PCOLS=3, PROWS=2

function Puzzle({ char, audio, onEnd, onBack }) {
  const [imgIdx,    setImgIdx]    = useState(null)  // which image selected
  const [pieces,    setPieces]    = useState(null)  // array of origPos values
  const [selected,  setSelected]  = useState(null)  // currently selected tile index
  const [moves,     setMoves]     = useState(0)
  const [done,      setDone]      = useState(false)
  const startTime=useRef(null),moveRef=useRef(0),activeRef=useRef(true)

  function startPuzzle(idx){
    setImgIdx(idx)
    let arr=Array.from({length:PCOLS*PROWS},(_,i)=>i)
    // Shuffle until not solved
    do{arr=shuffle(arr)}while(arr.every((v,i)=>v===i))
    setPieces(arr);setSelected(null);setMoves(0);moveRef.current=0;setDone(false)
    startTime.current=Date.now();audio.start()
  }

  function tapPiece(idx){
    if(done||!activeRef.current)return
    if(selected===null){setSelected(idx);audio.sfxPieceMove()}
    else{
      if(selected===idx){setSelected(null);return}
      const np=[...pieces];[np[selected],np[idx]]=[np[idx],np[selected]]
      setPieces(np);setSelected(null);moveRef.current+=1;setMoves(moveRef.current)
      audio.sfxPieceMove()
      if(np.every((v,i)=>v===i)){
        setDone(true);audio.sfxPuzzleDone()
        const elapsed=(Date.now()-startTime.current)/1000
        const tBonus=Math.max(0,300-elapsed*2)
        const mBonus=Math.max(0,200-moveRef.current*12)
        setTimeout(()=>{audio.stop();onEnd(Math.round(tBonus+mBonus+200))},1200)
      }
    }
  }

  // Image select screen
  if(imgIdx===null){
    return (
      <div style={{position:'fixed',inset:0,background:char.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1.2rem'}}>
        <BackBtn onClick={()=>{activeRef.current=false;onBack()}}/>
        <h2 style={{color:'white',fontWeight:700,fontSize:'clamp(1.2rem,5vw,1.8rem)',textAlign:'center',marginTop:'2rem'}}>
          🧩 だれのパズルをする？
        </h2>
        <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center'}}>
          {PUZZLE_IMGS.map((pi,i)=>(
            <button key={i} onPointerDown={()=>startPuzzle(i)} style={{
              background:'rgba(255,255,255,.06)',border:`2px solid ${pi.color}55`,
              borderRadius:20,padding:'1rem',cursor:'pointer',
              display:'flex',flexDirection:'column',alignItems:'center',gap:'.5rem',
              transition:'all .25s',
            }}>
              <div style={{width:'clamp(100px,22vw,150px)',height:'clamp(120px,26vw,180px)',borderRadius:14,overflow:'hidden',border:`2.5px solid ${pi.color}`}}>
                <img src={pi.src} style={{width:'100%',height:'100%',objectFit:'cover'}} draggable={false}/>
              </div>
              <div style={{color:pi.color,fontWeight:700,fontSize:'1.1rem'}}>{pi.label}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const pimg=PUZZLE_IMGS[imgIdx]
  const VW=Math.min(window.innerWidth-32, 480)
  const PIECE_W=Math.floor(VW/PCOLS)
  const PIECE_H=Math.round(PIECE_W*(3/4))

  return (
    <div style={{position:'fixed',inset:0,background:char.bg,display:'flex',flexDirection:'column',alignItems:'center',overflow:'hidden'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <div style={{paddingTop:50,paddingBottom:8,display:'flex',gap:'1.5rem',alignItems:'center',color:'white',fontSize:'.9rem'}}>
        <span>👆 {moves}かい</span>
        {selected!==null&&<span style={{color:'#FFD700',fontWeight:700}}>✅ えらんだ！もう1まいタップ</span>}
      </div>

      {/* Small reference image */}
      <div style={{width:PIECE_W,height:PIECE_H,borderRadius:8,overflow:'hidden',border:`2px solid ${pimg.color}55`,marginBottom:8,opacity:.55}}>
        <img src={pimg.src} style={{width:'100%',height:'100%',objectFit:'cover'}} draggable={false}/>
      </div>

      {/* Puzzle grid */}
      <div style={{
        display:'grid',gridTemplateColumns:`repeat(${PCOLS},${PIECE_W}px)`,
        gap:4,border:`3px solid ${done?'#FFD700':pimg.color}66`,
        borderRadius:16,overflow:'hidden',
        animation:done?'puzzleComplete .5s ease-out':'none',
        boxShadow:done?'0 0 40px #FFD700':undefined,
      }}>
        {pieces.map((origPos,curPos)=>{
          const origRow=Math.floor(origPos/PCOLS)
          const origCol=origPos%PCOLS
          const isSelected=selected===curPos
          return (
            <div key={curPos} onPointerDown={()=>tapPiece(curPos)} style={{
              width:PIECE_W,height:PIECE_H,
              backgroundImage:`url(${pimg.src})`,
              backgroundSize:`${PCOLS*100}% ${PROWS*100}%`,
              backgroundPosition:`${PCOLS===1?0:origCol*100/(PCOLS-1)}% ${PROWS===1?0:origRow*100/(PROWS-1)}%`,
              cursor:'pointer',
              outline:isSelected?`4px solid white`:'none',
              outlineOffset:'-2px',
              filter:isSelected?'brightness(1.4) drop-shadow(0 0 8px white)':'brightness(1)',
              transition:'filter .15s,outline .15s',
              animation:isSelected?'pieceSelect 1s ease-in-out infinite':'none',
            }}/>
          )
        })}
      </div>

      {done&&(
        <div style={{marginTop:'1rem',color:'#FFD700',fontSize:'1.8rem',fontWeight:900,animation:'comboFlash .4s ease-in-out infinite'}}>
          🎉 かんせい！ 🎉
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 7: デーモンシュート
═══════════════════════════════════════════════════════ */
const DEMONS = [
  { emoji:'👹', pts:15, glow:'#FF4500' },
  { emoji:'💀', pts:15, glow:'#9CA3AF' },
  { emoji:'😈', pts:20, glow:'#8B5CF6' },
  { emoji:'🧟', pts:15, glow:'#4ADE80' },
  { emoji:'🦇', pts:10, glow:'#6B7280' },
  { emoji:'🔮', pts:25, glow:'#7C3AED' },
  { emoji:'🕷️', pts:10, glow:'#374151' },
]
const CHAR_DROPS = [
  { src:IMG.rumi.profile,     color:'#C084FC' },
  { src:IMG.mira.profile,     color:'#FB7185' },
  { src:IMG.zoey.profile,     color:'#38BDF8' },
  { src:IMG.rumi.sword,       color:'#C084FC' },
  { src:IMG.mira.dance,       color:'#FB7185' },
  { src:IMG.zoey.stage,       color:'#38BDF8' },
]

function DemonShoot({ char, audio, onEnd, onBack }) {
  const [score,     setScore]     = useState(0)
  const [timeLeft,  setTimeLeft]  = useState(60)
  const [items,     setItems]     = useState([])
  const [combo,     setCombo]     = useState(0)
  const [particles, setParticles] = useState([])
  const [danger,    setDanger]    = useState(false)
  const [showHint,  setShowHint]  = useState(true)

  const scoreRef=useRef(0),comboRef=useRef(0),timeRef=useRef(60)
  const itemsRef=useRef([]),nextId=useRef(0)
  const rafRef=useRef(null),timerRef=useRef(null),spawnRef=useRef(null)
  const activeRef=useRef(true)

  const endGame=useCallback(()=>{
    if(!activeRef.current)return
    activeRef.current=false;audio.stop()
    cancelAnimationFrame(rafRef.current);clearTimeout(spawnRef.current);clearInterval(timerRef.current)
    setTimeout(()=>{audio.sfxGameOver();onEnd(scoreRef.current)},80)
  },[audio,onEnd])

  useEffect(()=>{
    setTimeout(()=>setShowHint(false),3500)
    audio.start()
    const H=window.innerHeight
    function loop(){
      if(!activeRef.current)return
      itemsRef.current=itemsRef.current.map(i=>({...i,y:i.y+i.speed})).filter(i=>i.y<H+100)
      setItems([...itemsRef.current]);rafRef.current=requestAnimationFrame(loop)
    }
    rafRef.current=requestAnimationFrame(loop)
    timerRef.current=setInterval(()=>{
      const n=timeRef.current-1;timeRef.current=n;setTimeLeft(n)
      if(n<=0){clearInterval(timerRef.current);endGame()}
    },1000)
    function spawn(){
      if(!activeRef.current)return
      const prog=1-timeRef.current/60
      const rate=Math.max(480,1250-prog*770)
      const W=window.innerWidth
      if(Math.random()<0.68){
        const d=DEMONS[Math.floor(Math.random()*DEMONS.length)]
        const sz=62+Math.random()*18
        itemsRef.current=[...itemsRef.current,{
          id:nextId.current++,type:'demon',
          x:Math.max(0,Math.random()*(W-sz-8)),y:-sz-10,size:sz,
          emoji:d.emoji,pts:d.pts,glow:d.glow,
          speed:1.5+prog*2.3+Math.random()*0.4,
        }]
      } else {
        const c=CHAR_DROPS[Math.floor(Math.random()*CHAR_DROPS.length)]
        const sz=68+Math.random()*14
        itemsRef.current=[...itemsRef.current,{
          id:nextId.current++,type:'char',
          x:Math.max(0,Math.random()*(W-sz-8)),y:-sz-10,size:sz,
          src:c.src,color:c.color,pts:0,
          speed:1.2+prog*1.4+Math.random()*0.3,
        }]
      }
      spawnRef.current=setTimeout(spawn,rate)
    }
    spawnRef.current=setTimeout(spawn,600)
    return()=>{activeRef.current=false;cancelAnimationFrame(rafRef.current);clearTimeout(spawnRef.current);clearInterval(timerRef.current)}
  },[audio,endGame])

  const tapItem=useCallback((id,type,pts,cx,cy,glow)=>{
    if(!itemsRef.current.find(i=>i.id===id))return
    itemsRef.current=itemsRef.current.filter(i=>i.id!==id)
    setItems([...itemsRef.current])
    if(type==='demon'){
      const nc=comboRef.current+1;comboRef.current=nc;setCombo(nc)
      const mult=nc>=5?3:nc>=3?2:1;const earned=pts*mult
      scoreRef.current+=earned;setScore(scoreRef.current)
      const pid=Date.now()+Math.random()
      setParticles(p=>[...p,{id:pid,x:cx,y:cy,text:nc>=3?`+${earned} コンボ！！`:`+${earned}`,color:nc>=3?'#FFD700':glow,big:nc>=3}])
      setTimeout(()=>setParticles(p=>p.filter(x=>x.id!==pid)),900)
      if(nc>=3)audio.sfxCombo();else audio.sfxCatch()
    } else {
      comboRef.current=0;setCombo(0)
      scoreRef.current=Math.max(0,scoreRef.current-20);setScore(scoreRef.current)
      const pid=Date.now()+Math.random()
      setParticles(p=>[...p,{id:pid,x:cx,y:cy,text:'-20 まちがい！',color:'#F87171',big:false}])
      setTimeout(()=>setParticles(p=>p.filter(x=>x.id!==pid)),900)
      setDanger(true);setTimeout(()=>setDanger(false),500)
      audio.sfxHit()
    }
  },[audio])

  return (
    <div style={{position:'fixed',inset:0,background:char.bg,overflow:'hidden'}}>
      {danger&&<div style={{position:'fixed',inset:0,background:'rgba(220,38,38,.35)',zIndex:100,pointerEvents:'none',animation:'dangerFlash .5s ease-out forwards'}}/>}
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <HUD char={char} score={score} timeLeft={timeLeft} combo={combo} urgent={timeLeft<=10}/>
      <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:'rgba(255,255,255,.1)',zIndex:30}}>
        <div style={{width:`${(timeLeft/60)*100}%`,height:'100%',background:timeLeft<=10?'#F87171':'#FF4500',transition:'width 1s linear',boxShadow:'0 0 10px #FF4500'}}/>
      </div>
      {showHint&&(
        <div style={{position:'absolute',top:'42%',left:'50%',transform:'translate(-50%,-50%)',color:'white',fontSize:'clamp(1rem,3.8vw,1.6rem)',fontWeight:900,textAlign:'center',pointerEvents:'none',zIndex:25,lineHeight:1.6,animation:'comboFlash .6s ease-in-out infinite',textShadow:`0 0 20px ${char.color}`}}>
          👹 デーモンをたおせ！<br/><span style={{fontSize:'.8em',color:'#FCA5A5'}}>⚠️ キャラクターはタップしないで！</span>
        </div>
      )}
      {items.map(item=>(
        <div key={item.id} onPointerDown={e=>{e.stopPropagation();tapItem(item.id,item.type,item.pts,e.clientX,e.clientY,item.type==='demon'?item.glow:item.color)}}
          style={{position:'absolute',left:item.x,top:item.y,width:item.size,height:item.size,cursor:'pointer',touchAction:'none',userSelect:'none',zIndex:10}}>
          {item.type==='demon'?(
            <div style={{width:'100%',height:'100%',fontSize:`${item.size*.75}px`,lineHeight:`${item.size}px`,textAlign:'center',filter:`drop-shadow(0 0 12px ${item.glow})`,animation:'itemSpin 1.2s ease-in-out infinite'}}>
              {item.emoji}
            </div>
          ):(
            <div style={{width:'100%',height:'100%',borderRadius:'50%',overflow:'hidden',border:`3px solid ${item.color}`,boxShadow:`0 0 18px ${item.color}88`,animation:'bubbleWobble 1.5s ease-in-out infinite'}}>
              <img src={item.src} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}} draggable={false}/>
            </div>
          )}
        </div>
      ))}
      {particles.map(p=><ScoreParticle key={p.id} p={p}/>)}
      <div style={{position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',zIndex:5,filter:`drop-shadow(0 0 20px ${char.color}88)`}}>
        <img src={char.img.demon||char.img.performance||char.img.profile} style={{width:'clamp(80px,18vw,130px)',height:'clamp(90px,22vw,160px)',objectFit:'cover',objectPosition:'top',borderRadius:'12px 12px 0 0'}} draggable={false}/>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 8: じゃんけん
═══════════════════════════════════════════════════════ */
function Janken({ char, audio, onEnd, onBack }) {
  const HANDS = [{ e:'✊', label:'グー' },{ e:'✌️', label:'チョキ' },{ e:'✋', label:'パー' }]
  const [round,    setRound]    = useState(0)
  const [phase,    setPhase]    = useState('choose')
  const [player,   setPlayer]   = useState(null)
  const [charHand, setCharHand] = useState(null)
  const [result,   setResult]   = useState(null)
  const winsRef = useRef(0), activeRef = useRef(true)
  const ROUNDS = 7
  useEffect(() => { audio.start(); return () => { activeRef.current = false } }, [])// eslint-disable-line

  function choose(idx) {
    if(phase !== 'choose') return
    const c = Math.floor(Math.random() * 3)
    setPlayer(idx); setCharHand(c)
    const diff = (idx - c + 3) % 3
    const r = diff === 0 ? 'draw' : diff === 1 ? 'win' : 'lose'
    setResult(r); setPhase('reveal')
    if(r === 'win') { winsRef.current++; audio.sfxCombo() }
    else if(r === 'lose') { audio.sfxHit() }
    else { audio.sfxCardFlip() }
    setTimeout(() => {
      if(!activeRef.current) return
      const nr = round + 1
      if(nr >= ROUNDS) {
        const pts = winsRef.current * 150
        audio.stop(); setTimeout(() => { audio.sfxGameOver(); onEnd(pts) }, 200)
      } else {
        setRound(nr); setPhase('choose'); setPlayer(null); setCharHand(null); setResult(null)
      }
    }, 1500)
  }

  const resColor = result === 'win' ? '#4ADE80' : result === 'lose' ? '#F87171' : '#FFD700'
  const resText  = result === 'win' ? 'かった！🎉' : result === 'lose' ? 'まけた…' : 'あいこ！'
  return (
    <div style={{position:'fixed',inset:0,background:char.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1rem',padding:'1rem'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <div style={{display:'flex',gap:6,marginTop:'2.5rem'}}>
        {Array.from({length:ROUNDS},(_,i)=>(
          <div key={i} style={{width:12,height:12,borderRadius:'50%',background:i<round?char.color:i===round?'white':'rgba(255,255,255,.2)',transition:'background .3s'}}/>
        ))}
      </div>
      <div style={{color:char.color,fontWeight:900,fontSize:'1.1rem'}}>{winsRef.current}かち / {ROUNDS}せん</div>
      <div style={{width:90,height:90,borderRadius:'50%',overflow:'hidden',border:`3px solid ${char.color}`,boxShadow:`0 0 24px ${char.color}88`}}>
        <img src={char.img.profile} style={{width:'100%',height:'100%',objectFit:'cover'}} draggable={false}/>
      </div>
      <div style={{display:'flex',gap:'2rem',alignItems:'center',minHeight:80}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'3.5rem'}}>{charHand !== null ? HANDS[charHand].e : '❓'}</div>
          <div style={{color:'rgba(255,255,255,.6)',fontSize:'.8rem'}}>{char.name}</div>
        </div>
        <div style={{color:'rgba(255,255,255,.5)',fontSize:'1.2rem',fontWeight:700}}>VS</div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'3.5rem'}}>{player !== null ? HANDS[player].e : '❓'}</div>
          <div style={{color:'rgba(255,255,255,.6)',fontSize:'.8rem'}}>きみ</div>
        </div>
      </div>
      {result && <div style={{color:resColor,fontSize:'1.8rem',fontWeight:900,animation:'comboFlash .5s ease-in-out infinite'}}>{resText}</div>}
      <div style={{display:'flex',gap:'1rem'}}>
        {HANDS.map((h,i)=>(
          <button key={i} onPointerDown={()=>choose(i)} disabled={phase!=='choose'} style={{
            width:'clamp(72px,20vw,96px)',height:'clamp(72px,20vw,96px)',
            fontSize:'2.2rem',borderRadius:'50%',
            border:`3px solid ${phase==='choose'?char.color:'rgba(255,255,255,.2)'}`,
            background:phase==='choose'?`${char.color}25`:'rgba(255,255,255,.05)',
            cursor:phase==='choose'?'pointer':'default',
            display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,
          }}>
            <span>{h.e}</span>
            <span style={{color:char.color,fontSize:'.6rem',fontWeight:700}}>{h.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 9: サイモンセズ
═══════════════════════════════════════════════════════ */
function SimonSays({ char, audio, onEnd, onBack }) {
  const [seq,     setSeq]     = useState([])
  const [input,   setInput]   = useState([])
  const [phase,   setPhase]   = useState('wait')
  const [lit,     setLit]     = useState(null)
  const [lives,   setLives]   = useState(3)
  const [level,   setLevel]   = useState(0)
  const livesRef=useRef(3), seqRef=useRef([]), levelRef=useRef(0)
  const scoreRef=useRef(0), activeRef=useRef(true)

  const showSequence = useCallback((sequence) => {
    setPhase('show')
    let i = 0
    function next() {
      if(!activeRef.current) return
      if(i >= sequence.length) { setTimeout(() => setPhase('input'), 500); return }
      setLit(sequence[i])
      const sfns = [audio.sfxAppear, audio.sfxCatch, audio.sfxBubble]
      sfns[sequence[i] % sfns.length]?.()
      setTimeout(() => { setLit(null); setTimeout(() => { i++; next() }, 250) }, 500)
    }
    setTimeout(next, 600)
  }, [audio])

  const startLevel = useCallback((lv, s) => {
    const newSeq = [...s, Math.floor(Math.random() * 3)]
    seqRef.current = newSeq; setSeq(newSeq); levelRef.current = lv; setLevel(lv); setInput([])
    showSequence(newSeq)
  }, [showSequence])

  useEffect(() => {
    audio.start(); setTimeout(() => startLevel(1, []), 500)
    return () => { activeRef.current = false }
  }, [])// eslint-disable-line

  function tapPad(idx) {
    if(phase !== 'input') return
    const sfns = [audio.sfxAppear, audio.sfxCatch, audio.sfxBubble]
    sfns[idx % sfns.length]?.()
    setLit(idx); setTimeout(() => setLit(null), 200)
    const ni = [...input, idx]; setInput(ni)
    const pos = ni.length - 1
    if(ni[pos] !== seqRef.current[pos]) {
      audio.sfxHit()
      const nl = livesRef.current - 1; livesRef.current = nl; setLives(nl)
      if(nl <= 0) { setPhase('wait'); setTimeout(() => { audio.stop(); audio.sfxGameOver(); onEnd(scoreRef.current) }, 500); return }
      setInput([]); setTimeout(() => showSequence(seqRef.current), 1000); return
    }
    if(ni.length === seqRef.current.length) {
      scoreRef.current += seqRef.current.length * 50; audio.sfxCombo(); setPhase('wait')
      setTimeout(() => startLevel(levelRef.current + 1, seqRef.current), 800)
    }
  }

  return (
    <div style={{position:'fixed',inset:0,background:char.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1rem',padding:'1rem'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <div style={{marginTop:'2.5rem',display:'flex',gap:'1rem',alignItems:'center'}}>
        <div style={{color:'white',fontWeight:900,fontSize:'1.2rem'}}>レベル {level}</div>
        <div style={{color:'#FFD700',fontWeight:700}}>スコア: {scoreRef.current}</div>
        <div style={{color:'#F87171'}}>{'❤️'.repeat(Math.max(0,lives))}</div>
      </div>
      <div style={{color:'rgba(255,255,255,.7)',fontSize:'.9rem',textAlign:'center'}}>
        {phase==='show'?'おぼえてね！👀':phase==='input'?'おなじじゅんばんでタップ！':'...'}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginTop:'1rem'}}>
        {CHARS.map((c,i) => (
          <button key={c.id} onPointerDown={()=>tapPad(i)} style={{
            width:'clamp(110px,28vw,155px)',height:'clamp(110px,28vw,155px)',borderRadius:20,
            background:lit===i?`${c.color}88`:`${c.color}20`,
            border:`3px solid ${lit===i?c.color:`${c.color}44`}`,
            cursor:phase==='input'?'pointer':'default',transition:'all .15s',
            display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,
            boxShadow:lit===i?`0 0 32px ${c.color}`:'none',
          }}>
            <div style={{width:56,height:56,borderRadius:'50%',overflow:'hidden',border:`2px solid ${c.color}`,opacity:lit===i?1:.7}}>
              <img src={c.img.profile} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}} draggable={false}/>
            </div>
            <div style={{color:c.color,fontSize:'.8rem',fontWeight:700}}>{c.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 10: ナンバータッチ
═══════════════════════════════════════════════════════ */
function NumberTouch({ char, audio, onEnd, onBack }) {
  const TOTAL = 15
  const [numbers] = useState(() => {
    const W = typeof window !== 'undefined' ? window.innerWidth : 400
    const H = typeof window !== 'undefined' ? window.innerHeight : 700
    return Array.from({length:TOTAL}, (_,i) => ({
      n: i+1, x: 40 + Math.random()*(W-100), y: 90 + Math.random()*(H-190),
    }))
  })
  const [next,     setNext]     = useState(1)
  const [cleared,  setCleared]  = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(60)
  const [flash,    setFlash]    = useState(null)
  const nextRef=useRef(1), timeRef=useRef(60), activeRef=useRef(true)
  const timerRef=useRef(null)

  const endGame = useCallback((t) => {
    if(!activeRef.current) return
    activeRef.current=false; clearInterval(timerRef.current); audio.stop()
    setTimeout(() => { audio.sfxGameOver(); onEnd(t*15+200) }, 200)
  }, [audio, onEnd])

  useEffect(() => {
    audio.start()
    timerRef.current = setInterval(() => {
      const n = timeRef.current-1; timeRef.current=n; setTimeLeft(n)
      if(n <= 0) endGame(0)
    }, 1000)
    return () => { activeRef.current=false; clearInterval(timerRef.current) }
  }, [audio, endGame])

  function tapNumber(n) {
    if(n !== nextRef.current) { audio.sfxHit(); setFlash({n,ok:false}); setTimeout(()=>setFlash(null),400); return }
    audio.sfxCatch(); setFlash({n,ok:true}); setTimeout(()=>setFlash(null),300)
    setCleared(prev => new Set([...prev,n]))
    const nn = n+1; nextRef.current=nn; setNext(nn)
    if(n === TOTAL) endGame(timeRef.current)
  }

  return (
    <div style={{position:'fixed',inset:0,background:char.bg,overflow:'hidden'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <div style={{position:'absolute',top:0,left:0,right:0,padding:'.6rem 1rem',background:'rgba(0,0,0,.45)',backdropFilter:'blur(6px)',zIndex:30,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{color:char.color,fontWeight:900,fontSize:'1.1rem'}}>つぎ: <span style={{fontSize:'1.6rem',color:'#FFD700'}}>{next<=TOTAL?next:'✅'}</span></div>
        <div style={{color:'rgba(255,255,255,.7)',fontSize:'.85rem'}}>🔢 ナンバータッチ</div>
        <div style={{color:timeLeft<=10?'#F87171':'white',fontSize:'clamp(1.3rem,5vw,2rem)',fontWeight:900}}>{timeLeft}s</div>
      </div>
      {numbers.map(({n,x,y}) => {
        const done = cleared.has(n), isFlash = flash?.n===n
        return (
          <div key={n} onPointerDown={() => !done && tapNumber(n)} style={{
            position:'absolute',left:x,top:y,width:54,height:54,borderRadius:'50%',
            background:done?'rgba(255,255,255,.08)':isFlash?(flash.ok?'#4ADE80':'#F87171'):`${char.color}30`,
            border:`3px solid ${done?'rgba(255,255,255,.15)':char.color}`,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'1.4rem',fontWeight:900,color:done?'rgba(255,255,255,.2)':'white',
            cursor:done?'default':'pointer',touchAction:'none',userSelect:'none',
            boxShadow:!done&&n===next?`0 0 20px ${char.color}`:'none',
            animation:n===next&&!done?'btnPulse 1.5s ease-in-out infinite':'none',
            transform:done?'scale(.85)':'scale(1)',transition:'all .2s',
          }}>{done?'✓':n}</div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 11: スロット
═══════════════════════════════════════════════════════ */
const SLOT_SYMS = [
  {src:IMG.rumi.profile,   color:'#C084FC',key:'rumi'},
  {src:IMG.mira.profile,   color:'#FB7185',key:'mira'},
  {src:IMG.zoey.profile,   color:'#38BDF8',key:'zoey'},
  {src:IMG.rumi.sword,     color:'#C084FC',key:'rumi'},
  {src:IMG.mira.dance,     color:'#FB7185',key:'mira'},
  {src:IMG.zoey.stage,     color:'#38BDF8',key:'zoey'},
]
function Slot({ char, audio, onEnd, onBack }) {
  const [reels,    setReels]    = useState([0,0,0])
  const [spinning, setSpinning] = useState(false)
  const [result,   setResult]   = useState(null)
  const [spins,    setSpins]    = useState(0)
  const [score,    setScore]    = useState(0)
  const MAX_SPINS=15, scoreRef=useRef(0), spinsRef=useRef(0), activeRef=useRef(true)
  useEffect(() => { audio.start(); return () => { activeRef.current=false } }, [])// eslint-disable-line

  function spin() {
    if(spinning||!activeRef.current) return
    const ns = spinsRef.current+1; spinsRef.current=ns; setSpins(ns)
    setSpinning(true); setResult(null); audio.sfxCardFlip()
    let ticks=0
    const iv = setInterval(() => {
      setReels([Math.floor(Math.random()*SLOT_SYMS.length),Math.floor(Math.random()*SLOT_SYMS.length),Math.floor(Math.random()*SLOT_SYMS.length)])
      if(++ticks > 12) clearInterval(iv)
    }, 80)
    setTimeout(() => {
      const r = [Math.floor(Math.random()*SLOT_SYMS.length),Math.floor(Math.random()*SLOT_SYMS.length),Math.floor(Math.random()*SLOT_SYMS.length)]
      setReels(r); setSpinning(false)
      const keys = r.map(i => SLOT_SYMS[i].key)
      let pts=10, res='miss'
      if(keys[0]===keys[1]&&keys[1]===keys[2]) { pts=300; res='jackpot'; audio.sfxSpecial() }
      else if(keys[0]===keys[1]||keys[1]===keys[2]||keys[0]===keys[2]) { pts=80; res='two'; audio.sfxCombo() }
      else { audio.sfxCardFlip() }
      scoreRef.current+=pts; setScore(scoreRef.current); setResult(res)
      if(ns >= MAX_SPINS) setTimeout(() => { audio.stop(); audio.sfxGameOver(); onEnd(scoreRef.current) }, 1200)
    }, 1200)
  }

  const resColor = result==='jackpot'?'#FFD700':result==='two'?'#4ADE80':'rgba(255,255,255,.4)'
  const resText  = result==='jackpot'?'🎊 JACKPOT!! +300':result==='two'?'✨ ペア +80':result==='miss'?'+10':''
  return (
    <div style={{position:'fixed',inset:0,background:char.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1.2rem',padding:'1rem'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <div style={{marginTop:'2.5rem',display:'flex',gap:'1.5rem',alignItems:'center'}}>
        <div style={{color:'#FFD700',fontSize:'1.8rem',fontWeight:900}}>{score.toLocaleString()}</div>
        <div style={{color:'rgba(255,255,255,.5)',fontSize:'.85rem'}}>{spins}/{MAX_SPINS}スピン</div>
      </div>
      <div style={{display:'flex',gap:8,background:'rgba(0,0,0,.5)',borderRadius:20,padding:'1rem',border:`2px solid ${char.color}44`}}>
        {reels.map((idx,i) => (
          <div key={i} style={{width:'clamp(80px,20vw,110px)',height:'clamp(80px,20vw,110px)',borderRadius:14,overflow:'hidden',border:`2.5px solid ${SLOT_SYMS[idx].color}`,boxShadow:spinning?'none':`0 0 12px ${SLOT_SYMS[idx].color}66`}}>
            <img src={SLOT_SYMS[idx].src} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}} draggable={false}/>
          </div>
        ))}
      </div>
      <div style={{minHeight:'2rem',color:resColor,fontSize:'1.3rem',fontWeight:900,animation:result&&result!=='miss'?'comboFlash .5s ease-in-out infinite':'none'}}>{resText}</div>
      <button onPointerDown={spin} disabled={spinning||spins>=MAX_SPINS} style={{
        padding:'1rem 3rem',fontSize:'1.4rem',fontWeight:900,border:'none',borderRadius:'100px',
        background:spinning||spins>=MAX_SPINS?'rgba(255,255,255,.15)':`linear-gradient(135deg,${char.color},${char.dark})`,
        color:'white',cursor:spinning||spins>=MAX_SPINS?'default':'pointer',
        animation:!spinning&&spins<MAX_SPINS?'btnPulse 2s ease-in-out infinite':'none',
        boxShadow:`0 8px 32px ${char.color}55`,
      }}>{spinning?'🌀 スピン中...':'🎰 スピン！'}</button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 12: ボールキャッチ
═══════════════════════════════════════════════════════ */
const CATCH_ITEMS=[
  {emoji:'⭐',pts:10,glow:'#FFD700'},{emoji:'💜',pts:10,glow:'#C084FC'},
  {emoji:'❤️',pts:10,glow:'#FB7185'},{emoji:'💎',pts:25,glow:'#93C5FD'},
  {emoji:'🌟',pts:15,glow:'#FFD700'},{emoji:'👹',pts:-15,glow:'#FF4500'},
]
function BallCatch({ char, audio, onEnd, onBack }) {
  const [score,    setScore]    = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [balls,    setBalls]    = useState([])
  const [platX,    setPlatX]    = useState(50)
  const [particles,setParticles]= useState([])
  const scoreRef=useRef(0),timeRef=useRef(60),platRef=useRef(50)
  const ballsRef=useRef([]),nextId=useRef(0)
  const rafRef=useRef(null),timerRef=useRef(null),spawnRef=useRef(null)
  const activeRef=useRef(true)
  const PLAT_W=22

  const endGame=useCallback(()=>{
    if(!activeRef.current)return
    activeRef.current=false;audio.stop()
    cancelAnimationFrame(rafRef.current);clearTimeout(spawnRef.current);clearInterval(timerRef.current)
    setTimeout(()=>{audio.sfxGameOver();onEnd(scoreRef.current)},80)
  },[audio,onEnd])

  useEffect(()=>{
    audio.start()
    const H=window.innerHeight,PLAT_Y=H-80
    function loop(){
      if(!activeRef.current)return
      const W=window.innerWidth
      const platLeft=(platRef.current/100)*W-(PLAT_W/200*W)
      const platRight=platLeft+(PLAT_W/100*W)
      const kept=[]
      for(const b of ballsRef.current){
        const nb={...b,y:b.y+b.speed}
        if(nb.y>=PLAT_Y-20&&nb.y<PLAT_Y+30&&nb.x>=platLeft-20&&nb.x<=platRight+20){
          scoreRef.current=Math.max(0,scoreRef.current+nb.pts);setScore(scoreRef.current)
          const pid=Date.now()+Math.random()
          setParticles(p=>[...p,{id:pid,x:nb.x,y:PLAT_Y,text:nb.pts>0?`+${nb.pts}`:nb.pts,color:nb.pts>0?'#FFD700':'#F87171',big:false}])
          setTimeout(()=>setParticles(p=>p.filter(x=>x.id!==pid)),800)
          if(nb.pts>0)audio.sfxCatch();else audio.sfxHit()
        } else if(nb.y<H+60){
          kept.push(nb)
        }
      }
      ballsRef.current=kept;setBalls([...ballsRef.current])
      rafRef.current=requestAnimationFrame(loop)
    }
    rafRef.current=requestAnimationFrame(loop)
    timerRef.current=setInterval(()=>{
      const n=timeRef.current-1;timeRef.current=n;setTimeLeft(n)
      if(n<=0){clearInterval(timerRef.current);endGame()}
    },1000)
    function spawn(){
      if(!activeRef.current)return
      const prog=1-timeRef.current/60,rate=Math.max(600,1400-prog*800),W=window.innerWidth
      const item=CATCH_ITEMS[Math.floor(Math.random()*CATCH_ITEMS.length)]
      const sz=48+Math.random()*16
      ballsRef.current=[...ballsRef.current,{id:nextId.current++,x:sz/2+Math.random()*(W-sz),y:-sz,size:sz,emoji:item.emoji,pts:item.pts,glow:item.glow,speed:2.2+prog*2+Math.random()*.5}]
      spawnRef.current=setTimeout(spawn,rate)
    }
    spawnRef.current=setTimeout(spawn,400)
    return()=>{activeRef.current=false;cancelAnimationFrame(rafRef.current);clearTimeout(spawnRef.current);clearInterval(timerRef.current)}
  },[audio,endGame])

  function movePlat(e){
    const pct=(e.clientX/window.innerWidth)*100
    platRef.current=Math.max(PLAT_W/2,Math.min(100-PLAT_W/2,pct));setPlatX(platRef.current)
  }
  return (
    <div onPointerMove={movePlat} onPointerDown={movePlat} style={{position:'fixed',inset:0,background:char.bg,overflow:'hidden',touchAction:'none'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <div style={{position:'absolute',top:0,left:0,right:0,padding:'.6rem 1rem',background:'rgba(0,0,0,.45)',backdropFilter:'blur(6px)',zIndex:30,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{color:'#FFD700',fontSize:'clamp(1.3rem,5vw,2rem)',fontWeight:900}}>{score.toLocaleString()}</div>
        <div style={{color:'rgba(255,255,255,.7)',fontSize:'.85rem'}}>🏀 ボールキャッチ</div>
        <div style={{color:timeLeft<=10?'#F87171':'white',fontSize:'clamp(1.3rem,5vw,2rem)',fontWeight:900}}>{timeLeft}s</div>
      </div>
      {balls.map(b=>(
        <div key={b.id} style={{position:'absolute',left:b.x-b.size/2,top:b.y,width:b.size,height:b.size,fontSize:`${b.size*.7}px`,lineHeight:`${b.size}px`,textAlign:'center',filter:`drop-shadow(0 0 10px ${b.glow})`,pointerEvents:'none',zIndex:10}}>{b.emoji}</div>
      ))}
      <div style={{position:'absolute',bottom:60,left:`calc(${platX}% - ${PLAT_W/2}%)`,width:`${PLAT_W}%`,height:18,background:`linear-gradient(135deg,${char.color},${char.dark})`,borderRadius:100,boxShadow:`0 0 20px ${char.color}88`,zIndex:20,pointerEvents:'none',transition:'left .05s linear'}}/>
      <div style={{position:'absolute',bottom:72,left:`calc(${platX}% - 20px)`,zIndex:21,pointerEvents:'none',transition:'left .05s linear'}}>
        <img src={char.img.profile} style={{width:40,height:40,borderRadius:'50%',objectFit:'cover',border:`2px solid ${char.color}`}} draggable={false}/>
      </div>
      {particles.map(p=><ScoreParticle key={p.id} p={p}/>)}
      <div style={{position:'absolute',bottom:8,left:'50%',transform:'translateX(-50%)',color:'rgba(255,255,255,.4)',fontSize:'.75rem',whiteSpace:'nowrap',pointerEvents:'none'}}>ゆびをうごかしてキャッチ！👹をさけて！</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 13: スピードタップ
═══════════════════════════════════════════════════════ */
function SpeedTap({ char, audio, onEnd, onBack }) {
  const [taps,      setTaps]      = useState(0)
  const [timeLeft,  setTimeLeft]  = useState(15)
  const [phase,     setPhase]     = useState('ready')
  const [countDown, setCountDown] = useState(3)
  const [ripples,   setRipples]   = useState([])
  const tapRef=useRef(0),timeRef=useRef(15),countRef=useRef(3)
  const timerRef=useRef(null),cdRef=useRef(null),activeRef=useRef(true)

  useEffect(()=>{
    audio.start()
    cdRef.current=setInterval(()=>{
      const n=countRef.current-1;countRef.current=n;setCountDown(n)
      if(n<=0){
        clearInterval(cdRef.current);setPhase('go')
        timerRef.current=setInterval(()=>{
          const t=timeRef.current-1;timeRef.current=t;setTimeLeft(t)
          if(t<=0){clearInterval(timerRef.current);setPhase('done');audio.stop();audio.sfxPuzzleDone();setTimeout(()=>onEnd(tapRef.current*8),600)}
        },1000)
      }
    },1000)
    return()=>{activeRef.current=false;clearInterval(cdRef.current);clearInterval(timerRef.current)}
  },[audio,onEnd])

  function handleTap(e){
    if(phase!=='go')return
    tapRef.current++;setTaps(tapRef.current);audio.sfxCatch()
    const pid=Date.now()+Math.random()
    setRipples(r=>[...r,{id:pid,x:e.clientX,y:e.clientY}])
    setTimeout(()=>setRipples(r=>r.filter(x=>x.id!==pid)),400)
  }

  return (
    <div onPointerDown={handleTap} style={{position:'fixed',inset:0,background:char.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1rem',touchAction:'none'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      {phase==='ready'&&<div style={{color:'white',fontSize:'clamp(4rem,18vw,8rem)',fontWeight:900,textShadow:`0 0 40px ${char.color}`,animation:'comboFlash .5s ease-in-out infinite'}}>{countDown>0?countDown:'GO!'}</div>}
      {phase==='go'&&<>
        <div style={{color:'rgba(255,255,255,.5)',fontSize:'.9rem'}}>のこり</div>
        <div style={{color:timeLeft<=5?'#F87171':'white',fontSize:'clamp(3rem,12vw,6rem)',fontWeight:900,animation:timeLeft<=5?'urgentPulse .5s ease-in-out infinite':'none'}}>{timeLeft}s</div>
        <div style={{color:'#FFD700',fontSize:'clamp(3rem,14vw,7rem)',fontWeight:900,lineHeight:1}}>{taps}</div>
        <div style={{width:'clamp(140px,38vw,200px)',height:'clamp(140px,38vw,200px)',borderRadius:'50%',background:`${char.color}25`,border:`4px solid ${char.color}`,boxShadow:`0 0 48px ${char.color}66`,display:'flex',alignItems:'center',justifyContent:'center',animation:'btnPulse 0.5s ease-in-out infinite'}}>
          <img src={char.img.profile} style={{width:'75%',height:'75%',borderRadius:'50%',objectFit:'cover'}} draggable={false}/>
        </div>
        <div style={{color:'rgba(255,255,255,.4)',fontSize:'.85rem'}}>どこでもタップ！</div>
      </>}
      {phase==='done'&&<div style={{textAlign:'center'}}>
        <div style={{color:'white',fontSize:'1.4rem',fontWeight:700,marginBottom:'1rem'}}>おわり！</div>
        <div style={{color:'#FFD700',fontSize:'clamp(3rem,14vw,6rem)',fontWeight:900}}>{taps}</div>
        <div style={{color:'rgba(255,255,255,.6)',fontSize:'1rem'}}>タップ！</div>
      </div>}
      {ripples.map(r=>(
        <div key={r.id} style={{position:'fixed',left:r.x-30,top:r.y-30,width:60,height:60,borderRadius:'50%',border:`3px solid ${char.color}`,animation:'bubblePop .4s ease-out forwards',pointerEvents:'none',zIndex:50}}/>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 14: 的当て
═══════════════════════════════════════════════════════ */
function MovingTarget({ char, audio, onEnd, onBack }) {
  const TOTAL=12
  const [score,    setScore]    = useState(0)
  const [round,    setRound]    = useState(1)
  const [targetX,  setTargetX]  = useState(50)
  const [feedback, setFeedback] = useState(null)
  const [phase,    setPhase]    = useState('moving')
  const scoreRef=useRef(0),xRef=useRef(50),dirRef=useRef(1),roundRef=useRef(1)
  const speedRef=useRef(0.4),rafRef=useRef(null),activeRef=useRef(true)
  const ZONE=20

  useEffect(()=>{
    audio.start()
    function loop(){
      if(!activeRef.current)return
      let nx=xRef.current+dirRef.current*speedRef.current
      if(nx>95){nx=95;dirRef.current=-1}
      if(nx<5){nx=5;dirRef.current=1}
      xRef.current=nx;setTargetX(nx)
      rafRef.current=requestAnimationFrame(loop)
    }
    rafRef.current=requestAnimationFrame(loop)
    return()=>{activeRef.current=false;cancelAnimationFrame(rafRef.current)}
  },[audio])

  function tap(){
    if(phase!=='moving')return
    const x=xRef.current,dist=Math.abs(x-50)
    let pts=0,fb=''
    if(dist<5){pts=50;fb='かんぺき！🎯'}
    else if(dist<ZONE/2){pts=30;fb='グッド！✨'}
    else if(dist<ZONE){pts=15;fb='OK！'}
    else{pts=0;fb='はずれ…'}
    scoreRef.current+=pts;setScore(scoreRef.current)
    setFeedback({text:fb,color:pts>=50?'#FFD700':pts>=30?'#4ADE80':pts>0?'#94A3B8':'#F87171'})
    setPhase('result')
    if(pts>=50)audio.sfxSpecial();else if(pts>=15)audio.sfxRhythmGood();else audio.sfxHit()
    setTimeout(()=>{
      if(!activeRef.current)return
      setFeedback(null)
      const nr=roundRef.current+1
      if(nr>TOTAL){audio.stop();setTimeout(()=>{audio.sfxGameOver();onEnd(scoreRef.current)},400);return}
      roundRef.current=nr;setRound(nr)
      xRef.current=Math.random()>0.5?8:92;dirRef.current=xRef.current<50?1:-1
      speedRef.current=0.35+nr*0.055;setPhase('moving')
    },1000)
  }

  const inZone=Math.abs(targetX-50)<ZONE/2
  return (
    <div style={{position:'fixed',inset:0,background:char.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1.5rem',padding:'1rem'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <div style={{marginTop:'2.5rem',display:'flex',gap:'1.5rem',alignItems:'center'}}>
        <div style={{color:'#FFD700',fontSize:'1.6rem',fontWeight:900}}>{score}</div>
        <div style={{color:'rgba(255,255,255,.6)',fontSize:'.9rem'}}>{round}/{TOTAL}</div>
      </div>
      <div style={{color:'rgba(255,255,255,.7)',fontSize:'1rem'}}>🎯 みどりのゾーンでタップ！</div>
      <div style={{position:'relative',width:'90%',height:80,background:'rgba(255,255,255,.06)',borderRadius:40,overflow:'hidden',border:'1px solid rgba(255,255,255,.1)'}}>
        <div style={{position:'absolute',left:`${50-ZONE/2}%`,top:0,width:`${ZONE}%`,height:'100%',background:'rgba(74,222,128,.2)',borderLeft:'2px dashed #4ADE80',borderRight:'2px dashed #4ADE80'}}/>
        <div style={{position:'absolute',left:'47.5%',top:0,width:'5%',height:'100%',background:'rgba(255,215,0,.25)'}}/>
        <div style={{position:'absolute',left:`calc(${targetX}% - 36px)`,top:'50%',transform:'translateY(-50%)',width:72,height:72,borderRadius:'50%',overflow:'hidden',border:`3px solid ${inZone?'#4ADE80':char.color}`,boxShadow:`0 0 ${inZone?24:12}px ${inZone?'#4ADE80':char.color}`,transition:'border-color .1s,box-shadow .1s'}}>
          <img src={char.img.profile} style={{width:'100%',height:'100%',objectFit:'cover'}} draggable={false}/>
        </div>
      </div>
      <button onPointerDown={tap} style={{padding:'1.2rem 3rem',fontSize:'1.5rem',fontWeight:900,border:'none',borderRadius:'100px',background:phase==='moving'?`linear-gradient(135deg,${char.color},${char.dark})`:'rgba(255,255,255,.15)',color:'white',cursor:phase==='moving'?'pointer':'default',animation:phase==='moving'?'btnPulse 2s ease-in-out infinite':'none',boxShadow:`0 8px 32px ${char.color}55`}}>
        {phase==='moving'?'⚡ タップ！':'⏳'}
      </button>
      {feedback&&<div style={{color:feedback.color,fontSize:'1.8rem',fontWeight:900,animation:'comboFlash .4s ease-in-out infinite'}}>{feedback.text}</div>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 15: クイックドロー
═══════════════════════════════════════════════════════ */
function QuickDraw({ char, audio, onEnd, onBack }) {
  const TOTAL=8
  const [phase,    setPhase]    = useState('wait')
  const [round,    setRound]    = useState(1)
  const [score,    setScore]    = useState(0)
  const [reaction, setReaction] = useState(null)
  const scoreRef=useRef(0),roundRef=useRef(1),goTime=useRef(null)
  const waitRef=useRef(null),activeRef=useRef(true)

  const nextRound=useCallback(()=>{
    if(!activeRef.current)return
    setPhase('ready');setReaction(null)
    const delay=1500+Math.random()*3000
    waitRef.current=setTimeout(()=>{
      if(!activeRef.current)return
      setPhase('go');goTime.current=Date.now();audio.sfxAppear()
    },delay)
  },[audio])

  useEffect(()=>{
    audio.start();setTimeout(nextRound,800)
    return()=>{activeRef.current=false;clearTimeout(waitRef.current)}
  },[audio,nextRound])

  function tap(){
    if(phase==='ready'){
      clearTimeout(waitRef.current);setPhase('early');audio.sfxHit()
      setTimeout(()=>{
        if(!activeRef.current)return
        const nr=roundRef.current+1
        if(nr>TOTAL){audio.stop();setTimeout(()=>{audio.sfxGameOver();onEnd(scoreRef.current)},400);return}
        roundRef.current=nr;setRound(nr);nextRound()
      },1500);return
    }
    if(phase!=='go')return
    const ms=Date.now()-goTime.current
    const pts=Math.round(Math.max(20,Math.min(150,800/ms*50)))
    scoreRef.current+=pts;setScore(scoreRef.current)
    setReaction(ms);setPhase('result')
    if(ms<300)audio.sfxSpecial();else audio.sfxCatch()
    setTimeout(()=>{
      if(!activeRef.current)return
      const nr=roundRef.current+1
      if(nr>TOTAL){audio.stop();setTimeout(()=>{audio.sfxGameOver();onEnd(scoreRef.current)},400);return}
      roundRef.current=nr;setRound(nr);nextRound()
    },1400)
  }

  return (
    <div onPointerDown={tap} style={{position:'fixed',inset:0,background:phase==='go'?`radial-gradient(circle,${char.color}55 0%,#000 70%)`:phase==='early'?'linear-gradient(160deg,#1c0507,#4c0519)':char.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1.2rem',padding:'1rem',touchAction:'none',transition:'background .3s'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <div style={{marginTop:'2.5rem',display:'flex',gap:'1.5rem'}}>
        <div style={{color:'#FFD700',fontSize:'1.6rem',fontWeight:900}}>{score}</div>
        <div style={{color:'rgba(255,255,255,.6)',fontSize:'.9rem',alignSelf:'center'}}>{round}/{TOTAL}</div>
      </div>
      <div style={{width:'clamp(150px,40vw,220px)',height:'clamp(150px,40vw,220px)',borderRadius:'50%',overflow:'hidden',border:`5px solid ${phase==='go'?'#4ADE80':phase==='early'?'#F87171':phase==='result'?'#FFD700':char.color}`,boxShadow:`0 0 ${phase==='go'?60:24}px ${phase==='go'?'#4ADE80':char.color}`,transition:'all .2s',animation:phase==='go'?'btnPulse .3s ease-in-out infinite':'none'}}>
        <img src={char.img.profile} style={{width:'100%',height:'100%',objectFit:'cover'}} draggable={false}/>
      </div>
      <div style={{color:phase==='go'?'#4ADE80':phase==='early'?'#F87171':phase==='result'?'#FFD700':'rgba(255,255,255,.7)',fontSize:'clamp(1.2rem,5vw,2rem)',fontWeight:900,textAlign:'center',animation:phase==='go'?'comboFlash .4s ease-in-out infinite':'none'}}>
        {phase==='wait'&&'じゅんびして…'}{phase==='ready'&&'⏳ まって...'}{phase==='go'&&'⚡ いまだ！タップ！'}{phase==='early'&&'😅 はやすぎ！'}{phase==='result'&&reaction&&`${reaction}ms ⚡`}
      </div>
      {phase==='result'&&reaction&&<div style={{color:'rgba(255,255,255,.7)',fontSize:'.9rem'}}>{reaction<200?'⚡ はやすぎる！':reaction<350?'🏆 すごい！':reaction<500?'✨ グッド！':'👍 OK！'}</div>}
      <div style={{color:'rgba(255,255,255,.3)',fontSize:'.8rem'}}>どこかをタップ</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 16: フォトスナップ
═══════════════════════════════════════════════════════ */
function PhotoSnap({ char, audio, onEnd, onBack }) {
  const PHOTOS=[
    {src:IMG.rumi.performance,color:'#C084FC'},{src:IMG.mira.dance,color:'#FB7185'},
    {src:IMG.zoey.stage,color:'#38BDF8'},{src:IMG.rumi.sword,color:'#C084FC'},
    {src:IMG.mira.stool,color:'#FB7185'},{src:IMG.zoey.determined,color:'#38BDF8'},
    {src:IMG.rumi.roof,color:'#C084FC'},{src:IMG.zoey.closeup,color:'#38BDF8'},
  ]
  const [idx,   setIdx]   = useState(0)
  const [scale, setScale] = useState(0.7)
  const [snap,  setSnap]  = useState(false)
  const [grade, setGrade] = useState(null)
  const [score, setScore] = useState(0)
  const scaleRef=useRef(0.7),dirRef=useRef(0.008),scoreRef=useRef(0)
  const rafRef=useRef(null),snapRef=useRef(false),activeRef=useRef(true)

  useEffect(()=>{
    audio.start()
    function loop(){
      if(!activeRef.current)return
      if(snapRef.current){rafRef.current=requestAnimationFrame(loop);return}
      let ns=scaleRef.current+dirRef.current
      if(ns>1.3){ns=1.3;dirRef.current=-0.008}
      if(ns<0.5){ns=0.5;dirRef.current=0.008}
      scaleRef.current=ns;setScale(ns)
      rafRef.current=requestAnimationFrame(loop)
    }
    rafRef.current=requestAnimationFrame(loop)
    return()=>{activeRef.current=false;cancelAnimationFrame(rafRef.current)}
  },[audio])

  function doSnap(){
    if(snapRef.current)return
    snapRef.current=true;setSnap(true)
    const s=scaleRef.current,dist=Math.abs(s-1.0)
    let pts=0,g=''
    if(dist<0.08){pts=100;g='⭐⭐⭐ かんぺき！'}
    else if(dist<0.18){pts=70;g='⭐⭐ グッド！'}
    else if(dist<0.28){pts=40;g='⭐ OK！'}
    else{pts=10;g='もうちょっと！'}
    scoreRef.current+=pts;setScore(scoreRef.current)
    setGrade(g)
    if(pts>=100)audio.sfxSpecial();else if(pts>=40)audio.sfxCatch();else audio.sfxCardFlip()
    setTimeout(()=>{
      if(!activeRef.current)return
      snapRef.current=false;setSnap(false);setGrade(null)
      const ni=idx+1
      if(ni>=PHOTOS.length){setIdx(ni);audio.stop();setTimeout(()=>{audio.sfxGameOver();onEnd(scoreRef.current)},500);return}
      setIdx(ni);scaleRef.current=0.7;dirRef.current=0.008+ni*0.001
    },1200)
  }

  const p=PHOTOS[Math.min(idx,PHOTOS.length-1)]
  const inSweet=Math.abs(scale-1.0)<0.08
  return (
    <div style={{position:'fixed',inset:0,background:char.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1rem',padding:'1rem'}}>
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <div style={{marginTop:'2.5rem',display:'flex',gap:'1.5rem',alignItems:'center'}}>
        <div style={{color:'#FFD700',fontSize:'1.6rem',fontWeight:900}}>{score}</div>
        <div style={{color:'rgba(255,255,255,.6)',fontSize:'.9rem'}}>{Math.min(idx+1,PHOTOS.length)}/{PHOTOS.length}</div>
      </div>
      <div style={{color:'rgba(255,255,255,.7)',fontSize:'.9rem'}}>📸 ちょうどいいおおきさでシャッター！</div>
      <div style={{position:'relative',width:'clamp(160px,45vw,240px)',height:'clamp(180px,52vw,280px)',borderRadius:20,overflow:'hidden',border:`4px solid ${inSweet?'#4ADE80':snap?'#FFD700':p.color}`,boxShadow:`0 0 ${inSweet?40:20}px ${inSweet?'#4ADE80':p.color}`,transition:'border-color .1s,box-shadow .1s',background:'#000'}}>
        <img src={p.src} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${scale})`,transformOrigin:'center center'}} draggable={false}/>
        {snap&&<div style={{position:'absolute',inset:0,background:'rgba(255,255,255,.6)',animation:'dangerFlash .3s ease-out forwards'}}/>}
        <div style={{position:'absolute',inset:0,border:'2px dashed rgba(255,255,255,.3)',margin:16,borderRadius:8,pointerEvents:'none'}}/>
      </div>
      <div style={{color:inSweet?'#4ADE80':'rgba(255,255,255,.5)',fontSize:'.85rem',fontWeight:700,transition:'color .1s'}}>{inSweet?'✨ ナウ！':'↕ おおきさをみて…'}</div>
      {grade&&<div style={{color:'#FFD700',fontSize:'1.5rem',fontWeight:900,animation:'comboFlash .4s ease-in-out infinite'}}>{grade}</div>}
      <button onPointerDown={doSnap} disabled={!!snap} style={{padding:'1rem 2.5rem',fontSize:'1.3rem',fontWeight:900,border:'none',borderRadius:'100px',background:snap?'rgba(255,255,255,.15)':`linear-gradient(135deg,${char.color},${char.dark})`,color:'white',cursor:snap?'default':'pointer',animation:!snap?'btnPulse 2s ease-in-out infinite':'none',boxShadow:`0 8px 32px ${char.color}55`}}>
        {snap?'📷':'📸 シャッター！'}
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   GAME 17: デーモンアボイド
═══════════════════════════════════════════════════════ */
function DemonAvoid({ char, audio, onEnd, onBack }) {
  const [score,    setScore]    = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [charX,    setCharX]    = useState(50)
  const [enemies,  setEnemies]  = useState([])
  const [stars,    setStars]    = useState([])
  const [lives,    setLives]    = useState(3)
  const [hit,      setHit]      = useState(false)
  const [particles,setParticles]= useState([])
  const scoreRef=useRef(0),timeRef=useRef(60),charXRef=useRef(50)
  const enemiesRef=useRef([]),starsRef=useRef([]),nextId=useRef(0)
  const livesRef=useRef(3),hitRef=useRef(false)
  const rafRef=useRef(null),timerRef=useRef(null),spawnRef=useRef(null)
  const activeRef=useRef(true)

  const endGame=useCallback(()=>{
    if(!activeRef.current)return
    activeRef.current=false;audio.stop()
    cancelAnimationFrame(rafRef.current);clearTimeout(spawnRef.current);clearInterval(timerRef.current)
    setTimeout(()=>{audio.sfxGameOver();onEnd(scoreRef.current)},80)
  },[audio,onEnd])

  useEffect(()=>{
    audio.start()
    const H=window.innerHeight,CHAR_Y=H-90
    function loop(){
      if(!activeRef.current)return
      const W=window.innerWidth,cX=(charXRef.current/100)*W
      const newE=[],newS=[]
      for(const e of enemiesRef.current){
        const ne={...e,y:e.y+e.speed}
        if(!hitRef.current&&ne.y>CHAR_Y-30&&ne.y<CHAR_Y+ne.size&&Math.abs(ne.x-cX)<40){
          hitRef.current=true;setHit(true);audio.sfxHit()
          const nl=livesRef.current-1;livesRef.current=nl;setLives(nl)
          if(nl<=0){endGame();return}
          setTimeout(()=>{hitRef.current=false;setHit(false)},1200)
        } else if(ne.y<H+60){newE.push(ne)}
      }
      for(const s of starsRef.current){
        const ns={...s,y:s.y+s.speed}
        if(ns.y>CHAR_Y-20&&ns.y<CHAR_Y+ns.size&&Math.abs(ns.x-cX)<36){
          scoreRef.current+=15;setScore(scoreRef.current);audio.sfxCatch()
          const pid=Date.now()+Math.random()
          setParticles(p=>[...p,{id:pid,x:ns.x,y:CHAR_Y,text:'+15',color:'#FFD700',big:false}])
          setTimeout(()=>setParticles(p=>p.filter(x=>x.id!==pid)),700)
        } else if(ns.y<H+40){newS.push(ns)}
      }
      enemiesRef.current=newE;starsRef.current=newS
      setEnemies([...newE]);setStars([...newS])
      rafRef.current=requestAnimationFrame(loop)
    }
    rafRef.current=requestAnimationFrame(loop)
    timerRef.current=setInterval(()=>{
      const n=timeRef.current-1;timeRef.current=n;setTimeLeft(n)
      if(n<=0){clearInterval(timerRef.current);endGame()}
    },1000)
    function spawn(){
      if(!activeRef.current)return
      const prog=1-timeRef.current/60,rate=Math.max(700,1800-prog*1100),W=window.innerWidth
      const d=DEMONS[Math.floor(Math.random()*DEMONS.length)]
      const sz=52
      enemiesRef.current=[...enemiesRef.current,{id:nextId.current++,x:sz/2+Math.random()*(W-sz),y:-sz,size:sz,emoji:d.emoji,glow:d.glow,speed:2+prog*2.5+Math.random()*.5}]
      if(Math.random()<0.4)starsRef.current=[...starsRef.current,{id:nextId.current++,x:36+Math.random()*(W-72),y:-36,size:36,speed:1.8+prog*1.5}]
      spawnRef.current=setTimeout(spawn,rate)
    }
    spawnRef.current=setTimeout(spawn,500)
    return()=>{activeRef.current=false;cancelAnimationFrame(rafRef.current);clearTimeout(spawnRef.current);clearInterval(timerRef.current)}
  },[audio,endGame])

  function move(e){
    const pct=(e.clientX/window.innerWidth)*100
    charXRef.current=Math.max(8,Math.min(92,pct));setCharX(charXRef.current)
  }

  return (
    <div onPointerMove={move} onPointerDown={move} style={{position:'fixed',inset:0,background:char.bg,overflow:'hidden',touchAction:'none'}}>
      {hit&&<div style={{position:'fixed',inset:0,background:'rgba(220,38,38,.3)',zIndex:100,pointerEvents:'none',animation:'dangerFlash .5s ease-out forwards'}}/>}
      <BackBtn onClick={()=>{activeRef.current=false;audio.stop();onBack()}}/>
      <div style={{position:'absolute',top:0,left:0,right:0,padding:'.6rem 1rem',background:'rgba(0,0,0,.45)',backdropFilter:'blur(6px)',zIndex:30,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{color:'#FFD700',fontSize:'clamp(1.2rem,4vw,1.8rem)',fontWeight:900}}>{score.toLocaleString()}</div>
        <div style={{fontSize:'1.4rem'}}>{'❤️'.repeat(Math.max(0,lives))}{'🖤'.repeat(Math.max(0,3-lives))}</div>
        <div style={{color:timeLeft<=10?'#F87171':'white',fontSize:'clamp(1.2rem,4vw,1.8rem)',fontWeight:900}}>{timeLeft}s</div>
      </div>
      {enemies.map(e=>(
        <div key={e.id} style={{position:'absolute',left:e.x-e.size/2,top:e.y,width:e.size,height:e.size,fontSize:`${e.size*.75}px`,lineHeight:`${e.size}px`,textAlign:'center',filter:`drop-shadow(0 0 10px ${e.glow})`,pointerEvents:'none',zIndex:10}}>{e.emoji}</div>
      ))}
      {stars.map(s=>(
        <div key={s.id} style={{position:'absolute',left:s.x-s.size/2,top:s.y,width:s.size,height:s.size,fontSize:`${s.size*.8}px`,lineHeight:`${s.size}px`,textAlign:'center',filter:'drop-shadow(0 0 8px #FFD700)',pointerEvents:'none',zIndex:10}}>⭐</div>
      ))}
      <div style={{position:'absolute',bottom:30,left:`calc(${charX}% - 30px)`,zIndex:20,pointerEvents:'none',transition:'left .04s linear',filter:hit?`drop-shadow(0 0 20px #F87171)`:`drop-shadow(0 0 20px ${char.color})`}}>
        <img src={char.img.profile} style={{width:60,height:60,borderRadius:'50%',objectFit:'cover',border:`3px solid ${hit?'#F87171':char.color}`}} draggable={false}/>
      </div>
      {particles.map(p=><ScoreParticle key={p.id} p={p}/>)}
      <div style={{position:'absolute',bottom:8,left:'50%',transform:'translateX(-50%)',color:'rgba(255,255,255,.4)',fontSize:'.75rem',whiteSpace:'nowrap',pointerEvents:'none'}}>ゆびをうごかして👹をよけろ！⭐をあつめよう</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const [screen,     setScreen]     = useState('title')
  // 'title' | 'select' | 'hub' | 'game' | 'result'
  const [char,       setChar]       = useState(null)
  const [gameId,     setGameId]     = useState(null)
  const [lastScore,  setLastScore]  = useState(0)
  const [highScores, setHighScores] = useState({})

  const audioRef    = useRef(null)
  const ytPlayerRef = useRef(null)
  const ytReadyRef  = useRef(false)

  useEffect(() => {
    // Load YouTube IFrame API for Huntrix / KPop Demon Hunters OST
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = () => {
      ytPlayerRef.current = new window.YT.Player('yt-audio', {
        height: '1', width: '1',
        videoId: YT_PLAYLIST[0],
        playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: YT_PLAYLIST.join(',') },
        events: { onReady: () => { ytReadyRef.current = true } },
      })
    }
    audioRef.current = makeAudio(() => ytReadyRef.current ? ytPlayerRef.current : null)
    return () => audioRef.current?.stop()
  }, [])

  function selectChar(c) { setChar(c); setScreen('hub') }

  function selectGame(gid) { setGameId(gid); setScreen('game') }

  function gameEnd(score) {
    setLastScore(score)
    setHighScores(prev => ({ ...prev, [gameId]: Math.max(prev[gameId]||0, score) }))
    setScreen('result')
  }

  function backToHub() {
    audioRef.current?.stop()
    setScreen('hub')
  }

  const game = GAMES.find(g => g.id === gameId)

  return (
    <>
      {/* Hidden YouTube audio player for Huntrix OST */}
      <div id="yt-audio" style={{position:'fixed',width:1,height:1,bottom:-10,left:-10,opacity:0,pointerEvents:'none'}}/>
      {screen === 'title' && <TitleScreen onStart={() => setScreen('select')} />}
      {screen === 'select' && <SelectScreen onSelect={selectChar} />}
      {screen === 'hub' && char && (
        <GameHub
          char={char}
          highScores={highScores}
          onSelectGame={selectGame}
          onBack={() => setScreen('select')}
        />
      )}
      {screen === 'game' && char && gameId === 'starCatch' && (
        <StarCatch char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'memoryCards' && (
        <MemoryCards char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'bubblePop' && (
        <BubblePop char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'hideSeek' && (
        <HideSeek char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'rhythmTap' && (
        <RhythmTap char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'puzzle' && (
        <Puzzle char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'demonShoot' && (
        <DemonShoot char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'janken' && (
        <Janken char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'simonSays' && (
        <SimonSays char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'numberTouch' && (
        <NumberTouch char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'slot' && (
        <Slot char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'ballCatch' && (
        <BallCatch char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'speedTap' && (
        <SpeedTap char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'movingTarget' && (
        <MovingTarget char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'quickDraw' && (
        <QuickDraw char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'demonAvoid' && (
        <DemonAvoid char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'game' && char && gameId === 'photoSnap' && (
        <PhotoSnap char={char} audio={audioRef.current} onEnd={gameEnd} onBack={backToHub} />
      )}
      {screen === 'result' && char && game && (
        <ResultScreen
          char={char}
          score={lastScore}
          highScore={highScores[gameId] || 0}
          gameLabel={game.emoji + ' ' + game.label}
          onReplay={() => { setScreen('game') }}
          onHub={backToHub}
        />
      )}
    </>
  )
}
