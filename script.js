// Espera o HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {

    // ==========================
    // ELEMENTOS DA PÁGINA
    // ==========================

    const themeToggle =
        document.getElementById('theme-toggle');

    const body = document.body;

    const authForm =
        document.getElementById('auth-form');

    const cpfInput =
        document.getElementById('cpf');

    const cepInput =
        document.getElementById('cep');

    // ==========================
    // CONFIGURAÇÃO DA API
    // ==========================

    const API_URL =
        'https://sublime-abdominal-pureness.ngrok-free.dev/PrimeOutfit/cadastro';
    // ==========================
    // GERENCIAMENTO DE TEMA
    // ==========================
    // Recupera tema salvo
    const savedTheme =
        localStorage.getItem('theme') ||
        'dark-theme';

    body.className = savedTheme;

    updateThemeIcon();

    // Evento botão trocar tema
    themeToggle.addEventListener(
        'click',
        () => {

            
            if ( body.classList.contains(
                    'dark-theme'
                )
            ) {
                body.className =
                    'light-theme';

                localStorage.setItem(
                    'theme',
                    'light-theme'
                );

            } else {

                body.className =
                    'dark-theme';

                localStorage.setItem(
                    'theme',
                    'dark-theme'
                );
            }

            updateThemeIcon();
        }
    );

    // Atualiza ícone do botão
    function updateThemeIcon() {

        const icon =
            themeToggle.querySelector('i');

        if (
            body.classList.contains(
                'light-theme'
            )
        ) {
            icon.className =
                'fas fa-sun';

        } else {

            icon.className =
                'fas fa-moon';
        }
    }

    // ==========================
    // MÁSCARA CPF
    // ==========================

    cpfInput.addEventListener(
        'input',
        (e) => {

            let value =
                e.target.value.replace(
                    /\D/g,
                    ''
                );

            // Limite 11 números
            value = value.slice(0, 11);

            if (value.length > 9) {

                value = value.replace(
                    /(\d{3})(\d{3})(\d{3})(\d{2})/,
                    '$1.$2.$3-$4'
                );

            } else if (
                value.length > 6
            ) {

                value = value.replace(
                    /(\d{3})(\d{3})(\d{1,3})/,
                    '$1.$2.$3'
                );

            } else if (
                value.length > 3
            ) {

                value = value.replace(
                    /(\d{3})(\d{1,3})/,
                    '$1.$2'
                );
            }

            e.target.value = value;
        }
    );

    // ==========================
    // MÁSCARA CEP
    // ==========================

    cepInput.addEventListener(
        'input',
        (e) => {

            let value =
                e.target.value.replace(
                    /\D/g,
                    ''
                );

            // Limite 8 números
            value = value.slice(0, 8);

            if (value.length > 5) {

                value = value.replace(
                    /(\d{5})(\d{1,3})/,
                    '$1-$2'
                );
            }

            e.target.value = value;
        }
    );

    // ==========================
    // ENVIO FORMULÁRIO
    // ==========================

    authForm.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();

            let isValid = true;

            const inputs =
                authForm.querySelectorAll(
                    'input'
                );

            // ==========================
            // VALIDAÇÕES
            // ==========================

            inputs.forEach(input => {

                const group =
                    input.parentElement;

                // Campo obrigatório
                if (
                    !input.value.trim()
                ) {

                    group.classList.add(
                        'error'
                    );

                    isValid = false;

                } else {

                    group.classList.remove(
                        'error'
                    );
                }

                // Validar email
                if (
                    input.type ===
                        'email' &&
                    input.value
                ) {

                    const emailRegex =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    if (
                        !emailRegex.test(
                            input.value
                        )
                    ) {

                        group.classList.add(
                            'error'
                        );

                        isValid = false;
                    }
                }

                // Validar CPF
                if (
                    input.id ===
                        'cpf' &&
                    input.value.length <
                        14
                ) {

                    group.classList.add(
                        'error'
                    );

                    isValid = false;
                }

                // Validar CEP
                if (
                    input.id ===
                        'cep' &&
                    input.value.length <
                        9
                ) {

                    group.classList.add(
                        'error'
                    );

                    isValid = false;
                }
            });

            // Se formulário inválido
            if (!isValid) {

                alert(
                    'Preencha os campos corretamente.'
                );

                return;
            }

            // ==========================
            // MONTA JSON
            // ==========================
// Objetos json para conexao via API de cadastro
            const data = {

                nmUsuario:
                    document.getElementById(
                        'nome'
                    ).value,

                email:
                    document.getElementById(
                        'email'
                    ).value,

                senha:
                    document.getElementById(
                        'senha'
                    ).value,

                idade: Number(
                    document.getElementById(
                        'idade'
                    ).value
                ),

                // Remove máscara
                cpf:
                    document.getElementById(
                        'cpf'
                    ).value.replace(
                        /\D/g,
                        ''
                    ),

                endereco:
                    document.getElementById(
                        'endereco'
                    ).value,

                // Remove máscara
                cep:
                    document.getElementById(
                        'cep'
                    ).value
            };

            console.log(
                'JSON enviado:',
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );

            // ==========================
            // BOTÃO LOADING
            // ==========================

            const submitBtn =
                authForm.querySelector(
                    '.submit-btn'
                );

            const originalContent =
                submitBtn.innerHTML;

            submitBtn.disabled =
                true;

            submitBtn.innerHTML =
                '<i class="fas fa-circle-notch fa-spin"></i> Enviando...';

            // ==========================
            // ENVIO PARA API
            // ==========================

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

                // Sucesso
                if (
                    response.ok
                ) {

                    alert(
                        'Cadastro realizado com sucesso!'
                    );

                    authForm.reset();

                } else {

                    alert(
                        'Erro da API:\n\n' +
                            text
                    );
                }

            } catch (error) {

                console.error(
                    'Erro completo:',
                    error
                );

                alert(
                    'Erro ao conectar com a API:\n\n' +
                        error.message
                );

            } finally {

                // Restaura botão
                submitBtn.innerHTML =
                    originalContent;

                submitBtn.disabled =
                    false;
            }
        }
    );
});
