export class DashboardInfo {
  userIncreasedInLastMonth: number;
  userIncreasedInThisMonth: number;
  bikeLendInThisMonth: number;
  bikeLendInLastMonth: number;
  revenueInThisMonth: number;
  revenueInLastMonth: number;
  totalStationsAmount: number;
  stationIncreasedInThisMonth: number;
  stationIncreasedInLastMonth: number;

}

export class Dashboard extends DashboardInfo{
  userIncreasedPercent: number;
  bikeLendIncreasedPercent: number;
  revenueInceasedPercent: number;
  stationInceasedPercent: number;

  userIncreased: number;
  bikeLendIncreased: number;
  revenueIncreased: number;
  stationIncreased: number;
}
