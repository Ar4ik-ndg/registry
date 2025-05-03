# Документация по проекту registry

Версия апи: v0.1
<br> Локальное окружение: `http://localhost:8080`
<br> Тестовое окружение: `http://registry_back:8080`

---
Пример формирования адреса:

```http
GET http://localhost:8080/api/v0.1/user/all
```

Где: <br>
`localhost:8080` - адрес сервера <br>
`/api/v0.1` - версия апи <br>
`/user` - название роли или сервиса <br>
`/all` - эндпоинт

---
# Пользователи
## Авторизация

---

### Вход

```http
POST http://localhost:8080/api/v0.1/auth/login
```

#### Запрос:

```curl
curl --request POST \
  --url http://localhost:8080/api/v0.1/auth/login \
  --header 'Content-Type: application/json' \
  --data '{
	"email": "test",
	"password":"test"
}'
```

где: <br>

| Параметр    | Значение           |
|-------------|--------------------|
| email       | Email пользователя |
| password    | Введенный пароль   |

### Ответ:

#### Успешный вход:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IHVzZXIiLCJpYXQiOjE3NDQwNDY2NzIsImV4cCI6MTc0NDEzMzA3Mn0.5o1l1kGDzOb10cPQNW-f4sBJHhwOVKXJ37ogK8G_ibI",
  "user": {
    "id": "5a86f10d-a94f-41f2-a192-8ec5d7c1b7c8",
    "fullName": "test user",
    "birthday": "12.3.4567",
    "phone": "test",
    "email": "test user",
    "passport": "test",
    "snils": "test",
    "medPolicy": "test",
    "role": "USER"
  }
}
```

```http
Status Code = 200 OK
```

#### Неверные данные:

```json
{
  "error" : "Неверный пароль"
}
```

```http
Status Code = 400 Bad Request
```

---

### Регистрация

```http
POST http://localhost:8080/api/v0.1/auth/register
```

#### Запрос:

```curl
curl --request POST \
  --url http://localhost:8080/api/v0.1/auth/register \
  --header 'Content-Type: application/json' \
  --data '{
    "birthday": "12.3.4567",
    "email": "test user",
    "fullName": "test user",
    "medPolicy": "test",
    "passport": "test",
    "phone": "test",
    "snils": "test",
    "password": "123"
}'
```

где: <br>

| Параметр  | Значение                                                   |
|-----------|------------------------------------------------------------|
| birthday  | День рождения                                              |
| email     | Email пользователя (должен быть уникальным)                |
| fullName  | ФИО                                                        |
| medPolicy | Мед. полис (должен быть уникальным, длина не более 16)     |
| passport  | Паспорт (должен быть уникальным, длина не более 10)        |
| phone     | Номер телефона (должен быть уникальным)                    |
| snils     | Снилс (должен быть уникальным, длина не более 11)          |
| password  | Пароль                                                     |
### Ответ:

---

#### Успешная регистрация:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NSIsImlhdCI6MTc0MzUyMTgyOCwiZXhwIjoxNzQzNjA4MjI4fQ.vXkDTsNhsrnXlRf_ei-eJK3q4X78YFcIZMzuyMUbCsY",
  "user": {
    "id": "5a86f10d-a94f-41f2-a192-8ec5d7c1b7c8",
    "birthday": "12.3.4567",
    "email": " user",
    "fullName": "test user",
    "medPolicy": "test",
    "passport": "test",
    "phone": "test",
    "snils": "test",
    "role": "USER"
  }
}
```
```http
Status Code = 200 OK
```

---

#### Совпадающие данные:

```json
{
    "error": "Пользователь с таким email уже существует"
}
```
```http
Status Code = 400 Bad Request
```

---

## Запросы пользователя

### Создание приема:

```http
POST http://localhost:8080/api/v0.1/user/tickets/new
```

#### Запрос

