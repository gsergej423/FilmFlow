/*
  Учебные данные (прототип). Файлы видео НЕ включены.
  Положи свои mp4 в соответствующие папки и пропиши src.
*/

/*
  Генератор сезонов сериала «Симпсоны».
  Количество серий в каждом сезоне соответствует реальному.
*/
function makeSimpsonsSeasons() {
    var counts = [
        13, 22, 24, 22, 22, 25, 25, 25, 25, 23,
        22, 21, 22, 22, 22, 21, 22, 22, 20, 21,
        23, 22, 22, 22, 22, 22, 22, 22, 21, 23,
        22, 22, 22, 22, 18
    ];
    return counts.map(function (count, idx) {
        var seasonNum = idx + 1;
        var seasonStr = String(seasonNum).padStart(2, "0");
        return {
            season: seasonNum,
            episodes: Array.from({ length: count }, function (_, i) {
                var epNum = i + 1;
                var epStr = String(epNum).padStart(2, "0");
                var fileName = "S" + seasonStr + "E" + epStr + ".mp4";
                return {
                    ep: epNum,
                    title: "Серия " + epNum,
                    duration: 22,
                    src: "media/Симпсоны/S" + seasonStr + "/" + fileName
                };
            })
        };
    });
}

/*
  Генератор каналов категории «Кино и сериалы».
  Данные с сайта Кинопоиск (hd.kinopoisk.ru).
  Логотипы нужно положить в media/logos/ с именами из поля logo.
*/
function makeCinemaChannels() {
    var list = [
        { name: "К1",                    logo: "k1.png",                 current: "Заступники",                       type: "Сериал" },
        { name: "Кинохит",               logo: "kinohit.png",            current: "Ловкие руки",                      type: "Фильм" },
        { name: "Кинопремьера",          logo: "kinopremiera.png",       current: "Кровь на границе",                 type: "Фильм" },
        { name: "Киносемья",             logo: "kinosemya.png",          current: "Валериан и город тысячи планет",   type: "Фильм" },
        { name: "Киновидение",           logo: "kinovidenie.png",        current: "Тайная любовь Казановы",           type: "Фильм" },
        { name: "Мужское кино",          logo: "muzhskoe_kino.png",      current: "Засада",                           type: "Фильм" },
        { name: "КИНО ТВ",               logo: "kino_tv.png",            current: "Охранник",                         type: "Фильм" },
        { name: "Киномикс",              logo: "kinomix.png",            current: "Вне досягаемости",                 type: "Фильм" },
        { name: "Кинокомедия HD",        logo: "kinokomediya_hd.png",    current: "Джуманджи: Переполох в Раю",       type: "Фильм" },
        { name: "Киноужас",              logo: "kinoujas.png",           current: "Логово",                           type: "Фильм" },
        { name: "Дом кино",              logo: "dom_kino.png",           current: "Убойная сила",                     type: "Сериал" },
        { name: "Дом кино Премиум",      logo: "dom_kino_premium.png",   current: "Мажор 2",                          type: "Сериал" },
        { name: "Победа",                logo: "pobeda.png",             current: "В бой идут одни \"старики\"",      type: "Фильм" },
        { name: "Время",                 logo: "vremya.png",             current: "Агент национальной безопасности",  type: "Сериал" },
        { name: "START Air",             logo: "start_air.png",          current: "Олень",                            type: "Фильм" },
        { name: "START World",           logo: "start_world.png",        current: "Далёкий город",                    type: "Сериал" },
        { name: "НСТ",                   logo: "nst.png",                current: "Кровь",                            type: "Фильм" },
        { name: "Синема",                logo: "sinema.png",             current: "Крокодил Данди",                   type: "Фильм" },
        { name: "Мосфильм. Золотая коллекция", logo: "mosfilm.png",      current: "Дамы приглашают кавалеров",        type: "Фильм" },
        { name: "FAN",                   logo: "fan.png",                current: "Сердце пармы",                     type: "Фильм" },
        { name: "Наше новое кино",       logo: "nashe_novoe_kino.png",   current: "Экипаж",                           type: "Фильм" },
        { name: "Amedia Premium",        logo: "amedia_premium.png",     current: "Молодой Папа",                     type: "Сериал" },
        { name: "КИНОСЕРИЯ",             logo: "kinoseriya.png",         current: "Каменская",                       type: "Сериал" },
        { name: "Русский роман",         logo: "russkiy_roman.png",      current: "Не обмани",                        type: "Фильм" },
        { name: "Роман",                 logo: "roman.png",              current: "Утраченные воспоминания",          type: "Сериал" },
        { name: "Сталь",                 logo: "stal.png",               current: "Ищейка-4",                         type: "Сериал" },
        { name: ".black",                logo: "black.png",              current: "Чисто английские убийства",        type: "Сериал" },
        { name: ".red",                  logo: "red.png",                current: "Доктор Эль",                       type: "Сериал" },
        { name: ".sci-fi",               logo: "scifi.png",              current: "Необычайные приключения Адель",    type: "Фильм" },
        { name: "Русский детектив",      logo: "russkiy_detektiv.png",   current: "Улицы разбитых фонарей 15",        type: "Сериал" },
        { name: "РОДНОЕ КИНО",           logo: "rodnoe_kino.png",        current: "Крот",                             type: "Сериал" },
        { name: "Русский бестселлер",    logo: "russkiy_bestseller.png", current: "Склифосовский",                    type: "Сериал" },
        { name: "Индийское Кино",        logo: "indiyskoe_kino.png",     current: "Жил-был Тигр",                     type: "Фильм" },
        { name: "Plan B",                logo: "plan_b.png",             current: "Обитель проклятых",                type: "Фильм" },
        { name: "Индия",                 logo: "india.png",              current: "Игра судьбы",                      type: "Сериал" },
        { name: "Комедия",               logo: "komediya.png",           current: "От кутюр",                         type: "Фильм" },
        { name: "Хит",                   logo: "hit.png",                current: "Дикий",                            type: "Сериал" },
        { name: "НТВ Сериал",            logo: "ntv_serial.png",         current: "Кодекс чести-6",                   type: "Сериал" },
        { name: "День Победы",           logo: "den_pobedy.png",         current: "Смерть шпионам!",                  type: "Сериал" },
        { name: "Кинопоказ",             logo: "kinopokaz.png",          current: "Зорро",                            type: "Фильм" },
        { name: "SHOT TV",               logo: "shot_tv.png",            current: "Я могла бы быть путаной",          type: "Фильм" },
        { name: "НТВ Хит",               logo: "ntv_hit.png",            current: "Дельта",                           type: "Сериал" },
        { name: "Amedia Hit",            logo: "amedia_hit.png",         current: "Декстер",                          type: "Сериал" },
        { name: "Amedia 2",              logo: "amedia_2.png",           current: "Однажды в Верасе",                 type: "Фильм" },
        { name: "CTC Love",              logo: "ctc_love.png",           current: "Отель Элеон",                      type: "Сериал" },
        { name: "Наш Кинопоказ",         logo: "nash_kinopokaz.png",     current: "Приключения экспоната",            type: "Фильм" },
        { name: "КИНЕКО",                logo: "kineko.png",             current: "Вернуться в 1988",                 type: "Сериал" },
        { name: "Vesna",                 logo: "vesna.png",              current: "Любить каждую минуту",             type: "Фильм" },
        { name: "Наше Мужское",          logo: "nashe_muzhskoe.png",     current: "Морской патруль",                  type: "Сериал" },
        { name: "Amedia 1",              logo: "amedia_1.png",           current: "Ходячие мертвецы: Мертвый город",  type: "Сериал" },
        { name: "Камеди",                logo: "kamedi.png",             current: "Амазонский стрелок",               type: "Фильм" },
        { name: "Блокбастер",            logo: "blokbaster.png",         current: "Брешь",                            type: "Фильм" },
        { name: "Дорама",                logo: "dorama.png",             current: "Дневник психопата",                type: "Сериал" },
        { name: "САПФИР",                logo: "sapfir.png",             current: "Это море переполнится",            type: "Сериал" },
        { name: "9-1-1",                 logo: "9_1_1.png",              current: "Алекс Гого",                       type: "Сериал" },
        { name: "ТВ 21",                 logo: "tv_21.png",              current: "Duhless-2",                        type: "Фильм" },
        { name: "Патриот",               logo: "patriot.png",            current: "Мужские тревоги",                  type: "Фильм" },
        { name: "Русский Иллюзион",      logo: "russkiy_illyuzion.png",  current: "О чем молчат французы",            type: "Фильм" },
        { name: "Иллюзион+",             logo: "illyuzion_plus.png",     current: "Дивергент, глава 3: За стеной",    type: "Фильм" },
        { name: "Еврокино",              logo: "evrokino.png",           current: "Ожидание",                         type: "Фильм" },
        { name: "СМОТРИМ 100% ЛЮБОВЬ",   logo: "smotrim_lyubov.png",     current: "Счастье можно дарить",             type: "Фильм" },
        { name: "СМОТРИМ 100% МУЖСКОЕ",  logo: "smotrim_muzhskoe.png",   current: "Тайны следствия",                  type: "Сериал" },
        { name: "СМОТРИМ 100% КЛАССИКА", logo: "smotrim_klassika.png",   current: "Месяц длинных дней",               type: "Фильм" },
        { name: "KinoJam 3",             logo: "kinojam_3.png",          current: "Братушка",                         type: "Фильм" },
        { name: "Москва Доверие",        logo: "moskva_doverie.png",     current: "Чёрный треугольник",               type: "Фильм" },
        { name: "Отчизна",               logo: "otchizna.png",           current: "Ночные ласточки",                  type: "Сериал" },
        { name: "Мечта",                 logo: "mechta.png",             current: "За всё тебя благодарю-3",          type: "Сериал" },
        { name: "Феникс+Кино",           logo: "feniks_kino.png",        current: "Чудес не бывает",                  type: "Фильм" },
        { name: "Мир сериала",           logo: "mir_seriala.png",        current: "Янычар",                           type: "Сериал" },
        { name: "Любимое кино",          logo: "lubimoe_kino.png",       current: "Анатомия падения",                 type: "Фильм" },
        { name: "Наше наследие",         logo: "nashe_nasledie.png",     current: "Моя любовь",                       type: "Фильм" },
        { name: "Живой",                 logo: "zhivoy.png",             current: "Программа передач уточняется",     type: "Фильм" }
    ];

    return list.map(function (item, i) {
        return {
            id: "ch" + (20 + i),
            name: item.name,
            category: "cinema",
            logo: "media/logos/" + item.logo,
            schedule: [
                { time: "06:00", title: "Утренний эфир" },
                { time: "12:00", title: item.current + " (" + item.type + ")" },
                { time: "18:00", title: "Вечерний показ" },
                { time: "22:00", title: item.current + " (" + item.type + ")" }
            ],
            archive: []
        };
    });
}

