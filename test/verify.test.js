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

describe('the roman-numeral list', () => {
  it('should display items with an upper case roman numeral', async () => {
    const listStyleType = await page.$eval('ul[class="roman-numeral"]', (list) => {
      let style = window.getComputedStyle(list);
      return style.getPropertyValue('list-style-type')
    });
      
    expect(listStyleType).toBe('upper-roman')
  });
});

describe('the bullet-point list', () => {
  it('should display items with a the outline of a circle', async () => {
    const listStyleType = await page.$eval('ul[class="bullet-point"]', (list) => {
      let style = window.getComputedStyle(list);
      return style.getPropertyValue('list-style-type')
    });
      
    expect(listStyleType).toBe('circle')
  });
})
