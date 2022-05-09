// Этот файл для практики создания Stream передачи данных порциями (buffer)
// Источник видео канала "webDev" "Node.js #6 Буфер и потоки (Buffer & Streams)": https://youtu.be/r--VL8JywyA?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0

// В nodejs есть 4 основных вида потока:
// 1. Readable 
// 2. Writable
// 3. Duplex
// 4. Transform

// Модуль filesystem для созадния Sreams
const fs = require('fs');

// Модуль zlib для сжатия данных: https://nodejs.org/dist/latest-v18.x/docs/api/zlib.html
const zlib = require('zlib');

// сжатие. После сжатия в файле write-buffer.js появится нечитаемые символы, чтобы их прочитать, нужно будет дикомпрессовать (как? автор об это не сказал. Но думаю в документации написано)
//! zlib.createGzip() - это СЖАТИЕ ДАННЫХ
const compressStream = zlib.createGzip();
// далее это сжатие используется ниже



//! читающий поток (тип Readable):
const readStream = fs.createReadStream('./docs/buffer.txt'); // чтобы спровоцировать ОШИБКУ (для handleError) нужно изменить путь на несуществующий например на buffer2.txt

//? использование (отдельное) 
// МОЖНО БЕЗ ПЕРВОГО АРГУМЕНТА, но в аднном случае, только с 'data' работает. 
//! .on - запускает ЧТЕНИЕ
// readStream.on('data', (chunk) => { // chunk - порции
//     console.log('-------------');
//     console.log(chunk.toString);
// })

//* мое иследование:
// судя по "console.log(fs.createReadStream('./docs/buffer.txt'));" или "console.log(readStream);"
// fs.createReadStream - возращает объект:
//  ReadStream {
//   fd: null,
//   path: './docs/buffer.txt',
//   flags: 'r',
//   mode: 438,
//   ...... 
// }
// fs.createReadStream возвращает:
//console.log(readStream);


//! пишущий поток (тип Writable):
const writeStream = fs.createWriteStream('./docs/write-buffer.txt'); // записать данные в новый файл (также создает новый файл)
//? использование (отдельное) 
// Воспользуемся данными, которые прочитали:
// readStream.on('data', (chunk) => { // chunk - порции
//     writeStream.write('\n---CHUNK START----\n'); //! .write(data) ЗАПУСКАЕТ ЗАПИСЬ
//     writeStream.write(chunk);
//     writeStream.write('\n---CHUNK END----\n');
// })

//* мое иследование:
// fs.createWriteStream возвращает: 
//console.log(writeStream.on("rr", () => {}));





//! И чтение и запись (тип Duplex) - метод .pipe
// 'on' - создается событие (событие чтения) - это из: https://nodejs.org/dist/latest-v18.x/docs/api/events.html#emitteroneventname-listener
// конструкция - emitter.on(eventName, listener)

// readStream.on('data', (chunk) => { // сначала читает
// .write - это из filesystem - https://nodejs.org/dist/latest-v18.x/docs/api/fs.html
//     writeStream.write('\n---CHUNK START---\n'); // чтобы видеть (в файле /docs/write-buffer.txt)НАЧАЛО буффера
//     writeStream.write(chunk); // потом, каждый прочитанный buffer записывает write в новый файл
//     writeStream.write('\n---CHUNK END---\n'); // чтобы видеть КОНЕЦ буффера (для нагладности, в write-buffer.txt произвести посик START )
// });

//! ОТДЕЛЬНЫЙ duplex-ный МЕТОД pipe() - вместо нашей цепи "readStream.on(... writeStream())""
// readStream.pipe(writeStream);



//вариант с выводом ошибки и удаление:
// функция обработки ошибки
const handleError = () => {
    console.log('Error');
    readStream.destroy(); //! destroy  УНИЧТОЖАЕТ ПОТОК данных (в нашей функции это оишбочные данные)
    writeStream.end('Finished with error...'); //! .end - ДОБАВЛЯЕТ В КОНЕЦ данные
};

// последовательная цепь
readStream
// при ошибок чтения - данные уничтожаются
    .on('error', handleError) // ЧТЕНИЕ - "handleError" - колбэк - обработчик - 
    .pipe(compressStream) // СЖАТИЕ - сжимает данные их перед записью
    .pipe(writeStream) // ЗАПИСЬ
// при ошибок при записи - данные также уничтожаются
    .on('error', handleError)




//!  чтение и запись + изменения этих данных - (Transform - бреобразующий тип), например "сжатие данных"
// для этого нам поможет модуль zlib, он подкючен в началае файла, как и должно быть


