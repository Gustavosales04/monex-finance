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