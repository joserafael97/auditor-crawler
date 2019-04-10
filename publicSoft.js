const puppeteer = require('puppeteer');

const clickByText = async (page, xpath) => {
  const linkHandlers = await page.$x(xpath);
  if (linkHandlers.length > 0) {

    await linkHandlers[0].click();
    console.log('***********clicou*****************')

  } else {
    throw new Error(`Link not found: ${xpath}`);
  }
};

const run = async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--start-fullscreen'], headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080});
  await page.goto('http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/views/views_control/index.php?cidade=O5w=&uf=PB');
  
  await clickByText(page, `//*[text() = 'Despesas']`);

  await page.waitFor(2000)
  await page.waitForXPath("//*[@title = 'Consultar Despesas Orçamentárias']");

  await clickByText(page, "//*[@title = 'Consultar Despesas Orçamentárias']");

  // Wait for account kit iframe to load
  await page.waitForXPath('//*[@id="frameContent"]/div/div/div[2]/iframe')
  await page.waitFor(3000);

  const iframe = page.frames()[1];

  await clickByText(iframe, "//*[@id='wrap-button']/input[1]");
  await page.waitFor(3000);

  await page.screenshot({path: 'buddy-screenshot.png'});
  console.log("Current page:", page.url());
  return browser.close();
};

const logErrorAndExit = err => {
  console.log(err);
  process.exit();
};

run().catch(logErrorAndExit);