window.FILMFLOW_DB = [
    {
        id: "m01", type: "movie",
        title: "Солнечный архив", year: 2025, duration: 119, rating: 8.4,
        country: "США", age: "12+",
        genres: ["Фантастика", "Детектив"],
        pop: 95,
        desc: "Архивариус находит записи, которые не должны существовать. Каждая запись — ключ к загадке."
    },
    {
        id: "m02", type: "movie",
        title: "Холоп", year: 2019, duration: 109, rating: 7.1,
        country: "Россия", age: "16+",
        genres: ["Комедия", "Фэнтези"],
        pop: 95,
        desc: "Молодой московский мажор Гриша, привыкший к роскоши и вседозволенности, после очередной выходки попадает в аварию и приходит в себя... в 1860 году, в роли крепостного конюха. Так начинается его путь к перевоспитанию.",
        poster: "media/posters/holop1.jpg"
    },
    {
        id: "m02b", type: "movie",
        title: "Холоп 2", year: 2024, duration: 118, rating: 6.9,
        country: "Россия", age: "16+",
        genres: ["Комедия", "Фэнтези"],
        pop: 96,
        desc: "Катя — избалованная дочь богатых родителей, уверенная, что всё в мире покупается. Её отец, вдохновлённый опытом Гриши, решает устроить для неё похожий «спектакль», чтобы преподать дочери урок. Но на этот раз всё идёт не по плану.",
        poster: "media/posters/holop2.jpg"
    },
    {
        id: "m02c", type: "movie",
        title: "Холоп 3", year: 2025, duration: 110, rating: 6.5,
        country: "Россия", age: "16+",
        genres: ["Комедия", "Фэнтези"],
        pop: 90,
        desc: "Продолжение популярной комедийной франшизы. Гриша и его команда снова берутся за перевоспитание очередного «холопа» — и попадают в новые невероятные приключения.",
        poster: "media/posters/holop3.jpg"
    },
    {
        id: "m03", type: "movie",
        title: "Чумовая пятница", year: 2003, duration: 97, rating: 7.0,
        country: "США", age: "6+",
        genres: ["Комедия", "Семейный", "Фэнтези"],
        pop: 88,
        desc: "Мать и дочь-подросток, которые никак не могут найти общий язык, в один прекрасный день меняются телами. Теперь им приходится жить жизнью друг друга и учиться понимать друг друга изнутри.",
        poster: "media/posters/freaky_friday.jpg"
    },
    {
        id: "m04", type: "movie",
        title: "Грань света", year: 2023, duration: 113, rating: 7.9,
        country: "Южная Корея", age: "16+",
        genres: ["Драма", "Триллер"],
        pop: 84,
        desc: "Фотограф замечает на снимках то, чего не видел в жизни. Это приводит к опасной правде."
    },
    {
        id: "m05", type: "movie",
        title: "Алёша Попович и Тугарин Змей", year: 2004, duration: 79, rating: 7.4,
        country: "Россия", age: "6+",
        genres: ["Анимация", "Комедия", "Приключения"],
        pop: 90,
        desc: "Мультфильм про богатыря Алёшу Поповича, который отправляется в путь и сталкивается с Тугариным Змеем.",
        poster: "media/posters/317597.jpg",
        src: "media/Алеша Попович и Тугарин Змей_1080p.mp4"
    },
    {
        id: "s01", type: "series",
        title: "Код рек", year: 2024, rating: 8.1,
        country: "Норвегия", age: "12+",
        genres: ["Приключения", "Детектив"],
        pop: 90,
        desc: "Сериал о поиске древних знаков у северных рек. Каждая серия приближает к разгадке.",
        seasons: [
            {
                season: 1,
                episodes: [
                    { ep: 1, title: "Знак на камне", duration: 42 },
                    { ep: 2, title: "Тропа к устью", duration: 45 },
                    { ep: 3, title: "Ложная карта", duration: 44 }
                ]
            },
            {
                season: 2,
                episodes: [
                    { ep: 1, title: "Северный ключ", duration: 46 },
                    { ep: 2, title: "Голос воды", duration: 43 }
                ]
            }
        ]
    },
    {
        id: "s02", type: "series",
        title: "Город на воде", year: 2023, rating: 7.6,
        country: "Япония", age: "6+",
        genres: ["Анимация", "Семейный"],
        pop: 78,
        desc: "Тёплый сериал о городке на плавучих платформах и тайне, которую раскрывают друзья.",
        seasons: [
            {
                season: 1,
                episodes: [
                    { ep: 1, title: "Платформа №7", duration: 24 },
                    { ep: 2, title: "Старая пристань", duration: 23 },
                    { ep: 3, title: "Письмо в бутылке", duration: 25 }
                ]
            }
        ]
    },
    {
        id: "s03", type: "series",
        title: "Проспект Бразилии", year: 2012, rating: 8.7,
        country: "Бразилия", age: "16+",
        genres: ["Драма", "Мелодрама", "Криминал"],
        pop: 99,
        desc: "История девушки, которая ищет справедливость и хочет отомстить мачехе, разрушившей её семью. Одна из самых популярных бразильских теленовелл.",
        poster: "media/posters/673465.jpg",
        seasons: [
            {
                season: 1,
                episodes: Array.from({ length: 160 }, function (_, i) {
                    var epNumber = i + 1;
                    var fileName = "".concat(String(epNumber).padStart(3, '0'), ".mp4");
                    return {
                        ep: epNumber,
                        title: fileName,
                        duration: 50,
                        src: "media/\u041F\u0440\u043E\u0441\u043F\u0435\u043A\u0442 \u0411\u0440\u0430\u0437\u0438\u043B\u0438\u0438(Avenida Brasil)/".concat(fileName)
                    };
                })
            }
        ]
    },
    {
        id: "s04",
        type: "series",
        title: "Дикий ангел (Muñeca Brava)",
        year: 1998,
        rating: 8.5,
        country: "Аргентина",
        age: "16+",
        genres: ["Драма", "Мелодрама"],
        pop: 98,
        desc: "История девушки-служанки Милагрос, которая влюбляется в богатого наследника Иво. Их любовь преодолевает социальные барьеры и интриги.",
        poster: "media/posters/i.webp",
        seasons: [
            {
                season: 1,
                episodes: Array.from({ length: 270 }, function (_, i) {
                    var epNumber = i + 1;
                    var fileName = "".concat(String(epNumber).padStart(3, '0'), ".mp4");
                    return {
                        ep: epNumber,
                        title: "\u0421\u0435\u0440\u0438\u044F ".concat(epNumber),
                        duration: 45,
                        src: "media/\u0414\u0438\u043A\u0438\u0439 \u0430\u043D\u0433\u0435\u043B(Mu\u00F1eca Brava)/".concat(fileName)
                    };
                })
            }
        ]
    },
    // ========== СИМПСОНЫ ==========
    {
        id: "simpsons",
        type: "series",
        title: "Симпсоны",
        year: 1989,
        rating: 8.7,
        country: "США",
        age: "16+",
        genres: ["Анимация", "Комедия", "Сатира"],
        pop: 100,
        desc: "Легендарный анимационный сериал о семье Симпсонов из города Спрингфилд. Гомер, Мардж, Барт, Лиза и Мэгги попадают в самые невероятные истории, а сериал вот уже более 35 лет высмеивает современное общество, политику и поп-культуру.",
        poster: "media/posters/simpsons.jpg",
        seasons: makeSimpsonsSeasons()
    },
    // ========== ФИЛЬМЫ О ГАРРИ ПОТТЕРЕ (для раздела "Магия") ==========
    {
        id: "hp1",
        type: "movie",
        title: "Гарри Поттер и философский камень",
        year: 2001,
        duration: 152,
        rating: 8.2,
        country: "Великобритания, США",
        age: "12+",
        genres: ["Фэнтези", "Приключения", "Семейный"],
        pop: 99,
        desc: "Жизнь Гарри Поттера меняется, когда он узнаёт, что он волшебник, и поступает в школу Хогвартс.",
        poster: "media/posters/hp1.jpg",
        src: "Гарри Поттер и философский камень.mp4"
    },
    {
        id: "hp2",
        type: "movie",
        title: "Гарри Поттер и Тайная комната",
        year: 2002,
        duration: 161,
        rating: 8.1,
        country: "Великобритания, США",
        age: "12+",
        genres: ["Фэнтези", "Приключения", "Семейный"],
        pop: 98,
        desc: "Гарри возвращается в Хогвартс и сталкивается с таинственным чудовищем из Тайной комнаты.",
        poster: "media/posters/hp2.jpg",
        src: "Гарри Поттер и Тайная комната.mp4"
    },
    {
        id: "hp3",
        type: "movie",
        title: "Гарри Поттер и узник Азкабана",
        year: 2004,
        duration: 142,
        rating: 8.3,
        country: "Великобритания, США",
        age: "12+",
        genres: ["Фэнтези", "Приключения", "Семейный"],
        pop: 98,
        desc: "Сбежавший из тюрьмы Азкабан Сириус Блэк охотится за Гарри, но правда оказывается сложнее.",
        poster: "media/posters/hp3.jpg",
        src: "Гарри Поттер и узник Азкабана.mp4"
    },
    {
        id: "hp4",
        type: "movie",
        title: "Гарри Поттер и Кубок огня",
        year: 2005,
        duration: 157,
        rating: 8.1,
        country: "Великобритания, США",
        age: "12+",
        genres: ["Фэнтези", "Приключения", "Семейный"],
        pop: 97,
        desc: "Гарри неожиданно становится участником Турнира Трёх Волшебников и сталкивается с возрождением Волан-де-Морта.",
        poster: "media/posters/hp4.jpg",
        src: "Гарри Поттер и Кубок огня.mp4"
    },
    {
        id: "hp5",
        type: "movie",
        title: "Гарри Поттер и Орден Феникса",
        year: 2007,
        duration: 138,
        rating: 7.9,
        country: "Великобритания, США",
        age: "12+",
        genres: ["Фэнтези", "Приключения", "Семейный"],
        pop: 96,
        desc: "Министерство магии отказывается верить в возвращение Тёмного Лорда, и Гарри создаёт Отряд Дамблдора.",
        poster: "media/posters/hp5.jpg",
        src: "Гарри Поттер и Орден Феникса.mp4"
    },
    {
        id: "hp6",
        type: "movie",
        title: "Гарри Поттер и Принц-полукровка",
        year: 2009,
        duration: 153,
        rating: 7.8,
        country: "Великобритания, США",
        age: "12+",
        genres: ["Фэнтези", "Приключения", "Семейный"],
        pop: 96,
        desc: "Гарри узнаёт больше о прошлом Волан-де-Морта и готовится к решающей битве.",
        poster: "media/posters/hp6.jpg",
        src: "Гарри Поттер и Принц-полукровка.mp4"
    },
    {
        id: "hp7p1",
        type: "movie",
        title: "Гарри Поттер и Дары Смерти: Часть 1",
        year: 2010,
        duration: 146,
        rating: 8.0,
        country: "Великобритания, США",
        age: "16+",
        genres: ["Фэнтези", "Приключения", "Драма"],
        pop: 97,
        desc: "Гарри, Рон и Гермиона отправляются на поиски крестражей, чтобы уничтожить Волан-де-Морта.",
        poster: "media/posters/hp7p1.jpg",
        src: "Гарри Поттер и Дары Смерти Часть 1.mp4"
    },
    {
        id: "hp7p2",
        type: "movie",
        title: "Гарри Поттер и Дары Смерти: Часть 2",
        year: 2011,
        duration: 130,
        rating: 8.4,
        country: "Великобритания, США",
        age: "16+",
        genres: ["Фэнтези", "Приключения", "Драма"],
        pop: 99,
        desc: "Финальная битва за Хогвартс. Гарри должен встретиться лицом к лицу с Волан-де-Мортом.",
        poster: "media/posters/hp7p2.jpg",
        src: "Гарри Поттер и Дары Смерти Часть 2.mp4"
    },
    {
        id: "hp20",
        type: "movie",
        title: "Гарри Поттер 20 лет спустя: Возвращение в Хогвартс",
        year: 2022,
        duration: 102,
        rating: 8.5,
        country: "Великобритания, США",
        age: "12+",
        genres: ["Документальный", "Семейный"],
        pop: 95,
        desc: "Актёры и создатели фильмов о Гарри Поттере воссоединяются, чтобы вспомнить съёмки и поделиться историями.",
        poster: "media/posters/hp20.jpg",
        src: "Гарри Поттер 20 лет спустя Возвращение в Хогвартс.mp4"
    }
];

