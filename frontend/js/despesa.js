function renderDespesas(lista) {
    const container = document.getElementById("lista-despesas");
    container.innerHTML = "";

    lista.forEach(d => {
        container.innerHTML += `
            <div class="despesa">
                <div class="info">
                    <span>${d.descricao}</span>
                    <span class="valor">R$ ${d.valor}</span>
                </div>
                <button class="delete">Excluir</button>
            </div>
        `;
    });
}


async function cadastrardespesa(){
    const descricao = document.getElementById("descricao").value
    const valor = document.getElementById("valor").value
    const data = document.getElementById("data").value
    const categoriaid = 9

    try {
        const response = despesa(descricao,valor,data,categoriaid)

        console.log(response)

    } catch (error) {
        console.log(response)
        alert(response.message)
    }
}