// Источник видео канала "webDev" "Node.js #10 Пакетный менеджер (NPM & Packages)": https://youtu.be/rX03u596ERs?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0
// В данном уроке была практика с npm (пакет модулей и пакетов), а также сопутствующие файлы: package.json, package-log.json. 
// На практике были усановлены сторонние npm-пакеты : 
// 1) nodemon - обновляет запуск сервера, при каких либо изменений файла (каждый раз после сохранения)
// 2) ejs - шаблонизатор для введений динамических данных на наш сайт. Позволит создавать динамические данные и рендерить их на iu (пользовательский интерфейс).
// 3) express - это nodejs-фрейворк для удобной и быстрой работой с запоросами и ответами (сервер).

// ОСНОВНЫЕ КОМАНДЫ NPM я уже описывал в документе: "NPM command-команды.odt", но в данном проекте это:
// 1) npm init (инициализация проекта, то есть установить в нашей папке с проектом npm-пакет и главное файла package.json и т.д.)
// 2) npm install - установка всех пакетов указанных в package.json. "install" - можно сокращать в "i"
// 3) npm install -g [namepackege] - установка пакета ГЛОБАЛЬНО (флажок -g), то есть установка на ПК прямо в корень Nodejs (я пологаю), а также подобная установка пакета не будет отражена, как зависимость проекта от данного пакета, в package.json, и данный пакет будет доступен для всех проектов которые будут на ПК,. Но подобный вид устанвоки НЕ РЕКОМЕНДУЕТСЯ, так как версии в использовании в проекте могут не совподать с версией на нашем ПК. В итоге лучше использовать следущий вид установки:
// 4) npm install --save-dev [namepackege] - ЛОКАЛЬНАЯ (--save-dev) установка в папку проекта + отражение зависимость проекта в package.json в поле ""devDependencies": {}" - значит пакет нужен в момент разработки приложения (dev - developer). И приложение можно запустить без этого пакета
// 5) "npm install --save [package]" ЛИБО ПРОСТО "npm install [package]" (--save стоит по умолчанию)- также, как в пункте №5 только зависимости устанавливаются в поле: "  "dependencies": {}"
// 6) После установки? чтобы постоянно не писать длинные команды (nodemon app.js), пропишем свою укороченную команду в package.json в поле scripts: {}: "dev": "nodemon [app.js]". А чтобы воспользоваться собсвенно командой, нужно писать: npm run [наша команды]. В нашем случае это: npm run dev
// 7) npm install [package] @latest - установка пакета последней версии
// 8) npm install [package] @1.0.0 - установка пакета определенной версии
// 9) npm uninstall [package] - удаление пакета




//! Реализация сервера, с ДИНАМИЧЕСКОЙ передачей данных (html-страницы)
//!
//? пока ДЛЯ ПРОВЕРКИ ПАКЕТА NODEMON - код скопирован из предыдущей реализации сервера (static-app.js)
const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

// создание сервера
const server = http.createServer((req, res) => {
    console.log('Server request');
    console.log('Just test');
    res.setHeader('Content-Type', 'text/html');

    
    const createPath = (page) =>  { return path.resolve(__dirname, 'views', `${page}.html`)};

    // была ошибка в cratePath, из-за не правильной конструкции () => {}, а нужно, если поставил {}, чтобы что-то вернуть, поставить return/
    // ниже стрелочная функция с нужными комментариями из главы "Многострочные стрелочные функции": https://learn.javascript.ru/arrow-functions-basics#mnogostrochnye-strelochnye-funktsii
    let sum = (a, b) => {  // фигурная скобка, открывающая тело многострочной функции
        let result = a + b;
        return result; // если мы используем фигурные скобки, то нам нужно явно указать "return"
      };

    // конструкция switch-case, чтобы относительно req.url вызывать "создателя пути" (createPath()),
    // и присваивать путь, при каждом запросе (на нужную старницу), переменной basePath
    // - чтобы это путь использовать при чтении-записи
    let basePath = '';

    switch(req.url) {
        case '/': 
        case '/home': // бывшие url (редирект с помощью switch-case)
        case '/index.html': // бывшие url (псевдо-редирект с помощью switch-case, т.е. обычное условие от switch-case, если бдут аткие url, то вернуть то то)
            basePath = createPath('index');
            res.statusCode = 200; // возвращает браузеру (будет виден в заголовках network) http-код удачной передачи данных. Хотя, в браузер то-то возращается, то автоматически присваивается код (2**) удачной передачи данных
            break;
        // case на редирект, к примеру url исменился, был /about-us, стал /contacts
        case '/about-us':
            res.statusCode = 301; // код, который сообщает браузеру, что редирект контрлируемый - хотя без него редирект работает
            res.setHeader('Location', '/contacts'); // сообщили браузеру об редиректе (редирект с помощью методов браузера)
            res.end();
            break;
        case '/contacts':
            basePath = createPath('contacts');
            res.statusCode = 200;
            break;
        default:
            basePath = createPath('error');
            res.statusCode = 404; // код ответа HTTP о том, что клиент был в состоянии общаться с сервером, но сервер не может найти данные согласно запросу.
            break;
    }
       
    // чтение-запись
    fs.readFile(basePath, (error, data) => {
        if(error) {
            console.log(error);
            res.statusCode = 500; // ошибка на стороне сервера
            res.end(); // обязательное завершение ответа, в любом случае
        } 
        else {
            res.write(data);
            res.end(); // обязательное завершение ответа, в любом случае
        }
    })

})

// назначение порта для прослушивания запросов
server.listen(PORT, 'localhost', (error) => {
    error ? console.log(error) : console.log(`Listening port ${PORT}`); 
});