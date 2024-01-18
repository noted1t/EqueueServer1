# E-Очередь

Связка сервер+статик сайт для электронной очереди

## Особенности

- Сервер на языке Kotlin с Ktor и REST API
- H2 в качестве sql базы данных
- Статический сайт на чистом javascript с REST

## API Endpoints

### POST /checkNameForExist

Проверяет на наличие записи пользователя в БД

- **Body**: `{"name": "exampleName"}`

### DELETE /deleteAll

Удаляет все записи из БД. Защищено админ-паролем.

- **Body**: `{"name": "yourAdminPassword"}`

### GET /getAllRecords

Достаёт все записи из бд.

### POST /insertData

Добавляет запись в бд.

- **Body**: `{"userData": { ... }}`

## Для локального запуска сайта:
- Поднять сервер через IntelliJ IDEA запустив файл Application.kt
- С расширением Live Server в VS Code открыть сайт кликнув по .html файлу правой кнопкой мыши и выбрав "Open with Live Server"