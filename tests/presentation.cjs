const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const baseUrl = (process.env.BASE_URL || 'http://127.0.0.1:8791/').replace(/\/?$/, '/');
const presentationUrl = new URL('index.html', baseUrl).href;
const launchOptions = {
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' }),
};

async function openPresentation(browser, viewport, mobile = false) {
  const page = await browser.newPage({ viewport, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
  // Font availability must not affect an interaction regression check.
  await page.route('https://fonts.googleapis.com/**', route => route.abort());
  await page.route('https://fonts.gstatic.com/**', route => route.abort());
  return page;
}

async function state(page) {
  return page.evaluate(() => ({
    slide: Number(document.getElementById('count').textContent.split(' / ')[0]),
    step: Number(/step (\d+)\//.exec(document.getElementById('notesh').textContent)[1]),
    notes: !document.getElementById('notes').hidden,
    expanded: document.getElementById('bnotes').getAttribute('aria-expanded'),
    focus: document.activeElement.id,
    hash: location.hash,
    fullscreen: Boolean(document.fullscreenElement),
  }));
}

async function expectPosition(page, slide, step) {
  await page.waitForFunction(({ slide, step }) => {
    const notesTitle = document.getElementById('notesh').textContent;
    return document.getElementById('count').textContent === `${slide} / 19`
      && notesTitle.includes(`step ${step}/`) && location.hash === `#s${slide}`;
  }, { slide, step });
  const current = await state(page);
  assert.equal(current.slide, slide);
  assert.equal(current.step, step);
  assert.equal(current.hash, `#s${slide}`);
  assert.equal(await page.locator('.slide.active').count(), 1);
  const correctReveals = await page.locator('.slide.active [data-s]').evaluateAll((nodes, step) =>
    nodes.every(node => node.classList.contains('on') === (Number(node.dataset.s) <= step)), step);
  assert.ok(correctReveals, `Slide ${slide} has incorrect reveal visibility at step ${step}`);
}

async function auditPresentation(browser) {
  const page = await openPresentation(browser, { width: 1600, height: 900 });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.goto(`${presentationUrl}#s8`, { waitUntil: 'domcontentloaded' });
    await expectPosition(page, 8, 0);
    const steps = await page.locator('.slide').evaluateAll(slides => slides.map(slide =>
      Math.max(0, ...[...slide.querySelectorAll('[data-s]')].map(node => Number(node.dataset.s)))));
    assert.equal(steps.length, 19);
    await page.keyboard.press('Home');
    await expectPosition(page, 1, 0);

    let forwardTransitions = 0;
    let backwardTransitions = 0;
    for (let i = 0; i < steps.length; i++) {
      for (let step = 0; step < steps[i]; step++) {
        await page.locator('#bnext').click();
        await expectPosition(page, i + 1, step + 1);
        forwardTransitions++;
      }
      if (i < steps.length - 1) {
        await page.locator('#bnext').click();
        await expectPosition(page, i + 2, 0);
        forwardTransitions++;
      }
    }
    await page.locator('#bnext').click();
    await expectPosition(page, 19, steps[18]);
    for (let i = steps.length - 1; i >= 0; i--) {
      for (let step = steps[i]; step > 0; step--) {
        await page.locator('#bprev').click();
        await expectPosition(page, i + 1, step - 1);
        backwardTransitions++;
      }
      if (i > 0) {
        await page.locator('#bprev').click();
        await expectPosition(page, i, steps[i - 1]);
        backwardTransitions++;
      }
    }
    await page.locator('#bprev').click();
    await expectPosition(page, 1, 0);

    const stage = page.locator('#stage');
    await stage.click({ position: { x: 1500, y: 450 } });
    await expectPosition(page, 1, 1);
    await stage.click({ position: { x: 1500, y: 450 }, button: 'right' });
    await expectPosition(page, 1, 0);
    for (const key of ['ArrowRight', 'PageDown', 'Space', 'Enter', 'ArrowDown']) {
      await page.keyboard.press('Home');
      await stage.click({ position: { x: 1500, y: 450 } });
      await page.keyboard.press(key);
      await expectPosition(page, 2, 0);
    }
    for (const key of ['ArrowLeft', 'PageUp', 'Backspace', 'ArrowUp']) {
      await page.keyboard.press('End');
      await page.keyboard.press(key);
      await expectPosition(page, 18, steps[17]);
    }
    await page.keyboard.press('Home');

    await page.locator('#bnotes').click();
    let current = await state(page);
    assert.equal(current.notes, true);
    assert.equal(current.expanded, 'true');
    assert.equal(current.focus, 'close-notes');
    await expectPosition(page, 1, 0);
    await page.locator('#close-notes').click();
    current = await state(page);
    assert.equal(current.notes, false);
    assert.equal(current.expanded, 'false');
    assert.equal(current.focus, 'bnotes');
    await expectPosition(page, 1, 0);
    await page.locator('#bnotes').press('Enter');
    assert.equal((await state(page)).notes, true);
    await expectPosition(page, 1, 0);
    await page.keyboard.press('Escape');
    assert.equal((await state(page)).notes, false);
    await expectPosition(page, 1, 0);
    await page.locator('#bnotes').press('Space');
    assert.equal((await state(page)).notes, true);
    await expectPosition(page, 1, 0);
    await page.keyboard.press('n');
    assert.equal((await state(page)).notes, false);
    await page.keyboard.press('N');
    assert.equal((await state(page)).notes, true);
    await page.keyboard.press('Escape');
    await page.locator('#bnext').press('Enter');
    await expectPosition(page, 1, 1);
    await page.locator('#bprev').press('Space');
    await expectPosition(page, 1, 0);

    await page.evaluate(() => { location.hash = 's12'; });
    await expectPosition(page, 12, 0);
    await page.evaluate(() => { location.hash = 's4'; });
    await expectPosition(page, 4, 0);
    await page.goBack();
    await expectPosition(page, 12, 0);
    await page.goForward();
    await expectPosition(page, 4, 0);
    await page.evaluate(() => { location.hash = 's999'; });
    await expectPosition(page, 19, 0);
    await page.evaluate(() => { location.hash = 's0'; });
    await expectPosition(page, 1, 0);

    await page.keyboard.press('f');
    await page.waitForFunction(() => Boolean(document.fullscreenElement));
    await page.keyboard.press('F');
    await page.waitForFunction(() => !document.fullscreenElement);
    await page.keyboard.press('Meta+f');
    await expectPosition(page, 1, 0);
    assert.equal((await state(page)).fullscreen, false);
    await page.keyboard.press('Control+n');
    assert.equal((await state(page)).notes, false);

    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
    const images = await page.locator('img').count();
    assert.deepEqual(errors, [], 'Presentation produced JavaScript errors');
    return { slides: steps.length, forwardTransitions, backwardTransitions, images };
  } finally {
    await page.close();
  }
}

async function auditResponsiveControls(browser) {
  const results = [];
  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 720 }]) {
    const mobile = viewport.width === 390;
    const page = await openPresentation(browser, viewport, mobile);
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    try {
      await page.goto(presentationUrl, { waitUntil: 'domcontentloaded' });
      for (const selector of ['#bnext', '#bprev', '#bnotes', '#close-notes']) {
        if (mobile) await page.locator(selector).tap();
        else await page.locator(selector).click();
      }
      await expectPosition(page, 1, 0);
      assert.equal((await state(page)).notes, false);
      assert.deepEqual(errors, [], 'Responsive presentation produced JavaScript errors');
      results.push({ viewport, input: mobile ? 'tap' : 'click', status: 'passed' });
    } finally {
      await page.close();
    }
  }
  return results;
}

(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    const presentation = await auditPresentation(browser);
    const responsiveControls = await auditResponsiveControls(browser);
    console.log(JSON.stringify({ status: 'passed', url: presentationUrl, ...presentation, responsiveControls }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
