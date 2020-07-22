import uniqid from 'uniqid';
import { elements } from '../views/base';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);

        //Persit data in localStorage
        this.persistData();

        return item;
    }

    addItemManually(item) {
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']; //Destructuring unitsShort
        const items = item.split(' ');
        const unitIndex = items.findIndex(el2 => units.includes(el2)); //Return index of array if there's element unitsShort array
        let element;
        if (unitIndex > -1) {
                element = {
                    id: uniqid(),
                    count: parseInt(items[0], 10),
                    unit: items[unitIndex],
                    ingredient: items.slice(unitIndex + 1).join(' ') //Return string from array
                }
            } else if (parseInt(items[0], 10)) {
                //There is no unit
                element = {
                    id: uniqid(),
                    count: parseInt(items[0], 10),
                    unit: '',
                    ingredient: items.slice(1).join(' ') 
                }
            } else if (unitIndex === -1) {
                //There is no unit and NO number in 1st position
                element = {
                    id: uniqid(),
                    count: 1,
                    unit: '',
                    ingredient: items.slice(0).join(' ')
                }
            }
        this.items.push(element);

        //Persit data in localStorage
        this.persistData();
        
        return element; 
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // [2,4,8] --> splice(1, 1) --> return 4 --> [2, 8]
        this.items.splice(index, 1);

        //Persit data in localStorage
        this.persistData();
    }

    deleteAllItem() {
        this.items.splice(0);

        //Persit data in localStorage
        this.persistData();
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount; //Return element itself

        //Persit data in localStorage
        this.persistData();
    }

    persistData() {
        localStorage.setItem('list', JSON.stringify(this.items)); //It's always be a string. JSON.stringify-convert arrays to a string
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('list')); //Convert string to arrays

        //Restore likes from the localStorage
        if (storage) this.items = storage;
    }
}

