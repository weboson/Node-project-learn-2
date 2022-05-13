// Источник видео канала "Node.js #12 Подключение шаблонизатора (View Engine)": https://youtu.be/OO1W6eSdMqg?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0
// В данном уроке используется шаблонизатор EJS, и с помощью него передаются данные, которые формируются на сервере (main-app.js) и передаются через ejs на сайт.
//? Шаблонизатор - это типа, пакет, позволяет сначал разбирать на модули, а потом их можно подкючать ко всем станицам. через:
//? <%- include('./partials/nav.ejs') %>. Как в PHP. Также можно объявлять прямо в верстке пременные, и там же их показывать, и еще эти пременные можно объявлять на Express-сервере. В общшем, ничего сложно, оф. сайта: https://ejs.co/#docs 

//! Создание сервера средствами фрейворка EXPRESS.js И шаблонизатора EJS + ДИНАМИЧЕСКАЯ генерация данных (переменные на сервере передаются через ejs на сайт) - файл: main-app.js
// 1) Создание сервера средствами фрейворка EXPRESS.js - файл: express-app.js
// 2) Реализация сервера НАТИВНЫМИ средствами Nodejs (без фрейворков), со СТАТИЧЕСКОЙ передачей данный (html-страницы) - файл: static-app.js



const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan'); // Middleware (13-й урок: https://youtu.be/9nQw4iwZGNU?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0)

//! шаблононизатор EJS имеет свой синтаксис (интерполяцию строк), кратко он представлен в папке "ejs-views". 
//! Пример синтаксиса: чтобы (чем то похоже на PHP): 
//! 1) <% title %> (вывод данных), 
//! 2) <%- include('./partials/nav.ejs') %> - подключение файловых модулей.

//! Т.е. чтобы HTML стал динамичным, нужно в HTML-коде страниц внести изменнения.
//? Официальная страница EJS: https://ejs.co/#docs

//! подключение шаблононизатора EJS в качестве фронт-движка (view engine) в специальный Express.js метод. Подробнее: http://expressjs.com/en/5x/api.html#app.set
//* app.set(name, value) 
app.set('view engine', 'ejs'); //? как видно, require() не нужен. Подключение через Express- метод 
// const fs = require('fs');

const PORT = 3000;

//! Далее интегрируем папку 'ejs'
// В метод для построения путей внесем пару изменений: папку 'ejs-views', и расширение .ejs
const createPath = (page) =>  { return path.resolve(__dirname, 'ejs-views', `${page}.ejs`)};

// слушатель
app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`Listening port ${PORT}`); 
});

//! Из Урока №13 "Node.js #13 Промежуточное ПО (Middleware)": https://youtu.be/9nQw4iwZGNU?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0
//! Middlewares всегда должны быть ПОСЛЕ создания сервера, прослушивателя и ДО ответа (render, send, sendFile, write)
// Пример промеждуточной функции (Middleware):
// app.use([path,] callback [, callback...]) - Монтирует указанную функцию или функции промежуточного программного обеспечения по указанному пути: функция промежуточного программного обеспечения выполняется, когда база запрошенного пути совпадает с путем.
// Подробнее: http://expressjs.com/en/5x/api.html#app.use
app.use((req, res, next) => { // 3 аргумента 
    console.log(`path: ${req.path}`);  // пример- path: /contacts
    console.log(`method: ${req.method}`);  // пример- method: GET
    next(); // чтобы вернуть контроль серверу, похоже это типа нативного res.end() 
});
// // еще один Middleware
// app.use((req, res, next) => {
//     console.log('Just for test');
//     next(); // и конечно обязательно в конце 
// });

//? Nodejs - в целях безопасности, не позволяет клиенту просто так подключится к файлам (данным) на сервере. 
// Наш пример: нельзя просто так, из шаблона подключится к файлу стилей, так не получится: <link rel="stylesheet" href="/main.css">
// Нужно разрешить подключатся к данной папке со стилями. 
// Для этого также используется промежуточное ПО Middleware
// express.static(root, [options]) - Это встроенная промежуточная функция в Express. 
// Он обслуживает статические файлы и основан на serve-static. Подробнее: http://expressjs.com/en/5x/api.html#express.static
// Аргумент root указывает корневой каталог, из которого следует обслуживать статические ресурсы.
app.use(express.static('styles'));


//? Также пользуются готовыми промежутоными ПО (Middleware) (npm-пакетами). Список представлен: http://expressjs.com/en/resources/middleware/morgan.html
//? Также нужно их устанавливать в проект: "npm install morgan"
// и далее используется
app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); // будет в консоли появлятяс информация: ms, status etc

//! (Из урока №14 - 6:04): 
// Отрывок из "https://learn.javascript.ru/xhr-forms": "Основной способ кодировки запросов – это urlencoded, то есть – стандартное кодирование URL."
// Чтобы спарсить POST-запрос, то есть, прочитать запрос с сайта (клиента), нам нужно эти ВХОДНЫЕ ДАННЫЕ РАСКОДИРОВАТЬ с URL-кодированного состояние. 
// Википедия про URL: https://ru.wikipedia.org/wiki/URL 
// Как я понял (нагуглил: https://learn.javascript.ru/xhr-forms), POST - запросы могут передоваться в разных кодировках, один из частых это URL-кодинг.
//? Пример url-закодированного post-запроса: "add-post?title=3&author=4&text=5"
//? Например, пробел заменяется на %20, символ / на %2F, русские буквы кодируются двумя байтами в UTF-8, поэтому, к примеру, Ц заменится на %D0%A6. Из статьи: https://learn.javascript.ru/xhr-forms
// Чтобы РАСКОДИРОВАТЬ URL-ДАННЫЕ нужно использовать встроенный в Express метод: .urlencoded()
//! express.urlencoded([options]) - подробнее: http://expressjs.com/en/5x/api.html#express.urlencoded
// Данный метод также запускает в промежутоном ПО (Middleware). Кстати, раньше использовали для парсинга пакет body-parser
// Определение из фо.сайта: Функция express.urlencoded ()  - это встроенная функция промежуточного программного обеспечения в Express. Он анализирует входящие запросы с полезной нагрузкой с кодировкой urlencoded и основан на парсере тела.
// РАСКОДИРОВКА из URL-кодирования
app.use(express.urlencoded({ extended: false })); // extended: fasle - без расширенного парсинга
// Далее ниже используем метод app.post()


