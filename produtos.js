async function carregarItens() {

    try {

        const response = await fetch(
            'https://sublime-abdominal-pureness.ngrok-free.dev/PrimeOutfit/produtos/busca'
        );

        if (!response.ok) {

            throw new Error(
                'Erro ao buscar API'
            );
        }

        const produtos =
            await response.json();

        console.log(produtos);

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
                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                    class="produto-img"
                >

                <h3>
                    ${produto.nome}
                </h3>

                <p>
                    ${produto.descricao}
                </p>

                <div class="preco">
                    R$ ${produto.preco}
                </div>
            `;

            container.appendChild(
                card
            );

        });

    } catch (error) {

        console.error(
            'Erro:',
            error
        );
    }
}

document.addEventListener(
    'DOMContentLoaded',
    carregarItens
);