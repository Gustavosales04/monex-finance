async function fazercadastro() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const mensagem = document.getElementById("mensagem");

    try{
        const data = await cadastrar(name,email,password)
        
        console.log(data);
        
        mensagem.textContent  = data.message
        
        if (data.message != "Usuario cadastrado com sucesso!"){
            mensagem.style.color = "red"
            setTimeout(() => {
                mensagem.textContent = "";
                mensagem.style.color = "black"
            }, 8000);
        }


        if (data.message == "Usuario cadastrado com sucesso!"){
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        }

    }
    catch{
        console.log(mensagem);
    }
}