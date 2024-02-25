import {db} from "./db";
import puppeteer, { Browser } from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export class WaLoader {

  static async loadAll(flightUrls?: string[]): Promise<Fare[]> {
    if (flightUrls === undefined || flightUrls.length === 0) {
      console.log("No WizzAir flights provided, skipping their loading.");
      return [];
    }
    const loader = await FareLoader.create();
    const allQueryResults = await Promise.all(
      flightUrls.map(url => loader.load(url))
    );
    await loader.close();
    return allQueryResults.reduce(
      (acc, curr) => acc.concat(curr), []
    );
  }
}

class FareChart {
  outboundFlights: Fare[];
  returnFlights: Fare[];

  constructor(
    outboundFlights: Fare[],
    returnFlights: Fare[],
  ) {
    this.outboundFlights = outboundFlights;
    this.returnFlights = returnFlights;
  }

  getFaresWithPrices(): Fare[] {
    return getFaresWithPricesOnly(this.outboundFlights)
      .concat(getFaresWithPricesOnly(this.returnFlights));
  }
}

function getFaresWithPricesOnly(fares: Fare[]): Fare[] {
  return fares.filter(f => f.priceType === "price");
}

interface Fare {
  departureStation: string,
  arrivalStation: string,
  price: Price,
  "priceType": string,
  "date": string,
  "classOfService": string,
  "hasMacFlight": boolean
}

function getFlightId(fare: Fare): string {
  return `${fare.departureStation}-${fare.arrivalStation}-${fare.date}`;
}

interface Price {
  amount: number,
  currencyCode: string
}

puppeteerExtra.use(StealthPlugin());

class FareLoader {
  private browser: Browser;
  
  private constructor(browser: Browser) {
    this.browser = browser;
  }
  
  static async create(): Promise<FareLoader> {
    const browser = await puppeteerExtra.launch({
      headless: true
    });
    return new FareLoader(browser);
  }

  async load(flightUrl: string): Promise<Fare[]> {
    const ts = new Date();
    const fareChart = await this.loadFareChart(flightUrl);
    const fares = fareChart.getFaresWithPrices();
    await Promise.all(
      fares.map(f => this.save(f, ts))
    );
    return fares;
  }

  async loadFareChart(flightUrl: string): Promise<FareChart> {
    const page = await this.browser.newPage();
    await page.setViewport({width: 1366, height: 768});
    const pageLoading = page.goto(flightUrl)
    const response = await page.waitForResponse(
      resp => resp.url().includes('farechart') && resp.request().method() === 'POST'
    );
    const body = await response.json();
    await pageLoading;
    return new FareChart(body.outboundFlights, body.returnFlights);
  }

  async close() {
    return this.browser.close();
  }

  async save(fare: Fare, ts: Date) {
    const query = {
      text: `INSERT INTO wa_fares(flight, server_time, price, class) VALUES($1, $2, $3, $4)`,
      values: [
        getFlightId(fare),
        ts.toISOString(),
        fare.price.amount,
        fare.classOfService
      ],
    };
    return db.pool.query(query);
  }
}