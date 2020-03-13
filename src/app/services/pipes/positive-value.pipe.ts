import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'positiveValue'
})

export class PositiveValuePipe implements PipeTransform {

  transform(value: any): any {
    if (value < 0) {
      value = Math.abs(value);
    }
    return value;
  }

}