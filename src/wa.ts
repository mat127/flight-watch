import axios from 'axios';
import {pool} from "./db";

interface FareQuery {
  adultCount: number,
  dayInterval: number,
  flightList: FlightParams[],
  childCount: number,
  isFlightChange: boolean,
  isRescueFare: boolean,
  wdc: boolean
}

interface FlightParams {
  arrivalStation: string,
  date: string,
  departureStation: string
}

const fareQueries: FareQuery[] = [{
  adultCount: 1,
  dayInterval: 3,
  flightList: [{
    arrivalStation: "HER",
    date: "2024-09-02",
    departureStation: "KRK"
  },{
    arrivalStation: "KRK",
    date: "2024-09-09",
    departureStation: "HER"
  }],
  childCount: 0,
  isFlightChange: false,
  isRescueFare: false,
  wdc: false
}];

const client = axios.create({
  baseURL: "https://be.wizzair.com/20.3.0/Api",
  headers: {
    Cookie: "_abck=7EE67C3032365D0CD2AA85007518105B~-1~YAAQxpMRAuqfEmCNAQAAlL/sfwsfMskH07ajrFFP8T9hfHEkKxCOZkdhfRzddhg9jhmrLloJinRFusiYmmt7QIRzayJTi6L3otsEWOYGoequeKfSQEl/8CZO8/lDrlPS5UthUee/JNlSYrXKshCZfCsf5JgDwduVx8XoVIQn9Ln/ZOTG4FFo0tcOHEbTnK9OqBR6+EPetpAk52TYlUZdoN38aOfTen6XDXYFIz8d7KOMepmbbK+MU21oixm6lUbY+mq+NiACg0JQoCQcU2FQPACcRTe25GhPnsZFPil5ZfNIrfq7IyjTuqZEVpS8XvsTmF1IKofZgIo7jobDNoq+3XGYXUFEb4FEGSDyw6+Ml8r7qCFQXp6Ij7xK3HQpIMphVS+ZhBv7SdwKYkx82Y6M6KntqLKVRaUEFalsGLbMh6NbdLfHfTUdvRqMCv+j~-1~-1~-1; ak_bmsc=4A5DD991F6BF96E878A4C60C14C3AE59~000000000000000000000000000000~YAAQxpMRAkpoEGCNAQAAni+efxYJnqbRfqgWZlnVn8U37+BaX8CGVMl6hAUCrIIAPR4VhfhoEWkfJIFPSze+ef89HeXy0E2HiGFeaS0h0sb574MB3NVzRpLaHZU5eSHr7nrvtLTXV7xk/LdF0mXEfUyKbhAb1XZZou5h4Wox84ncouWGv+LZvyKTFof5hPVVuirxlG2/MTzLJbdGvdUa/n7/x9ymmKuN39k4Djp5xZW7rIepFzckSpTk/51AUK3c9Yxn24PdwQbq7OfXZmm1Fbnn0rl5sksy+hrhVpUMo2mPMagPB/DGpV96CSizj/9TMIESujhLigUnhwlV7EqlE3qGaYVpQQJVEu/QJCdxGosWwQIhJ2J6PIbM8fX/MW8dw21DpShTF+BA/ic/TTOXtACn5R4xYNYDv3mQuigrSqcMRNLrg9KmFCnAdAByRX6ZyiFct1NrGHog/xVGW0aW1ZXK7v7JEB7/zjjAKbvh/ojFGzKSwI5GPGQUYi5Qpsh0iBc=; bm_sz=D53B3B846D3179DB988D7DB948D110BB~YAAQxpMRAi1oEGCNAQAAySqefxaVteIi3JQXRmG6aBzdvZ2J+iCrLB7DlmOugn/Q2Z61A5JayhPhvZrcymEPH5KRafDMYUzq0lnchJ99gsPz+Z5FvPgi+KvjsuAvVUeDTv2UM7PqCG+6N4j2nysvhahbZMZ+bFl71Lgv23Y6CMNzSiOMlRADNLbVXFxWE7Oagj7RsnfxdEm2EROf4efChLzt0AJSOtOrY2GfmGGQc3B8aOTsHVnqC0g1VO2jwew36RoDjfvhAdr09gvBTLhxWx3ioDoCI0ON0k/ZbODu712lFoqQBTBJRL4eryfSBOsWYvRG6RTwgfVPISvhwlWX3luxpSvpeDhfKr88qB6IXRWrTPOHZmx+b2nsXd+L7VykqLLw2d6syuEhb2cx2jfNfvQzL6snSAhVhnSBar9tD+aQxZBF7fGph8iEW/ulhgtAPjXqr1uB6w==~3682356~3294263; bm_sv=F7FD1DD11904EB60E9392DB2B2055A2E~YAAQxpMRAvufEmCNAQAAicDsfxas1N4NgnryHJMlgmte0d0DXpWODNSsZhW+KJXzY7k8ojtkNXkbllriss0ui1UKIlouGNMAk2eudu73173MHCRhA0lWNsKDMfXKe2P7hSMAY/v3h/9fGKmP/JXlf5BQxR0b2+5m97bf0UEwXjGgrizIyhsX7qX3ng71GjJgDFh6VEnEkBdFOjLl+9O5rGC5QowzA9LIcJ3IZnEodVObIqhGrY+XqrlFYa5uQfmWJ1Y=~1; RequestVerificationToken=25b9d60291484ef1a2549d6a19daff00; akacd_onewizz_AB_backend_production=3884695889~rv=10~id=e5eda520b663bb91614292caeaf27117; _gcl_au=1.1.1940108926.1707243081; _ga=GA1.2.1680589569.1707243082; _gid=GA1.2.1720082521.1707243082; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Feb+06+2024+20%3A37%3A02+GMT%2B0100+(st%C5%99edoevropsk%C3%BD+standardn%C3%AD+%C4%8Das)&version=202310.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0004%3A1%2CC0003%3A1%2CC0002%3A1%2CC0001%3A1%2CC0007%3A1; _ga_G2EKSJBE0J=GS1.1.1707243082.1.1.1707248232.43.0.0; _fbp=fb.1.1707243082592.609320849; _ga_CLN8TZXB9T=GS1.1.1707248217.3.0.1707248224.53.0.0; OptanonAlertBoxClosed=2024-02-06T18:11:24.969Z; _pin_unauth=dWlkPU1HVXhPR1EyTW1NdE56RTBOQzAwWkRFeUxXRTFZVGN0TVRBMk5UQmlOV00yTkRBMw; _tt_enable_cookie=1; _ttp=_k5h90Osc_wl4IK5wMSs7ruNC13; _gat_gtag_UA_2629375_25=1; ASP.NET_SessionId=fbu1jairsevanbazqgvmgyec",
    "X-RequestVerificationToken": "25b9d60291484ef1a2549d6a19daff00",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0",
    Origin: "https://wizzair.com",
    Referer: "https://wizzair.com/en-gb/"
  }
});

