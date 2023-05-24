import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstLetter'
})
export class CapitalizeFirstLetterPipe implements PipeTransform {

  transform(value:string | undefined) { 
    if (!value) {
      return '';
    }
    
    if (value === undefined) {
      return '';
    }
    
    return value[0].toUpperCase() + value.substr(1).toLowerCase(); 
   }

}