```curl
curl --request POST \
  --url http://localhost:8080/api/v0.1/user/tickets/new \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
  --data '{
    "date": "01.01.2001 00:00",
    "description": "test",
    "doctor": "d3aad82a-3865-4801-aaa6-5908a95bfea6",
    "user": {"email" : "pacient@clinic.ru"}
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
| date                    | Дата и время приема (по паттерну: dd.MM.yyyy HH:mm)      |
| description             | Описание болезни (жалоба)                                |
| doctor                  | id лечащего врача                                        |
| user                    | email пользователя, за которым закрепляется прием        |
### Ответ:

---

#### Правильный токен:
```json
{
  "message": "Запись успешно отправлена на подтверждение",
  "ticket": {
    "id": "608280f5-1f7f-4735-a102-fbcaf396c171",
    "date": "01.01.2001 00:00",
    "description": "test",
    "results": null,
    "doctor": {
      "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
      "fullName": "test user",
      "phone": "test",
      "email": "test doc",
      "prof": "Терапевт"
    },
    "status": "подтверждается",
    "user": {
      "email": "pacient@clinic.ru",
      "birthday": "12.3.4567",
      "fullName": "Иван Иванов Иванович",
      "medPolicy": "1234567890",
      "passport": "1234567890",
      "phone": "+79120000000",
      "snils": "1234567890"
    }
  }
}
```

```http
Status Code = 200 OK
```

---

#### Неверная дата
```json
{
  "error": "Неверно выбрано время"
}
```

```http
Status Code = 400 Bad Request
```
---
#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---

### Отмена приема:

```http
PUT http://localhost:8080/api/v0.1/user/tickets/cancel/<id>
```

#### Запрос

```curl
curl --request PUT \
  --url http://localhost:8080/api/v0.1/user/tickets/cancel/<id> \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
| id                      | id приема который надо отменить                          |

Отмена в день приема и после него недоступна

### Ответ:

---

#### Правильный токен:
```json
{
  "message": "Прием отменен",
  "ticket": {
    "id": "608280f5-1f7f-4735-a102-fbcaf396c171",
    "date": "01.01.2001 00:00",
    "description": "test",
    "results": null,
    "doctor": {
      "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
      "fullName": "test user",
      "phone": "test",
      "email": "test doc",
      "prof": "Терапевт"
    },
    "status": "отменен",
    "user": {
      "email": "pacient@clinic.ru",
      "birthday": "12.3.4567",
      "fullName": "Иван Иванов Иванович",
      "medPolicy": "1234567890",
      "passport": "1234567890",
      "phone": "+79120000000",
      "snils": "1234567890"
    }
  }
}
```

```http
Status Code = 200 OK
```

---

#### Неверная дата
```json
{
  "error": "Прием нельзя отменить в текущий день"
}
```


```http
Status Code = 400 Bad Request
```
---
#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---

### Вывод всех приемов, закрепленных за пользователем:

```http
GET http://localhost:8080/api/v0.1/user/tickets/<id>
```

#### Запрос

```curl
curl --request GET \
  --url http://localhost:8080/api/v0.1/user/tickets/<id> \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
| id                      | id пользователя                                          |
### Ответ:

---

#### Правильный токен:

```json
[
  {
    "id": "608280f5-1f7f-4735-a102-fbcaf396c171",
    "date": "01.01.2001 00:00",
    "description": "test",
    "results": null,
    "doctor": {
      "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
      "fullName": "test user",
      "phone": "test",
      "email": "test doc",
      "prof": "Терапевт"
    },
    "status": "подтверждается",
    "user": {
      "email": "pacient@clinic.ru",
      "birthday": "12.3.4567",
      "fullName": "Иван Иванов Иванович",
      "medPolicy": "1234567890",
      "passport": "1234567890",
      "phone": "+79120000000",
      "snils": "1234567890"
    }
  }
]
```
```http
Status Code = 200 OK
```

---
#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---


### Запрос пользователя по id или email:

```http
GET http://localhost:8080/api/v0.1/user/(id или email)/<id или email>
```

#### Запрос

```curl
curl --request GET \
  --url http://localhost:8080/api/v0.1/user/(id или email)/<id или email> \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
| id                      | id искомого пользователя                                 |
| email                   | email искомого пользователя                              |
### Ответ:

---

#### Правильный токен:

