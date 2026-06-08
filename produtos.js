async function carregarProdutos() {

    try {

        const response =
            
    await fetch(
'https://sublime-abdominal-pureness.ngrok-free.dev/PrimeOutfit/produtos/busca',
        {
            method: 'GET',

            headers: {
                'ngrok-skip-browser-warning':
                    'true',

                'Content-Type':
                    'application/json'
            }
        }
    );

        if (!response.ok) {

            throw new Error(
                'Erro ao buscar API'
            );
        }

        const produtos =
            await response.json();

        console.log(
            'Produtos API:',
            produtos
        );

        renderizarProdutos(
            produtos
        );

    } catch (error) {

        console.error(
            'Erro API:',
            error
        );
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

        // URL da imagem
        const imagemUrl =

`https://sublime-abdominal-pureness.ngrok-free.dev/imagens/${produto.urlImagem}`;

        card.innerHTML = `

            <a
                href="
infoprodutos.html?id=${produto.idProduto}
                "
                class="
                produto-link
                "
            >

                <img
                    src="${imagemUrl}"
                    class="
                    produto-img
                    "
                    alt="
                    ${produto.nmProduto}
                    "

                    
                >

                <div
                    class="
                    produto-info
                    "
                >

                    <h3>
                        ${produto.nmProduto}
                    </h3>

                    <p>
                        ${produto.dsProduto}
                    </p>

                    <div
                        class="
                        preco
                        "
                    >
                        R$
                        ${produto.vlPreco}
                    </div>

                </div>

            </a>
        `;

        container.appendChild(
            card
        );
    });
}


carregarProdutos();