"""Browser UI checks with original source via data: modules (Chromium has no localhost access)."""
from pathlib import Path
import json,base64,re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
passes=[];errors=[]
def module_url(path):
    code=(ROOT/'public'/path).read_text(encoding='utf-8')
    def replace(m):
        target=(Path(path).parent/m.group(2)).as_posix()
        return m.group(1)+module_url(target)+m.group(3)
    code=re.sub(r'(from\s+[\'\"])([^\'\"]+)([\'\"])',replace,code)
    return 'data:text/javascript;base64,'+base64.b64encode(code.encode()).decode()
html=(ROOT/'public/index.html').read_text(encoding='utf-8')
css=(ROOT/'public/css/style.css').read_text(encoding='utf-8')
html=html.replace('<link rel="stylesheet" href="/css/style.css">','<style>'+css+'</style>')
html=html.replace('<script type="module" src="/js/app.js"></script>','<script type="module">import("'+module_url('js/app.js')+'")</script>')
logo=(ROOT/'public/assets/brand/mark.svg').read_text(encoding='utf-8')
html=html.replace('src="/assets/brand/mark.svg"','src="data:image/svg+xml;base64,'+base64.b64encode(logo.encode()).decode()+'"')
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    for is_mobile in (False,True):
        label='Mobile 390px' if is_mobile else 'Desktop 1440px'
        ctx=browser.new_context(viewport={'width':390 if is_mobile else 1440,'height':844 if is_mobile else 900},is_mobile=is_mobile,has_touch=is_mobile,service_workers='block')
        page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(html,wait_until='domcontentloaded');page.locator('.auth-choice').wait_for()
        assert page.locator('[data-action="guest-start"]').count()==1
        assert page.locator('[data-action="account"]').count()>=1
        passes.append(label+': clear guest and account entry options')
        page.screenshot(path=str(ROOT/('preview-home-mobile.png' if is_mobile else 'preview-home-desktop.png')),full_page=True)
        page.locator('#account-entry').click()
        assert page.locator('.account-grid .account-pane').count()==2
        assert page.get_by_text('Die sichere Kontofunktion ist vorbereitet').is_visible()
        passes.append(label+': no fake login while provider unconfigured')
        page.screenshot(path=str(ROOT/('preview-account-mobile.png' if is_mobile else 'preview-account-desktop.png')),full_page=True)
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
        passes.append(label+': account view without horizontal scroll')
        page.locator('[data-action="guest-start"]').first.click()
        assert page.locator('.question-title').is_visible()
        passes.append(label+': guest immediately starts a real question')
        page.locator('[data-action="leave"]').first.click()
        assert page.locator('.landing-top').is_visible()
        passes.append(label+': return from guest practice')
        page.locator('#theme-toggle').click()
        assert page.evaluate('document.documentElement.dataset.theme')=='dark'
        passes.append(label+': dark mode remains functional')
        ctx.close()
    browser.close()
assert not errors,errors
(ROOT/'browser-v6-results.json').write_text(json.dumps({'checks':len(passes),'passed':passes,'errors':errors},indent=2,ensure_ascii=False))
print('PASS',len(passes),'UI checks with 0 JavaScript errors')