```json
{
  "id": "5a86f10d-a94f-41f2-a192-8ec5d7c1b7c8",
  "fullName": "test user",
  "birthday": "12.3.4567",
  "phone": "test",
  "email": "test user",
  "passport": "test",
  "snils": "test",
  "medPolicy": "test",
  "role": "USER"
}
```
```http
Status Code = 200 OK
```

---

#### Несуществующий id/email:

```json
{
  "error": "Не найдено пользователя с email/id <email/id>"
}
```
```http
Status Code = 400 Bad Request
```


---

#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---

### Обновление пользователя:

```http
PUT http://localhost:8080/api/v0.1/user/id/<id>
```

#### Запрос

```curl
curl --request PUT \
  --url http://localhost:8080/api/v0.1/user/id/{id} \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
  --data '{
    "fullName": "test user",
    "birthday": "12.3.4567",
    "phone": "test",
    "email": "test user",
    "passport": "test",
    "snils": "test",
    "medPolicy": "test",
    "password": "1234"
}'
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
| id                      | id пользователя                                          |
| fullName                | ФИО                                                      |
| birthday                | День рождения                                            |
| phone                   | Номер телефона (должен быть уникальным)                  |
| email                   | email                                                    |
| passport                | Паспорт (должен быть уникальным, длина не более 10)      |
| snils                   | Снилс (должен быть уникальным, длина не более 11)        |
| medPolicy               | Мед. полис (должен быть уникальным, длина не более 16)   |
| password                | Пароль                                                   |

Поля, которые не требуется обновлять может = null
### Ответ:

---

#### Правильный токен:

```json
{
  "id": "5a86f10d-a94f-41f2-a192-8ec5d7c1b7c8",
  "fullName": "test user",
  "birthday": "12.3.4567",
  "phone": "test",
  "email": "test user",
  "passport": "test",
  "snils": "test",
  "medPolicy": "test",
  "role": "USER"
}
```
```http
Status Code = 200 OK
```

---
#### Несуществующий id:

```json
{
  "error": "Не найдено пользователя с id <id>"
}
```
```http
Status Code = 400 Bad Request
```

---
#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---

### Удаление пользователя:

```http
DELETE http://localhost:8080/api/v0.1/user/id/<id>
```

#### Запрос

```curl
curl --request DELETE \
  --url http://localhost:8080/api/v0.1/user/id/<id> \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...'
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
| id                      | id удаляемого пользователя                               |
### Ответ:

---

#### Правильный токен:

```json
{
  "message":"Пользователь успешно удален"
}
```
```http
Status Code = 200 OK
```

---

#### Несуществующий email:

```json
{
  "error": "Не найдено пользователя с id <id>"
}
```
```http
Status Code = 400 Bad Request
```

---

#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---

### Получение списка врачей отдельного направления:

```http
GET http://localhost:8080/api/v0.1/user/med/<profession>
```

#### Запрос

```curl
curl --request GET \
  --url http://localhost:8080/api/v0.1/user/med/<profession> \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...'
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
| profession              | направление искомых врачей                               |
### Ответ:

---

#### Правильный токен:

```json
[
  {
    "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
    "fullName": "test user",
    "phone": "test",
    "email": "test doc",
    "prof": "Терапевт",
    "role": "DOCTOR"
  }
]
```
```http
Status Code = 200 OK
```

---

#### Неправильное направление или несуществующее:

```json
{
  "error": "Нет докторов данного направления"
}
```
```http
Status Code = 400 Bad Request
```

---

#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```
---

### Получение специальностей врачей:

```http
GET http://localhost:8080/api/v0.1/user/med/profs
```

#### Запрос

```curl
curl --request GET \
  --url http://localhost:8080/api/v0.1/user/med/profs \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...'
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
### Ответ:

---

#### Правильный токен:

```json
[
  "Терапевт",
  "Офтальмолог"
]
```
```http
Status Code = 200 OK
```

---

#### Нет ни 1 направления:

```json
{
  "error": "Нет докторов данного направления"
}
```
```http
Status Code = 400 Bad Request
```

---

#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```
---

### Получение занятого времени:

```http
GET http://localhost:8080/api/v0.1/user/tickets/busy
```

#### Запрос

