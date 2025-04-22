document.addEventListener('DOMContentLoaded', function() {
    const publicPages = ['pacient.html', 'index.html', ''];
    const currentPage = window.location.pathname.split('/').pop();
    
    // Если страница публичная - не проверяем авторизацию
    if (publicPages.includes(currentPage)) return;

    const protectedPages = {
        'USER': ['personal-account.html', 'zapis.html'],
        'MEDIC': ['vrach.html', 'vrach1.html', 'zapis.html'],
        'ADMIN': ['admin.html','vrach.html', 'vrach1.html', 'zapis.html'],
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
            'ADMIN': 'admin.html',
            'MEDIC': 'vrach.html',
            'USER': 'personal-account.html'
        };
        window.location.href = defaultPages[userRole] || 'pacient.html';
    }
});