// Источник видео канала "webDev" "Node.js #8 Создание сервера (Create Server)": https://youtu.be/zH4T7AiMWqY?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0

// это просто пример, для разбора, как работает сервер на Nodejs

//! http - для взимодействия клиент-сервер, с потоковой передачей данных,
//! также сервер используется в файле:
//! 1) static-app.js (статическая передача html-старниц) и 
//! 2) main-app.js - с генерация страниц (с EXPRESS-ejs, который позволяет, динамическую передау данных на сайт)




//? В node-ДОКУМЕНТАЦИИ ПРИМЕРЫ ПОСЛОЖНЕЕ, там есть методы:  http.request(options), server.on() и т.д
//? ---Чтобы искать в документации, нужно писать сначало точку, а потмо слово, например: ".setHeader"

// модуль http для взимодействия клиент-сервер, с потоковой передачей данных: https://nodejs.org/dist/latest-v18.x/docs/api/http.html
const http = require('http');


//!модификация: добавил константу PORT, чтобы постоянно не писать (кстати. я уже проходи метод создания глобального объекта в поле process.env)
const PORT = 3000;
// http.createServer - для создания сервера
// 1-й аргумент: колбэк, вызывается каждый раз, когда к серверу идет запрос (идет обращение)
// в самом колбэке аргументы: 
                            // 1-й: объект запроса (например: url-адрес приходящий в запросе) 
                            // 2-й: и объект ответа (который мы будем формировать и отправлять в браузер (клиенту))
const server = http.createServer(
    (req, res) => { // req - объект запроса, res - объект ответа
// когда будет запрос от клиента (открытие url-адреса:порт в браузере), появится у нас в терминале строка 
        console.log('Server request'); 

        //-- посмотрел для себя:
        // console.log(req); // очень много свойств
        // console.log(res); // очень много свойств
        console.log(`req.url:${req.url} и req.method:${req.method}`); // получил:  req.url: / и req.method: GET

//!модификация: теперь что-нибудь передадим (ОТВЕТИМ) на ЗАПРОС

//!res.setHeader();
        // res.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']); - передает в ответе сопутствующую информацию, которая помогает браузер понять тип контента (смотреть: обновить страницу в реждиме разраба, во вкладке Network) . Что первый, что второй аргумент, можно брать в режиме разраба. Но я пробовал только: 
        // 1-й арг: Желательно 'Set-Cookie' или 'Content-Type', а так хоть что, только в латинице;
        // 2-й арг: Что угодно, и конечно только в латинице
        // например:
        // res.setHeader('Content-Type2222', 'any types'); // в режиме разраба: Content-Type2222: any types

        // Нашел на запрос "content-type какие бывают", что эти данные все же имеют свои требования:
        // Основные подтипы:
        //     Content-Type: text/html - html текст
        //     Content-Type: text/plain - простой текст
        //     Content-Type: text/x-server-parsed-html - файл созданный с помощью SSI
        //     Content-Type: text/css - файл содержащий стили - css
        //? Подробнее в таблице про HTTP -загловки: http://espressocode.top/http-headers-content-type/
        //? Подробнее про методы в документации: https://nodejs.org/dist/latest-v18.x/docs/api/http.html#requestsetheadername-value
        //! .setHeader() работает ДО res.write(), иначе ошибка

        //? 1 - вариант, где контент простой текст
        //res.setHeader('Content-Type', 'text/plain');
//!res.write();
//! req.write() -  Записывает данные в тело ответа (а req.write() - в тело запроса - в документации подробнее: https://nodejs.org/dist/latest-v18.x/docs/api/http.html#requestwritechunk-encoding-callback)
        //res.write('Hello,\n Risht \n Russian words dont write!!!', 'utf8'); // res.write() - можно использовать несколько раз, и можно считать основным методом в ответе, но также нужно отправлять вспомогательную информацию, с помощью метода res.setHeader().

        //? 2 - варинат, где контент уже HTML
        //res.setHeader('Content-Type', 'text/html ') // Content-Type: text/html
        //res.write('<h1>Hello,\n Risht!!! \n Russian words dont write. </h1>'); // И строка стала интерпретироваться как HTML - разметка
        //res.write('<p>just a paragraph</p>');
        //? Мы даже можем добавить тег <head> с подключением стилей (Пример: сервер отвечает изменением стилей + новая сраница)
        //res.write('<head><link rel="stylesheet" href="#"></head>'); // появился данный тег (и инфа в network), но он в конце. т.е. ПОРЯДКО РАЗМЕЩЕНИЯ СОХРАНЯЕТСЯ. Поэтому нужно данный тег писать в начале (выше)
        //? 3 - варинат, как CSS - стили
        //  res.setHeader('Content-Type', 'text/css');
        //  res.write('color: red') // тупо текст 'color: red'
        
        //? 4 - варинат, как JSON-данные
        //res.setHeader('Content-Type', 'application/json');
    
        // const data = JSON.stringify([
        //     {name: "Rishat", age: 36},
        //     {name: "Tonny", age: 46}
        // ])       
        //? 4.1 автор передает json через метод .end, хотя через .write тоже передается
        //res.write(data);
        //res.end(data);


       //? 5 редирект  - протестил кусочек кода из урока № 9 (app.js)
       if (req.url == '/1') {
           console.log('111111111111111111111111111111111111111111');
            res.setHeader('Location', '/contacts2'); // реально редирект происходит (спойлер: то работае, то нет, но в network присутствует = Location: /contacts2), 
            // но после не смогу избавить от неё, даже выкл сервер + alt +f5, все время редирект с localhost... открыл инкогнито
            // хотя возможно браузер при обвлении возвращает на прошлую старницу, а она была /contacts2. Но ведь, в header-ах был location: contacts2, короче фиг знает
            res.end();
            res.statusCode = 301; // код, который сообщает браузеру, что редирект контрлируемый - хотя без него редирект работает
            res.setHeader('Location', '/contacts'); // сообщили браузеру об редиректе
            res.end();

       }
        
       res.end();
        

        // req.end() - завершает ответ (можно передавать данный, например json ), и передает управление браузеру(клиенту), если не закончить ответ, страница будет постоянно грузиться
        //? request.end([data[, encoding]][, callback]) - 
        //? ПОДРОБНЕЕ: https://nodejs.org/dist/latest-v18.x/docs/api/http.html#requestenddata-encoding-callback
        //res.end(); // ОБЯЗАТЕЛЬНО В КОНЦЕ
    }
);

// Укажем порт (канал), который сервер будет СЛУШАТЬ (запросы) и в дальнейшем реагировать (отвечать)
//1-аргумент: обычно указывается порт 3000 (в документации 1337)
//2-аргумент: имя хоста, обычно имя 'localhost' хранится по-умолчанию
//3-аргумент: имя хоста, обычно имя 'localhost' хранится по-умолчанию
server.listen(PORT, 'localhost', (error) => {
// если удачно откроется порт 3000, появится соответствующая строка, если нет то error
    error ? console.log(error) : console.log(`Listening port ${PORT}`); 
});

// ИТОГО:
// запускаю app: node http
// появляется в термнале строка: 'Listening port 3000'
// открываю в браузере url-адрес: http://localhost:3000/ или http://127.0.0.1:3000/- который пока постоянно загружается (?до модификации), ведь мы (сервер) еще не отвечаем ему
// также появляется в терминале строка: 'Server request'