```curl
curl --request GET \
  --url http://localhost:8080/api/v0.1/user/tickets/busy \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...'\
  --data '{
    "date": "12.03.4567",
    "doctor": "d3aad82a-3865-4801-aaa6-5908a95bfea6"}'
```

где: <br>

| Параметр                | Значение                                                          |
|-------------------------|-------------------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)}          |
| date                    | Дата (формат dd.MM.yyyy), с которой хотите получить занятое время |
| docotr                  | id доктора, занятое время которого надо найти                     |
### Ответ:

---

#### Правильный токен:

```json
[
  "07.05.1764 17:49",
  "14.12.2239 04:26"
]
```
```http
Status Code = 200 OK
```

---

#### Нет занятых:
```json
[]
```
```http
Status Code = 200 OK
```

---

#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```
---

# Персонал

Запросы роли пользователя также доступны для данной роли

## Авторизация

---

### Вход

```http
POST http://localhost:8080/api/v0.1/auth/login
```

#### Запрос:

```curl
curl --request POST \
  --url http://localhost:8080/api/v0.1/auth/login \
  --header 'Content-Type: application/json' \
  --data '{
	"email": "test doc",
	"password":"123"
}'
```

где: <br>

| Параметр    | Значение           |
|-------------|--------------------|
| email       | Email пользователя |
| password    | Введенный пароль   |

### Ответ:

#### Успешный вход:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IGRvYyIsImlhdCI6MTc0NDExMTczNSwiZXhwIjoxNzQ0MTk4MTM1fQ.A9WGANu_VtBLdycvH4-9H1EmI0yeOIsRMjqe9-tXAoI",
  "user": {
    "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
    "fullName": "test user",
    "phone": "test",
    "email": "test doc",
    "prof": "Терапевт",
    "role": "DOCTOR"
  }
}
```

```http
Status Code = 200 OK
```

#### Неверные данные:

```json
{
  "error" : "Неверный пароль"
}
```

```http
Status Code = 400 Bad Request
```

---

### Регистрация

```http
POST http://localhost:8080/api/v0.1/auth/register/staff
```

#### Запрос:

```curl
curl --request POST \
  --url http://localhost:8080/api/v0.1/auth/register/staff \
  --header 'Content-Type: application/json' \
  --data '{
    "fullName": "test user",
    "phone": "test",
    "email": "test doc",
    "prof": "Терапевт",
    "password": "123",
    "role": "DOCTOR"
}'
```

где: <br>

| Параметр | Значение                                                                                     |
|----------|----------------------------------------------------------------------------------------------|
| email    | Email пользователя (должен быть уникальным)                                                  |
| fullName | ФИО                                                                                          |
| phone    | Номер телефона (должен быть уникальным)                                                      |
| prof     | Врачебное направление/ профессия                                                             |
| password | Пароль                                                                                       |
| role     | Роль на сайте (регистратура - REGISTRAR, мед. работник - DOCTOR; сис. администратор - ADMIN) |
### Ответ:

---

#### Успешная регистрация:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IGRvYyIsImlhdCI6MTc0NDExMTczNSwiZXhwIjoxNzQ0MTk4MTM1fQ.A9WGANu_VtBLdycvH4-9H1EmI0yeOIsRMjqe9-tXAoI",
  "user": {
    "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
    "fullName": "test user",
    "phone": "test",
    "email": "test doc",
    "prof": "Терапевт",
    "role": "DOCTOR"
  }
}
```
```http
Status Code = 200 OK
```

---

#### Совпадающие данные:

```json
{
    "error": "Пользователь с таким email уже существует"
}
```

```http
Status Code = 400 Bad Request
```

---

## Запросы персонала

### Вывод всех приемов:

```http
GET http://localhost:8080/api/v0.1/med/tickets/all
```

#### Запрос

