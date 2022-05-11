// Источник видео канала "webDev" "Node.js #9 Создание базового роутинга (Create Base Routing)": https://youtu.be/f7nejJv0fzc?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0


//! Реализация сервера НАТИВНЫМИ средствами Nodejs (без фрейворков), со СТАТИЧЕСКОЙ передачей данных (данные прям в html-страницах, а не в БД),
// 1) Создание сервера средствами фрейворка EXPRESS.js - файл: express-app.js
// 2) Создание сервера средствами фрейворка EXPRESS.js И шаблонизатора EJS + ДИНАМИЧЕСКАЯ генерация страниц из БД MongoDB - файл: main-app.js



// Начало создания приложения
const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

// создание сервера
const server = http.createServer((req, res) => {
    console.log('Server request');
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