import { 
    getUserAppointments, 
    cancelAppointment,
    createAppointment,
    updateUserProfile,
    getCurrentUser,
    getDoctorsBySpecialization,
    confirmAppointment as confirmAppointmentAPI
} from './api.js';

// Константы для специальностей
const SPECIALIZATIONS = [
    "Терапевт", "Кардиолог", "Невролог", 
    "Эндокринолог", "Гастроэнтеролог", "ЛОР",
    "Офтальмолог", "Ортопед", "Дерматолог"
];

document.addEventListener('DOMContentLoaded', async function() {
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'pacient.html?login=true';
        return;
    }

    try {
        const [user, appointments] = await Promise.all([
            getCurrentUser(),
            getUserAppointments()
        ]);
        
        displayUserInfo(user);
        displayAppointments(appointments);
        initEventHandlers();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        showErrorModal('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
    }
});

function displayUserInfo(user) {
    const fields = {
        'fullName': user.fullName,
        'birthday': user.birthday || 'не указано',
        'passport': user.passport || 'не указано',
        'snils': user.snils || 'не указано',
        'medPolicy': user.medPolicy || 'не указано',
        'email': user.email,
        'phone': user.phone || 'не указано'
    };

    Object.entries(fields).forEach(([field, value]) => {
        const element = document.querySelector(`.info-value[data-field="${field}"]`);
        if (element) {
            if (field === 'email') {
                element.innerHTML = `<a href="mailto:${value}">${value}</a>`;
            } else {
                element.textContent = value;
            }
        }
    });
}

function displayAppointments(appointments) {
    const container = document.querySelector('.appointments');
    container.innerHTML = '';

    if (appointments.length === 0) {
        container.innerHTML = `
            <div class="no-appointments">
                <p>У вас нет запланированных приёмов</p>
                <button class="action-btn new-appointment-btn">Записаться на приём</button>
            </div>
        `;
        return;
    }

    appointments.forEach(appointment => {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.dataset.id = appointment.id;
        
        const statusClass = getStatusClass(appointment.status);
        const actionsHTML = getActionsHTML(appointment.status, appointment.id);
        
        card.innerHTML = `
            <div class="appointment-header">
                <h3>Приём ${formatDisplayDate(appointment.date)}</h3>
                <span class="appointment-status ${statusClass}">Статус: ${appointment.status}</span>
            </div>
            <div class="appointment-details">
                <p><strong>Врач:</strong> ${appointment.doctor}</p>
                <p><strong>Жалобы:</strong> ${appointment.description || 'не указаны'}</p>
                ${appointment.results ? `<p><strong>Результаты:</strong> ${appointment.results}</p>` : ''}
            </div>
            ${actionsHTML}
        `;
        
        container.appendChild(card);
    });

    // Добавляем кнопку для новой записи
    const newAppointmentBtn = document.createElement('button');
    newAppointmentBtn.className = 'action-btn new-appointment-btn';
    newAppointmentBtn.textContent = 'Записаться на приём';
    newAppointmentBtn.addEventListener('click', showSpecializationModal);
    container.appendChild(newAppointmentBtn);
}

function initEventHandlers() {
    document.addEventListener('click', async (e) => {
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
        
        if (e.target.classList.contains('confirm-btn')) {
            const id = e.target.dataset.id;
            try {
                await confirmAppointmentAPI(id);
                showSuccessModal('Приём подтверждён');
                await refreshAppointments();
            } catch (error) {
                showErrorModal('Ошибка при подтверждении: ' + error.message);
            }
        }
        
        if (e.target.classList.contains('transfer-btn')) {
            const id = e.target.dataset.id;
            showRescheduleModal(id);
        }
        
        if (e.target.classList.contains('repeat-btn')) {
            const id = e.target.dataset.id;
            showCreateAppointmentModal(id);
        }
        
        if (e.target.classList.contains('new-appointment-btn')) {
            showSpecializationModal();
        }
    });

    document.querySelector('.edit-btn')?.addEventListener('click', showEditProfileModal);
    document.querySelector('.change-pwd-btn')?.addEventListener('click', showChangePasswordModal);
    document.querySelector('.logout-btn')?.addEventListener('click', logout);
}

// ========== ФУНКЦИИ ЗАПИСИ НА ПРИЕМ ==========
function showSpecializationModal() {
    const modalHTML = `
        <div class="modal" id="specializationModal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Выберите специалиста</h2>
                <div class="specialization-list">
                    ${SPECIALIZATIONS.map(spec => `
                        <div class="specialization-item" data-spec="${spec}">
                            <h3>${spec}</h3>
                            <button class="action-btn select-btn">Выбрать</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('specializationModal');
    modal.style.display = 'block';

    document.querySelectorAll('.select-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const spec = this.closest('.specialization-item').dataset.spec;
            modal.remove();
            showDoctorsModal(spec);
        });
    });

    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