```curl
curl --request GET \
  --url http://localhost:8080/api/v0.1/med/tickets/all \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
### Ответ:

---

#### Правильный токен:

```json
[
  {
    "id": "ada353f5-4577-4694-8dc1-50294e7baea2",
    "date": "07.04.2025 00:32",
    "description": "test",
    "results": null,
    "doctor": {
      "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
      "fullName": "test user",
      "phone": "test",
      "email": "test doc",
      "prof": "Терапевт"
    },
    "status": "подтверждается",
    "user": {
      "email": "pacient@clinic.ru",
      "birthday": "12.3.4567",
      "fullName": "Иван Иванов Иванович",
      "medPolicy": "1234567890",
      "passport": "1234567890",
      "phone": "+79120000000",
      "snils": "1234567890"
    }
  }
]
```
```http
Status Code = 200 OK
```

---
#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---

### Вывод приемов по статусу:

```http
GET http://localhost:8080/api/v0.1/med/tickets/status/<status>
```

#### Запрос

```curl
curl --request GET \
  --url http://localhost:8080/api/v0.1/med/tickets/status/<status> \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
```

где: <br>

| Параметр                | Значение                                                                            |
|-------------------------|-------------------------------------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)}                            |
| status                  | Искомый статус приемов (отменен, подтверждается, запланирован, обработка, завершен) |
### Ответ:

---

#### Правильный токен:

```json
[
  {
    "id": "ada353f5-4577-4694-8dc1-50294e7baea2",
    "date": "07.04.2025 00:32",
    "description": "test",
    "results": null,
    "doctor": {
      "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
      "fullName": "test user",
      "phone": "test",
      "email": "test doc",
      "prof": "Терапевт"
    },
    "status": "подтверждается",
    "user": {
      "email": "pacient@clinic.ru",
      "birthday": "12.3.4567",
      "fullName": "Иван Иванов Иванович",
      "medPolicy": "1234567890",
      "passport": "1234567890",
      "phone": "+79120000000",
      "snils": "1234567890"
    }
  }
]
```
```http
Status Code = 200 OK
```
---
#### Несуществуюущий адрес:

```json
{
    "error": "Неверно передан статус"
}
```

```http
Status Code = 400 Forbidden
```

---
#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---

### Вывод приемов по дате и врачу:

```http
GET http://localhost:8080/api/v0.1/med/tickets/doctor/<doctorId>
```

#### Запрос

```curl
curl --request GET \
  --url http://localhost:8080/api/v0.1/med/tickets/doctor/<doctorId> \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
| doctorId                | id врача, для которого надо получить список приемов      |
### Ответ:

---

#### Правильный токен:

```json
[
  {
    "id": "ada353f5-4577-4694-8dc1-50294e7baea2",
    "date": "07.04.2025 00:32",
    "description": "test",
    "results": null,
    "doctor": {
      "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
      "fullName": "test user",
      "phone": "test",
      "email": "test doc",
      "prof": "Терапевт"
    },
    "status": "подтверждается",
    "user": {
      "email": "pacient@clinic.ru",
      "birthday": "12.3.4567",
      "fullName": "Иван Иванов Иванович",
      "medPolicy": "1234567890",
      "passport": "1234567890",
      "phone": "+79120000000",
      "snils": "1234567890"
    }
  }
]
```
```http
Status Code = 200 OK
```
---
#### Несуществуюущий адрес:

```json
{
    "error": "Нет задач на текущую дату"
}
```

```http
Status Code = 400 Forbidden
```

---

#### Несуществуюущий id:

```json
{
    "error": "Не найдено врача"
}
```

```http
Status Code = 400 Forbidden
```

---
#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---

### Создание приема:

```http
POST http://localhost:8080/api/v0.1/med/tickets/new
```

#### Запрос

```curl
curl --request POST \
  --url http://localhost:8080/api/v0.1/med/tickets/new \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
  --data '{
    "date": "01.01.2001 00:00",
    "description": "test",
    "doctor": "d3aad82a-3865-4801-aaa6-5908a95bfea6",
    "status": "запланирован",
    "user": {
    "email": "pacient@clinic.ru",
    "birthday": "12.3.4567",
    "fullName": "Иван Иванов Иванович",
    "medPolicy": "1234567890",
    "passport": "1234567890",
    "phone": "+79120000000",
    "snils": "1234567890"
    }
```

где: <br>