// роутинг на домашнюю страницу
app.get('/', (req, res) => {
//! Важно: если присутствует на старнице какая-либо переменная, то она обязательно должна имется в ОТВЕТЕ (в res.render), иначе ошибка
    const title = "Home"; // сохранили значение в title, которое присутсвует в html-коде страницы
    //! res.render(view [, locals] [, callback]) - Визуализирует представление и отправляет обработанную HTML-строку клиенту. Подробнее: http://expressjs.com/en/5x/api.html#res.render
    res.render(createPath('index'), {title}); // передали переменную title в рендер
});

// старница контактов
app.get('/contacts', (req, res) => { 
    const title = "Contacts";
    // данный массив будет отображен в цикле в шаблоне contacts.ejs 
    const contacts = [
        { name: 'YouTube', link: 'http://youtube.com/YauhenKavalchuk' },
        { name: 'Twitter', link: 'http://github.com/YauhenKavalchuk' },
        { name: 'GitHub', link: 'http://twitter.com/YauhenKavalchuk' },
      ];
    res.render(createPath('contacts'), {contacts, title}); 
 
});


//! Из Урока №14 "Node.js #14 Обработка POST запроса (Handling Post Requests)": https://youtu.be/mxv8ykwaWEw?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0
//! Модернизирую станицу posts/:id - делаю динамичные данные (теперь данные будут хрониться на сервере (не в БД), а не в верстке в шаблоне)
// старница одного поста
// реализовано через :id поста
app.get('/posts/:id', (req, res) => { 
    const title = "Post";
    // добавим данные, которые будем размещать в верстке (post.ejs)
    const post = {
        id: '1',
        text: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.',
        title: 'Post title',
        date: '05.05.2021',
        author: 'Rishat',
    };
    res.render(createPath('post'), {title, post}); // res.render(path, date)
});


//! Модернизирую станицу (урок 14): передаю массив данных (постов) в верстку (posts.ejs)
// старница списка постов
app.get('/posts', (req, res) => { 
    const title = "Posts";
    const posts = [
        {
            id: '1',
            text: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.',
            title: 'Post title',
            date: '05.05.2021',
            author: 'Rishat',
        },
    ]
    res.render(createPath('posts'), {title, posts}); 
 
});


//! (Урок 14) После того, как мы раскодировали url-запрос, то есть после строчки "app.use(express.urlencoded({ extended: false }));", используем метод:
// app.post(path, callback [, callback ...]) - Направляет запросы HTTP POST по указанному пути с указанными функциями обратного вызова. Подробнее: http://expressjs.com/en/5x/api.html#app.post.method
//, вытягиваем данные из /add-post
app.post('/add-post', (req, res) => { // как я понял .post ВЫТЯГИВАЕТ ДАННЫЕ посылаемого из формы url: /add-post и потомы мы уже .render('шаблон для вывода'...)
    //res.send(req.body); // чтобы проверить работоспособнеость кода

    // //! Из оф.сайта: "req.body" - Содержит пары ключ-значение данных, представленных в тексте запроса. 
    // //! По умолчанию он не определен и заполняется, когда вы используете промежуточное ПО для разбора тела, такое как body-parser и multer.
    // //! Подробнее: http://expressjs.com/en/5x/api.html#req.body
    // Деструктуризация req.body (вытянутых данных)
    // В POST-запросе содержатся данные из формы (У КОТОРОГО ОБЯЗАТЕЛЬНО ДОЛЖЕН БЫТЬ method="post" - без него не сработает): name="title", name="author", name="text"
    const { title, author, text } = req.body; // 
    // присвоем эти данные в константу post
    const post = {
        // добавим еще данные
        id: new Date(), // не понял зачем: 8:10: https://youtu.be/mxv8ykwaWEw?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0&t=492
        date: (new Date()).toLocaleDateString(), // чтобы дата отображалась в нужном формате

        // переменные из формы (name="...")
        title,
        author,
        text,
    };
    
    // отрисуем это в шаблоне post.ejs
    res.render(createPath('post'), { post, title}); // post и title для заголовка старницы
})

// старница добавления поста
app.get('/add-post', (req, res) => { 
    const title = "Add-post";
    res.render(createPath('add-post'), {title}); 
});

// редирект
app.get('/about-us', (req, res) => {
    // res.redirect([status,] path) - метод редиректа
    // Перенаправляет на URL-адрес, полученный из указанного пути, с указанным статусом, положительным целым числом, соответствующим коду статуса HTTP. Если не указано, статус по умолчанию «302 «Найдено». Подробнее на оф.сайте: http://expressjs.com/en/api.html#res.redirect
    res.redirect('/contacts'); // аргумент URL-адрес
});

// ошибка
app.use((req, res) => { 

    // для ejs
    const title = "Error-page";
    // есть два варианта передачи кода (в данном случае ошибки)
    // 1) стандартный от NOdejs
    // res.statusCode = 404;
    // 2) и имеющийся у Express
    
    // ниже удобный синтаксис цепочка, как у JS-прописов promise().then().catch().finaly
    res
    .status(404)
    .render(createPath('error'), {title}); 
});