const EventEmitter = require('events');
// !не верный способ, так как экземпляр "emitter" объявленный  однажды, будет совершенно другой с тем, который будет объявлен снова 
// const emitter = new EventEmitter();
// const log = (msg) => {
//     console.log(msg);
//     // ВЫЗОВ СОБЫТИЯ "nameEmitter", который создан и просулшиается в другом файле (events.js)
//     emitter.emit('nameEmitter', {
//         id: 1, 
//         text: 'Текст с вызова событий №2'
//     });
// }

// module.exports = log;


//? верный способ: наследовать совим классом от EventEmitter
class Logger extends EventEmitter { // в nodejs есть встроенный метод наследования от класса "util.inherits": пример в конце:
    log = (msg) => {
        console.log(msg);
        // ВЫЗОВ ПОЛЯ КЛАССА (Logger) УНАСЛЕДУЮЩИЙ ОТ EventEmitter
        this.emit('nameEmitter', {
            id: 1, 
            text: 'Текст с вызова событий №2'
        });
    }
};

// экспортируем наш класс Logger
module.exports = Logger;

// Встроенный в Nodejs метод НАСЛЕДОВАНИЯ от класса "util.inherits", модуля 'util'
// пример:
// естественно нужно экспортировать данный модуль
// const util = require('util');

// далее можно просто создать свой класс, а потом уже использовать метод наследования
// class Logger {
//     log = (msg) => {
//         console.log(msg);
//         this.emit('name_event', data);
//     }
// }

// и потом уже использвоать метод наследования
// util.inherits(Logger, EventEmitter);