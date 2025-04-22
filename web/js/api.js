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

// Создать новый приём (заявку)
export async function createAppointment(data) {
    return apiRequest('/user/tikets/request', 'POST', {
        patientId: localStorage.getItem('userId'),
        doctorId: data.doctorId,
        requestedDate: data.requestedDate,
        description: data.description,
        status: data.status || 'pending'
    });
}

// Отменить приём
export async function cancelAppointment(appointmentId) {
    return apiRequest(`/user/tikets/cancel/${appointmentId}`, 'PUT');
}

// Подтвердить / Обновить заявку
export async function confirmAppointment(appointmentId, data = {}) {
    return apiRequest(`/med/tikets/update/${appointmentId}`, 'PUT', data);
}

// Обновить данные пользователя
export async function updateUserProfile(data) {
    const userId = localStorage.getItem('userId');
    return apiRequest(`/user/id/${userId}`, 'PUT', data);
}

// ==================== Вспомогательные функции ====================

function formatDateForAPI(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// ==================== Врач ====================

export async function getDoctorAppointments() {
    const doctorId = localStorage.getItem('userId');
    return apiRequest(`/doctor/appointments/${doctorId}`);
}

export async function getAppointmentDetails(appointmentId) {
    return apiRequest(`/appointments/${appointmentId}`);
}

export async function completeAppointment(appointmentId, results) {
    return apiRequest(`/doctor/appointments/complete/${appointmentId}`, 'PUT', results);
}

export async function getPatientInfo(patientId) {
    return apiRequest(`/patients/${patientId}`);
}

export async function uploadAppointmentResults(appointmentId, files) {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    };

    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/results`, {
        method: 'POST',
        headers,
        body: formData
    });

    if (!response.ok) {
        throw new Error('Ошибка при загрузке файлов');
    }

    return await response.json();
}

// Получить свободные слоты врача
export async function getDoctorSlots(doctorId) {
    return apiRequest(`/doctor/${doctorId}/slots`, 'GET');
}
