import axios from 'axios';
import {pool} from "./db";

export interface FlightParams {
  ADT: number,
  TEEN: number,
  CHD: number,
  INF: number,
  Origin: string,
  Destination: string,
  DateOut: string,
  DateIn: string,
  RoundTrip: boolean,
  ToUs: string
}

export interface Availability {
  trips: Trip[],
  serverTimeUTC: string
}

export interface Trip {
  dates: TripDate[]
}

export interface TripDate {
  flights: Flight[]
}

export interface Flight {
  faresLeft: number,
  flightKey: string,
  regularFare: Fare
  flights: Flight[]
}

export interface Fare {
  fares: FarePrice[]
}

export interface FarePrice {
  type: string,
  amount: number,
  publishedFare: number
}

const flightParams: FlightParams[] = [{
  ADT: 1,
  TEEN: 0,
  CHD: 0,
  INF: 0,
  Origin: "BTS",
  Destination: "AHO",
  DateOut: "2024-06-30",
  DateIn: "2024-07-07",
  RoundTrip: true,
  ToUs: "AGREED"
}, {
  ADT: 1,
  TEEN: 0,
  CHD: 0,
  INF: 0,
  Origin: "KTW",
  Destination: "AHO",
  DateOut: "2024-07-01",
  DateIn: "2024-07-08",
  RoundTrip: true,
  ToUs: "AGREED"
}];

const client = axios.create({
  baseURL: "https://www.ryanair.com/api/booking/v4/cs-cz",
  headers: {
    Cookie: "fr-correlation-id=816533f2-4c75-4711-af2e-d47114bbb1a8; rid=f76dd9f8-3152-44ce-88ca-569995ac4a6c; rid.sig=jyna6R42wntYgoTpqvxHMK7H+KyM6xLed+9I3KsvYZaVt7P36AL6zp9dGFPu5uVxaIiFpNXrszr+LfNCdY3IT3oCSYLeNv/ujtjsDqOzkY66AL3V6kH2vsK+au12X21HkZ4S8GaG8CoBmm/m0rLsOKYkxtw+U3+ejBaPc15jJjKXnc3owMBg82SNbqyKjVd6Ve3KOI0h//ziAUbLRk96P674a+EYzjTmvcloZ24qFromUOZ5KQyVDeXkO0kKtz/pWewryPYSCpa3GzHnA6KnjQWuW7BQb+5D9mxOtt3cezjk29eQET5J3TQc53o/Va7rwWT7rPGVgWzG+d8xNhSfn+Rn4ZQhUhVvG3FgDr+gMjtQckGbt3xQO7kRuuTd/u3cVUqCx9WE3FBRPCzzvPCuZCjG3feCn1CZdNbCMAVjE8MV2SGj+6CIvpmGy0I1kBOG38j2XymO+3MpwzCzkiOHB+jq1EftwXV/mShMTHu9amtrzq7X4EHUxiARuYmBVgEX2NYDYvra5POb4YP+3tbsS1iu9xvcOQwCn/BMUiCrwtE0cTtIZMmSRMaL6xcmq6mvV8sjlswM7xoFuaGlWBcYggU7O6yGO1Co5D8FmIkUHSoMER8yjghJY8PejLWjbl/b8N/74itQoIZnQfADsx66AGbnFX4JKWEOQHPaf5pHCaF40NoqGBIzLIkPnBDlJ9B9EtOM7sJltTn3L6b6oWcIHy0THHtCk7LItNMezG8TUmyTke5uAc4QQz+xrwyA4Mru; mkt=/cz/cs/"
  }
});

export const ra = {
  loadAll: async function(): Promise<Availability[]> {
    return Promise.all(
      flightParams.map(p => ra.load(p))
    )
  },

  load: async function(params: FlightParams): Promise<Availability> {
    const response = await client.get('/availability', {
      params: params,
    });
    await ra.saveAll(response.data as Availability)
    return response.data;
  },

  saveAll: async function (availability: Availability) {
    return Promise.all(availability.trips.flatMap((trip) => Promise.all(
      trip.dates.flatMap((date) => Promise.all(
        date.flights.flatMap((flight) => Promise.all(
          flight.regularFare.fares.map(
            (fare) => ra.saveFare(flight, fare, availability.serverTimeUTC)
          )
        ))
      ))
    )))
  },

  saveFare: async function (flight: Flight, fare: FarePrice, timestamp: string) {
    const query = {
      text: `INSERT INTO fares(flight, type, server_time, amount, published_fare, fares_left)
                     VALUES($1, $2, $3, $4, $5, $6)`,
      values: [
        flight.flightKey,
        fare.type,
        timestamp,
        fare.amount,
        fare.publishedFare,
        flight.faresLeft
      ],
    };
    await pool.query(query);
  }
}

export default ra;
