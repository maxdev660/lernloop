// Lernen statt künstlicher Streaks: lokale, nachvollziehbare Themenübersicht.
export const skillKey = q => `${q.track || 'retail'}:${q.track === 'language' ? (q.lang || q.field || 'en') : q.field}`;
export function noteSkill(data, question, correct, now=Date.now()) {
  if (!data.skills || typeof data.skills !== 'object') data.skills = {};
  const key = skillKey(question);
  const old = data.skills[key] || {attempts:0, correct:0, recent:[], lastAt:0};
  const recent = [...(Array.isArray(old.recent) ? old.recent : []), correct ? 1 : 0].slice(-12);
  data.skills[key] = {attempts:(old.attempts||0)+1,correct:(old.correct||0)+(correct?1:0),recent,lastAt:now};
  return data.skills[key];
}
export function skillStatus(skill) {
  const attempts = skill?.attempts || 0;
  if (!attempts) return {label:'Noch offen',tone:'new',detail:'Noch nicht geübt'};
  const recent = Array.isArray(skill.recent) ? skill.recent : [];
  const ratio = recent.length ? recent.reduce((a,b)=>a+b,0)/recent.length : 0;
  if (recent.length>=4 && ratio>=0.8) return {label:'Läuft gut',tone:'good',detail:`${Math.round(ratio*100)} % in den letzten ${recent.length} Versuchen`};
  if (ratio<0.5) return {label:'Wiederholen',tone:'review',detail:`${Math.round(ratio*100)} % in den letzten ${recent.length} Versuchen`};
  return {label:'Im Aufbau',tone:'building',detail:`${Math.round(ratio*100)} % in den letzten ${recent.length} Versuchen`};
}
export function chooseFocus(skills, candidates) {
  if (!candidates?.length) return null;
  const scored=candidates.map(candidate => {
    const stat=skills?.[candidate.key];
    const recent=stat?.recent || [];
    const ratio=recent.length ? recent.reduce((a,b)=>a+b,0)/recent.length : 0.52;
    // Neue Themen nicht übergehen; Schwierigkeiten besonders gewichten.
    const score=ratio + (stat?.attempts ? 0.025*Math.min(stat.attempts,8) : 0);
    return {candidate,score};
  });
  scored.sort((a,b)=>a.score-b.score || a.candidate.key.localeCompare(b.candidate.key));
  return scored[0].candidate;
}
export function makeLearningLink(base, config) {
  const u=new URL(base);u.search='';u.hash='';
  u.searchParams.set('lernen', ['retail','math','language'].includes(config.track) ? config.track : 'retail');
  if (config.track==='retail') {
    u.searchParams.set('jahr', ['1','2','3','all'].includes(String(config.year)) ? config.year : 'all');
    const fields=(config.selected||[]).map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=14).slice(0,14);
    if(fields.length)u.searchParams.set('lf',fields.join(','));
  } else if (config.track==='math') {
    u.searchParams.set('klasse',String(Math.max(5,Math.min(13,Number(config.grade)||9))));
    if(config.topics?.length)u.searchParams.set('themen',config.topics.join(',').slice(0,130));
  } else if(config.track==='language')u.searchParams.set('sprache',String(config.language||'en').slice(0,2));
  return u.toString();
}
export function parseLearningLink(url,validTopics=[],validLangs=['en','es','fr','it']) {
  const u=new URL(url,'https://lernloop.pages.dev/');
  const track=u.searchParams.get('lernen');
  if(!['retail','math','language'].includes(track))return null;
  const out={track};
  if(track==='retail') {
    const year=u.searchParams.get('jahr');out.year=['1','2','3','all'].includes(year)?year:'all';
    const possible=out.year==='all'?new Set(Array.from({length:14},(_,i)=>i+1)):new Set((out.year==='1'?[1,2,3,4,5]:out.year==='2'?[6,7,8,9,10]:[11,12,13,14]));
    out.selected=[...new Set((u.searchParams.get('lf')||'').split(',').map(Number).filter(n=>Number.isInteger(n)&&possible.has(n)))];
  } else if(track==='math') {
    out.grade=Math.max(5,Math.min(13,Number(u.searchParams.get('klasse'))||9));
    out.topics=(u.searchParams.get('themen')||'').split(',').filter(t=>validTopics.includes(t));
  } else {
    const lang=u.searchParams.get('sprache');out.language=validLangs.includes(lang)?lang:'en';
  }
  return out;
}
