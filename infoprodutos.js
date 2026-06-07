const params =
    new URLSearchParams(
        window.location.search
    );

const id =
    Number(
        params.get('id')
    );

console.log(
    'ID da URL:',
    id
);


// PRODUTOS DE TESTE
const produtos = [

    {
        idProduto: 1002,

        nmProduto:
            'Camisa Polo Prime',

        dsProduto:
            'Camisa premium algodão.',

        vlPreco: 129.90,

        imagem:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'
    },

    {
        idProduto: 1003,

        nmProduto:
            'Moletom Prime',

        dsProduto:
            'Streetwear premium.',

        vlPreco: 249.90,

        imagem:
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
    },

    {
        idProduto: 1004,

        nmProduto:
            'Jaqueta Prime',

        dsProduto:
            'Jaqueta premium.',

        vlPreco: 389.90,

        imagem:
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
    }
];


// procura produto
const produto =
    produtos.find(
        p =>
        p.idProduto ===
        id
    );

console.log(
    'Produto encontrado:',
    produto
);

const container =
    document.getElementById(
        'produto-container'
    );


// se não encontrar
if (!produto) {

    container.innerHTML = `

        <div
            style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#050505;
                color:white;
                font-size:2rem;
            "
        >
            Produto não encontrado
        </div>
    `;

}

// renderiza produto
else {

    container.innerHTML = `

        <div class="produto-page">

            <div
                class="produto-imagem"
            >

                <img
                    src="${produto.imagem}"
                    alt="${produto.nmProduto}"
                >

            </div>

            <div
                class="
                produto-detalhes
                "
            >

                <h1>
                    ${produto.nmProduto}
                </h1>

                <p>
                    ${produto.dsProduto}
                </p>

                <h2>
                    R$
                    ${produto.vlPreco}
                </h2>

                <button>
                    Comprar Agora
                </button>

            </div>

        </div>
    `;
}