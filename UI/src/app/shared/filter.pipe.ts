import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any} items
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(items: any, searchText: string, arg: string): any[] {
      
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    console.log(items);

    return items
    .filter(function(obj) {
        console.log(obj);
      return obj[arg].toLocaleLowerCase().includes(searchText);
    })
    .map(function(obj) {
      return obj;
    });
    
  }
}