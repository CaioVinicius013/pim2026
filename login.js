document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ELEMENTOS
    // ==========================================

    const loginForm =
        document.getElementById(
            'loginForm'
        );

    const emailInput =
        document.getElementById(
            'email'
        );

    const passwordInput =
        document.getElementById(
            'senha'
        );

    const togglePasswordBtn =
        document.getElementById(
            'togglePassword'
        );

    const themeToggleBtn =
        document.getElementById(
            'themeToggle'
        );

    const loginButton =
        document.getElementById(
            'loginButton'
        );

    const apiFeedback =
        document.getElementById(
            'apiFeedback'
        );

    // ==========================================
    // URL DA API
    // TROQUE APENAS AQUI
    // ==========================================

    const API_URL =
        'https://sublime-abdominal-pureness.ngrok-free.dev/PrimeOutfit/login';

    // Exemplo:
    // const API_URL =
    // 'https://seu-ngrok.ngrok-free.app/login';

    // ==========================================
    // GERENCIAMENTO DE TEMA
    // ==========================================

    const savedTheme =
        localStorage.getItem(
            'theme'
        ) || 'dark';

    if (
        savedTheme ===
        'light'
    ) {

        document.body.classList.add(
            'light-theme'
        );

        updateThemeIcon(true);
    }

    themeToggleBtn?.addEventListener(
        'click',
        () => {

            const isLight =
                document.body.classList.toggle(
                    'light-theme'
                );

            localStorage.setItem(
                'theme',
                isLight
                    ? 'light'
                    : 'dark'
            );

            updateThemeIcon(
                isLight
            );
        }
    );

    function updateThemeIcon(
        isLight
    ) {

        const icon =
            themeToggleBtn?.querySelector(
                'i'
            );

        if (!icon) return;

        icon.className =
            isLight
                ? 'fas fa-sun'
                : 'fas fa-moon';
    }

    // ==========================================
    // MOSTRAR / OCULTAR SENHA
    // ==========================================

    togglePasswordBtn?.addEventListener(
        'click',
        () => {

            const isPassword =
                passwordInput.type ===
                'password';

            passwordInput.type =
                isPassword
                    ? 'text'
                    : 'password';

            togglePasswordBtn
                .querySelector(
                    'i'
                ).className =
                isPassword
                    ? 'fas fa-eye-slash'
                    : 'fas fa-eye';
        }
    );

    // ==========================================
    // VALIDAR EMAIL
    // ==========================================

    function validateEmail(
        email
    ) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    }

    // ==========================================
    // INPUT INVÁLIDO
    // ==========================================

    function setInvalid(
        element,
        message
    ) {

        const group =
            element.closest(
                '.input-group'
            );

        if (!group) return;

        group.classList.add(
            'invalid'
        );

        const errorMessage =
            group.querySelector(
                '.error-message'
            );

        if (
            errorMessage
        ) {
            errorMessage.textContent =
                message;
        }
    }

    
    function clearInvalid(
        element
    ) {

        const group =
            element.closest(
                '.input-group'
            );

        group?.classList.remove(
            'invalid'
        );
    }

    // ==========================================
    // LIMPAR ERRO AO DIGITAR
    // ==========================================

    [
        emailInput,
        passwordInput
    ].forEach(input => {

        input?.addEventListener(
            'input',
            () => {

                clearInvalid(
                    input
                );
            }
        );
    });

    // ==========================================
    // LOGIN
    // ==========================================

    loginForm?.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();

            let isValid =
                true;

            apiFeedback.style.display =
                'none';

            // ======================
            // VALIDAÇÕES
            // ======================

            if (
                !emailInput.value.trim()
            ) {

                setInvalid(
                    emailInput,
                    'E-mail obrigatório'
                );

                isValid =
                    false;

            } else if (
                !validateEmail(
                    emailInput.value.trim()
                )
            ) {

                setInvalid(
                    emailInput,
                    'E-mail inválido'
                );

                isValid =
                    false;
            }

            if (
                !passwordInput.value
            ) {

                setInvalid(
                    passwordInput,
                    'Senha obrigatória'
                );

                isValid =
                    false;
            }

            if (!isValid)
                return;

            // ======================
            // JSON DA API
            // ======================

            const data = {

                email:
                    emailInput.value.trim(),

                senha:
                    passwordInput.value
            };

            console.log(
                'JSON enviado:',
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );

            // ======================
            // LOADING BOTÃO
            // ======================

            const originalText =
                loginButton.innerHTML;

            loginButton.disabled =
                true;

            loginButton.innerHTML =
                '<i class="fas fa-circle-notch fa-spin"></i> Entrando...';

            // ======================
            // ENVIO API
            // ======================

            try {

                const response =
                    await fetch(
                        API_URL,
                        {
                            method:
                                'POST',

                            headers:
                                {
                                    'Content-Type':
                                        'application/json',

                                    'ngrok-skip-browser-warning':
                                        'true'
                                },

                            body:
                                JSON.stringify(
                                    data
                                )
                        }
                    );

                const text =
                    await response.text();

                console.log(
                    'Status HTTP:',
                    response.status
                );

                console.log(
                    'Resposta API:',
                    text
                );

                // ======================
                // SUCESSO
                // ======================

                if (
                    response.ok
                ) {
                    const usuario = {
                        email: emailInput.value
                    };
                    localStorage.setItem(
                        'usuarioLogado',
                        JSON.stringify(usuario)
                    );
                     // opcional: token da API
                        // localStorage.setItem(
                        //    'token',
                        //    resultado.token
                        // );

                        // Redireciona para página que o usuário tentou acessar, ou index
                        const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
                        localStorage.removeItem('redirectAfterLogin');
                        window.location.href = redirectUrl;
                             
                    showFeedback(
                        'Login realizado com sucesso!',
                        'success'
                    );

                    // Exemplo redirect:
                    // window.location.href =
                    // 'dashboard.html';

                } else {

                    showFeedback(
                        text ||
                            'Email ou senha inválidos',
                        'error'
                    );
                }

            } catch (
                error
            ) {

                console.error(
                    'Erro:',
                    error
                );

                showFeedback(
                    'Erro ao conectar na API: ' +
                        error.message,
                    'error'
                );

            } finally {

                loginButton.disabled =
                    false;

                loginButton.innerHTML =
                    originalText;
            }
        }
    );

    // ==========================================
    // FEEDBACK
    // ==========================================

    function showFeedback(
        message,
        type
    ) {

        apiFeedback.textContent =
            message;

        apiFeedback.className =
            `api-feedback ${type}`;

        apiFeedback.style.display =
            'block';
    }

    // ==========================================
    // ENTER
    // ==========================================

    document.addEventListener(
        'keypress',
        (e) => {

            if (
                e.key ===
                'Enter'
            ) {

                loginForm?.dispatchEvent(
                    new Event(
                        'submit'
                    )
                );
            }
        }
    );
});