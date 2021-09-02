// To parse this data:
//
//   import { Convert, Temperatures } from "./file";
//
//   const temperatures = Convert.toTemperatures(json);

import { Bike } from "./bike";

export interface UserInfo {
  userId: string;
  email: string;
  money: number;
  bike: number;
  usage: number;
  historyRoute: HistoryRoute[];
  admin: boolean;
}

export interface HistoryRoute {
  id: string;
  source: string;
  sourceName: string;
  destination: string;
  destinationName: string;
  cost: number;
  bikeId: number;
  currentRoute: boolean;
  borrowTime: Date;
  returnTime: Date;
  sLat: number
  sLng: number
  dLat: number
  dLng: number

}

// Converts JSON strings to/from your types
export class Convert {
  public static toTemperatures(json: string): UserInfo {
    return JSON.parse(json);
  }

  public static temperaturesToJson(value: UserInfo): string {
    return JSON.stringify(value);
  }
}
