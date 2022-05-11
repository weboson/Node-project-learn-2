// Источник видео канала "Node.js #12 Подключение шаблонизатора (View Engine)": https://youtu.be/OO1W6eSdMqg?list=PLNkWIWHIRwMFtsaJ4b_wwkJDHKJeuAkP0
// В данном уроке используется шаблонизатор EJS, и с помощью него передаются данные, которые формируются на сервере (main-app.js) и передаются через ejs на сайт.
//? Шаблонизатор - это типа, пакет, позволяет сначал разбирать на модули, а потом их можно подкючать ко всем станицам. через:
//? <%- include('./partials/nav.ejs') %>. Как в PHP. Также можно объявлять прямо в верстке пременные, и там же их показывать, и еще эти пременные можно объявлять на Express-сервере. В общшем, ничего сложно, оф. сайта: https://ejs.co/#docs 

//! Создание сервера средствами фрейворка EXPRESS.js И шаблонизатора EJS + ДИНАМИЧЕСКАЯ генерация данных (переменные на сервере передаются через ejs на сайт) - файл: main-app.js
// 1) Создание сервера средствами фрейворка EXPRESS.js - файл: express-app.js
// 2) Реализация сервера НАТИВНЫМИ средствами Nodejs (без фрейворков), со СТАТИЧЕСКОЙ передачей данный (html-страницы) - файл: static-app.js



const express = require('express');
const path = require('path');
const app = express()

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

// старница одного поста
// реализовано через :id поста
app.get('/posts/:id', (req, res) => { 
    const title = "Post";
    res.render(createPath('post'), {title}); 
});

// старница списка постов
app.get('/posts', (req, res) => { 
    const title = "Posts";
    res.render(createPath('posts'), {title}); 
 
});

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