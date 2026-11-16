"""Isolated Chromium interaction tests of the actual JS/CSS sources.
The sandbox blocks all Chromium localhost/file navigations; module sources are loaded as data:.
This cannot test live HTTPS PWA installation or networking and must not be counted as doing so.
"""
from pathlib import Path
import json,base64,re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
passed=[]
errors=[]

def module_url(path):
  code=(ROOT/'public'/path).read_text(encoding='utf-8')
  def repl(m):
    target=(Path(path).parent/m.group(2)).as_posix()
    return m.group(1)+module_url(target)+m.group(3)
  code=re.sub(r"(from\s+['\"])([^'\"]+)(['\"])",repl,code)
  return 'data:text/javascript;base64,'+base64.b64encode(code.encode()).decode()

html=(ROOT/'public/index.html').read_text(encoding='utf-8')
css=(ROOT/'public/css/style.css').read_text(encoding='utf-8')
html=html.replace('<link rel="stylesheet" href="/css/style.css">','<style>'+css+'</style>')
html=html.replace('<script type="module" src="/js/app.js"></script>','<script type="module">import("'+module_url('js/app.js')+'")</script>')
logo=(ROOT/'public/assets/brand/mark.svg').read_text(encoding='utf-8')
html=html.replace('src="/assets/brand/mark.svg"','src="data:image/svg+xml;base64,'+base64.b64encode(logo.encode()).decode()+'"')
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for mobile in [False,True]:
    context=browser.new_context(viewport={'width':390 if mobile else 1440,'height':844 if mobile else 900},device_scale_factor=1,is_mobile=mobile,has_touch=mobile,service_workers='block')
    page=context.new_page()
    page.set_default_timeout(9000)
    page.on('pageerror',lambda e:errors.append(str(e)))
    label='Handy' if mobile else 'Desktop'
    page.set_content(html,wait_until='domcontentloaded')
    page.wait_for_selector('.daily-focus',timeout=15000)
    assert 'Ein bisschen klarer.' in page.locator('h1').inner_text()
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1')
    passed.append(f'{label}: Startseite und kein horizontaler Überlauf')
    page.screenshot(path=str(ROOT/('preview-mobile.png' if mobile else 'preview-desktop.png')),full_page=True)
    page.locator('#theme-toggle').click()
    assert page.evaluate('document.documentElement.dataset.theme')=='dark'
    page.locator('#theme-toggle').click()
    passed.append(f'{label}: Hell- und Dunkelmodus')
    page.locator('[data-action="daily-start"]').first.click()
    assert page.locator('.question-title').is_visible()
    for i in range(5):
      if page.locator('[data-action="show-sample"]').count():
        page.locator('[data-action="show-sample"]').click()
        page.locator('[data-action="rate-open-bad"]').click()
      elif page.locator('.options button').count():
        page.locator('.options button').first.click()
        page.locator('[data-action="check"]').click()
      elif page.locator('#user-answer').count():
        page.locator('#user-answer').fill('0')
        page.locator('[data-action="check"]').click()
      assert page.locator('.feedback').is_visible()
      assert page.locator('.memory').count()==1
      page.locator('[data-action="next"]').last.click()
    assert page.locator('.result-shell').is_visible()
    passed.append(f'{label}: 5-Fragen-Check mit Auswertung und Merksatz')
    page.locator('[data-action="home"]').first.click()
    page.locator('[data-action="compass"]').first.click()
    assert page.locator('.skill-list').is_visible()
    assert page.locator('.skill-item').count()>=1
    assert any('Antworten' in s and not s.strip().startswith('0 Antworten') for s in page.locator('.skill-tail small').all_inner_texts())
    passed.append(f'{label}: Lernkompass zeigt beantwortete Aufgaben')
    page.locator('[data-action="share-goal"]').first.click()
    page.wait_for_timeout(200)
    assert page.locator('#share-status').count()==1
    assert page.locator('.manual-link input').count()==1
    assert 'lernen=retail' in page.locator('.manual-link input').input_value()
    passed.append(f'{label}: Lernziel-Link ohne Nutzerdaten')
    page.locator('[data-action="setup-current"]').first.click()
    page.locator('[data-action="year"][data-value="2"]').click()
    assert page.locator('.field').count()==5
    page.locator('.field').nth(1).click()
    assert page.locator('.field.is-selected').count()==1
    passed.append(f'{label}: 2. Lehrjahr und Lernfeldauswahl')
    page.locator('[data-action="home"]').first.click()
    page.locator('[data-action="app-info"]').first.click()
    assert 'lernloop. als App.' in page.locator('h1').inner_text()
    assert page.locator('.install-steps').count()==1
    assert page.locator('#install-cta').is_hidden()
    passed.append(f'{label}: App-Installationsanleitung und keine Fake-Installation')
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1')
    passed.append(f'{label}: kein Überlauf nach den Interaktionen')
    context.close()
  browser.close()
  assert not errors,f'JavaScript errors: {errors}'
(ROOT/'browser-v5-results.json').write_text(json.dumps({'count':len(passed),'passed':passed,'errors':errors},ensure_ascii=False,indent=2))
print('PASS',len(passed),'Browser-Szenarien. Fehler:',errors)
