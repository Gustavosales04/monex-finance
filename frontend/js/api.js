(() => {
    const paginasPublicas = ["login.html", "cadastro.html"];
    const paginaAtual = window.location.pathname.split("/").pop();

    if (paginasPublicas.includes(paginaAtual)) {
        return;
    }

    const redirecionarParaLogin = () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    };

    const decodificarPayloadJwt = (token) => {
        const partes = token.split(".");

        if (partes.length !== 3) {
            throw new Error("Token invalido");
        }

        const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
        const base64Completo = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
        const payload = atob(base64Completo);

        return JSON.parse(payload);
    };

    const token = localStorage.getItem("token");

    if (!token) {
        redirecionarParaLogin();
        return;
    }

    try {
        const payload = decodificarPayloadJwt(token);
        const agora = Math.floor(Date.now() / 1000);

        if (!payload.exp || payload.exp <= agora) {
            redirecionarParaLogin();
        }
    } catch (error) {
        redirecionarParaLogin();
    }
})();

async function cadastrar(name,email,password) {
    const response = await fetch("http://localhost:3000/cadastro",{
        method: "Post",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password})
    });

    return response.json();  
}

async function logar(email,password) {
    const response = await fetch("http://localhost:3000/login",{
        method: "Post",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password})
    });

    return response.json();  
}

async function despesa(descricao,valor,data,categoriaid) {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/criar-despesa",{
        method: "Post",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            descricao: descricao,
            valor: valor,
            data: data,
            categoriaid: categoriaid})
    });

    return response.json();  
}

async function listarDespesa() {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/listar-despesa",{
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    return response.json();  
}

async function carregarDespesasMes() {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/listar-despesa-mes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Erro na requisicao: ${response.status}`);
    }

    const despesas = await response.json();

    if (!Array.isArray(despesas)) {
        throw new Error("Resposta invalida da API.");
    }

    return despesas;
}

async function deletarDespesaApi(id) {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/deletar-despesa",{
        method: "DELETE",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            id: id
        })
    });

    return response.json();  
}

async function listarCategorias() {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/listar-categoria",{
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    console.log("Resposta listarCategorias:", response);
    return response.json();  
}

async function criarCategoria(nome) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Token de autenticação não encontrado.");
    }

    const response = await fetch("http://localhost:3000/criar-categoria", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: nome })
    });

    const text = await response.text();
    if (!response.ok) {
        throw new Error(text || `Erro na requisição: ${response.status}`);
    }

    try {
        return JSON.parse(text);
    } catch (err) {
        return { Categoria: nome };
    }
}
