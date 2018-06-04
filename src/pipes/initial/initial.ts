import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initial',
})
export class InitialPipe implements PipeTransform {
  /**
   * Takes a value and gets first character and makes it uppercase.
   */
  transform(value: string, ...args) {
    return value.charAt(0).toUpperCase();
  }
}
