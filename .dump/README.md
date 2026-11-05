# Users

#### Default admin
- login: `admin@mail.ru`
- password: `password`

#### Customer 1
- login: `user1@mail.ru`
- password: `password1`

# How to restore database
1. Через MongoDB Compass подключаемся к базе по адресу:
```
mongodb://root:example@localhost:27018/weblarek?authSource=admin
```
2. Выбираем коллекцию `users`, в ней `ADD DATA` и `Import JSON or CSV file`. Выбираем файл `.dump/weblarek.users.json`
3. Выбираем коллекцию `products`, в ней `ADD DATA` и `Import JSON or CSV file`. Выбираем файл `.dump/weblarek.products.json`
Файлы изображений для продуктов уже находятся в директории backend/src/public/images/


## Важно!!
Пароли в дампе хранятся как bcrypt-хеши. Дамп предназначен для первичного наполнения пустой учебной базы. Пользователи с прежними MD5-хешами не могут войти после обновления: для них требуется смена пароля на bcrypt-хеш или повторная регистрация тестовой учётной записи
