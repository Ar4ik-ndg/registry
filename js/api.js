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

// ==================== Пользователь ====================
// Получить данные текущего пользователя
export async function getCurrentUser() {
    const userId = localStorage.getItem('userId');
    return apiRequest(`/user/id/${userId}`);
}

// Получить все приёмы пользователя
export async function getUserAppointments() {
    const userId = localStorage.getItem('userId');
    return apiRequest(`/user/tikets/${userId}`);
}

// Создать новый приём
export async function createAppointment(date, description, doctor) {
    return apiRequest('/user/tikets/new', 'POST', {
        date: formatDateForAPI(date), // Форматируем дату
        description,
        doctor,
        user: localStorage.getItem('userId')
    });
}

// Отменить приём
export async function cancelAppointment(appointmentId) {
    return apiRequest(`/user/tikets/cancel/${appointmentId}`, 'PUT');
}

// Обновить данные пользователя
export async function updateUserProfile(data) {
    const userId = localStorage.getItem('userId');
    return apiRequest(`/user/id/${userId}`, 'PUT', data);
}

// ==================== Вспомогательные функции ====================
function formatDateForAPI(date) {
    // Преобразует дату в формат 'dd.MM.yyyy HH:mm'
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}