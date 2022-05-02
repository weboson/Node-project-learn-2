// Урок №2: 
// "Node.js #2 Глобальные объекты (Global Objects)": https://youtu.be/xrHETaIbNpg?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0
// Тайм-код: 6:30 ссылка: https://youtu.be/xrHETaIbNpg?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0

// 1-й пример:
// глобальный объекьт global:
//console.log(global);
// кстати, console.log() - также является глобальным объектом 

// 2-й пример:
// к global не обязательно обращатся напрямую и писать, например: global.setTimeout()
// setTimeout(() => {
//     console.log('Hello');
// }, 2000); // после ввода в терминал "node global.js (можно без .js)", в терминале спустя 2 секунды появляется строка "Hello"

// 3-й пример:
//глобальный объект __dirname
// выдает директорию до исполняемой папки
//console.log(__dirname); // E:\Practics-JavaScript\Node-Learn 2022\Node-project-learn №2

// 4-й пример:
// глоб. объект __filename
// возвращает строку, где полная директория до исполняемого файла, включая файл и его расширение
//console.log(__filename); // E:\Practics-JavaScript\Node-Learn 2022\Node-project-learn №2\global.js

// 5-й пример:
// process - хранит в себе много нужной информации (количество ядер, ОС и т.д.)
// часто испорльзуется из-за своей глобальной доступности поле .env
// в process.env обычно добавляют свои константы, напимер: PORT
// console.log(process.env);

// 6-й пример:
// также используется process.argv - он хранит в себе команды введенные в терминале, например: n
//console.log(process.argv); // при вводе команды "node global 12 [1,2,3] "string"" - выдал в терминале массив строк:
// [
//     'E:\\SoftWare\\Node\\node.exe',
//     'E:\\Practics-JavaScript\\Node-Learn 2022\\Node-project-learn №2\\global',
//     '12',
//     '[1,2,3]',
//     'string'
//   ]

// 7-й пример:
//пример использования process.argv: вводим команду "node global Rishat"
//console.log(`Hello, ${process.argv[2]}`); // Hello, Rishat

// 8-й пример:
// глобальный класс (объект) new URL() - парсирует url-адресс на составляющие, например:
const url = new URL('https://webdev.com/path/name#test');
console.log(url.hostname);
console.log(url.href);
console.log(url.pathname);
console.log(url.hash);

// выдал в терминале:
// webdev.com
// https://webdev.com/path/name#test
// /path/name
// #test
