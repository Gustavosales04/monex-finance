function renderDespesas(lista) {
    const container = document.getElementById("corpo-tabela");
    container.innerHTML = "";

    lista.forEach(d => {
        const [ano, mes, dia] = d.data.split('T')[0].split('-');
        const data = `${dia}/${mes}/${ano}`;
        const valorFormatado = parseFloat(d.valor).toFixed(2).replace('.', ',');
        container.innerHTML += `
            <tr>
                <td>${d.descricao}</td>
                <td>${d.categoria || "N/A"}</td>
                <td>R$${valorFormatado}</td>
                <td>${data}</td>
                <td><button class="delete" onclick="deletarDespesa(${d.id})">Excluir</button></td>
            </tr>
        `;
    });
}

async function carregarDespesas() {
    try {
        const response = await listarDespesa();
        
        if (response && Array.isArray(response)) {
            renderDespesas(response);
        } else if (response.erro) {
            alert(response.erro);
        } else {
            console.log("Resposta inesperada:", response);
        }
    } catch (error) {
        console.error("Erro ao carregar despesas:", error);
        alert("Erro ao carregar despesas");
    }
}

async function carregarCategorias() {
    if (window.initCategoryCombo) {
        await window.initCategoryCombo();
    }
}

async function deletarDespesa(id) {
    const confirmar = confirm("Tem certeza que deseja excluir esta despesa?");

    if (!confirmar) {
        return;
    }

    try {
        const response = await deletarDespesaApi(id);

        if (response && response.erro) {
            alert(response.erro);
            return;
        }

        alert("Despesa excluida com sucesso!");
        await carregarDespesas();
    } catch (error) {
        console.error("Erro ao excluir despesa:", error);
        alert("Erro ao excluir despesa");
    }
}

async function cadastrardespesa(){
    const descricaoEl = document.getElementById("descricao");
    const valorEl = document.getElementById("valor");
    const dataEl = document.getElementById("data");

    const descricao = descricaoEl.value;
    const valor = valorEl.value;
    const data = dataEl.value;
    const categoriaid = window.selected ? window.selected.id : null;

    descricaoEl.value = "";
    valorEl.value = "";
    dataEl.value = "";
    const categoriaInput = document.getElementById("categoria-input");
    if (categoriaInput) categoriaInput.value = "";
    window.selected = null;

    try {
        const response = await despesa(descricao,valor,data,categoriaid);

        console.log(response);
        console.log(response.id);
        
        if (response && response.id) {
            alert("Despesa adicionada com sucesso!");
        } else if (response && response.erro) {
            alert(response.erro);
        }
        await carregarDespesas();

    } catch (error) {
        console.log(error)
        alert("Erro ao cadastrar despesa")
    }
}


document.addEventListener("DOMContentLoaded", () => {
    carregarCategorias();
    carregarDespesas();
});
