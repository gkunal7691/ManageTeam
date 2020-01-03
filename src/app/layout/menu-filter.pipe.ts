import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterMenu',
    pure: false
})
export class MenuFilter implements PipeTransform {
    transform(item: any, filter: any): any {
        if (!item || !filter) {
            return item;
        }
        return item.filter(i => {
            if(!i.roleId){
                return true;
            }
            return i.roleId.indexOf(filter) !== -1;
        });
    }
}