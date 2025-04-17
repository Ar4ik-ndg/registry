document.addEventListener('DOMContentLoaded', function() {
    const publicPages = ['pacient.html', 'index.html', ''];
    const currentPage = window.location.pathname.split('/').pop();
    
    // Если страница публичная - не проверяем авторизацию
    if (publicPages.includes(currentPage)) return;

    // В auth.js обновляем protectedPages
    const protectedPages = {
        'patient': ['personal-account.html', 'zapis.html'],
        'doctor': ['vrach.html', 'vrach1.html'],
        'admin': ['admin.html']
    };

    // Проверка авторизации
    if (localStorage.getItem('isAuthenticated') !== 'true') {
        window.location.href = 'pacient.html?login=true';
        return;
    }

    // Проверка доступа по роли
    const userRole = localStorage.getItem('userRole');
    const allowedPages = protectedPages[userRole] || [];
    
    if (!allowedPages.includes(currentPage)) {
        alert('У вас нет доступа к этой странице');
        // Перенаправляем на страницу по умолчанию для роли
        const defaultPages = {
            'admin': 'admin.html',
            'doctor': 'vrach.html',
            'patient': 'personal-account.html'
        };
        window.location.href = defaultPages[userRole] || 'pacient.html';
    }
});