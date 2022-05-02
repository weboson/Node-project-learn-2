// Урок №1: "Node.js #1 Базовые концепции и установка (Basic Concepts & Setup Environment)": https://youtu.be/NOiPCc5OUuw?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0
// Тайм-код: 6:30 ссылка: https://youtu.be/NOiPCc5OUuw?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0&t=391

const userName = 'Rishat';
const sayHi = (userName) => `Hello, my name is ${userName}!`;
// console.log(sayHi(userName));


// Урок №3: "Node.js #3 Модули (импорт и экспорт) (Modules & Require)": https://youtu.be/ufrqHbKmco8?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0
// ЭКСПОРТИРУЕМ здешнюю переменнную "userName", чтобы была доступна во вне. Напримсер будем использовать в файле "modules.js"
// с помощью глобального объекта module, запишем в его свойство "exports" нашу переменную "userName"
// module.exports = userName;

//ЭКСПОРТИРУЕМ НЕСКОЛЬКО переменных (данных)
module.exports = {
    userName, // т.е. userName: 'Rishat',
    sayHi, // и sayHi: [Function: sayHi],
} 