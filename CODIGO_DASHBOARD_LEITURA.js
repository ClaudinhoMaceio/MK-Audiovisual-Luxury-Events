/**
 * CÓDIGO PARA DASHBOARD - LER DADOS DO GOOGLE DRIVE
 * 
 * Este código é para o SISTEMA 2 (Dashboard)
 * Use este código para ler os contratos salvos no Google Drive
 * 
 * INSTRUÇÕES:
 * 1. Substitua SCRIPT_URL pela URL do seu Google Apps Script
 * 2. Use as funções abaixo para ler os dados
 */

// ============================================
// CONFIGURAÇÃO
// ============================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwlXdKn8UPygZLwqkimfA6YydFyD9EZmw51uYCNnmG0rX94B0dP6ONDATWWr9C7k8vT/exec';
const FOLDER_ID = '16kt50n_MFB60_h3JFgIA408k8YrjU6Rb';
const FILE_NAME = 'mk_audiovisual_contratos.json';

// ============================================
// FUNÇÃO PRINCIPAL: LER TODOS OS CONTRATOS
// ============================================
async function lerContratos() {
    try {
        console.log('📖 Carregando contratos...');
        
        const url = `${SCRIPT_URL}?action=read&folderId=${FOLDER_ID}&fileName=${FILE_NAME}`;
        console.log('🔗 URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Dados recebidos:', result);
        
        if (result.success) {
            const contratos = result.data.contratos || [];
            const total = result.total || contratos.length;
            const ultimaAtualizacao = result.data.ultima_atualizacao || result.ultima_atualizacao;
            
            console.log(`✅ ${total} contratos carregados`);
            console.log(`📅 Última atualização: ${ultimaAtualizacao || 'Nunca'}`);
            
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
        console.error('❌ Erro ao carregar contratos:', error);
        return {
            success: false,
            error: error.message,
            contratos: [],
            total: 0
        };
    }
}

// ============================================
// FUNÇÃO: OBTER ESTATÍSTICAS
// ============================================
async function obterEstatisticas() {
    try {
        const dados = await lerContratos();
        
        if (!dados.success) {
            return {
                success: false,
                error: dados.error,
                total: 0,
                por_mes: {},
                por_servico: {}
            };
        }
        
        const contratos = dados.contratos;
        const total = contratos.length;
        
        // Estatísticas por mês
        const porMes = {};
        contratos.forEach(contrato => {
            if (contrato.logistica && contrato.logistica.data) {
                const data = contrato.logistica.data;
                const mes = data.split('/')[1] + '/' + data.split('/')[2]; // MM/AAAA
                porMes[mes] = (porMes[mes] || 0) + 1;
            }
        });
        
        // Estatísticas por serviço
        const porServico = {};
        contratos.forEach(contrato => {
            if (contrato.servicos && Array.isArray(contrato.servicos)) {
                contrato.servicos.forEach(servico => {
                    const servicoNome = servico.split('(')[0].trim(); // Remove horas
                    porServico[servicoNome] = (porServico[servicoNome] || 0) + 1;
                });
            }
        });
        
        return {
            success: true,
            total: total,
            ultima_atualizacao: dados.ultima_atualizacao,
            por_mes: porMes,
            por_servico: porServico
        };
    } catch (error) {
        console.error('❌ Erro ao obter estatísticas:', error);
        return {
            success: false,
            error: error.message,
            total: 0
        };
    }
}

// ============================================
// FUNÇÃO: BUSCAR CONTRATO POR ID
// ============================================
async function buscarContratoPorId(idEvento) {
    try {
        const dados = await lerContratos();
        
        if (!dados.success) {
            return {
                success: false,
                error: dados.error,
                contrato: null
            };
        }
        
        const contrato = dados.contratos.find(c => c.id_evento === idEvento);
        
        if (contrato) {
            return {
                success: true,
                contrato: contrato
            };
        } else {
            return {
                success: false,
                error: 'Contrato não encontrado',
                contrato: null
            };
        }
    } catch (error) {
        console.error('❌ Erro ao buscar contrato:', error);
        return {
            success: false,
            error: error.message,
            contrato: null
        };
    }
}

// ============================================
// FUNÇÃO: FILTRAR CONTRATOS
// ============================================
async function filtrarContratos(filtros) {
    try {
        const dados = await lerContratos();
        
        if (!dados.success) {
            return {
                success: false,
                error: dados.error,
                contratos: []
            };
        }
        
        let contratos = dados.contratos;
        
        // Filtrar por nome do cliente
        if (filtros.nomeCliente) {
            const nomeBusca = filtros.nomeCliente.toLowerCase();
            contratos = contratos.filter(c => 
                c.cliente && c.cliente.nome && 
                c.cliente.nome.toLowerCase().includes(nomeBusca)
            );
        }
        
        // Filtrar por data do evento
        if (filtros.dataEvento) {
            contratos = contratos.filter(c => 
                c.logistica && c.logistica.data === filtros.dataEvento
            );
        }
        
        // Filtrar por serviço
        if (filtros.servico) {
            contratos = contratos.filter(c => 
                c.servicos && c.servicos.some(s => 
                    s.toLowerCase().includes(filtros.servico.toLowerCase())
                )
            );
        }
        
        // Filtrar por período
        if (filtros.dataInicio && filtros.dataFim) {
            contratos = contratos.filter(c => {
                if (!c.logistica || !c.logistica.data) return false;
                const dataEvento = c.logistica.data.split('/').reverse().join('-'); // DD/MM/AAAA -> AAAA-MM-DD
                return dataEvento >= filtros.dataInicio && dataEvento <= filtros.dataFim;
            });
        }
        
        return {
            success: true,
            contratos: contratos,
            total: contratos.length
        };
    } catch (error) {
        console.error('❌ Erro ao filtrar contratos:', error);
        return {
            success: false,
            error: error.message,
            contratos: []
        };
    }
}

// ============================================
// EXEMPLOS DE USO
// ============================================

// Exemplo 1: Carregar todos os contratos
async function exemplo1() {
    const dados = await lerContratos();
    
    if (dados.success) {
        console.log(`Total de contratos: ${dados.total}`);
        dados.contratos.forEach(contrato => {
            console.log(`- ${contrato.cliente.nome} - ${contrato.logistica.data}`);
        });
    } else {
        console.error('Erro:', dados.error);
    }
}

// Exemplo 2: Obter estatísticas
async function exemplo2() {
    const stats = await obterEstatisticas();
    
    if (stats.success) {
        console.log(`Total: ${stats.total}`);
        console.log('Por mês:', stats.por_mes);
        console.log('Por serviço:', stats.por_servico);
    }
}

// Exemplo 3: Buscar contrato específico
async function exemplo3() {
    const idEvento = 1234567890; // ID do evento
    const resultado = await buscarContratoPorId(idEvento);
    
    if (resultado.success) {
        console.log('Contrato encontrado:', resultado.contrato);
    } else {
        console.error('Erro:', resultado.error);
    }
}

// Exemplo 4: Filtrar contratos
async function exemplo4() {
    const filtros = {
        nomeCliente: 'João',
        servico: '360',
        dataInicio: '2024-01-01',
        dataFim: '2024-12-31'
    };
    
    const resultado = await filtrarContratos(filtros);
    
    if (resultado.success) {
        console.log(`Encontrados ${resultado.total} contratos`);
        resultado.contratos.forEach(c => {
            console.log(`- ${c.cliente.nome}`);
        });
    }
}

// ============================================
// EXPORTAR FUNÇÕES (se usar módulos)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        lerContratos,
        obterEstatisticas,
        buscarContratoPorId,
        filtrarContratos
    };
}