| Параметр                | Значение                                                                                                                                                            |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)}                                                                                                            |
| date                    | Дата и время приема (по паттерну: dd.MM.yyyy HH:mm                                                                                                                  |
| description             | Описание болезни (жалоба)                                                                                                                                           |
| doctor                  | id лечащего врача                                                                                                                                                   |
| status                  | Статус заявки (отменен, подтверждается, запланирован, обработка, завершен)<br/> при null по умолчанию ставится подтверждается                                       |
| user                    | Только email, если пользователь уже существует.<br/>Необходимая для создания пользователя информация, если пользователь ранее не создавал заявок (для регистратуры) |

Дата приема может быть только со следующего дня и более

### Ответ:

---

#### Правильный токен:

```json
{
  "message": "Запись успешно отправлена на подтверждение",
  "ticket": {
    "id": "608280f5-1f7f-4735-a102-fbcaf396c171",
    "date": "01.01.2001 00:00",
    "description": "test",
    "results": null,
    "doctor": {
      "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
      "fullName": "test user",
      "phone": "test",
      "email": "test doc",
      "prof": "Терапевт"
    },
    "status": "запланирован",
    "user": {
      "email": "pacient@clinic.ru",
      "birthday": "12.3.4567",
      "fullName": "Иван Иванов Иванович",
      "medPolicy": "1234567890",
      "passport": "1234567890",
      "phone": "+79120000000",
      "snils": "1234567890"
    }
  }
}
```

```http
Status Code = 200 OK
```

---
#### Неверное время:

```json
{
  "error": "Неверно выбрано время"
}
```

```http
Status Code = 400 OK
```

---
#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---

### Обновление приема:

```http
PUT http://localhost:8080/api/v0.1/med/tickets/update/<id>
```

#### Запрос

```curl
curl --request PUT \
  --url http://localhost:8080/api/v0.1/med/tickets/update/<id> \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
  --data '{
    "date": "01.01.2001 00:00",
    "description": "test",
    "doctor": "d3aad82a-3865-4801-aaa6-5908a95bfea6",
    "status": "запланирован",
    "user": "50c96c35-1b53-48a2-9d7a-b097aff2defa"
```

где: <br>

| Параметр                | Значение                                                                                                                      |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)}                                                                      |
| id                      | id приема, который надо обновить                                                                                              |
| date                    | Дата и время приема (по паттерну: dd.MM.yyyy HH:mm                                                                            |
| description             | Описание болезни (жалоба)                                                                                                     |
| doctor                  | id лечащего врача                                                                                                             |
| status                  | Статус заявки (отменен, подтверждается, запланирован, обработка, завершен)<br/> при null по умолчанию ставится подтверждается |
| user                    | id пользователя, за которым закрепляется прием                                                                                |

Параметры, которые не требуется обновлять, можно не указывать, т.е. = null <br>
Новая дата приема может быть только со следующего дня и более

### Ответ:

---

#### Правильный токен:

```json
{
  "message": "Запись успешно обновлена",
  "ticket": {
    "id": "608280f5-1f7f-4735-a102-fbcaf396c171",
    "date": "01.01.2001 00:00",
    "description": "test",
    "results": null,
    "doctor": {
      "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
      "fullName": "test user",
      "phone": "test",
      "email": "test doc",
      "prof": "Терапевт"
    },
    "status": "запланирован",
    "user": {
      "id": "5a86f10d-a94f-41f2-a192-8ec5d7c1b7c8",
      "fullName": "test user",
      "birthday": "12.3.4567",
      "phone": "test",
      "email": "test user",
      "passport": "test",
      "snils": "test",
      "medPolicy": "test",
      "role": "USER"
    }
  }
}
```

```http
Status Code = 200 OK
```

---
#### Неверное время/ статус:

```json
{
  "error": "Неверно выбрано время/ статус"
}
```

```http
Status Code = 400 OK
```

---
#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---


### Вывод приема по id:

```http
GET http://localhost:8080/api/v0.1/med/tickets/id/<id>
```

#### Запрос

```curl
curl --request GET \
  --url http://localhost:8080/api/v0.1/mde/tickets/id/<id> \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
| id                      | id приема, который надо вывести                          |

### Ответ:

---

#### Правильный токен:

```json
{
  "id": "5d18edaa-5008-4ce0-b906-f0f74c50c5aa",
  "date": "01.02.2025 22:22",
  "description": "test",
  "results": null,
  "doctor": {
    "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
    "fullName": "test user",
    "phone": "test",
    "email": "test doc",
    "prof": "Терапевт"
  },
  "status": "подтверждается",
  "user": {
    "id": "5a86f10d-a94f-41f2-a192-8ec5d7c1b7c8",
    "fullName": "test user",
    "birthday": "12.3.4567",
    "phone": "test",
    "email": "test user",
    "passport": "test",
    "snils": "test",
    "medPolicy": "test",
    "role": "USER"
  }
}
```

```http
Status Code = 200 OK
```

---
#### Неверный id:

```json
{
  "error": "Не найдено задачи с id <id>"
}
```

```http
Status Code = 400 OK
```

---
#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---

### Запрос персонала по id или email:

```http
GET http://localhost:8080/api/v0.1/med/(id или email)/<id или email>
```

#### Запрос

```curl
curl --request GET \
  --url http://localhost:8080/api/v0.1/med/(id или email)/<id или email> \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
| id                      | id искомого персонала                                    |
| email                   | email искомого персонала                                 |
### Ответ:

---

#### Правильный токен:

```json
{
  "id": "e0db2437-e7b1-449a-a73f-acc6889995c1",
  "fullName": "test user",
  "phone": "test",
  "email": "test doc",
  "prof": "Терапевт",
  "role": "DOCTOR"
}
```
```http
Status Code = 200 OK
```

---

#### Несуществующий id/email:

```json
{
  "error": "Не найдено пользователя с email/id <email/id>"
}
```
```http
Status Code = 400 Bad Request
```


---

#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---

### Обновление пользователя:

```http
PUT http://localhost:8080/api/v0.1/med/id/<id>
```

#### Запрос

```curl
curl --request PUT \
  --url http://localhost:8080/api/v0.1/med/id/{id} \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...' \
  --data '{
    "fullName": "test user",
    "phone": "test",
    "email": "test doc",
    "prof": "Терапевт",
    "password": "123",
    "role": "DOCTOR"
}'
```

где: <br>

| Параметр                | Значение                                                                                    |
|-------------------------|---------------------------------------------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)}                                    |
| id                      | id обновляемого персонала                                                                   |
| email                   | Email пользователя (должен быть уникальным)                                                 |
| fullName                | ФИО                                                                                         |
| phone                   | Номер телефона (должен быть уникальным)                                                     |
| prof                    | Врачебное направление/ профессия                                                            |
| password                | Пароль                                                                                      |
| role                    | Роль на сайте (регистратура- REGISTRAR, мед. работник - DOCTOR; сис. администратор - ADMIN) |