// Телеканалы (российские) с расписанием на сегодня и архивом
window.FILMFLOW_CHANNELS = [
    // ===== Федеральные =====
    {
        id: "ch1", name: "Первый канал", category: "federal",
        logo: "media/logos/ch1.png",
        schedule: [
            { time: "09:00", title: "Новости (с субтитрами)" },
            { time: "09:25", title: "Модный приговор" },
            { time: "10:15", title: "Жить здорово!" },
            { time: "11:00", title: "Время покажет" },
            { time: "12:00", title: "Новости (с субтитрами)" },
            { time: "12:15", title: "Время покажет" },
            { time: "14:00", title: "Большая игра" },
            { time: "15:00", title: "Новости (с субтитрами)" },
            { time: "15:15", title: "Давай поженимся!: 2-я часть — \"Представительница благородной профессии\"" },
            { time: "16:05", title: "Мужское / Женское: Крестная мать" },
            { time: "17:00", title: "Большая игра" },
            { time: "18:00", title: "Вечерние новости (с субтитрами)" },
            { time: "18:30", title: "Время покажет" },
            { time: "19:50", title: "Пусть говорят: Трагедия эмбрионов. Биологический отец против" },
            { time: "21:00", title: "Время" },
            { time: "22:00", title: "Премьера. \"Эль Русо\": 3–4 серии" },
            { time: "23:15", title: "Большая игра" },
            { time: "00:15", title: "Премьера. \"Шоу Вована и Лексуса\"" },
            { time: "01:10", title: "ПОДКАСТ.ЛАБ: \"Летописи конца времен\". Иван Охлобыстин — о Петре Мамонове и русском роке" },
            { time: "01:50", title: "ПОДКАСТ.ЛАБ: \"Космические истории\". Космонавт будущего: кто полетит к другим планетам" }
        ],
        archive: [
            { date: "2026-04-14", time: "21:00", title: "Сегодня вечером (выпуск от 14.04)" },
            { date: "2026-04-14", time: "20:00", title: "Время" },
            { date: "2026-04-14", time: "19:00", title: "Поле чудес (14.04)" }
        ],
        streamIframe: '<iframe width="720" height="405" src="https://rutube.ru/play/embed/c58f502c7bb34a8fcdd976b221fca292" style="border: none;" allow="clipboard-write; autoplay" allowFullScreen></iframe>',
        programUrl: "https://tv.mail.ru/moskva/channel/1/"
    },
    {
        id: "ch2", name: "Россия 1", category: "federal",
        logo: "media/logos/russia1.png",
        schedule: [
            { time: "05:00", title: "Утро России" },
            { time: "09:00", title: "Вести" },
            { time: "09:30", title: "Вести. Местное время" },
            { time: "09:55", title: "О самом главном" },
            { time: "11:00", title: "Вести" },
            { time: "11:30", title: "Вести. Местное время" },
            { time: "12:00", title: "60 минут" },
            { time: "14:00", title: "Вести" },
            { time: "14:30", title: "Кулагины" },
            { time: "15:30", title: "Кулагины" },
            { time: "16:30", title: "Вести" },
            { time: "17:00", title: "Малахов" },
            { time: "18:00", title: "60 минут" },
            { time: "20:00", title: "Вести" },
            { time: "21:10", title: "Вести. Местное время" },
            { time: "21:30", title: "Т/с «Алла-такси»" },
            { time: "23:30", title: "Вечер с Владимиром Соловьёвым" }
        ],
        archive: [
            { date: "2026-04-14", time: "21:30", title: "Т/с «Алла-такси»" }
        ],
        programUrl: "https://tv.mail.ru/penza/channel/733/"
    },
    {
        id: "ch3", name: "Матч ТВ", category: "sports",
        logo: "media/logos/matchtv.png",
        schedule: [
            { time: "06:00", title: "Новости спорта" },
            { time: "07:00", title: "Все на Матч!" },
            { time: "10:00", title: "Футбол. Чемпионат России" },
            { time: "12:00", title: "Специальный репортаж" },
            { time: "13:00", title: "Новости" },
            { time: "14:00", title: "Хоккей. КХЛ" },
            { time: "17:00", title: "Все на Матч!" },
            { time: "19:00", title: "Новости" },
            { time: "20:00", title: "Футбол. Лига чемпионов" },
            { time: "23:00", title: "После футбола" }
        ],
        archive: [],
        streamIframe: '<iframe width="720" height="405" src="https://rutube.sport/play/embed/11bbbec75a2ceb8cf446ad16813c6eec" style="border: none;" allow="clipboard-write; autoplay" allowFullScreen></iframe>',
        programUrl: "https://matchtv.ru/tvguide/matchtv",
        programLabel: "📋 Полная программа на МАТЧ ТВ"
    },
    {
        id: "ch4", name: "НТВ", category: "federal",
        logo: "media/logos/ntv.png",
        schedule: [
            { time: "06:00", title: "Сегодня" },
            { time: "06:30", title: "Утро. Самое лучшее" },
            { time: "09:00", title: "Сегодня" },
            { time: "09:25", title: "ЧП" },
            { time: "10:00", title: "Медицинские тайны" },
            { time: "11:00", title: "Суд присяжных" },
            { time: "13:00", title: "Сегодня" },
            { time: "13:25", title: "Чрезвычайное происшествие" },
            { time: "14:00", title: "Место встречи" },
            { time: "16:00", title: "Сегодня" },
            { time: "16:30", title: "За гранью" },
            { time: "17:30", title: "ДНК" },
            { time: "19:00", title: "Сегодня" },
            { time: "20:00", title: "Т/с «Пёс»" },
            { time: "22:00", title: "Итоги дня" },
            { time: "23:00", title: "Ты не поверишь!" }
        ],
        archive: [
            { date: "2026-04-14", time: "20:00", title: "Т/с «Пёс» (14.04)" }
        ],
        streamIframe: '<iframe src="https://vkvideo.ru/video_ext.php?oid=-28658784&id=456349482&hash=f29a0aef1e853554" width="100%" height="100%" frameborder="0" allowfullscreen="1" style="background-color: #000" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>',
        programUrl: "https://tv.mail.ru/moskva/channel/4/"
    },
    {
        id: "ch5", name: "Пятый канал", category: "federal",
        logo: "media/logos/5tv.png",
        schedule: [
            { time: "05:00", title: "Известия" },
            { time: "05:30", title: "Утро на 5" },
            { time: "09:00", title: "Известия" },
            { time: "09:30", title: "Страна советов" },
            { time: "11:00", title: "День ангела" },
            { time: "13:00", title: "Известия" },
            { time: "13:30", title: "След" },
            { time: "17:00", title: "Известия" },
            { time: "17:30", title: "След" },
            { time: "20:00", title: "Известия" },
            { time: "20:30", title: "След" },
            { time: "23:00", title: "Светская хроника" }
        ],
        archive: []
    },
    {
        id: "ch6", name: "ТВ Центр", category: "federal",
        logo: "media/logos/tvc.png",
        schedule: [
            { time: "06:00", title: "Настроение" },
            { time: "08:00", title: "События" },
            { time: "08:25", title: "Доктор И..." },
            { time: "09:00", title: "Естественный отбор" },
            { time: "10:00", title: "Актёрские драмы" },
            { time: "11:00", title: "События" },
            { time: "11:30", title: "Хроники московского быта" },
            { time: "12:30", title: "Мой герой" },
            { time: "13:30", title: "События" },
            { time: "14:00", title: "Город новостей" },
            { time: "14:30", title: "Осторожно, мошенники!" },
            { time: "15:30", title: "90-е" },
            { time: "16:30", title: "Прощание" },
            { time: "17:30", title: "События" },
            { time: "18:00", title: "Право знать" },
            { time: "20:00", title: "События" },
            { time: "20:45", title: "Петровка, 38" },
            { time: "21:00", title: "Т/с «Мосгаз»" },
            { time: "23:00", title: "События" }
        ],
        archive: []
    },
    {
        id: "ch7", name: "РЕН ТВ", category: "entertainment",
        logo: "media/logos/rentv.png",
        schedule: [
            { time: "05:00", title: "Неизвестная история" },
            { time: "06:00", title: "С бодрым утром!" },
            { time: "08:30", title: "Новости" },
            { time: "09:00", title: "Загадки человечества" },
            { time: "10:00", title: "Как устроен мир" },
            { time: "11:00", title: "Новости" },
            { time: "11:30", title: "Тайны Чапман" },
            { time: "12:30", title: "Самые шокирующие гипотезы" },
            { time: "13:30", title: "Новости" },
            { time: "14:00", title: "Засекреченные списки" },
            { time: "15:00", title: "Невероятно интересные истории" },
            { time: "16:00", title: "Новости" },
            { time: "16:30", title: "Т/с «Солдаты»" },
            { time: "20:00", title: "Новости" },
            { time: "21:00", title: "Т/с «След»" },
            { time: "23:00", title: "Итоговая программа" }
        ],
        archive: []
    },
    {
        id: "ch8", name: "СТС", category: "entertainment",
        logo: "media/logos/sts.png",
        schedule: [
            { time: "06:00", title: "Мультфильмы" },
            { time: "08:00", title: "Воронины" },
            { time: "10:00", title: "Кухня" },
            { time: "12:00", title: "Уральские пельмени" },
            { time: "14:00", title: "Шоу «Уральских пельменей»" },
            { time: "17:00", title: "Ивановы-Ивановы" },
            { time: "19:00", title: "Т/с «СеняФедя»" },
            { time: "21:00", title: "Кино на СТС" },
            { time: "23:00", title: "Уральские пельмени" }
        ],
        archive: []
    },
    {
        id: "ch9",
        name: "ТНТ",
        category: "entertainment",
        logo: "media/logos/tnt.png",
        schedule: [
            { time: "07:00", title: "ТНТ. Best" },
            { time: "09:00", title: "Дом-2" },
            { time: "11:00", title: "Бородина против Бузовой" },
            { time: "13:00", title: "СашаТаня" },
            { time: "15:00", title: "Универ. Новая общага" },
            { time: "18:00", title: "Интерны" },
            { time: "20:00", title: "Комеди Клаб" },
            { time: "21:00", title: "Однажды в России" },
            { time: "23:00", title: "Stand Up" }
        ],
        archive: [],
        streamIframe: '<iframe width="720" height="405" src="https://rutube.ru/play/embed/546602986e6a424d74d594876ddb3f04" style="border: none;" allow="clipboard-write; autoplay" allowFullScreen></iframe>',
        programUrl: "https://tvprogram.tnt-online.ru/",
        programLabel: "Полная программа на tnt-online.ru"
    },
    {
        id: "ch10", name: "Пятница!", category: "entertainment",
        logo: "media/logos/friday.png",
        schedule: [
            { time: "06:00", title: "Пятница News" },
            { time: "07:00", title: "Орёл и решка" },
            { time: "10:00", title: "На ножах" },
            { time: "12:00", title: "Четыре свадьбы" },
            { time: "14:00", title: "Битва шефов" },
            { time: "17:00", title: "Кондитер" },
            { time: "19:00", title: "Пятница News" },
            { time: "20:00", title: "Мир наизнанку" },
            { time: "22:00", title: "Пятница News" },
            { time: "23:00", title: "Инсайдеры" }
        ],
        archive: []
    },
    {
        id: "ch17",
        name: "Ю",
        category: "entertainment",
        logo: "media/logos/u.png",
        schedule: [
            { time: "06:00", title: "Мультфильмы" },
            { time: "07:30", title: "Простоквашино" },
            { time: "08:00", title: "Т/с «Папины дочки»" },
            { time: "10:00", title: "Т/с «Воронины»" },
            { time: "12:00", title: "Т/с «Реальные пацаны»" },
            { time: "14:00", title: "Т/с «Универ»" },
            { time: "16:00", title: "Т/с «Кухня»" },
            { time: "18:00", title: "Т/с «Ивановы-Ивановы»" },
            { time: "20:00", title: "Премьера. Т/с «СеняФедя»" },
            { time: "22:00", title: "Т/с «Физрук»" },
            { time: "00:00", title: "Ночной сериал" },
            { time: "02:00", title: "Музыка на Ю" }
        ],
        archive: [
            { date: "2026-09-15", time: "20:00", title: "Т/с «СеняФедя» (серия 5)" },
            { date: "2026-09-15", time: "22:00", title: "Т/с «Физрук» (серия 12)" },
            { date: "2026-09-14", time: "18:00", title: "Т/с «Ивановы-Ивановы» (серия 8)" }
        ],
        streamIframe: '<iframe width="720" height="405" src="https://rutube.ru/play/embed/5c9327074e25ca86f3111d4085cbbb65" style="border: none;" allow="clipboard-write; autoplay" allowFullScreen></iframe>',
        programUrl: "https://tv.mail.ru/moskva/channel/197/",
        programLabel: "📋 Полная программа на tv.mail.ru"
    },
    {
        id: "ch11", name: "Культура", category: "educational",
        logo: "media/logos/kultura.png",
        schedule: [
            { time: "06:30", title: "Новости культуры" },
            { time: "07:00", title: "Правила жизни" },
            { time: "08:00", title: "Легенды мирового кино" },
            { time: "09:00", title: "Новости культуры" },
            { time: "10:00", title: "Наблюдатель" },
            { time: "11:00", title: "ХХ век" },
            { time: "12:30", title: "Новости культуры" },
            { time: "13:00", title: "Диалоги о животных" },
            { time: "14:00", title: "Эрмитаж" },
            { time: "15:00", title: "Новости культуры" },
            { time: "15:30", title: "Больше, чем любовь" },
            { time: "17:00", title: "Новости культуры" },
            { time: "17:30", title: "Пешком..." },
            { time: "18:00", title: "Линия жизни" },
            { time: "19:00", title: "Новости культуры" },
            { time: "19:30", title: "Искусственный отбор" },
            { time: "21:00", title: "Агора" },
            { time: "22:00", title: "Новости культуры" },
            { time: "22:30", title: "Спектакль" }
        ],
        archive: []
    },
    {
        id: "ch12", name: "Карусель", category: "kids",
        logo: "media/logos/karusel.png",
        schedule: [
            { time: "05:00", title: "Мультфильмы" },
            { time: "08:00", title: "С добрым утром, малыши!" },
            { time: "08:30", title: "Навигатор" },
            { time: "09:00", title: "Фиксики" },
            { time: "11:00", title: "Смешарики" },
            { time: "13:00", title: "Маша и Медведь" },
            { time: "15:00", title: "Три кота" },
            { time: "17:00", title: "Лунтик" },
            { time: "19:00", title: "Спокойной ночи, малыши!" },
            { time: "20:00", title: "Барбоскины" },
            { time: "22:00", title: "Мультфильмы" }
        ],
        archive: []
    },
    {
        id: "ch13", name: "Мульт", category: "kids",
        logo: "media/logos/mult.png",
        schedule: [
            { time: "05:00", title: "Мультфильмы" },
            { time: "09:00", title: "Ми-ми-мишки" },
            { time: "12:00", title: "Сказочный патруль" },
            { time: "15:00", title: "Лео и Тиг" },
            { time: "18:00", title: "Кошечки-собачки" },
            { time: "21:00", title: "Мультфильмы" }
        ],
        archive: []
    },
    {
        id: "ch18",
        name: "Nickelodeon",
        category: "kids",
        logo: "media/logos/nickelodeon.png",
        schedule: [
            { time: "06:00", title: "Губка Боб Квадратные Штаны" },
            { time: "07:00", title: "Свинка Пеппа" },
            { time: "07:30", title: "Щенячий патруль" },
            { time: "08:30", title: "Даша-путешественница" },
            { time: "09:00", title: "Губка Боб Квадратные Штаны" },
            { time: "10:30", title: "Черепашки-ниндзя" },
            { time: "12:00", title: "Мой шумный дом" },
            { time: "13:30", title: "Вспыш и чудо-машинки" },
            { time: "15:00", title: "Губка Боб Квадратные Штаны" },
            { time: "17:00", title: "Элвин и бурундуки" },
            { time: "18:30", title: "Опасный Генри" },
            { time: "20:00", title: "АйКарли" },
            { time: "21:30", title: "Виктория-победительница" },
            { time: "23:00", title: "Дрейк и Джош" },
            { time: "00:30", title: "Ночной Nickelodeon" }
        ],
        archive: [
            { date: "2026-09-15", time: "20:00", title: "АйКарли (сезон 3, серия 12)" },
            { date: "2026-09-15", time: "18:30", title: "Опасный Генри (сезон 4, серия 5)" },
            { date: "2026-09-14", time: "19:00", title: "Губка Боб Квадратные Штаны (сезон 10)" }
        ],
        streamIframe: '<iframe width="720" height="405" src="https://rutube.ru/play/embed/e902c1a059034a1537430b2aa5aedece" style="border: none;" allow="clipboard-write; autoplay" allowFullScreen></iframe>',
        programUrl: "https://tv.mail.ru/moskva/channel/1172/",
        programLabel: "📋 Полная программа на tv.mail.ru"
    },
    {
        id: "ch19",
        name: "Cartoon Network",
        category: "kids",
        logo: "media/logos/cartoon-network.png",
        schedule: [
            { time: "06:00", title: "Удивительный мир Гамбола" },
            { time: "07:00", title: "Вся правда о медведях" },
            { time: "08:00", title: "Юные титаны, вперёд!" },
            { time: "09:00", title: "Бен 10" },
            { time: "10:00", title: "Суперкрошки" },
            { time: "11:30", title: "Обычный мультик" },
            { time: "13:00", title: "Дядя Деда" },
            { time: "14:30", title: "Время приключений" },
            { time: "16:00", title: "Легенды Чимы" },
            { time: "17:30", title: "Отважные пташки" },
            { time: "19:00", title: "Крейг из ручья" },
            { time: "20:30", title: "Удивительный мир Гамбола" },
            { time: "22:00", title: "Взрослые мультфильмы (18+)" },
            { time: "00:00", title: "Ночной Cartoon Network" }
        ],
        archive: [
            { date: "2026-09-15", time: "20:30", title: "Удивительный мир Гамбола (сезон 6, серия 4)" },
            { date: "2026-09-15", time: "14:30", title: "Время приключений (сезон 9, серия 8)" },
            { date: "2026-09-14", time: "11:30", title: "Обычный мультик (сезон 7)" }
        ],
        streamIframe: '<iframe width="720" height="405" src="https://rutube.ru/play/embed/d2119cfb95146b3983cf05c1fe35e66f" style="border: none;" allow="clipboard-write; autoplay" allowFullScreen></iframe>',
        programUrl: "https://tv.mail.ru/moskva/channel/1017/",
        programLabel: "📋 Полная программа на tv.mail.ru"
    },
    {
        id: "ch14", name: "Россия 24", category: "news",
        logo: "media/logos/russia24.png",
        schedule: [
            { time: "00:00", title: "Новости" },
            { time: "03:00", title: "Новости" },
            { time: "06:00", title: "Вести" },
            { time: "09:00", title: "Вести" },
            { time: "12:00", title: "Вести" },
            { time: "15:00", title: "Вести" },
            { time: "18:00", title: "Вести" },
            { time: "21:00", title: "Вести" },
            { time: "23:00", title: "Вести" }
        ],
        archive: []
    },
    {
        id: "ch15", name: "Москва 24", category: "news",
        logo: "media/logos/m24.png",
        schedule: [
            { time: "06:00", title: "Новости" },
            { time: "09:00", title: "Утро" },
            { time: "12:00", title: "Город" },
            { time: "15:00", title: "Новости" },
            { time: "18:00", title: "Мегаполис" },
            { time: "21:00", title: "Новости" }
        ],
        archive: []
    },
    {
        id: "ch16",
        name: "ТНТ4",
        category: "entertainment",
        logo: "media/logos/tnt4.png",
        schedule: [
            { time: "06:00", title: "ТНТ4. Best" },
            { time: "08:00", title: "Комеди Клаб" },
            { time: "10:00", title: "Прожарка" },
            { time: "12:00", title: "22 комика" },
            { time: "14:00", title: "Деньги или позор" },
            { time: "16:00", title: "Наша Russia" },
            { time: "18:00", title: "Comedy Woman" },
            { time: "20:00", title: "Убойная лига" },
            { time: "22:00", title: "Не спать!" },
            { time: "00:00", title: "ТНТ4. Ночь" }
        ],
        archive: [],
        streamIframe: '<iframe width="720" height="405" src="https://rutube.ru/play/embed/c801a7087e29a097192d74c270fbc6c1" style="border: none;" allow="clipboard-write; autoplay" allowFullScreen></iframe>',
        programUrl: "https://tnt4.ru/tvprogram",
        programLabel: "Полная программа на tnt4.ru"
    }
];

// ===== Категория «Кино и сериалы» =====
window.FILMFLOW_CHANNELS = window.FILMFLOW_CHANNELS.concat(makeCinemaChannels());