import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandsSeparator'
})
export class ThousandsSeparatorPipe implements PipeTransform {

  transform(value: any | undefined): string {
    if (!value) {
      return '';
    }
    
    if (value === undefined) {
      return '';
    }
    
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

}