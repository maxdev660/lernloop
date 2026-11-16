import {test} from 'node:test';import assert from 'node:assert/strict';
import {LEARNING_FIELDS} from '../public/js/data/curriculum.js';
import {QUESTIONS,TEMPLATES,makeGenerated,shuffleQuestion,gradeAnswer,allFieldsForYear,validateQuestion} from '../public/js/core/engine.js';
import {MATH_MAKERS,generateMath,mathTemplates,regenMath} from '../public/js/modules/math.js';
import {LANGS,generateLanguage,checkLanguage,languagePairs} from '../public/js/modules/languages.js';
import {calculate} from '../public/js/core/calculator.js';
const count=12000;
test('offizielle Lernfeldstruktur 1–14 und Jahrgänge 5/5/4',()=>{
 assert.equal(LEARNING_FIELDS.length,14);assert.deepEqual(LEARNING_FIELDS.map(x=>x.id),Array.from({length:14},(_,i)=>i+1));
 assert.equal(allFieldsForYear('1').length,5);assert.equal(allFieldsForYear('2').length,5);assert.equal(allFieldsForYear('3').length,4);assert.equal(allFieldsForYear('all').length,14);
});
test('98 Grundfragen mit richtigen Antwortstrukturen',()=>{assert.equal(QUESTIONS.length,98);for(const q of QUESTIONS)assert.ok(validateQuestion(q),q.id)});
test('29 Retail-Varianten fachlich strukturell prüfen × 12 000',()=>{assert.equal(TEMPLATES.length,29);let countByField=new Set();for(let i=0;i<count;i++){const t=TEMPLATES[i%TEMPLATES.length];const seed=(i*976531+19)>>>0;const q=makeGenerated(t,seed);assert.ok(validateQuestion(q),`${t.key} ${seed}`);countByField.add(q.field);if(q.type==='calc'){assert.equal(gradeAnswer(q,String(q.answer).replace('.',',')),true);assert.equal(gradeAnswer(q,'abc'),false)}if(q.type==='single'){const mixed=shuffleQuestion(q,()=>.37);assert.equal(gradeAnswer(mixed,mixed.answer),true);assert.equal(gradeAnswer(mixed,(mixed.answer+1)%mixed.options.length),false);}}
 assert.equal(countByField.size,14);
});
test('Mathematik × 12 000 Varianten, deterministisch und unterscheidbare richtige/falsche Antworten',()=>{assert.equal(MATH_MAKERS.length,17);for(let i=0;i<count;i++){const grade=5+i%9;const q=generateMath((i*3451+5)>>>0,grade);assert.ok(q&&Number.isFinite(q.answer),`math ${i}`);assert.ok(q.prompt&&q.explanation&&q.remember);assert.equal(gradeAnswer(q,String(q.answer).replace('.',',')),true);assert.equal(gradeAnswer(q,String(q.answer+13)),false);assert.ok(mathTemplates(grade).some(x=>x.key===q.template));const revived=regenMath(q.id,grade);assert.equal(revived.answer,q.answer);assert.equal(revived.prompt,q.prompt);}}
);
test('Sprachen × 12 000 Varianten mit Lösung, Mikrofon-/Audio-Text-Fallback',()=>{for(const lang of LANGS){assert.equal(languagePairs(lang.id).length,20);for(let i=0;i<count/4;i++){const q=generateLanguage(i*19+3,lang.id);assert.ok(q.prompt&&q.remember);if(q.type==='single'){const mixed=shuffleQuestion(q,()=>.2);assert.equal(gradeAnswer(mixed,mixed.answer),true)}else assert.equal(checkLanguage(q,q.displayAnswer),true);}}
});
test('Taschenrechner: mathematische Operationen, Prozent, Wurzeln, Potenzen, Ungültiges',()=>{assert.equal(calculate('(20+10)*2'),60);assert.equal(calculate('50*20%'),10);assert.equal(calculate('sqrt(81)+4^2'),25);assert.equal(calculate('10/4'),2.5);assert.throws(()=>calculate('1/0'));assert.throws(()=>calculate('alert(1)'));assert.throws(()=>calculate('sqrt(-9)'));});
test('Themenfilter schließen nicht gewählte Mathethemen aus',()=>{for(const grade of [5,7,9,13])for(const topic of ['percent','geometry','mental']){const arr=mathTemplates(grade,[topic]);assert.ok(arr.every(x=>x.topic===topic));}});
import {loadData,saveData,recordAnswer,setSaved} from '../public/js/core/storage.js';
test('Speichern, Laden, Fehler wiederholen und Merksatz-Sammlung mit LocalStorage',()=>{
 const store=new Map();const old=globalThis.localStorage;globalThis.localStorage={getItem:key=>store.get(key)??null,setItem:(key,v)=>store.set(key,v)};
 try{const d=loadData(),q={id:'test-q',field:1,prompt:'Testaufgabe',remember:'Merksatz'};assert.equal(d.stats.answered,0);recordAnswer(d,q,false);let back=loadData();assert.equal(back.stats.answered,1);assert.equal(Object.keys(back.mistakes).length,1);setSaved(back,q);back=loadData();assert.ok(back.saved['test-q']);recordAnswer(back,q,true);back=loadData();assert.equal(back.stats.correct,1);assert.equal(Object.keys(back.mistakes).length,0);}
 finally{globalThis.localStorage=old;}
});
