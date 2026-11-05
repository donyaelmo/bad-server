# Проектная работа "WebLarek. Плохой сервер.", спринт 18

Автор: Никита Пахуридзе (Гибкий формат обучения)
Курс: Фуллстек-разработчик

## Репозиторий

https://github.com/donyaelmo/bad-server

Для запуска npm-команд вне Docker используйте Node.js 22.

## Подготовка к работе
1. Склонировать репозиторий
2. Создать локальные файлы окружения из примеров и запустить Docker. Для backend в Docker укажите `DB_ADDRESS=mongodb://root:example@mongo:27017/weblarek?authSource=admin`, для frontend — `VITE_API_ORIGIN=http://localhost/api`.
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
Запустить проект
```bash
docker compose up -d
```
3. Наполнить базу данных
[README.md](.dump%2FREADME.md)
4. Перейти по адресу http://localhost/ и на странице должны быть продукты.
5. На странице http://localhost/login/ можно авторизоваться.
6. Админка находится по адресу http://localhost/admin/

