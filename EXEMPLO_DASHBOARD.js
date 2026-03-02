/**
 * EXEMPLO DE CÓDIGO PARA DASHBOARD
 * Como ler dados do Google Drive via API
 * 
 * Substitua SEU_ID pela URL do seu Google Apps Script
 */

// Configuração
const API_URL = 'https://script.google.com/macros/s/SEU_ID/exec';

// ============================================
// FUNÇÃO PRINCIPAL: LER TODOS OS CONTRATOS
// ============================================
async function carregarContratos() {
    try {
        const url = `${API_URL}?action=read`;
        console.log('Carregando contratos de:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            const contratos = result.data.contratos;
            const total = result.total || contratos.length;
            const ultimaAtualizacao = result.ultima_atualizacao;
            
            console.log(`✓ ${total} contratos carregados`);
            console.log(`Última atualização: ${ultimaAtualizacao}`);
            
            return {
                success: true,
                contratos: contratos,
                total: total,
                ultima_atualizacao: ultimaAtualizacao
            };
        } else {
            throw new Error(result.error || 'Erro desconhecido');
        }
    } catch (error) {
        console.error('Erro ao carregar contratos:', error);
        return {
            success: false,
            error: error.message,
            contratos: [],
            total: 0
        };
    }
}

// ============================================
// EXEMPLO 1: Exibir Estatísticas
// ============================================
async function exibirEstatisticas() {
    const dados = await carregarContratos();
    
    if (dados.success) {
        console.log('=== ESTATÍSTICAS ===');
        console.log(`Total de Contratos: ${dados.total}`);
        console.log(`Última Atualização: ${dados.ultima_atualizacao}`);
        
        // Contar por serviço
        const servicosCount = {};
        dados.contratos.forEach(contrato => {
            contrato.servicos.forEach(servico => {
                servicosCount[servico] = (servicosCount[servico] || 0) + 1;
            });
        });
        
        console.log('Serviços mais contratados:', servicosCount);
    }
}

// ============================================
// EXEMPLO 2: Listar Contratos Recentes
// ============================================
async function listarContratosRecentes(limite = 10) {
    const dados = await carregarContratos();
    
    if (dados.success) {
        // Ordenar por data de emissão (mais recentes primeiro)
        const recentes = dados.contratos
            .sort((a, b) => new Date(b.data_emissao) - new Date(a.data_emissao))
            .slice(0, limite);
        
        console.log('=== CONTRATOS RECENTES ===');
        recentes.forEach((contrato, index) => {
            console.log(`${index + 1}. ${contrato.cliente.nome} - ${contrato.logistica.data}`);
        });
        
        return recentes;
    }
    
    return [];
}

// ============================================
// EXEMPLO 3: Filtrar por Período
// ============================================
async function filtrarPorPeriodo(dataInicio, dataFim) {
    const dados = await carregarContratos();
    
    if (dados.success) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        
        const filtrados = dados.contratos.filter(contrato => {
            const dataEvento = new Date(contrato.logistica.data.split('/').reverse().join('-'));
            return dataEvento >= inicio && dataEvento <= fim;
        });
        
        console.log(`Contratos no período: ${filtrados.length}`);
        return filtrados;
    }
    
    return [];
}

// ============================================
// EXEMPLO 4: Buscar por Cliente
// ============================================
async function buscarPorCliente(nomeCliente) {
    const dados = await carregarContratos();
    
    if (dados.success) {
        const encontrados = dados.contratos.filter(contrato => 
            contrato.cliente.nome.toLowerCase().includes(nomeCliente.toLowerCase())
        );
        
        console.log(`Contratos encontrados para "${nomeCliente}": ${encontrados.length}`);
        return encontrados;
    }
    
    return [];
}

// ============================================
// EXEMPLO 5: Dashboard Completo
// ============================================
async function atualizarDashboard() {
    console.log('Atualizando dashboard...');
    
    const dados = await carregarContratos();
    
    if (!dados.success) {
        console.error('Erro ao carregar dados:', dados.error);
        return;
    }
    
    // Estatísticas gerais
    const stats = {
        total: dados.total,
        ultima_atualizacao: dados.ultima_atualizacao,
        por_mes: {},
        por_servico: {},
        por_cidade: {}
    };
    
    // Processar dados
    dados.contratos.forEach(contrato => {
        // Por mês
        const mes = contrato.logistica.data.split('/')[1];
        stats.por_mes[mes] = (stats.por_mes[mes] || 0) + 1;
        
        // Por serviço
        contrato.servicos.forEach(servico => {
            stats.por_servico[servico] = (stats.por_servico[servico] || 0) + 1;
        });
        
        // Por cidade
        const cidade = contrato.logistica.cidade.split('/')[0];
        stats.por_cidade[cidade] = (stats.por_cidade[cidade] || 0) + 1;
    });
    
    console.log('=== DASHBOARD ===');
    console.log('Estatísticas:', stats);
    
    return stats;
}

// ============================================
// EXEMPLO 6: Atualização Automática
// ============================================
function iniciarAtualizacaoAutomatica(intervaloMinutos = 5) {
    console.log(`Iniciando atualização automática a cada ${intervaloMinutos} minutos`);
    
    // Atualizar imediatamente
    atualizarDashboard();
    
    // Configurar intervalo
    setInterval(() => {
        console.log('Atualizando dashboard automaticamente...');
        atualizarDashboard();
    }, intervaloMinutos * 60 * 1000);
}

// ============================================
// USO
// ============================================

// Exemplo de uso básico
// carregarContratos().then(dados => {
//     console.log('Dados carregados:', dados);
// });

// Exemplo de dashboard completo
// atualizarDashboard();

// Exemplo de atualização automática (a cada 5 minutos)
// iniciarAtualizacaoAutomatica(5);

// Exportar funções (se usar módulos)
// export { carregarContratos, atualizarDashboard, listarContratosRecentes };
