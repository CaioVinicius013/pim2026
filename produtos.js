let produtosOriginais = [];

async function carregarItens() {

    try {

        // TESTE SEM API
        produtosOriginais = [

    {
        idProduto: 1002,

        nmProduto:
            'Camiseta Oversized Prime',

        dsProduto:
            'Premium oversized',

        vlPreco: 99.90,

        categoria:
            'camiseta',

        imagem:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'
    },

    {
        nmProduto:
            'Moletom Prime',

        dsProduto:
            'Streetwear premium',

        vlPreco: 249.90,

        categoria:
            'moletom',

        imagem:
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
    },

    {
        nmProduto:
            'Calça Cargo',

        dsProduto:
            'Minimalista premium',

        vlPreco: 189.90,

        categoria:
            'calca',

        imagem:
            'https://images.unsplash.com/photo-1506629905607-d9f8b0f6f3c7?w=800'
    }
];

        renderizarProdutos(
            produtosOriginais
        );

        ativarFiltros();

    } catch (error) {

        console.error(error);
    }
}

function renderizarProdutos(produtos) {

    const container =
        document.getElementById(
            'cards-container'
        );

    container.innerHTML = '';

    produtos.forEach(produto => {

        const card =
            document.createElement(
                'div'
            );

        card.className =
            'produto-card';

        card.innerHTML = `

            <a
                href="infoprodutos.html?id=${produto.idProduto}"
                class="produto-link"
            >

                <img
                    src="${produto.imagem}"
                    class="produto-img"
                >

                <div class="produto-info">

                    <h3>
                        ${produto.nmProduto}
                    </h3>

                    <p>
                        ${produto.dsProduto}
                    </p>

                    <div class="preco">
                        R$ ${produto.vlPreco}
                    </div>

                </div>

            </a>
        `;

        container.appendChild(
            card
        );
    });
}
function ativarFiltros() {

    // busca
    document
        .getElementById(
            'buscarProduto'
        )
        .addEventListener(
            'input',
            filtrarProdutos
        );

    // categoria
    document
        .getElementById(
            'filtroCategoria'
        )
        .addEventListener(
            'change',
            filtrarProdutos
        );

    // ordenar
    document
        .getElementById(
            'ordenarPreco'
        )
        .addEventListener(
            'change',
            filtrarProdutos
        );
}

function filtrarProdutos() {

    const busca =
        document
            .getElementById(
                'buscarProduto'
            )
            .value
            .toLowerCase();

    const categoria =
        document
            .getElementById(
                'filtroCategoria'
            )
            .value;

    const ordem =
        document
            .getElementById(
                'ordenarPreco'
            )
            .value;

    let produtosFiltrados =
        [...produtosOriginais];

    // busca
    produtosFiltrados =
        produtosFiltrados.filter(
            produto =>
                produto.nmProduto
                .toLowerCase()
                .includes(busca)
        );

    // categoria
    if (
        categoria !== 'todos'
    ) {
        produtosFiltrados =
            produtosFiltrados.filter(
                produto =>
                    produto.categoria ===
                    categoria
            );
    }

    // ordenar
    if (ordem === 'menor') {

        produtosFiltrados.sort(
            (a, b) =>
                a.vlPreco -
                b.vlPreco
        );

    } else if (
        ordem === 'maior'
    ) {

        produtosFiltrados.sort(
            (a, b) =>
                b.vlPreco -
                a.vlPreco
        );
    }

    renderizarProdutos(
        produtosFiltrados
    );
}

window.onload =
    carregarItens;