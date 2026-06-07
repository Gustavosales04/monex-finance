async function fazerlogin() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const mensagem = document.getElementById("mensagem");

    if (!email || !password) {
        mensagem.textContent = "Por favor, preencha todos os campos.";
        mensagem.style.color = "red";
        return;
    }

    try {
        const data = await logar(email,password);
        
        if (data.message){
            mensagem.textContent = data.message;
            mensagem.style.color = "red";
            setTimeout(() => {
                mensagem.textContent = "";
            }, 8000);
        } else {
            localStorage.setItem("token", data);
            setTimeout(() => {
                window.location.href = "home.html";
            }, 1500);
        }
    } catch (error) {
        console.error("Erro ao tentar logar:", error);
        mensagem.textContent = "Erro ao conectar com o servidor. Tente novamente mais tarde.";
        mensagem.style.color = "red";
    }
}