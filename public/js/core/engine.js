import {QUESTIONS} from '../data/questions.js';
import {TEMPLATES,makeGenerated,templatesForFields} from '../data/generators.js';
import {LEARNING_FIELDS} from '../data/curriculum.js';
const randomInt=()=>{try{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0];}catch{return Math.floor(Math.random()*4294967296);}};
export function allFieldsForYear(year){return LEARNING_FIELDS.filter(x=>year==='all'||x.year===Number(year)).map(x=>x.id);}
export function activeFields(year,selected){const possible=allFieldsForYear(year);return selected?.length?possible.filter(n=>selected.includes(n)):possible;}
export function normalizeText(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').toLowerCase().replace(/[.,!?;:]/g,'').replace(/\s+/g,' ').trim();}
export function shuffleQuestion(q,r=Math.random){if(!['single','multi'].includes(q.type))return {...q};const indexed=q.options.map((label,i)=>({label,index:i}));for(let i=indexed.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[indexed[i],indexed[j]]=[indexed[j],indexed[i]];}return {...q,options:indexed.map(x=>x.label),answer:Array.isArray(q.answer)?indexed.map((x,i)=>q.answer.includes(x.index)?i:-1).filter(i=>i>=0):indexed.findIndex(x=>x.index===q.answer)};}
export function formatNumber(x){return Number(x).toLocaleString('de-DE',{minimumFractionDigits:Number.isInteger(x)?0:2,maximumFractionDigits:2});}
export function answerLabel(q){if(q.type==='single')return q.options[q.answer];if(q.type==='multi')return q.answer.map(i=>q.options[i]).join(' · ');if(q.type==='calc')return `${formatNumber(q.answer)}${q.unit?' '+q.unit:''}`;if(q.type==='fill')return q.displayAnswer;if(q.type==='open')return q.sample;return ''}
export function gradeAnswer(q,value){if(q.type==='single')return Number(value)===q.answer;
 if(q.type==='multi'){const selected=Array.isArray(value)?value.map(Number).sort((a,b)=>a-b):[];const answers=[...q.answer].sort((a,b)=>a-b);return selected.length===answers.length&&selected.every((v,i)=>v===answers[i]);}
 if(q.type==='calc'){const s=String(value??'').replace(/\s/g,'').replace(/€/g,'').replace(/%/g,'');const de=s.includes(',')?s.replace(/\./g,'').replace(',','.'):s;const n=Number(de);return de!==''&&Number.isFinite(n)&&Math.abs(n-q.answer)<=0.011;}
 if(q.type==='fill')return q.accepted.some(a=>normalizeText(a)===normalizeText(value));
 return null;}
export function nextQuestion(fields=[],recentIds=[],recentTemplates=[]){if(!fields.length)return null;
 const statics=QUESTIONS.filter(q=>fields.includes(q.field));
 const templates=templatesForFields(fields);
 const useGen=templates.length&&(Math.random()<0.63||!statics.length);
 if(useGen){const choices=templates.filter(t=>!recentTemplates.slice(-5).includes(t.key));const t=(choices.length?choices:templates)[Math.floor(Math.random()*(choices.length?choices:templates).length)];return shuffleQuestion(makeGenerated(t,randomInt()));}
 const pool=statics.filter(q=>!recentIds.slice(-22).includes(q.id));const viable=pool.length?pool:statics;return viable.length?shuffleQuestion(viable[Math.floor(Math.random()*viable.length)]):null;
}
export function validateQuestion(q){if(!q||!LEARNING_FIELDS.some(f=>f.id===q.field)||!q.prompt||!q.remember||!q.explanation)return false;
 if(['single','multi'].includes(q.type)){if(!Array.isArray(q.options)||q.options.length<2||new Set(q.options).size!==q.options.length)return false;if(q.type==='single'&&(!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length))return false;if(q.type==='multi'&&(!Array.isArray(q.answer)||!q.answer.length||q.answer.some(i=>!Number.isInteger(i)||i<0||i>=q.options.length)))return false;}
 if(q.type==='calc'&&!Number.isFinite(q.answer))return false;
 if(q.type==='fill'&&(!q.accepted||!q.accepted.length))return false;
 if(q.type==='open'&&!q.sample)return false;
 return ['single','multi','calc','fill','open'].includes(q.type);
}
export {QUESTIONS,TEMPLATES,makeGenerated};