Поля, которые не требуется обновлять может = null
### Ответ:

---

#### Правильный токен:

```json
{
  "fullName": "test user",
  "phone": "test",
  "email": "test doc",
  "prof": "Терапевт",
  "role": "DOCTOR"
}
```
```http
Status Code = 200 OK
```

---
#### Несуществующий id:

```json
{
  "error": "Не найдено пользователя с id <id>"
}
```
```http
Status Code = 400 Bad Request
```

---
#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---

### Удаление персонала:

```http
DELETE http://localhost:8080/api/v0.1/med/id/<id>
```

#### Запрос

```curl
curl --request DELETE \
  --url http://localhost:8080/api/v0.1/med/id/<id> \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ...'
```

где: <br>

| Параметр                | Значение                                                 |
|-------------------------|----------------------------------------------------------|
| --header 'Authorization | Bearer ${token (получается при авторизации/регистрации)} |
| id                      | id удаляемого персонала                                  |
### Ответ:

---

#### Правильный токен:

```json
{
  "message":"Пользователь успешно удален"
}
```
```http
Status Code = 200 OK
```

---

#### Несуществующий id:

```json
{
  "error": "Не найдено пользователя с id <id>"
}
```
```http
Status Code = 400 Bad Request
```

---

#### Просроченный/неверный токен:

```http
Status Code = 403 Forbidden
```

---
