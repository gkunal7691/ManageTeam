import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(value: number, args?: any): string {

    const hours: number = Math.floor(value / 60);
    const minutes: number = (value - hours * 60);

    if (hours < 10 && minutes < 10) {
      return '0' + hours + 'h 0' + (value - hours * 60) +'m';
    }
    if (hours < 10 && minutes > 10) {
      return '0' + hours + 'h ' + (value - hours * 60)+'m';
    }
    if (hours > 10 && minutes < 10) {
      return hours + 'h 0' + (value - hours * 60)+'m';
    }
    if (hours > 10 && minutes > 10) {
      return  hours + 'h ' + (value - hours * 60)+'m';
    }
  }

}
