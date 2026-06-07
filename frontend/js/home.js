const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

let graficoCategorias = null;
let graficoEvolucao = null;

function obterValoresResumo() {
    return document.querySelectorAll(".summary-card .summary-value");
}

function formatarValorBRL(valor) {
    return formatadorMoeda.format(Number(valor) || 0);
}

function valorDespesa(despesa) {
    return Number(despesa.valor) || 0;
}

function categoriaDespesa(despesa) {
    return despesa.categoria || "Sem categoria";
}

function calcularTotalDespesas(despesas) {
    return despesas.reduce((total, despesa) => total + valorDespesa(despesa), 0);
}

function calcularQuantidadeDespesas(despesas) {
    return despesas.length;
}

function gerarResumoCategorias(despesas) {
    return despesas.reduce((resumo, despesa) => {
        const categoria = categoriaDespesa(despesa);
        resumo[categoria] = (resumo[categoria] || 0) + valorDespesa(despesa);
        return resumo;
    }, {});
}

function calcularMaiorCategoria(despesas) {
    const resumoCategorias = gerarResumoCategorias(despesas);
    const categorias = Object.entries(resumoCategorias);

    if (categorias.length === 0) {
        return "Nenhuma despesa";
    }

    const [maiorCategoria] = categorias.reduce((maior, atual) => {
        return atual[1] > maior[1] ? atual : maior;
    });

    return maiorCategoria;
}

function atualizarDashboard(despesas) {
    const valoresResumo = obterValoresResumo();

    if (valoresResumo.length < 3) {
        throw new Error("Cards de resumo nao encontrados.");
    }

    valoresResumo[0].textContent = formatarValorBRL(calcularTotalDespesas(despesas));
    valoresResumo[1].textContent = calcularQuantidadeDespesas(despesas);
    valoresResumo[2].textContent = calcularMaiorCategoria(despesas);
}

function destruirGraficoAnterior() {
    if (graficoCategorias) {
        graficoCategorias.destroy();
        graficoCategorias = null;
    }
}

function destruirGraficoEvolucaoAnterior() {
    if (graficoEvolucao) {
        graficoEvolucao.destroy();
        graficoEvolucao = null;
    }
}

function obterDataBaseDespesa(data) {
    if (!data) {
        return "";
    }

    return String(data).slice(0, 10);
}

function formatarDataGrafico(dataBase) {
    const partes = dataBase.split("-");

    if (partes.length !== 3) {
        return dataBase;
    }

    return `${partes[2]}/${partes[1]}`;
}

