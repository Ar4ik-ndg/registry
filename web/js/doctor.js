// doctor.js
import { 
    getDoctorAppointments,
    completeAppointment,
    getPatientInfo,
    uploadAppointmentResults
} from './api.js';

document.addEventListener('DOMContentLoaded', async function() {
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'pacient.html?login=true';
        return;
    }

    try {
        const appointments = await getDoctorAppointments();
        displayAppointments(appointments);
        initEventHandlers();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        showErrorModal('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
    }
});

function displayAppointments(appointments) {
    const container = document.querySelector('.appointments');
    container.innerHTML = '';

    if (appointments.length === 0) {
        container.innerHTML = '<p class="no-appointments">Нет запланированных приёмов</p>';
        return;
    }

    appointments.forEach(appointment => {
        const card = document.createElement('div');
        card.className = `appointment-card ${getStatusClass(appointment.status)}`;
        card.dataset.id = appointment.id;
        
        card.innerHTML = `
            <div class="appointment-header">
                <h3>${appointment.patientName}</h3>
                <span class="appointment-status">Статус: ${appointment.status}</span>
            </div>
            <div class="appointment-details">
                <p><strong>Дата:</strong> ${formatDisplayDate(appointment.date)}</p>
                <p><strong>Время:</strong> ${appointment.time}</p>
                ${appointment.description ? `<p><strong>Жалобы:</strong> ${appointment.description}</p>` : ''}
            </div>
            <div class="appointment-actions">
                ${getActionsHTML(appointment.status, appointment.id)}
            </div>
        `;
        
        container.appendChild(card);
    });
}

function getStatusClass(status) {
    const statusMap = {
        'подтверждается': 'status-not-confirmed',
        'запланирован': 'status-planned',
        'отменён': 'status-cancelled',
        'завершён': 'status-completed',
        'обработка': 'status-processing'
    };
    return statusMap[status.toLowerCase()] || '';
}

function getActionsHTML(status, id) {
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus === 'запланирован') {
        return `
            <button class="action-btn complete-btn" data-id="${id}">Начать приём</button>
            <button class="action-btn cancel-btn" data-id="${id}">Отменить</button>
        `;
    }
    
    if (lowerStatus === 'завершён') {
        return `
            <button class="action-btn view-btn" data-id="${id}">Просмотр</button>
            <button class="action-btn repeat-btn" data-id="${id}">Повторный приём</button>
        `;
    }
    
    return '';
}

function initEventHandlers() {
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('complete-btn')) {
            const id = e.target.dataset.id;
            showCompleteAppointmentModal(id);
        }
        
        if (e.target.classList.contains('cancel-btn')) {
            const id = e.target.dataset.id;
            try {
                if (confirm('Вы уверены, что хотите отменить приём?')) {
                    await cancelAppointment(id);
                    showSuccessModal('Приём успешно отменён');
                    await refreshAppointments();
                }
            } catch (error) {
                showErrorModal('Ошибка при отмене: ' + error.message);
            }
        }
        
        if (e.target.classList.contains('view-btn')) {
            const id = e.target.dataset.id;
            viewAppointmentDetails(id);
        }
        
        if (e.target.classList.contains('repeat-btn')) {
            const id = e.target.dataset.id;
            showCreateAppointmentModal(id);
        }
    });
}

async function showCompleteAppointmentModal(appointmentId) {
    try {
        const appointment = await getAppointmentDetails(appointmentId);
        const patient = await getPatientInfo(appointment.patientId);

        const modalHTML = `
            <div class="modal" id="completeAppointmentModal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Завершение приёма</h2>
                    <div class="patient-info">
                        <h3>Пациент: ${patient.fullName}</h3>
                        <p>Дата рождения: ${patient.birthday || 'не указано'}</p>
                        <p>Полис: ${patient.medPolicy || 'не указано'}</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="diagnosis">Диагноз:</label>
                        <input type="text" id="diagnosis" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="recommendations">Рекомендации:</label>
                        <textarea id="recommendations" rows="4" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="appointmentFiles">Прикрепить файлы:</label>
                        <input type="file" id="appointmentFiles" multiple>
                    </div>
                    
                    <button class="action-btn confirm-btn" id="confirmComplete">Завершить приём</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('completeAppointmentModal');
        modal.style.display = 'block';

        document.getElementById('confirmComplete').addEventListener('click', async () => {
            const diagnosis = document.getElementById('diagnosis').value;
            const recommendations = document.getElementById('recommendations').value;
            const files = document.getElementById('appointmentFiles').files;

            if (!diagnosis || !recommendations) {
                showErrorModal('Пожалуйста, заполните все обязательные поля');
                return;
            }

            try {
                const results = {
                    diagnosis,
                    recommendations,
                    files: Array.from(files)
                };

                await completeAppointment(appointmentId, results);
                showSuccessModal('Приём успешно завершён');
                modal.remove();
                await refreshAppointments();
            } catch (error) {
                showErrorModal('Ошибка при завершении приёма: ' + error.message);
            }
        });

        modal.querySelector('.close').addEventListener('click', () => modal.remove());
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

    } catch (error) {
        showErrorModal('Ошибка при загрузке данных: ' + error.message);
    }
}

async function refreshAppointments() {
    try {
        const appointments = await getDoctorAppointments();
        displayAppointments(appointments);
    } catch (error) {
        console.error('Ошибка обновления приёмов:', error);
    }
}

function formatDisplayDate(apiDate) {
    return apiDate.split(' ')[0];
}

function showSuccessModal(message) {
    alert(message);
}

function showErrorModal(message) {
    alert(message);
}