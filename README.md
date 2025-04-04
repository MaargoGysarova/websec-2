# Безопасность веб-приложений. Лабораторка №2

## Вариант 1. Расписания

Сделать аналог раздела https://ssau.ru/rasp?groupId=531030143

Какие нужны возможности:
- справочники групп, табличные данные по расписаниям добывать с настоящего сайта на серверной стороне приложения
- в клиентскую часть подгружать эти сведения динамически по JSON-API
- обеспечить возможность смотреть расписания в разрезе группы или препода
- обеспечить возможность выбора учебной недели (по умолчанию выбирается автоматически)

## Мое приложение   

websec-2-main/
├── src/
│   ├── controllers/
│   │   └── scheduleController.js    # Логика обработки запросов
│   ├── services/
│   │   └── scheduleService.js       # Бизнес-логика и работа с внешним API
│   ├── routes/
│   │   └── scheduleRoutes.js        # Маршрутизация
│   └── public/
│       ├── css/
│       │   └── style.css            # Стили
│       ├── js/
│       │   └── script.js            # Клиентский JavaScript
│       └── images/                   # Директория для изображений (если понадобится)
├── index.html                       # Главная страница
├── server.js                        # Точка входа сервера
├── package.json                     # Зависимости и скрипты
├── package-lock.json               # Фиксация версий зависимостей
├── groupAndTeachers.json           # Данные о группах и преподавателях
└── README.md                       # Документация проекта

![alt text](image.png)