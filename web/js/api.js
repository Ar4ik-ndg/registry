const API_BASE_URL = 'http://registry_back:8080/api/v0.1';

// Общая функция для запросов
async function apiRequest(endpoint, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    };

    const config = {
        method,
        headers
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка сервера');
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Сохранение в localStorage
function saveAuthData({token, user}) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.fullName);
    localStorage.setItem('isAuthenticated', 'true');
}

// Форматирование даты
function formatDateForAPI(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// ==================== Авторизация =====================

// Вход
export async function login(data){
    const response = await apiRequest(`auth/login`, 'POST', {
        "email": data.email,
        "password": data.password
    });

    if(response.token) {
        saveAuthData(response)
    }

    return response;
}

// Регистрация пользователя
export async function register(data) {
    const response = await apiRequest(`auth/register`, 'POST', {
        "birthday": data.birthday,
        "email": data.email,
        "fullName": data.fullName,
        "medPolicy": data.medPolicy,
        "passport": data.passport,
        "phone": data.phone,
        "snils": data.snils,
        "password": data.password
    });

    if(response.token) {
        saveAuthData(response)
    }

    return response;
}

// Регистрация сотрудника
export async function registerStaff(data) {
    const response = await apiRequest(`auth/register/staff`, 'POST', {
        "email": data.email,
        "fullName": data.fullName,
        "prof": data.prof,
        "phone": data.phone,
        "role": data.role,
        "password": data.password
    });

    if(response.token) {
        saveAuthData(response)
    }

    return response;
}

export async function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAuthenticated');
    window.location.href = 'patient.html';
}

// ==================== Пользователь ====================

// Создание приема
export async function createTiket(data) {
    if (!data.date || !data.description || !data.doctor || !data.email) {
        throw new Error("Не все поля заполнены");
    }

    const response = await apiRequest(`/user/tikets/new`,'POST',{
        "date": formatDateForAPI(data.date),
        "description": data.description,
        "doctor": data.doctor,
        "user": {"email": data.email}
    });

    return response;
}

// Отмена приема
export async function cancelTiket(id) {
    if (!id) { throw new Error("Не указан прием, который отменяется"); }

    const response = await apiRequest(`/user/tikets/cancel/${id}`,'PUT');
    return response;
}

// Получить все приемы пользователя
export async function getTiketsByUser(userId){
    if (!userId) { throw new Error("Не указан пользователь"); }

    const response = await apiRequest(`/user/tikets/${userId}`);
    return response;
}

// Получить данные текущего пользователя
export async function getCurrentUser(identifier, type="id",){
    if (!identifier || !type) { throw new Error("Не указан пользователь"); }

    const response = await apiRequest(`/user/${type}/${identifier}`);
    return response;
}

// Обновить данные пользователя
export async function updateUser(id,data){
    if (!data || Object.keys(data).length === 0) {
        throw new Error("Не переданы данные для обновления");
    }
    if (!id) { throw new Error("Пользователь не указан"); }
    const response = await apiRequest(`/user/id/${id}`, 'PUT', data);
    const token = localStorage.getItem('authToken');
    if(!response.error && token && response.id && response.email && response.role) {
        saveAuthData({"token": token, "user": response});
    }
    return response;
}

// Удалить пользователя
export async function deleteUser(id){
    if(!id) { throw new Error("Пользователь не указан"); }

    const response = await  apiRequest(`/user/id/${id}`, 'DELETE');
    if (response.message) { await logout(); }
    return response;
}

// Получить список всех врачей отдельного направления
export async function getDocs(prof){
    if (!prof) { throw new Error("Не задано направление врачей"); }

    const response = await apiRequest(`/user/med/${prof}`);
    return response;
}

// ==================== Врач ====================

// Получение всех приемов
export async function getAllTikets(){
    const response = apiRequest(`/med/tikets/all`);
    return response;
}

// Получение приемов по статусу
export async function getTiketsByStatus(status){
    if (!status) { throw new Error("Не передан статус"); }

    const response = apiRequest(`/med/tikets/status/${status}`);
    return response;
}

// Получение приемов на текущий день по ФИО доктора
export async function getTiketsByDoctor(doctor) {
    if (!doctor) { throw new Error("Не передано ФИО доктора"); }

    const response = apiRequest(`/med/tikets/doctor/${doctor}`);
    return response;
}

// Создание нового приема
export async function createTiketByStaff(data){
    if (!data.date || !data.description || !data.doctor || !data.status || !data.user) {
        throw new Error("Не введены обязательные поля"); }
    if (!data.user.email) {throw new Error("Не передан email пациента"); }

    const response = apiRequest(`/med/tikets/new`, 'POST',{
        "date": formatDateForAPI(data.date),
        "description": data.description,
        "doctor": data.doctor,
        "status": data.status,
        "user": data.user
    });
    return response;
}

// Обновление приема
export async function updateTiket(data, id) {
    if (!id) { throw new Error("Не передан прием"); }
    if (!data.status) { throw new Error("Не передан новый статус"); }
    if (data.date) { data.date = formatDateForAPI(data.date); }

    const response = apiRequest(`/med/tikets/update/${id}`, 'PUT', data);
    return response;
}

// Получить прием по id
export async function getTiket(id){
    if (!id) { throw new Error("Не передан пользователь"); }

    const response = apiRequest(`/med/tikets/id/${id}`);
    return response;
}

// Получить данные о персонале
export async function getCurrentStaff(identifier, type="id"){
    if (!identifier || !type) { throw new Error("Не указан пользователь"); }

    const response = await apiRequest(`/med/${type}/${identifier}`);
    return response;
}

// Обновить персонал
export async function updateStaff(id, data) {
    if (!data || Object.keys(data).length === 0) {
        throw new Error("Не переданы данные для обновления");
    }
    if (!id) { throw new Error("Пользователь не указан"); }
    const response = await apiRequest(`/med/id/${id}`, 'PUT', data);
    const token = localStorage.getItem('authToken');
    if(!response.error && token && response.id && response.email && response.role) {
        saveAuthData({"token": token, "user": response});
    }
    return response;
}

// Удалить пользователя
export async function deleteStaff(id){
    if(!id) { throw new Error("Пользователь не указан"); }

    const response = await  apiRequest(`/user/id/${id}`, 'DELETE');
    if (response.message) { await logout(); }
    return response;
}
