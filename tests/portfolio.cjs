/* Run against a served site; see tests/README.md. */
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = new URL(process.env.BASE_URL || 'http://127.0.0.1:8791/');
const url = /\/portfolio\/(?:index\.html)?$/.test(base.pathname) ? base.href : new URL('portfolio/', base).href;
const chapters = ['overview', 'audience', 'fig1', 'fig2', 'fig3', 'fig4', 'fig5', 'fig6', 'story', 'method', 'eval', 'mat'];
let checks = 0;
function check(value, message) { assert.ok(value, message); checks++; }
// Fixed controls are already in view. Avoid Playwright's scrollIntoView on sticky headers.
async function clickFixed(page, selector) { const box = await page.locator(selector).boundingBox(); assert.ok(box); await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2); }

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' }) });
  const errors = [];
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(url);
    check(response.ok(), 'Portfolio must load successfully');

    async function destination(id) {
      await page.waitForFunction(id => {
        const el = document.getElementById(id), header = document.querySelector('#top');
        const target = Math.max(0, Math.min(el.getBoundingClientRect().top + scrollY - header.offsetHeight, document.documentElement.scrollHeight - innerHeight));
        return Math.abs(scrollY - target) < 2;
      }, id, { timeout: 5000 }).catch(async error => { console.error('Destination', id, await page.evaluate(id => ({hash: location.hash, scroll: scrollY, top: document.getElementById(id).getBoundingClientRect().top, height: document.documentElement.scrollHeight}), id)); throw error; });
      check(await page.evaluate(id => location.hash === '#' + id, id), 'URL must identify ' + id);
    }
    async function nav(id, kind = 'menu') {
      if (kind === 'menu') {
        await clickFixed(page, '#menu-open');
        await page.locator('#menu-list [data-go="' + id + '"]').click();
        check(await page.locator('#menu-open').getAttribute('aria-expanded') === 'false', 'Choosing a chapter closes the menu');
      } else await page.locator('#rail [data-go="' + id + '"]').click();
      await destination(id);
    }
    // Run the reported path before scrolling can warm up lazy-loaded images.
    await nav('fig3');
    await nav('fig6', 'rail');
    check(await page.locator('#fig6').evaluate(el => el.getBoundingClientRect().top < 66), 'Cold navigation must land below the header');
    console.log('Cold-load menu and rail navigation passed');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    // Reduced motion is read at startup, so reload before the complete click sweep.
    await page.reload();
    for (const language of ['en', 'zh']) {
      await clickFixed(page, '#l-' + language);
      check(await page.locator('#l-' + language).getAttribute('aria-pressed') === 'true', 'Language toggle must update');
      for (const id of chapters) await nav(id);
      for (const id of [...chapters].reverse()) await nav(id, 'rail');
    }
    await clickFixed(page, '#menu-open');
    await clickFixed(page, '#menu-close');
    check(await page.locator('#menu-open').getAttribute('aria-expanded') === 'false', 'Menu close button must close it');
    await clickFixed(page, '#menu-open');
    await page.keyboard.press('Escape');
    check(await page.locator('#menu-open').evaluate(el => el === document.activeElement), 'Escape restores menu trigger focus');
    await clickFixed(page, 'a.word');
    await destination('hero');
    await page.goBack();
    await destination('overview');
    await clickFixed(page, '#l-en');
    console.log('All 12 menu and rail destinations passed in both languages, plus browser Back');

    for (const [container, output] of [['#roleTabs', '#roleBody'], ['#etabs', '#chain'], ['#scope', '#scopeTxt']]) {
      const count = await page.locator(container + ' button').count();
      for (let i = 0; i < count; i++) {
        await page.locator(container + ' button').nth(i).click();
        const active = await page.locator(container + ' button').nth(i).evaluate(el => el.getAttribute('aria-pressed') === 'true' || el.classList.contains('on'));
        check(active, container + ' selected tab must match the clicked tab');
        check((await page.locator(output).innerText()).trim().length > 0, container + ' must produce content');
      }
    }
    for (const id of ['f1', 'f6']) {
      const slider = page.locator('#' + id + 'r');
      await slider.focus();
      await page.keyboard.press('Home');
      check((await page.locator('#' + id + 'read').innerText()).includes('2019'), id + ' first year must update');
      await page.keyboard.press('End');
      check((await page.locator('#' + id + 'read').innerText()).includes('2026'), id + ' last year must update');
    }
    for (let i = 0; i < 8; i++) {
      await page.locator('#f1gap .gb-hit').nth(i).click();
      check(Number(await page.locator('#f1r').inputValue()) === i, 'Every gap bar, including zero, must select its year');
    }
    for (const [i, key] of [[2, 'Enter'], [3, 'Space']]) {
      await page.locator('#f1gap .gb-hit').nth(i).focus();
      await page.keyboard.press(key);
      check(Number(await page.locator('#f1r').inputValue()) === i, 'Gap bars support ' + key);
    }
    await page.locator('#f1ctl [data-id="head"]').click();
    check(await page.locator('#f1chart [data-s="c"]').evaluate(el => el.style.opacity === '0'), 'Headline view hides commencements');
    await page.locator('#f1ctl [data-id="both"]').click();
    check(await page.locator('#f1chart [data-s="c"]').evaluate(el => el.style.opacity === '1'), 'Both lines restores commencements');
    const linear = await page.locator('#f2bars .fi').last().evaluate(el => el.style.width);
    await page.locator('#f2ctl [data-id="log"]').click();
    check(await page.locator('#f2bars .fi').last().evaluate(el => el.style.width) !== linear, 'Log scale updates bar geometry');
    await page.locator('#f2ctl [data-id="lin"]').click();
    check(await page.locator('#f2bars .fi').last().evaluate(el => el.style.width) === linear, 'Linear scale restores bar geometry');
    for (let i = 0; i < 14; i++) {
      await page.locator('#f2cum .cd').nth(i).click();
      check((await page.locator('#cumtip').textContent()).startsWith('#' + (i + 1) + ' '), 'Cumulative points show the clicked rank');
    }
    for (let i = 0; i < 13; i++) {
      await page.locator('#hm .ch2').nth(i).click();
      check(await page.locator('#hm .ch2').nth(i).evaluate(el => el.classList.contains('s')), 'Heatmap field must select');
      check((await page.locator('#hmread').innerText()).includes('largest known'), 'Heatmap field must explain its largest regions');
      await page.locator('#f3clear').click();
      check(await page.locator('#hm .ch2.s').count() === 0, 'Clear selection resets the heatmap');
    }
    const cells = page.locator('#hm .c');
    for (let i = 0; i < await cells.count(); i++) {
      const cell = cells.nth(i), value = (await cell.textContent()).trim();
      await cell.click();
      const readout = await page.locator('#hmread').innerText();
      check(value ? readout.includes(value) : readout.includes('not disclosed'), 'Heatmap cell must explain its own value or missing data');
    }
    for (let i = 0; i < 3; i++) {
      const chip = page.locator('#f4ctl [data-id="' + i + '"]'), card = page.locator('#f4card .pol[data-id="' + i + '"]');
      await chip.click();
      check(await card.evaluate(el => el.classList.contains('on')), 'Policy chip selects its card');
      check(await chip.getAttribute('aria-pressed') === 'true', 'Policy chip selected state agrees');
      await card.click();
      check(await page.locator('#f4card .pol.on').count() === 0, 'Policy card can deselect');
      check(await page.locator('#f4ctl [aria-pressed="true"]').count() === 0, 'Deselecting a policy resets its chip');
      await card.click();
      check(await chip.getAttribute('aria-pressed') === 'true', 'Selecting a policy card selects its chip');
      await card.click();
    }
    await page.locator('#f5ctl [data-id="shr"]').click();
    check(await page.locator('#f5bars .ptk').evaluateAll(els => els.every(el => el.style.width === '100%')), 'Share view normalizes sectors');
    await page.locator('#f5ctl [data-id="cnt"]').click();
    check(await page.locator('#f5bars .ptk').last().evaluate(el => el.style.width !== '100%'), 'Absolute view restores different totals');
    for (const id of ['e', 'p', 'r']) {
      await page.locator('#f6ctl [data-id="' + id + '"]').click();
      check(await page.locator('#f6chart [data-s="' + id + '"]').evaluate(el => el.style.opacity === '0'), 'Legend hides selected series');
      await page.locator('#f6ctl [data-id="' + id + '"]').click();
      check(await page.locator('#f6chart [data-s="' + id + '"]').evaluate(el => el.style.opacity === '1'), 'Legend restores selected series');
    }
    console.log('Tabs, sliders, all chart controls, all 182 heatmap cells and policy state passed');

    for (let i = 0; i < 10; i++) {
      await page.locator('#arc .nd').nth(i).click();
      check(await page.locator('#arc .nd.on').textContent() === String(i + 1), 'Storyboard node selects its scene');
      check((await page.locator('#sbp img').getAttribute('src')).endsWith('s' + (i + 1) + '.jpg'), 'Storyboard image follows scene');
    }
    await page.locator('#nxt').click();
    check(await page.locator('#arc .nd.on').textContent() === '1', 'Next wraps to the first scene');
    await page.locator('#prv').click();
    check(await page.locator('#arc .nd.on').textContent() === '10', 'Previous wraps to the last scene');
    await page.locator('#ply').click();
    await page.waitForFunction(() => document.querySelector('#arc .nd.on').textContent === '1', null, { timeout: 5000 });
    await page.locator('#ply').click();
    await page.waitForTimeout(3700);
    check(await page.locator('#arc .nd.on').textContent() === '1', 'Pause stops storyboard playback');
    for (const close of ['button', 'escape', 'backdrop']) {
      await page.locator('[data-zoom]').first().click();
      check(await page.locator('.lbx').count() === 1, 'Image opens a preview');
      if (close === 'button') await page.locator('.lbx .close').click();
      else if (close === 'escape') await page.keyboard.press('Escape');
      else await page.locator('.lbx').click({ position: { x: 2, y: 2 } });
      check(await page.locator('.lbx').count() === 0, 'Image closes via ' + close);
    }
    for (let i = 0; i < await page.locator('[data-zoom]').count(); i++) {
      const trigger = page.locator('[data-zoom]').nth(i);
      await trigger.focus();
      await page.keyboard.press('Enter');
      check(await page.locator('.lbx img').getAttribute('src') === await trigger.locator('img').getAttribute('src'), 'Every image preview opens its own image');
      await page.locator('.lbx .close').click();
      check(await trigger.evaluate(el => el === document.activeElement), 'Closing preview restores image focus');
    }
    for (let i = 0; i < 4; i++) {
      const card = page.locator('#limits .flip').nth(i);
      await card.click();
      check(await card.evaluate(el => el.classList.contains('on')), 'Limit card flips on click');
      await card.focus();
      await page.keyboard.press('Enter');
      check(await card.evaluate(el => !el.classList.contains('on')), 'Limit card flips back on keyboard');
    }
    await page.locator('#copy').click();
    check(await page.evaluate(() => navigator.clipboard.readText()) === 'katherinelin0292@gmail.com', 'Copy email writes the correct address');
    const video = page.locator('video');
    await video.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('video').readyState >= 1, null, { timeout: 15000 });
    check(await video.evaluate(el => el.controls && el.duration > 0 && !el.error), 'Story film metadata and native controls are available');
    await video.evaluate(el => el.play());
    check(await video.evaluate(el => !el.paused), 'Story film can play');
    await video.evaluate(el => el.pause());
    console.log('Storyboard, all image previews, closing methods, flip cards, clipboard and film passed');

    // Validate actual anchor destinations after all generated UI variants were exercised.
    const links = await page.locator('a[href]').evaluateAll(els => els.map(el => ({ href: el.getAttribute('href'), absolute: el.href })));
    for (const link of links) {
      if (link.href.startsWith('#')) check(await page.evaluate(hash => !!document.getElementById(hash.slice(1)), link.href), 'Fragment destination must exist: ' + link.href);
      else if (new URL(link.absolute).origin === new URL(url).origin) check((await page.request.get(link.absolute)).ok(), 'Local linked material must load: ' + link.absolute);
    }
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', isMobile: true, hasTouch: true });
    const phone = await mobile.newPage();
    phone.on('pageerror', error => errors.push(error.message));
    await phone.goto(url);
    for (const language of ['en', 'zh']) {
      await clickFixed(phone, '#l-' + language);
      for (const id of chapters) {
        await clickFixed(phone, '#menu-open');
        await phone.locator('#menu-list [data-go="' + id + '"]').click();
        await phone.waitForFunction(id => location.hash === '#' + id && !document.querySelector('#menu').classList.contains('open'), id);
        check(await phone.locator('#' + id).evaluate(el => el.getBoundingClientRect().top < innerHeight), 'Mobile menu reaches ' + id);
      }
    }
    await phone.setViewportSize({ width: 568, height: 320 });
    await clickFixed(phone, '#menu-open');
    await phone.locator('#menu-list [data-go="mat"]').click();
    check(await phone.locator('#menu-open').getAttribute('aria-expanded') === 'false', 'Short-height menu can reach its final chapter');
    check(errors.length === 0, 'No JavaScript errors: ' + errors.join('; '));
    console.log('PASS: ' + checks + ' portfolio interaction checks (desktop, mobile, English, Chinese)');
    await mobile.close();
    await context.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
