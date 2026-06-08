async function carregarProduto() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        Number(
            params.get('id')
        );

    console.log(
        'ID URL:',
        id
    );

    try {

        const response =
            await fetch(
'https://sublime-abdominal-pureness.ngrok-free.dev/PrimeOutfit/produtos/busca'
            );

        const produtos =
            await response.json();

        console.log(
            'Produtos API:',
            produtos
        );

        const produto =
            produtos.find(
                p =>
                p.idProduto === id
            );

        console.log(
            'Produto encontrado:',
            produto
        );

        const container =
            document.getElementById(
                'produto-container'
            );

        if (!produto) {

            container.innerHTML =
                '<h1>Produto não encontrado</h1>';

            return;
        }

        container.innerHTML = `

            <div style="
                display:flex;
                gap:40px;
                padding:50px;
                color:white;
                background:#111;
                min-height:100vh;
            ">

                <div>

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

                    <p>
                        Categoria:
                        ${produto.idCategoria}
                    </p>

                </div>

            </div>
        `;

    } catch (error) {

        console.error(
            'ERRO:',
            error
        );
    }
}

carregarProduto();