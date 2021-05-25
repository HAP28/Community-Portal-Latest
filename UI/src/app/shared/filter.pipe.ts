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
      items.map((obj) => {
        obj[arg] = obj[arg].replace(
          new RegExp('<span style="color:red">', 'gi'),
          ''
        );
        obj[arg] = obj[arg].replace(
          new RegExp('<span style="color:red">', 'gi'),
          ''
        );
        obj[arg] = obj[arg].replace(new RegExp('</span>', 'gi'), '');
      });
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items
      .filter(function (obj) {
        obj[arg] = obj[arg].replace(
          new RegExp('<span style="color:red">', 'gi'),
          ''
        );
        obj[arg] = obj[arg].replace(
          new RegExp('<span style="color:red">', 'gi'),
          ''
        );
        obj[arg] = obj[arg].replace(new RegExp('</span>', 'gi'), '');
        console.log(obj);
        return obj[arg].toLocaleLowerCase().includes(searchText);
      })
      .map(function (obj) {
        let newObj = obj;
        console.log(obj);
        if (searchText != ' ') {
          newObj[arg] = obj[arg].replace(
            new RegExp(searchText, 'g'),
            '<span style="color:red">' + searchText + '</span>'
          );
          newObj[arg] = newObj[arg].replace(
            new RegExp(
              searchText[0].toUpperCase() + searchText.substr(1).toLowerCase(),
              'g'
            ),
            '<span style="color:red">' +
              searchText[0].toUpperCase() +
              searchText.substr(1).toLowerCase() +
              '</span>'
          );
        }
        return newObj;
      });
  }
}