interface Fare {
  departureStation: string,
  arrivalStation: string,
  price: Price,
  "priceType": string,
  "date": string,
  "classOfService": string,
  "hasMacFlight": boolean
}

interface Price {
  amount: number,
  currencyCode: string
}

export const wa = {
  loadAll: async function (): Promise<Fare[]> {
    const allQueryResults = await Promise.all(
      fareQueries.map(p => wa.load(p))
    );
    return allQueryResults.reduce(
      (acc, curr) => acc.concat(curr), []
    );
  },

  load: async function(flightParams: FareQuery): Promise<Fare[]> {
    const ts = new Date();
    const response = await client.post('/asset/farechart', flightParams);
    const fares = getWithPricesOnly(response.data.outboundFlights)
      .concat(getWithPricesOnly(response.data.returnFlights));
    await Promise.all(fares.map(f => save(f, ts)))
    return fares;
  },
};

function getWithPricesOnly(fares: Fare[]): Fare[] {
  return fares.filter(f => f.priceType === "price");
}

async function save(fare: Fare, ts: Date) {
  const query = {
    text: `INSERT INTO wa_fares(flight, server_time, price, class) VALUES($1, $2, $3, $4)`,
    values: [
      getFlightId(fare),
      ts,
      fare.price.amount,
      fare.classOfService
    ],
  };
  return pool.query(query);
}

function getFlightId(fare: Fare): string {
  return `${fare.departureStation}-${fare.arrivalStation}-${fare.date}`;
}

export default wa;