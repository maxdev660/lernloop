import {AUTH_CONFIG} from './auth-config.js';

const KEY='lernloop_auth_v1';
let session=null;
let user=null;
const url=String(AUTH_CONFIG.url||'').replace(/\/+$/,'');
const publicKey=String(AUTH_CONFIG.publishableKey||'');
export const loginEnabled=Boolean(/^https:\/\/[a-z\d-]+\.supabase\.co$/i.test(url)&&publicKey.length>12);
export const activeUser=()=>user;
const headers=(authenticated=false)=>({apikey:publicKey, ...(authenticated&&session?.access_token?{Authorization:`Bearer ${session.access_token}`}:{})});
function readSaved(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
function store(next){session=next;try{next?localStorage.setItem(KEY,JSON.stringify(next)):localStorage.removeItem(KEY)}catch{}}
async function request(path,options={}){
  if(!loginEnabled)throw new Error('Die Anmeldung wurde noch nicht eingerichtet.');
  const {authenticated=false,method='GET',body,...rest}=options;
  const response=await fetch(url+path,{...rest,method,headers:{...headers(authenticated),...(body?{'Content-Type':'application/json'}:{}),...(rest.headers||{})},...(body?{body:JSON.stringify(body)}:{})});
  const raw=await response.text();let data=null;try{data=raw?JSON.parse(raw):null}catch{data={message:raw}};
  if(!response.ok)throw new Error(data?.msg||data?.error_description||data?.message||data?.error||`Serverfehler ${response.status}`);
  return data;
}
async function renew(){
  if(!session?.refresh_token)return false;
  try{const next=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token}});if(!next?.access_token)return false;store({...next,expires_at:Math.floor(Date.now()/1000)+(next.expires_in||3600)});return true}catch{return false}
}
async function validSession(){
 if(!session?.access_token)return false;
 if((session.expires_at||0) <= Math.floor(Date.now()/1000)+60 && !await renew())return false;
 return true;
}
export async function restoreAuth(){
 if(!loginEnabled)return null;
 const fragment=new URLSearchParams(window.location.hash.replace(/^#/,''));
 if(fragment.has('access_token') && fragment.has('refresh_token')){
   store({access_token:fragment.get('access_token'),refresh_token:fragment.get('refresh_token'),expires_at:Math.floor(Date.now()/1000)+Number(fragment.get('expires_in')||3600)});
   // Immediately remove the access token from browser history / visible URL.
   history.replaceState(null,'',window.location.pathname+window.location.search);
 }else{session=readSaved();}
 if(!await validSession()){store(null);user=null;return null;}
 try{user=await request('/auth/v1/user',{authenticated:true});if(!user?.id)throw Error('Nutzer nicht gefunden');return user}catch{store(null);user=null;return null;}
}
export async function sendLoginLink(email){
 if(!loginEnabled)throw new Error('Die Anmeldung wurde noch nicht eingerichtet.');
 const clean=String(email||'').trim();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)||clean.length>254)throw new Error('Bitte gib eine gültige E-Mail-Adresse ein.');
 const redirect=window.location.origin+'/?auth=1';
 await request('/auth/v1/otp?redirect_to='+encodeURIComponent(redirect),{method:'POST',body:{email:clean,create_user:true}});
 return true;
}
export async function signOutAuth(){
 if(loginEnabled&&session?.access_token){try{await request('/auth/v1/logout',{method:'POST',authenticated:true})}catch{}}
 user=null;store(null);
}
export async function getCloudProgress(){
 if(!await validSession())throw Error('Bitte melde dich erneut an.');
 const rows=await request('/rest/v1/lernloop_profiles?select=data,updated_at&limit=1',{authenticated:true});
 return rows?.[0]?.data||null;
}
export async function pushCloudProgress(data){
 if(!await validSession())throw Error('Sitzung abgelaufen. Bitte melde dich erneut an.');
 if(!user?.id)throw Error('Nicht angemeldet.');
 // Only the caller's own user_id can be written (RLS policy, see supabase/schema.sql).
 const body=[{user_id:user.id,data,updated_at:new Date().toISOString()}];
 await request('/rest/v1/lernloop_profiles?on_conflict=user_id',{method:'POST',authenticated:true,headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body});
 return true;
}
