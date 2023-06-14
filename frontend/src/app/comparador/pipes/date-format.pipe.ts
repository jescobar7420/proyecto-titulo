import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();

    day = day.padStart(2, '0');
    month = month.padStart(2, '0');

    return `${month}/${day}/${year}`;
  }
}
