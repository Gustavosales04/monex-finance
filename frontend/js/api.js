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