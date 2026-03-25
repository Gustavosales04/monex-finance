async function fazerlogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const mensagem = document.getElementById("mensagem");

    try {
        const data = await logar(email,password);

        console.log(data);
        
        if (data.message){
            mensagem.textContent  = data.message
            mensagem.style.color = "red"
            setTimeout(() => {
                mensagem.textContent = "";
            }, 8000);
        }else{
            localStorage.setItem("token", data)
            setTimeout(() => {
                window.location.href = "despesa.html";
            }, 1500);

        }

    } catch{
        console.log("Erro ao tentar logar")
    }

}