import { Injectable } from '@angular/core';

@Injectable()
export class DateWorkerService {

  constructor() {}

  public CurrentYear(): number {
    let d = new Date();
    var m = d.getFullYear();
    return m;
  }

  public CurrenMonth(): number {
    let d = new Date();
    var m = d.getMonth() + 1;
    return m;
  }

  public getYearFromDate(date: string): number {
    let d = new Date(date);
    var m = d.getFullYear();
    return m;
  }

  public getMonthFromDate(date: string): number {
    let d = new Date(date);
    var m = d.getMonth() + 1;
    return m;
  }

}