async function showDoctorsModal(specialization) {
    try {
        const doctors = await getDoctorsBySpecialization(specialization);
        
        const modalHTML = `
            <div class="modal" id="doctorsModal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>${specialization}: доступные врачи</h2>
                    <div class="doctors-list">
                        ${doctors.length > 0 
                            ? doctors.map(doctor => `
                                <div class="doctor-item" data-id="${doctor.id}">
                                    <h3>${doctor.fullName}</h3>
                                    <p>${doctor.specialization || specialization}</p>
                                    <p>Опыт: ${doctor.experience || 'не указан'}</p>
                                    <button class="action-btn select-btn">Выбрать</button>
                                </div>
                              `).join('')
                            : '<p>Нет доступных врачей</p>'}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('doctorsModal');
        modal.style.display = 'block';

        document.querySelectorAll('.select-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const doctorId = this.closest('.doctor-item').dataset.id;
                const doctorName = this.closest('.doctor-item').querySelector('h3').textContent;
                modal.remove();
                showDateTimeModal(doctorId, doctorName, specialization);
            });
        });

        modal.querySelector('.close').addEventListener('click', () => modal.remove());
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

    } catch (error) {
        showErrorModal('Ошибка при загрузке врачей: ' + error.message);
    }
}

function showDateTimeModal(doctorId, doctorName, specialization) {
    const modalHTML = `
        <div class="modal" id="dateTimeModal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Выберите дату и время</h2>
                <p>Врач: ${doctorName} (${specialization})</p>
                
                <div class="form-group">
                    <label for="appointmentDate">Дата:</label>
                    <input type="date" id="appointmentDate" min="${getCurrentDate()}">
                </div>
                
                <div class="form-group">
                    <label for="appointmentTime">Время:</label>
                    <select id="appointmentTime">
                        ${generateTimeOptions()}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="appointmentDescription">Жалобы/симптомы:</label>
                    <textarea id="appointmentDescription" rows="3" required></textarea>
                </div>
                
                <button class="action-btn confirm-btn" id="confirmAppointment">Отправить заявку</button>
                <p class="info-text">Заявка будет обработана регистратурой в течение 24 часов</p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('dateTimeModal');
    modal.style.display = 'block';

    document.getElementById('confirmAppointment').addEventListener('click', async () => {
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        const description = document.getElementById('appointmentDescription').value;
        
        if (!date || !description) {
            showErrorModal('Пожалуйста, заполните все обязательные поля');
            return;
        }

        try {
            await createAppointment({
                doctorId: doctorId,
                requestedDate: `${formatDateForAPI(new Date(date))} ${time}`,
                description: description,
                status: 'pending'
            });
            
            showSuccessModal('Ваша заявка отправлена в регистратуру! Мы свяжемся с вами для подтверждения.');
            modal.remove();
            await refreshAppointments();
        } catch (error) {
            showErrorModal('Ошибка при отправке заявки: ' + error.message);
        }
    });

    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
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
    
    if (lowerStatus === 'подтверждается') {
        return `
            <div class="appointment-actions">
                <button class="action-btn confirm-btn" data-id="${id}">Подтвердить</button>
            </div>
        `;
    }
    
    if (lowerStatus === 'запланирован') {
        return `
            <div class="appointment-actions">
                <button class="action-btn transfer-btn" data-id="${id}">Перенести</button>
                <button class="action-btn cancel-btn" data-id="${id}">Отменить</button>
            </div>
        `;
    }
    
    if (lowerStatus === 'завершён') {
        return `
            <div class="appointment-actions">
                <button class="action-btn repeat-btn" data-id="${id}">Записаться повторно</button>
            </div>
        `;
    }
    
    return '';
}

function formatDisplayDate(apiDate) {
    return apiDate.split(' ')[0];
}

async function refreshAppointments() {
    try {
        const appointments = await getUserAppointments();
        displayAppointments(appointments);
    } catch (error) {
        console.error('Ошибка обновления приёмов:', error);
    }
}

function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function generateTimeOptions() {
    const times = [];
    for (let hour = 9; hour <= 16; hour++) {
        if (hour === 12) continue; // Пропускаем обед
        times.push(`<option value="${hour.toString().padStart(2, '0')}:00">${hour}:00</option>`);
    }
    return times.join('');
}

function formatDateForAPI(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function showSuccessModal(message) {
    alert(message);
}

function showErrorModal(message) {
    alert(message);
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        window.location.href = 'pacient.html';
    }
}

// Заглушки для модальных окон (реализуйте по аналогии)
function showEditProfileModal() {
    alert('Функция редактирования профиля будет реализована позже');
}

function showChangePasswordModal() {
    alert('Функция смены пароля будет реализована позже');
}

function showRescheduleModal(appointmentId) {
    alert(`Функция переноса приёма ${appointmentId} будет реализована позже`);
}

function showCreateAppointmentModal(appointmentId) {
    alert(`Функция повторной записи для приёма ${appointmentId} будет реализована позже`);
}