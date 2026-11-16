import {cp,mkdir,rm,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const src=join(root,'public'),dist=join(root,'dist');
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});await cp(src,dist,{recursive:true});
const index=await stat(join(dist,'index.html'));console.log(`lernloop. Build erfolgreich: dist/index.html (${index.size} Bytes)`);
