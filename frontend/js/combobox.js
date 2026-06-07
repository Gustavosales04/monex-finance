window.categories = [];
window.selected = null;

window.initCategoryCombo = async function() {
    const input = document.getElementById("categoria-input");
    const createButton = document.getElementById("categoria-create-button");
    const dropdown = document.getElementById("categoria-dropdown");
    const combo = document.getElementById("categoria-combobox");

    if (!input || !createButton || !dropdown || !combo) {
        return;
    }

    input.addEventListener("input", () => {
        if (window.selected && window.selected.Categoria.toLowerCase() !== input.value.trim().toLowerCase()) {
            clearSelectedCategory();
        }
        renderCategoryDropdown();
    });

    input.addEventListener("focus", () => {
        renderCategoryDropdown();
        dropdown.classList.remove("hidden");
    });

    createButton.addEventListener("click", async () => {
        const nome = input.value.trim();
        if (!nome) return;
        if (isExactCategoriaMatch(nome)) {
            const exist = window.categories.find(item => item.Categoria.toLowerCase() === nome.toLowerCase());
            if (exist) selectCategory(exist);
            return;
        }
        await createCategory(nome);
    });

    document.addEventListener("click", (event) => {
        if (!combo.contains(event.target)) {
            dropdown.classList.add("hidden");
        }
    });

    await loadCategoryOptions();
};

async function loadCategoryOptions() {
    const response = await listarCategorias();
    if (response && Array.isArray(response)) {
        window.categories = response.map(item => ({
            id: item.id,
            Categoria: item.Categoria || item.categoria || item.Nome || item.nome || ""
        }));
    } else {
        window.categories = [];
    }
    renderCategoryDropdown();
}

function getCategoryQuery() {
    const input = document.getElementById("categoria-input");
    return input ? input.value.trim() : "";
}

function isExactCategoriaMatch(query) {
    return !!query && window.categories.some(item => item.Categoria.toLowerCase() === query.toLowerCase());
}

function renderCategoryDropdown() {
    const dropdown = document.getElementById("categoria-dropdown");
    const input = document.getElementById("categoria-input");
    const createButton = document.getElementById("categoria-create-button");

    if (!dropdown || !input || !createButton) return;

    const query = getCategoryQuery().toLowerCase();
    dropdown.innerHTML = "";

    const filtered = query
        ? window.categories.filter(item => item.Categoria.toLowerCase().includes(query))
        : window.categories.slice();

    filtered.forEach(item => {
        const option = document.createElement("div");
        option.className = "combo-option";
        option.textContent = item.Categoria;
        option.addEventListener("click", () => selectCategory(item));
        dropdown.appendChild(option);
    });

    const exactMatch = isExactCategoriaMatch(query);
    if (query && !exactMatch) {
        const createOption = document.createElement("div");
        createOption.className = "combo-option create-option";
        createOption.textContent = `+ Criar "${input.value.trim()}"`;
        createOption.addEventListener("click", async () => {
            await createCategory(input.value.trim());
        });
        dropdown.appendChild(createOption);
    }

    if (filtered.length === 0 && !query) {
        const emptyOption = document.createElement("div");
        emptyOption.className = "combo-option empty-option";
        emptyOption.textContent = "Nenhuma categoria encontrada";
        dropdown.appendChild(emptyOption);
    }

    createButton.disabled = !query || exactMatch;
}

async function createCategory(nome) {
    try {
        const response = await criarCategoria(nome);
        await loadCategoryOptions();
        const item = window.categories.find(item => item.Categoria.toLowerCase() === nome.toLowerCase());
        if (item) {
            selectCategory(item);
            return item;
        }
        const tempItem = {
            id: null,
            Categoria: response.Categoria || response.categoria || response.Nome || response.nome || nome
        };
        selectCategory(tempItem);
        return tempItem;
    } catch (error) {
        console.error("Erro ao criar categoria:", error);
        alert(error.message || "Não foi possível criar a categoria.");
        return null;
    }
}

function selectCategory(item) {
    window.selected = item;
    const input = document.getElementById("categoria-input");
    if (input) input.value = item.Categoria;
    renderSelectedCategory();
    const dropdown = document.getElementById("categoria-dropdown");
    if (dropdown) dropdown.classList.add("hidden");
}

function renderSelectedCategory() {
    // O valor selecionado permanece somente no input, sem tags extras.
}

function clearSelectedCategory() {
    window.selected = null;
    const input = document.getElementById("categoria-input");
    if (input) input.value = "";
    renderCategoryDropdown();
}
