// Curated A1 phrase bank. Not an exhaustive language curriculum.
const entries = {
 en:[
 ['Guten Morgen.','Good morning.'],['Wie heißt du?','What is your name?'],['Ich heiße Anna.','My name is Anna.'],['Danke.','Thank you.'],['Bitte.','Please.'],['Wie geht es dir?','How are you?'],['Mir geht es gut.','I am fine.'],['Wo ist der Bahnhof?','Where is the train station?'],['Ich brauche Hilfe.','I need help.'],['Ein Wasser, bitte.','A water, please.'],['Wie viel kostet das?','How much does it cost?'],['Ich lerne Englisch.','I am learning English.'],['Ich habe eine Frage.','I have a question.'],['Heute ist Montag.','Today is Monday.'],['Morgen habe ich Zeit.','I have time tomorrow.'],['Kannst du das wiederholen?','Can you repeat that?'],['Ich verstehe nicht.','I do not understand.'],['Ich komme aus Deutschland.','I am from Germany.'],['Ich möchte einen Kaffee.','I would like a coffee.'],['Wo ist die Toilette?','Where is the bathroom.']
 ],
 es:[
 ['Guten Morgen.','Buenos días.'],['Wie heißt du?','¿Cómo te llamas?'],['Ich heiße Anna.','Me llamo Ana.'],['Danke.','Gracias.'],['Bitte.','Por favor.'],['Wie geht es dir?','¿Cómo estás?'],['Mir geht es gut.','Estoy bien.'],['Wo ist der Bahnhof?','¿Dónde está la estación de tren?'],['Ich brauche Hilfe.','Necesito ayuda.'],['Ein Wasser, bitte.','Un agua, por favor.'],['Wie viel kostet das?','¿Cuánto cuesta?'],['Ich lerne Spanisch.','Estoy aprendiendo español.'],['Ich habe eine Frage.','Tengo una pregunta.'],['Heute ist Montag.','Hoy es lunes.'],['Morgen habe ich Zeit.','Mañana tengo tiempo.'],['Kannst du das wiederholen?','¿Puedes repetirlo?'],['Ich verstehe nicht.','No entiendo.'],['Ich komme aus Deutschland.','Soy de Alemania.'],['Ich möchte einen Kaffee.','Quisiera un café.'],['Wo ist die Toilette?','¿Dónde está el baño?']
 ],
 fr:[
 ['Guten Morgen.','Bonjour.'],['Wie heißt du?','Comment tu t’appelles ?'],['Ich heiße Anna.','Je m’appelle Anna.'],['Danke.','Merci.'],['Bitte.','S’il vous plaît.'],['Wie geht es dir?','Comment ça va ?'],['Mir geht es gut.','Je vais bien.'],['Wo ist der Bahnhof?','Où est la gare ?'],['Ich brauche Hilfe.','J’ai besoin d’aide.'],['Ein Wasser, bitte.','De l’eau, s’il vous plaît.'],['Wie viel kostet das?','Combien ça coûte ?'],['Ich lerne Französisch.','J’apprends le français.'],['Ich habe eine Frage.','J’ai une question.'],['Heute ist Montag.','Aujourd’hui, c’est lundi.'],['Morgen habe ich Zeit.','J’ai du temps demain.'],['Kannst du das wiederholen?','Peux-tu répéter ?'],['Ich verstehe nicht.','Je ne comprends pas.'],['Ich komme aus Deutschland.','Je viens d’Allemagne.'],['Ich möchte einen Kaffee.','Je voudrais un café.'],['Wo ist die Toilette?','Où sont les toilettes ?']
 ],
 it:[
 ['Guten Morgen.','Buongiorno.'],['Wie heißt du?','Come ti chiami?'],['Ich heiße Anna.','Mi chiamo Anna.'],['Danke.','Grazie.'],['Bitte.','Per favore.'],['Wie geht es dir?','Come stai?'],['Mir geht es gut.','Sto bene.'],['Wo ist der Bahnhof?','Dov’è la stazione?'],['Ich brauche Hilfe.','Ho bisogno di aiuto.'],['Ein Wasser, bitte.','Un’acqua, per favore.'],['Wie viel kostet das?','Quanto costa?'],['Ich lerne Italienisch.','Sto imparando l’italiano.'],['Ich habe eine Frage.','Ho una domanda.'],['Heute ist Montag.','Oggi è lunedì.'],['Morgen habe ich Zeit.','Domani ho tempo.'],['Kannst du das wiederholen?','Puoi ripetere?'],['Ich verstehe nicht.','Non capisco.'],['Ich komme aus Deutschland.','Vengo dalla Germania.'],['Ich möchte einen Kaffee.','Vorrei un caffè.'],['Wo ist die Toilette?','Dov’è il bagno?']
 ]
};
export const LANGS=[{id:'en',name:'Englisch',voice:'en-US'},{id:'es',name:'Spanisch',voice:'es-ES'},{id:'fr',name:'Französisch',voice:'fr-FR'},{id:'it',name:'Italienisch',voice:'it-IT'}];
const punctuation=s=>s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,'').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim();
export const eq=(a,b)=>punctuation(a)===punctuation(b);
export const languagePairs=lang=>entries[lang]||[];
export function generateLanguage(seed,language='en',exclude=[]){
 const arr=entries[language]||entries.en;
 const n=Math.floor(seed/13)%arr.length;
 const kind= ['translate','listen','speak','order','vocab'][seed%5];
 const [de,target]=arr[n];
 const base={id:`l-${language}-${seed}`,track:'language',field:language,lang:language,source:de,target,template:kind,allowCalculator:false,remember:`${de} → ${target}`};
 if(kind==='translate')return {...base,type:'fill',prompt:`Übersetze ins ${LANGS.find(x=>x.id===language)?.name}: „${de}“`,accepted:[target],displayAnswer:target,explanation:`Eine korrekte Beispielübersetzung lautet: „${target}“`};
 if(kind==='listen')return {...base,type:'listen',prompt:'Höre genau hin und schreibe auf, was du hörst.',accepted:[target],displayAnswer:target,explanation:`Du hast gehört: „${target}“`};
 if(kind==='speak')return {...base,type:'speak',prompt:`Sprich diesen Satz: „${target}“`,accepted:[target],displayAnswer:target,explanation:`Beispielsatz: „${target}“. Die Texterkennung ist keine vollständige Aussprachebewertung.`};
 if(kind==='order')return {...base,type:'order',prompt:`Bringe die Wörter in die richtige Reihenfolge und tippe den Satz ein.`,words:target.replace(/[.,!?¿]/g,'').split(/\s+/).reverse(),accepted:[target],displayAnswer:target,explanation:`Die korrekte Reihenfolge lautet: „${target}“`};
 return {...base,type:'single',prompt:`Was bedeutet „${target}“ auf Deutsch?`,options:[de,...[...arr.slice(n+1),...arr.slice(0,n)].slice(0,3).map(x=>x[0])],answer:0,explanation:`„${target}“ heißt „${de}“.`};
}
export function languageFromId(id){const m=/^l-(en|es|fr|it)-(\d+)$/.exec(id);return m?generateLanguage(Number(m[2]),m[1]):null;}
export function checkLanguage(q,answer){return q.accepted?.some(x=>eq(x,answer))||false;}
