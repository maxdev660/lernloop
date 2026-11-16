import subprocess,time,json,sys,mimetypes,base64,re
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
proc=None
passed=[]
errors=[]
try:
 with sync_playwright() as p:
  for mobile in [False,True]:
   browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
   context=browser.new_context(service_workers='block',viewport={'width':390 if mobile else 1440,'height':844 if mobile else 900},device_scale_factor=1,is_mobile=mobile,has_touch=mobile)
   page=context.new_page()
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_default_timeout(4000)
   def module_url(path):
    code=(ROOT/'public'/path).read_text(encoding='utf-8')
    def replace(m):
     target=(Path(path).parent/m.group(2)).as_posix()
     return m.group(1)+module_url(target)+m.group(3)
    code=re.sub(r"(from\s+['\"])([^'\"]+)(['\"])",replace,code)
    return 'data:text/javascript;base64,'+base64.b64encode(code.encode()).decode()
   html=(ROOT/'public/index.html').read_text(encoding='utf-8')
   css=(ROOT/'public/css/style.css').read_text(encoding='utf-8')
   html=html.replace('<link rel="stylesheet" href="/css/style.css">','<style>'+css+'</style>')
   html=html.replace('<script type="module" src="/js/app.js"></script>','<script type="module">import("'+module_url('js/app.js')+'")</script>')
   logo=(ROOT/'public/assets/brand/mark.svg').read_text(encoding='utf-8')
   html=html.replace('src="/assets/brand/mark.svg"','src="data:image/svg+xml;base64,'+base64.b64encode(logo.encode()).decode()+'"')
   page.set_content(html,wait_until='domcontentloaded')
   page.wait_for_selector('.path-list',timeout=15000)
   page.screenshot(path=str(ROOT/('preview-mobile.png' if mobile else 'preview-desktop.png')),full_page=True)
   assert page.locator('h1').count()>0
   print('PASS',len(passed),flush=True)
   passed.append(f'{"mobile" if mobile else "desktop"}: Startseite')
   assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1')
   print('PASS',len(passed),flush=True)
   passed.append('Kein horizontaler Überlauf')
   # Theme persistent
   page.locator('#theme-toggle').click()
   assert page.evaluate('document.documentElement.dataset.theme')=='dark'
   page.locator('#theme-toggle').click()
   print('PASS',len(passed),flush=True)
   passed.append('Theme umschalten')
   # retail year selection, filter, solve
   page.get_by_role('button',name='Ausbildung Einzelhandel').click()
   assert page.get_by_text('1. Lehrjahr').count()>0
   page.get_by_role('button',name='1. Lehrjahr').click()
   assert page.locator('button.field').count()==5
   page.locator('button.field').first.click()
   assert page.locator('button.field.is-selected').count()==1
   page.get_by_role('button',name='Lernen starten').click()
   assert page.locator('.question-title').is_visible()
   # choice input sample
   t=page.locator('.options button').count()
   if t:page.locator('.options button').first.click()
   elif page.locator('#user-answer').count():page.locator('#user-answer').fill('10')
   if page.locator('[data-action="show-sample"]').count():
    page.locator('[data-action="show-sample"]').click()
    page.locator('[data-action="rate-open-bad"]').click()
   else: page.locator('[data-action="check"]').click()
   assert page.locator('.memory').is_visible()
   page.locator('[data-action="save-memory"]').click()
   assert page.locator('.memory').is_visible()
   print('PASS',len(passed),flush=True)
   passed.append('Einzelhandel Filter, Antwort, Merksatz speichern')
   page.get_by_role('button',name='Lernbereich').click()
   # math
   page.get_by_role('button',name='Mathematik').click()
   assert page.locator('#grade-select').count()==1
   page.locator('#grade-select').select_option('9')
   page.get_by_role('button',name='Prozentrechnung').click()
   page.get_by_role('button',name='Lernen starten').click()
   assert page.locator('.question-title').is_visible()
   assert page.locator('#user-answer').count()==1
   if page.locator('[data-action="calc-open"]').count():
    page.locator('[data-action="calc-open"]').click()
    assert page.locator('#calc-layer').is_visible()
    page.locator('[data-action="calc-close"]').click()
   page.locator('#user-answer').fill('123')
   page.locator('[data-action="check"]').click()
   assert page.locator('.feedback').is_visible()
   print('PASS',len(passed),flush=True)
   passed.append('Mathe, Themenwahl, Rechner, Antwortauswertung')
   page.get_by_role('button',name='Lernbereich').click()
   # language
   page.get_by_role('button',name='Sprachen').click()
   page.get_by_role('button',name='Spanisch').click()
   page.get_by_role('button',name='Lernen starten').click()
   assert page.locator('.question-title').count()==1
   print('PASS',len(passed),flush=True)
   passed.append('Sprache A1 Auswahl')
   page.locator('[data-action="leave"]').click()
   page.locator(('.mobile-nav' if mobile else '.desktop-nav')+' [data-nav="saved"]').click()
   assert 'Merksätze' in page.locator('h1').inner_text()
   print('PASS',len(passed),flush=True)
   passed.append('Gespeicherte Merksätze')
   if not mobile:
    page.locator('[data-action="home"]').first.click()
    page.locator('[data-value="retail"][data-action="pick-track"]').click()
    page.locator('[data-value="exam"][data-action="duration"]').click()
    page.locator('[data-action="start"]').click()
    for i in range(20):
     if page.locator('.options button').count(): page.locator('.options button').first.click()
     elif page.locator('#user-answer').count():page.locator('#user-answer').fill('0')
     if page.locator('[data-action="check"]').count():page.locator('[data-action="check"]').click()
     elif page.locator('[data-action="show-sample"]').count():
      page.locator('[data-action="show-sample"]').click()
      page.locator('[data-action="rate-open-bad"]').click()
      page.locator('[data-action="next"]').click()
    assert page.locator('.result-shell').is_visible()
    assert page.locator('.result-item').count()==20
    passed.append('Prüfungs-Check: 20 Fragen und Ergebniskontrolle')
   browser.close()
  if errors:raise AssertionError(f'JS page errors: {errors}')
finally:
 if proc:
  proc.terminate()
  try:proc.wait(timeout=3)
  except:proc.kill()
(ROOT/'browser-qa-results.json').write_text(json.dumps({'passed':passed,'errors':errors,'count':len(passed)},ensure_ascii=False,indent=2))
print(json.dumps({'passed':passed,'errors':errors,'count':len(passed)},ensure_ascii=False,indent=2))
