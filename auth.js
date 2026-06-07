const link =
    document.createElement(
        'link'
    );

link.rel =
    'stylesheet';

link.href =
    'auth.css';

document.head.appendChild(
    link
);



document.addEventListener(
    'DOMContentLoaded',
    () => {

        const usuario =
            JSON.parse(
                localStorage.getItem(
                    'usuarioLogado'
                )
            );

        const navUser =
            document.getElementById(
                'nav-user'
            );

        if (!navUser) return;

        // usuário logado
        if (usuario) {

            navUser.innerHTML = `

                <!-- CARRINHO -->
                <a href="checkout.html"
                   class="cart-btn"
                   style="
                    position:relative;
                    text-decoration:none;
                    font-size:1.2rem;
                   ">

                    🛒

                    <span id="cartBadge"
                          style="
                            display:none;
                            position:absolute;
                            top:-8px;
                            right:-10px;
                            background:#d4af37;
                            color:#000;
                            font-size:0.65rem;
                            font-weight:700;
                            width:18px;
                            height:18px;
                            border-radius:50%;
                            align-items:center;
                            justify-content:center;
                          ">

                        0

                    </span>

                </a>

                <!-- PERFIL -->
                <a href="perfil.html"
                   class="perfil-user">

                    👤
                    ${usuario.email}

                </a>

                <!-- SAIR -->
                <button
                    id="logout-btn"
                    class="logout-btn">

                    Sair

                </button>

                <!-- CONTATO -->
                <a href="#contato">
                    Contato
                </a>
            `;

            // logout
            document
                .getElementById(
                    'logout-btn'
                )
                .addEventListener(
                    'click',
                    () => {

                        localStorage.removeItem(
                            'usuarioLogado'
                        );

                        window.location.reload();
                    }
                );
        }
    }
);