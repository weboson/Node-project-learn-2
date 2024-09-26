// Урок №3: "Node.js #3 Модули (импорт и экспорт) (Modules & Require)": https://youtu.be/ufrqHbKmco8?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0
// ИМПОРТИРУЕМ переменнную "userName", из файла "test.js", с помощью глобального объекта require('path')

// 5) Также можем экспортировать "НЕ СВОИ" данные, например встроенный глобальный объект "os"
const os = require("os") // аргумент не как путь
// воспользуемся импортируемым модулем
console.log(os.platform(), os.release()); // win32 10.0.19044

// 1) ИМПОРТИРУЕМ ОДНУ ПЕРЕМЕННУЮ
// const user = require('./test');
// console.log(user); // Rishat, 


// 2) ИМПОРТИРУЕМ НЕСКОЛЬКО переменных (данных)
// разобъем дынные на нужные переменные, с помощью JS-нативного метода "Диструризация объекта"
// где userName мы переименовали в user, а метод sayHi оставили прежним
const {userName: user, sayHi} = require('./test');
// 3) создадим местную переменную
const name = 'Rinat';

//возпользуемся методом "sayHi", чтоб показать в консоле строку: `Hello, my name is ${name}!`;
console.log(sayHi(name)); // Hello, my name is Rinat!

// 4) ЭКСПОРТИРУЕМ местную переменную "name" во внешнюю среду
module.exports = name;



