// Kleiner Ausdrucksparser ohne eval oder Function. +, -, *, /, Klammern, %, sqrt.
export function calculate(input){
 const s=String(input).replace(/,/g,'.').replace(/[×x]/g,'*').replace(/[÷:]/g,'/').replace(/\s+/g,'');let i=0;
 function number(){let start=i;while(/[0-9.]/.test(s[i]||'')&&i<s.length)i++;const part=s.slice(start,i);if(!/^\d+(\.\d+)?$|^\.\d+$/.test(part))throw Error('Ungültige Zahl');return Number(part);}
 function primary(){if(s[i]==='+'){i++;return primary();}if(s[i]==='-'){i++;return -primary();}if(s.slice(i,i+4)==='sqrt'){i+=4;if(s[i]!=='(')throw Error('Wurzel: Klammer erwartet');i++;const x=expr();if(s[i++]!==')'||x<0)throw Error('Ungültige Wurzel');return Math.sqrt(x);}if(s[i]==='('){i++;const x=expr();if(s[i++]!==')')throw Error('Schließende Klammer fehlt');return x;}return number();}
 function factor(){let n=primary();while(s[i]==='%'){i++;n/=100;}if(s[i]==='^'){i++;n=Math.pow(n,factor());}return n;}
 function term(){let n=factor();while(s[i]==='*'||s[i]==='/'){const op=s[i++];const x=factor();if(op==='/'&&x===0)throw Error('Division durch null');n=op==='*'?n*x:n/x;}return n;}
 function expr(){let n=term();while(s[i]==='+'||s[i]==='-'){const op=s[i++],x=term();n=op==='+'?n+x:n-x;}return n;}
 const result=expr();if(i!==s.length||!Number.isFinite(result))throw Error('Ungültiger Ausdruck');return Math.round((result+Number.EPSILON)*1e10)/1e10;
}
