document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const authForm = document.getElementById('auth-form');
    const cpfInput = document.getElementById('cpf');
    const cepInput = document.getElementById('cep');

    // Theme Management
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    body.className = savedTheme;
    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.className = 'light-theme';
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.className = 'dark-theme';
            localStorage.setItem('theme', 'dark-theme');
        }
        updateThemeIcon();
    });

    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('light-theme')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // CPF Masking (000.000.000-00)
    cpfInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }
        
        e.target.value = value;
    });

    // CEP Masking (00000-000)
    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        
        if (value.length > 5) {
            value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
        }
        
        e.target.value = value;
    });

    // Form Validation and Submission
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const inputs = authForm.querySelectorAll('input');
        inputs.forEach(input => {
            const group = input.parentElement;
            
            // Basic required check
            if (!input.value.trim()) {
                group.classList.add('error');
                isValid = false;
            } else {
                group.classList.remove('error');
            }

            // Email check
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    group.classList.add('error');
                    isValid = false;
                }
            }

            // CPF check
            if (input.id === 'cpf' && input.value.length < 14) {
                group.classList.add('error');
                isValid = false;
            }

            // CEP check
            if (input.id === 'cep' && input.value.length < 9) {
                group.classList.add('error');
                isValid = false;
            }
        });

        if (isValid) {
            const submitBtn = authForm.querySelector('.submit-btn');
            const originalContent = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processando...';
            
            // Simulate API call
            setTimeout(() => {
                alert('Bem-vindo à Prime Outfit! Cadastro realizado com sucesso.');
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                authForm.reset();
            }, 1500);
        }
    });
});