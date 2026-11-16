// Self-contained parameter-based math exercises. No AI claims, no external API.
const makeRng=seed=>{let s=seed>>>0;return()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296}};
const rint=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const p=(r,arr)=>arr[rint(r,0,arr.length-1)];
const fmt=n=>String(Math.round(n*100)/100).replace('.',',');
const q=(topic,prompt,answer,explanation,remember,allowCalculator=true,unit='',extras={})=>({track:'math',field:topic,type:'calc',prompt,answer,explanation,remember,allowCalculator,unit,...extras});
export const MATH_TOPICS=[
{id:'mental',title:'Kopfrechnen',grades:'5–13'},
{id:'fractions',title:'Brüche & Anteile',grades:'5–9'},
{id:'percent',title:'Prozentrechnung',grades:'6–13'},
{id:'equations',title:'Gleichungen',grades:'7–13'},
{id:'geometry',title:'Geometrie',grades:'5–13'},
{id:'powers',title:'Potenzen & Wurzeln',grades:'8–13'},
{id:'quadratic',title:'Quadratische Gleichungen',grades:'9–13'}
];
export const MATH_MAKERS=[
{key:'headadd',topic:'mental',grade:5,make:r=>{const a=rint(r,11,120),b=rint(r,11,120);return q('mental',`Berechne ohne Taschenrechner: ${a} + ${b}`,a+b,`${a} + ${b} = ${a+b}.`,'Addiere zuerst die Zehner, danach die Einer.',false)}},
{key:'headminus',topic:'mental',grade:5,make:r=>{const a=rint(r,60,250),b=rint(r,12,59);return q('mental',`Berechne im Kopf: ${a} − ${b}`,a-b,`${a} − ${b} = ${a-b}.`,'Bei der Subtraktion können Zehner und Einer getrennt werden.',false)}},
{key:'headmult',topic:'mental',grade:5,make:r=>{const a=rint(r,3,12),b=rint(r,4,12);return q('mental',`Wie viel ist ${a} × ${b}?`,a*b,`${a} × ${b} = ${a*b}.`,'Das kleine Einmaleins hilft bei größeren Rechnungen.',false)}},
{key:'headdiv',topic:'mental',grade:5,make:r=>{const b=rint(r,2,12),n=rint(r,3,18);return q('mental',`Berechne ohne Rechner: ${b*n} ÷ ${b}`,n,`${b*n} ÷ ${b} = ${n}.`,'Division ist die Umkehrung der Multiplikation.',false)}},
{key:'fraction',topic:'fractions',grade:5,make:r=>{const denom=p(r,[2,3,4,5,8,10]),n=rint(r,1,denom-1),total=denom*rint(r,3,30),ans=total*n/denom;return q('fractions',`Wie viel sind ${n}/${denom} von ${total}?`,ans,`${total} ÷ ${denom} × ${n} = ${ans}.`,'Bruchteil = Gesamtwert ÷ Nenner × Zähler.',false)}},
{key:'fractionadd',topic:'fractions',grade:6,make:r=>{const d=p(r,[4,6,8,10,12]),a=rint(r,1,d-2),b=rint(r,1,d-a);return q('fractions',`Gleichnamige Brüche: ${a}/${d} + ${b}/${d}. Gib das Ergebnis als Dezimalzahl ein.`,(a+b)/d,`(${a}+${b})/${d} = ${a+b}/${d} = ${fmt((a+b)/d)}.`,'Bei gleichen Nennern werden die Zähler addiert; der Nenner bleibt.',false)}},
{key:'percentpart',topic:'percent',grade:6,make:r=>{const base=rint(r,4,100)*10,percent=p(r,[5,10,15,20,25,30,40,50,75]);return q('percent',`Wie viel sind ${percent} % von ${base} €?`,base*percent/100,`${base} × ${percent} ÷ 100 = ${fmt(base*percent/100)} €.`,'Prozentwert = Grundwert × Prozentsatz ÷ 100.',true,'€')}},
{key:'discount',topic:'percent',grade:7,make:r=>{const base=rint(r,15,300)*5,rate=p(r,[5,10,15,20,25,30]);return q('percent',`Eine Jacke kostet ${base} €. Im Angebot gibt es ${rate} % Rabatt. Wie hoch ist der neue Preis?`,base*(1-rate/100),`${base} × (1 − ${rate}/100) = ${fmt(base*(1-rate/100))} €.`,'Nach einem Rabatt gilt: Preis × (1 − Rabattsatz/100).',true,'€')}},
{key:'growth',topic:'percent',grade:7,make:r=>{const base=rint(r,10,200)*5,rate=p(r,[5,10,15,20]);return q('percent',`Ein Wert von ${base} steigt um ${rate} %. Wie hoch ist der neue Wert?`,base*(1+rate/100),`${base} × (1 + ${rate}/100) = ${fmt(base*(1+rate/100))}.`,'Bei einem Anstieg wird mit 1 plus dem Dezimal-Prozentsatz multipliziert.',true)}},
{key:'percentage',topic:'percent',grade:7,make:r=>{const base=rint(r,4,100)*20,rate=p(r,[10,20,25,30,40,50,75]);const part=base*rate/100;return q('percent',`${fmt(part)} von ${base}: Wie hoch ist der Anteil in Prozent?`,rate,`${fmt(part)} ÷ ${base} × 100 = ${rate} %.`,'Prozentsatz = Prozentwert ÷ Grundwert × 100.',true,'%')}},
{key:'linear',topic:'equations',grade:7,make:r=>{const x=rint(r,-15,20),a=rint(r,2,12),b=rint(r,-20,20);return q('equations',`Löse nach x auf: ${a}x ${b<0?'− '+Math.abs(b):'+ '+b} = ${a*x+b}.`,x,`${a}x = ${a*x+b} ${b<0?'+':'−'} ${Math.abs(b)} = ${a*x}; also x = ${x}.`,'Bei Gleichungen auf beiden Seiten dieselbe Umformung durchführen.',false)}},
{key:'triangle',topic:'geometry',grade:5,make:r=>{const a=rint(r,3,25),h=rint(r,3,20);return q('geometry',`Ein Dreieck hat Grundseite ${a} cm und Höhe ${h} cm. Wie groß ist seine Fläche?`,a*h/2,`${a} × ${h} ÷ 2 = ${fmt(a*h/2)} cm².`,'Flächeninhalt Dreieck = Grundseite × Höhe ÷ 2.',true,'cm²')}},
{key:'rectangle',topic:'geometry',grade:5,make:r=>{const a=rint(r,4,24),b=rint(r,5,28);return q('geometry',`Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist seine Fläche?`,a*b,`${a} × ${b} = ${a*b} cm².`,'Fläche eines Rechtecks = Länge × Breite.',false,'cm²')}},
{key:'pyth',topic:'geometry',grade:9,make:r=>{const t=p(r,[[3,4,5],[5,12,13],[8,15,17],[7,24,25]]);return q('geometry',`Ein rechtwinkliges Dreieck hat Katheten von ${t[0]} cm und ${t[1]} cm. Wie lang ist die Hypotenuse?`,t[2],`√(${t[0]}² + ${t[1]}²) = ${t[2]} cm.`,'Satz des Pythagoras: a² + b² = c².',true,'cm')}},
{key:'square',topic:'powers',grade:8,make:r=>{const n=rint(r,3,26);return q('powers',`Berechne ${n}².`,n*n,`${n} × ${n} = ${n*n}.`,'Eine Zahl zum Quadrat wird mit sich selbst multipliziert.',false)}},
{key:'root',topic:'powers',grade:8,make:r=>{const n=rint(r,4,24);return q('powers',`Wie lautet √${n*n}?`,n,`√${n*n} = ${n}, weil ${n}² = ${n*n}.`,'Die Quadratwurzel ist bei nichtnegativen Zahlen die nichtnegative Zahl, deren Quadrat den Wert ergibt.',false)}},
{key:'quadratic',topic:'quadratic',grade:9,make:r=>{const x=rint(r,2,20);return q('quadratic',`Die Gleichung x² = ${x*x} hat zwei Lösungen. Gib die positive Lösung an.`,x,`x = ±√${x*x} = ±${x}. Positive Lösung: ${x}.`,'Beim Lösen von x² = a sowohl die positive als auch die negative Lösung beachten, falls a > 0.',true)}},
];
export function mathTemplates(grade=10,selected=[]){return MATH_MAKERS.filter(t=>grade>=t.grade&&(!selected?.length||selected.includes(t.topic)));}
export function generateMath(seed,grade=10,selected=[],exclude=[]){const pool=mathTemplates(grade,selected);if(!pool.length)return null;const r=makeRng(seed);const remaining=pool.filter(x=>!exclude.slice(-4).includes(x.key));const t=p(r,remaining.length?remaining:pool),question=t.make(r);return {...question,id:`m-${t.key}-${seed}`,template:t.key,grade};}
export function regenMath(id,grade=10){const parts=/^m-([a-z]+)-(\d+)$/.exec(id);if(!parts)return null;const t=MATH_MAKERS.find(x=>x.key===parts[1]);if(!t)return null;const r=makeRng(Number(parts[2]));r();return {...t.make(r),id,template:t.key,grade};}
export function randomSeed(){try{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0];}catch{return Math.floor(Math.random()*4294967296)}}