function formatarDataBR(data) {
    const dataBase = obterDataBaseDespesa(data);
    const partes = dataBase.split("-");

    if (partes.length !== 3) {
        return dataBase || "-";
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function ordenarDespesasPorData(despesas) {
    return [...despesas].sort((despesaA, despesaB) => {
        const dataA = obterDataBaseDespesa(despesaA.data);
        const dataB = obterDataBaseDespesa(despesaB.data);

        return dataB.localeCompare(dataA);
    });
}

function obterDespesasRecentes(despesas, limite = 5) {
    return ordenarDespesasPorData(despesas).slice(0, limite);
}

function alternarEstadoTabelaDespesas(exibirMensagem) {
    const tabelaWrapper = document.querySelector(".recent-expenses .table-wrapper");
    const mensagem = document.getElementById("mensagem-despesas-recentes");
    const rodape = document.querySelector(".recent-expenses .recent-footer");

    if (tabelaWrapper) {
        tabelaWrapper.style.display = exibirMensagem ? "none" : "block";
    }

    if (mensagem) {
        mensagem.classList.toggle("is-visible", exibirMensagem);
    }

    if (rodape) {
        rodape.style.display = exibirMensagem ? "none" : "flex";
    }
}

function renderizarTabelaDespesas(despesas, limite = 5) {
    const tabela = document.getElementById("tabela-despesas-recentes");

    if (!tabela) {
        return;
    }

    tabela.innerHTML = "";

    if (!despesas.length) {
        alternarEstadoTabelaDespesas(true);
        return;
    }

    alternarEstadoTabelaDespesas(false);

    const despesasRecentes = obterDespesasRecentes(despesas, limite);

    despesasRecentes.forEach((despesa) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${despesa.descricao || "-"}</td>
            <td>${categoriaDespesa(despesa)}</td>
            <td>${formatarValorBRL(valorDespesa(despesa))}</td>
            <td>${formatarDataBR(despesa.data)}</td>
        `;

        tabela.appendChild(linha);
    });
}

function agruparDespesasPorDia(despesas) {
    return despesas.reduce((resumo, despesa) => {
        const dataBase = obterDataBaseDespesa(despesa.data);

        if (!dataBase) {
            return resumo;
        }

        resumo[dataBase] = (resumo[dataBase] || 0) + valorDespesa(despesa);
        return resumo;
    }, {});
}

function prepararDadosGraficoEvolucao(despesas) {
    const resumoPorDia = agruparDespesasPorDia(despesas);
    const diasOrdenados = Object.keys(resumoPorDia).sort();

    return {
        labels: diasOrdenados.map(formatarDataGrafico),
        valores: diasOrdenados.map((dia) => resumoPorDia[dia])
    };
}

function alternarMensagemGraficoEvolucao(exibirMensagem) {
    const canvas = document.getElementById("grafico-evolucao");
    const mensagem = document.getElementById("mensagem-grafico-evolucao");

    if (!canvas || !mensagem) {
        return;
    }

    canvas.style.display = exibirMensagem ? "none" : "block";
    mensagem.classList.toggle("is-visible", exibirMensagem);
}

function criarGraficoEvolucao(despesas) {
    const canvas = document.getElementById("grafico-evolucao");

    if (!canvas) {
        return;
    }

    if (typeof Chart === "undefined") {
        console.error("Chart.js nao foi carregado.");
        return;
    }

    destruirGraficoEvolucaoAnterior();

    const dadosGrafico = prepararDadosGraficoEvolucao(despesas);

    if (dadosGrafico.labels.length === 0) {
        alternarMensagemGraficoEvolucao(true);
        return;
    }

    alternarMensagemGraficoEvolucao(false);

    graficoEvolucao = new Chart(canvas, {
        type: "line",
        data: {
            labels: dadosGrafico.labels,
            datasets: [{
                label: "Gastos no dia",
                data: dadosGrafico.valores,
                borderColor: "#1b632a",
                backgroundColor: "rgba(47, 154, 84, 0.14)",
                pointBackgroundColor: "#2f3f70",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3,
                fill: true,
                tension: 0.38
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#66758a",
                        font: {
                            size: 12,
                            weight: "600"
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "rgba(102, 117, 138, 0.14)"
                    },
                    ticks: {
                        color: "#66758a",
                        callback: (value) => formatarValorBRL(value),
                        font: {
                            size: 12,
                            weight: "600"
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const valor = context.parsed.y || 0;
                            return `Gastos: ${formatarValorBRL(valor)}`;
                        }
                    }
                }
            }
        }
    });
}

function alternarMensagemGraficoCategorias(exibirMensagem) {
    const canvas = document.getElementById("grafico-categorias");
    const mensagem = document.getElementById("mensagem-grafico-categorias");

    if (!canvas || !mensagem) {
        return;
    }

    canvas.style.display = exibirMensagem ? "none" : "block";
    mensagem.classList.toggle("is-visible", exibirMensagem);
}

function criarGraficoCategorias(despesas) {
    const canvas = document.getElementById("grafico-categorias");

    if (!canvas) {
        return;
    }

    if (typeof Chart === "undefined") {
        console.error("Chart.js nao foi carregado.");
        return;
    }

    destruirGraficoAnterior();

    const resumoCategorias = gerarResumoCategorias(despesas);
    const categorias = Object.keys(resumoCategorias);
    const valores = Object.values(resumoCategorias);

    if (categorias.length === 0) {
        alternarMensagemGraficoCategorias(true);
        return;
    }

    alternarMensagemGraficoCategorias(false);

    graficoCategorias = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: categorias,
            datasets: [{
                data: valores,
                backgroundColor: [
                    "#2f9a54",
                    "#2f3f70",
                    "#18a4b8",
                    "#f2c94c",
                    "#e85d75",
                    "#7c5cc4",
                    "#f2994a",
                    "#8a96a8"
                ],
                borderColor: "#ffffff",
                borderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "68%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        boxWidth: 12,
                        boxHeight: 12,
                        color: "#66758a",
                        font: {
                            size: 12,
                            weight: "600"
                        },
                        padding: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const categoria = context.label || "Sem categoria";
                            const valor = context.parsed || 0;
                            return `${categoria}: ${formatarValorBRL(valor)}`;
                        }
                    }
                }
            }
        }
    });
}

function exibirErroDashboard() {
    const valoresResumo = obterValoresResumo();

    if (valoresResumo.length < 3) {
        return;
    }

    valoresResumo[0].textContent = "Erro ao carregar";
    valoresResumo[1].textContent = "-";
    valoresResumo[2].textContent = "Tente novamente";
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const despesas = await carregarDespesasMes();
        atualizarDashboard(despesas);
        renderizarTabelaDespesas(despesas);

        try {
            criarGraficoEvolucao(despesas);
            criarGraficoCategorias(despesas);
        } catch (error) {
            console.error("Erro ao renderizar graficos do dashboard:", error);
        }
    } catch (error) {
        console.error("Erro ao carregar despesas do mes:", error);
        exibirErroDashboard();
        renderizarTabelaDespesas([]);

        try {
            criarGraficoEvolucao([]);
            criarGraficoCategorias([]);
        } catch (chartError) {
            console.error("Erro ao renderizar estado vazio dos graficos:", chartError);
        }
    }
});
