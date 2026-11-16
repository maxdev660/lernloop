import test from 'node:test';
import assert from 'node:assert/strict';
import {skillKey,noteSkill,skillStatus,chooseFocus,makeLearningLink,parseLearningLink} from '../public/js/core/compass.js';
import {LEARNING_FIELDS} from '../public/js/data/curriculum.js';
import {MATH_TOPICS} from '../public/js/modules/math.js';

const base='https://lernloop.pages.dev/';
test('Lernkompass: Fehler erhalten Priorität, Fortschritt bleibt lokal',()=>{
 const db={skills:{}};
 const wrong={track:'retail',field:3}; const good={track:'retail',field:2};
 for(let i=0;i<8;i++){noteSkill(db,wrong,false,1000+i); noteSkill(db,good,true,1000+i);}
 assert.equal(db.skills['retail:3'].attempts,8);assert.equal(db.skills['retail:3'].correct,0);
 assert.equal(db.skills['retail:2'].correct,8);assert.equal(db.skills['retail:3'].recent.length,8);
 assert.equal(skillStatus(db.skills['retail:3']).label,'Wiederholen');
 assert.equal(skillStatus(db.skills['retail:2']).label,'Läuft gut');
 const focus=chooseFocus(db.skills,[{key:'retail:2',value:2},{key:'retail:3',value:3}]);assert.equal(focus.value,3);
});
test('Lernkompass: Noch untrainierte Themen bekommen verständlichen Status',()=>{
 assert.equal(skillStatus(undefined).label,'Noch offen');
 assert.equal(skillKey({track:'math',field:'percent'}),'math:percent');
 assert.equal(skillKey({track:'language',field:'fr',lang:'fr'}),'language:fr');
 assert.equal(chooseFocus({},[]),null);
});
test('Teilbare Lernziele: URL bleibt ohne Nutzerstatistiken oder Notizen und rekonstruiert korrekte Auswahl',()=>{
 for(let i=0;i<1200;i++){
  const year=['1','2','3','all'][i%4];
  const fields=LEARNING_FIELDS.filter(f=>year==='all'||String(f.year)===year).map(f=>f.id);
  const expected=fields.filter((_,j)=>(j+i)%2===0);
  const url=makeLearningLink(base,{track:'retail',year,selected:expected,stats:{private:123},notes:'secret'});
  assert.ok(!url.includes('secret')&&!url.includes('private'));
  const parsed=parseLearningLink(url,MATH_TOPICS.map(x=>x.id));
  assert.equal(parsed.track,'retail');assert.equal(parsed.year,year);assert.deepEqual(parsed.selected,expected);
 }
});
test('Teilbare Lernziele: Mathe, Sprachen und fehlerhafte Eingaben werden validiert',()=>{
 for(let i=5;i<=13;i++){
  const cfg={track:'math',grade:i,topics:['percent','equations']};
  assert.deepEqual(parseLearningLink(makeLearningLink(base,cfg),MATH_TOPICS.map(x=>x.id)),cfg);
 }
 for(const lang of ['en','es','fr','it']){
  const cfg={track:'language',language:lang};assert.deepEqual(parseLearningLink(makeLearningLink(base,cfg),MATH_TOPICS.map(x=>x.id)),cfg);
 }
 assert.equal(parseLearningLink(base),null);
 assert.deepEqual(parseLearningLink(base+'?lernen=retail&jahr=1&lf=1,2,2,13,abc,-3').selected,[1,2]);
 assert.deepEqual(parseLearningLink(base+'?lernen=math&klasse=999&themen=unknown,percent', ['percent']).topics,['percent']);
});
