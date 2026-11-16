const KEY='lernloop_v4_local';
const DEFAULT={theme:'light',year:'all',selected:[],stats:{answered:0,correct:0},mistakes:{},saved:{}};
export function loadData(){try{const value=JSON.parse(localStorage.getItem(KEY));if(!value||typeof value!=='object')return structuredClone(DEFAULT);return {...structuredClone(DEFAULT),...value,stats:{...DEFAULT.stats,...value.stats},mistakes:value.mistakes||{},saved:value.saved||{}};}catch{return structuredClone(DEFAULT);}}
export function saveData(data){try{localStorage.setItem(KEY,JSON.stringify(data));return true;}catch{return false;}}
export function recordAnswer(data,q,correct){data.stats.answered++;if(correct)data.stats.correct++;
 if(correct){delete data.mistakes[q.id];}else{const old=data.mistakes[q.id];data.mistakes[q.id]={question:q,count:(old?.count||0)+1,date:Date.now()};const keys=Object.keys(data.mistakes);if(keys.length>180){keys.sort((a,b)=>data.mistakes[a].date-data.mistakes[b].date).slice(0,keys.length-180).forEach(k=>delete data.mistakes[k]);}}
 return saveData(data);}
export function setSaved(data,q){if(data.saved[q.id])delete data.saved[q.id];else data.saved[q.id]={field:q.field,prompt:q.prompt,remember:q.remember,created:Date.now()};saveData(data);return !!data.saved[q.id];}
