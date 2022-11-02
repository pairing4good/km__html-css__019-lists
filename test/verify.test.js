const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });  

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the left class', () => {
  it('should display to the left with the text wrapping around the image', async () => {
    const float = await page.$eval('div[class="left"]', (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue('float');
    });
    
    expect(float).toBe("left");
  });
});

describe('the right class', () => {
  it('should display to the right with the text wrapping around the image', async () => {
    const float = await page.$eval('div[class="right"]', (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue('float');
    });
    
    expect(float).toBe("right");
  });
});

describe('the default class', () => {
  it('should display on the same side that the body that is set in the style.css', async () => {
    const letiableDefinitionCount = await page.$eval('style', (style) => {
      return style.innerHTML.match(/\.default.*{[\s\S][^}]*float:.*inherit;/g).length;
    });
    
    expect(letiableDefinitionCount).toEqual(1);
  });
});

describe('the below class', () => {
  it('should display below the image', async () => {
    const clear = await page.$eval('div[class="below"]', (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue('clear')
    });
    
    let setToBoth = clear === 'both';
    let setToLeft = clear === 'left';
    expect(setToBoth || setToLeft).toBe(true);
  });
});