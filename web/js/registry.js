import { getAllAppointments, processAppointment, getDoctorSlots } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const appointments = await getAllAppointments();
    renderAppointments(appointments);
  } catch (error) {
    console.error('Ошибка загрузки заявок:', error);
  }
});

function renderAppointments(appointments) {
  const container = document.getElementById('appointmentsList');
  container.innerHTML = '';

  appointments.forEach(app => {
    const appointmentEl = document.createElement('div');
    appointmentEl.className = `appointment-card status-${app.status}`;
    appointmentEl.innerHTML = `
      <h3>${app.patientName}</h3>
      <p>Врач: ${app.doctorName}</p>
      <p>Дата: ${app.requestedDate}</p>
      <p>Статус: ${app.status}</p>
      ${app.status === 'pending' ? `
        <div class="actions">
          <button class="btn-approve" data-id="${app.id}">Подтвердить</button>
          <button class="btn-reject" data-id="${app.id}">Отклонить</button>
        </div>
      ` : ''}
    `;
    container.appendChild(appointmentEl);
  });

  // Обработчики кнопок
  document.querySelectorAll('.btn-approve').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await processAppointment(btn.dataset.id, 'approve');
        const appointments = await getAllAppointments();
        renderAppointments(appointments);
      } catch (error) {
        console.error('Ошибка подтверждения:', error);
      }
    });
  });

  document.querySelectorAll('.btn-reject').forEach(btn => {
    btn.addEventListener('click', async () => {
      const reason = prompt('Укажите причину отказа:');
      if (reason) {
        try {
          await processAppointment(btn.dataset.id, 'reject', { reason });
          const appointments = await getAllAppointments();
          renderAppointments(appointments);
        } catch (error) {
          console.error('Ошибка отклонения:', error);
        }
      }
    });
  });
}