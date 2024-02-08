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
  baseURL: "https://be.wizzair.com/20.4.0/Api",
  headers: {
    Cookie: "_abck=7EE67C3032365D0CD2AA85007518105B~0~YAAQxpMRAr10N2CNAQAAA0faigvy0WnVg2UJiMObB3plFTvSNTBOtJCWvNv6EvACev8rKZc45nB+459G2gj1oiUXrKVIaCD+5kseptvzU+C42Brk29jI/nO6ciEQ3jhp3cUPzNKZygLL6A7SKUw0tR35YDDSr0cEk1RFWxSjYS0V1Rxmy5aeBcHBL2ZXMOMvnHTeHWD6u8xJhUufsplHAPk7W7jl/+pCeNargDtUPgTtQ9GrS8F6OMHAvA/57SfSbYXYZn/3HLsql797szu2PUM0bEa7RZcRNqA/1jMV4hQDAS0vfw2vvXPApBJaP1tM3SJYP/9debPIcyXVoTldVgUPpt0ZkT8rvQiNAq8QNUp3hgZ+Is1tjgbJNL5CDJrpsLHEReQpu4JwJdrtcO2i2z1AgmHI3Qk1pWJEkRLDR7l6QTAbdBvnlQfiLhg=~-1~-1~-1; _gcl_au=1.1.1940108926.1707243081; _ga=GA1.2.1680589569.1707243082; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Feb+08+2024+23%3A29%3A01+GMT%2B0100+(st%C5%99edoevropsk%C3%BD+standardn%C3%AD+%C4%8Das)&version=202310.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0004%3A1%2CC0003%3A1%2CC0002%3A1%2CC0001%3A1%2CC0007%3A1; _ga_G2EKSJBE0J=GS1.1.1707431340.2.1.1707431386.14.0.0; _fbp=fb.1.1707243082592.609320849; _ga_CLN8TZXB9T=GS1.1.1707431368.4.0.1707431380.48.0.0; OptanonAlertBoxClosed=2024-02-06T18:11:24.969Z; _pin_unauth=dWlkPU1HVXhPR1EyTW1NdE56RTBOQzAwWkRFeUxXRTFZVGN0TVRBMk5UQmlOV00yTkRBMw; _tt_enable_cookie=1; _ttp=_k5h90Osc_wl4IK5wMSs7ruNC13; ak_bmsc=A268819F1A41C2F5A372D972F4B97B02~000000000000000000000000000000~YAAQxpMRAjRsN2CNAQAARNjWihbiCY4+FNoQP5izYeUVE5Wij6Rw8XnDzimfB7X4mf159MoqCgWnQB6MCejUL8U6gzaQbrvn0SZBuLOV1xbaXpAM7hEr+xDu3sEUp0/NNr//TFqFRT7WxgRAObOQfGI8+wTnsem3cP+V0ua7MNx3bk/RA7fElrityve3BOI933YFuKESWKQehnjogOLIK0d5AU8dJdYphye8ssFdO6MVTZ2FJLG5GXklQS0iEK8n25DO9qZPSxCPPmw0hRA+tonhROTqgb/lTxwlu3Kc2TlokTkQsQzCSL7xS6mRFI6R9rKDvYK8+yFEosj9uEZUCdoJZL8Pnn6u3a5kUR3ijy+XxusyOohePBrGz3E8kSyroFEOmjSL5sNEeMqFv+iftfSMnRClqdvvr8j4kRQ66yT7+2Emd81/j2aznl8B3GTjhNIVFAv6ptX2dkmLZDVGgN3aBjgkNn5X2RNAbBoSujiUhginE1zVHko10UBkseGAfkU=; bm_sz=3CAE2613A278DB35719687DDB9813A17~YAAQxpMRAiRsN2CNAQAA2NLWihZuZsTilUsbKc53EcZV2v6wgc1X6fkz92rtzVtrRsHMmBUkqCaN9qtLke7gAVFViV+keaGwB+lNxtVw9RZnwmKBFJYgHE7yknUo+fSDU86VLoVSHvfqziNsUOuFUycU8c2qePtRCniPs5fKBsvMODU5VkFX5NywQqgED/fmwGS6KNeZ9m9ZIfZKijyVDjthi4Ha1uEKqGQjvNn/TmCxDCNBo5CvyncwB6Bl4VQ6N1gBz/883C8Tfx8sWyheyKlhCWQrqBY1DH8WCCCH5YIjuotfr/hQu7LuChMmXQtjwOKSPBguY+17PKREdz5na0I6KRgvBkLmWnIsNp7Do/ECUkCmGRjW7DvMYG1Fl26h6uyOozRKnjbhI9M25C+IUR0juq0snNjQeKYKCk0/AC/GMQBVcG6etRyE5SNISxbFnvCh/E1rxA==~3553590~3486277; bm_sv=03C3D94E20A352442264B3622C7122B0~YAAQxpMRAsh0N2CNAQAAQkraihZ7cB98SC+RaAi2ICM/IQLyflWKcLmE52xzF5+wwKrXQGsnkDN1Xzks9/R2G8k35jLsHHthsSqLFU5Yz1NmCzl+PDQypENHEWb3Fo7ebQ/hXVvK5SLMtw5XElJqAfDLp/PhDpO7BRpOW1BaTPaqP3TnaPDN4no+KjEWDfptqGHMBIWzo8lOG+YcaGBBUFnHI+k7wbzRhYH334tzqBiHCQz/qIg/HV1ZT1aQijO1Nho=~1; ASP.NET_SessionId=u5ndc0q0biyy01an4t1vje3v; RequestVerificationToken=3edf82e0b4ae463fb8883ee0d143cf34; akacd_onewizz_AB_backend_production=3884884151~rv=25~id=704fdcc7325af80bcd91ba020830a1b2; _gid=GA1.2.593627708.1707431341",
    "X-RequestVerificationToken": "3edf82e0b4ae463fb8883ee0d143cf34",
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
      ts.toISOString(),
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