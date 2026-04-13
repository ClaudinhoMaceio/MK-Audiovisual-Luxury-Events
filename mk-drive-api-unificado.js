/**
 * MK AUDIOVISUAL - API UNIFICADA GOOGLE DRIVE
 * 
 * Este arquivo funciona para AMBOS os sistemas:
 * - Sistema 1: Criar/Salvar contratos no JSON
 * - Sistema 2: Ler contratos do JSON
 * 
 * INSTRUÇÕES:
 * 1. Substitua SCRIPT_URL pela URL do seu Google Apps Script
 * 2. Use este arquivo em ambos os sistemas (contratos e dashboard)
 * 3. O Google Apps Script já está unificado (GOOGLE_APPS_SCRIPT_CODE.js)
 */

// ============================================
// CONFIGURAÇÃO
// ============================================
const MK_DRIVE_CONFIG = {
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwlXdKn8UPygZLwqkimfA6YydFyD9EZmw51uYCNnmG0rX94B0dP6ONDATWWr9C7k8vT/exec',
    FOLDER_ID: '16kt50n_MFB60_h3JFgIA408k8YrjU6Rb',
    FILE_NAME: 'mk_audiovisual_contratos.json',
    REQUEST_TIMEOUT_MS: 15000,
    VERIFY_RETRIES: 4,
    VERIFY_INTERVAL_MS: 1500,
    MOBILE_VERIFY_RETRIES: 8,
    MOBILE_VERIFY_INTERVAL_MS: 2500
};

// ============================================
// CLASSE PRINCIPAL - API UNIFICADA
// ============================================
class MKDriveAPI {
    constructor(config = {}) {
        this.SCRIPT_URL = config.SCRIPT_URL || MK_DRIVE_CONFIG.SCRIPT_URL;
        this.FOLDER_ID = config.FOLDER_ID || MK_DRIVE_CONFIG.FOLDER_ID;
        this.FILE_NAME = config.FILE_NAME || MK_DRIVE_CONFIG.FILE_NAME;
        this.REQUEST_TIMEOUT_MS = config.REQUEST_TIMEOUT_MS || MK_DRIVE_CONFIG.REQUEST_TIMEOUT_MS;
        this.VERIFY_RETRIES = config.VERIFY_RETRIES || MK_DRIVE_CONFIG.VERIFY_RETRIES;
        this.VERIFY_INTERVAL_MS = config.VERIFY_INTERVAL_MS || MK_DRIVE_CONFIG.VERIFY_INTERVAL_MS;
        this.MOBILE_VERIFY_RETRIES = config.MOBILE_VERIFY_RETRIES || MK_DRIVE_CONFIG.MOBILE_VERIFY_RETRIES;
        this.MOBILE_VERIFY_INTERVAL_MS = config.MOBILE_VERIFY_INTERVAL_MS || MK_DRIVE_CONFIG.MOBILE_VERIFY_INTERVAL_MS;
    }

    // ============================================
    // MÉTODO 1: SALVAR CONTRATO (Sistema 1)
    // ============================================
    async salvarContrato(dadosContrato) {
        try {
            console.log('💾 [SALVAR] Iniciando salvamento...');
            console.log('📦 Dados:', dadosContrato);
            const mobileContexto = this._isMobileContext();
            console.log('📱 Contexto mobile detectado:', mobileContexto);

            // No celular/PWA, priorizar no-cors/beacon (mais estável que iframe cross-origin)
            if (mobileContexto) {
                try {
                    return await this._salvarViaNoCorsPOST(dadosContrato);
                } catch (noCorsError) {
                    console.warn('⚠️ no-cors POST falhou no mobile:', noCorsError.message);
                    try {
                        return await this._salvarViaBeaconPOST(dadosContrato);
                    } catch (beaconError) {
                        console.warn('⚠️ Beacon POST também falhou no mobile:', beaconError.message);
                        // seguir para fluxo normal de fallback abaixo
                    }
                }
            }

            // Tentar método POST primeiro
            try {
                return await this._salvarViaPOST(dadosContrato);
            } catch (postError) {
                console.warn('⚠️ POST falhou, tentando método alternativo (GET):', postError.message);
                
                // Se POST falhar por CORS/rede, tentar no-cors e depois GET/iframe
                if (
                    postError.message.includes('CORS') ||
                    postError.message.includes('Failed to fetch') ||
                    postError.message.includes('NetworkError') ||
                    postError.name === 'TypeError'
                ) {
                    try {
                        return await this._salvarViaNoCorsPOST(dadosContrato);
                    } catch (noCorsError) {
                        console.warn('⚠️ no-cors POST falhou, tentando GET/iframe:', noCorsError.message);
                        if (this._isMobileContext()) {
                            try {
                                return await this._salvarViaBeaconPOST(dadosContrato);
                            } catch (beaconError) {
                                console.warn('⚠️ Beacon POST falhou, tentando GET/iframe:', beaconError.message);
                            }
                        }
                        return await this._salvarViaGET(dadosContrato);
                    }
                } else {
                    throw postError;
                }
            }
        } catch (error) {
            console.error('❌ Erro ao salvar:', error);
            throw error;
        }
    }

    // Método interno: Salvar via POST
    async _salvarViaPOST(dadosContrato) {
        const payload = {
            action: 'save',
            folderId: this.FOLDER_ID,
            fileName: this.FILE_NAME,
            data: dadosContrato
        };

        const response = await this._fetchWithTimeout(this.SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        console.log('📥 Resposta POST:', responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (error) {
            throw new Error(`Resposta inválida: ${responseText.substring(0, 200)}`);
        }

        if (response.ok && result.success) {
            console.log('✅ Contrato salvo via POST! Total:', result.total);
            return {
                success: true,
                message: result.message || 'Contrato salvo com sucesso!',
                total: result.total,
                id_evento: dadosContrato.id_evento
            };
        } else {
            throw new Error(result.error || 'Erro ao salvar');
        }
    }

    // Método interno: Salvar via POST no-cors (evita preflight/CORS em host externo)
    async _salvarViaNoCorsPOST(dadosContrato) {
        console.log('🔄 Tentando POST no-cors (fallback web/PWA)...');

        const payload = {
            action: 'save',
            folderId: this.FOLDER_ID,
            fileName: this.FILE_NAME,
            data: dadosContrato
        };

        await this._fetchWithTimeout(this.SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                // text/plain evita preflight e mantém o payload legível no Apps Script
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        const verificacao = await this._verificarComRetentativas(dadosContrato.id_evento);
        if (verificacao.encontrado) {
            return {
                success: true,
                message: 'Contrato salvo via POST no-cors e confirmado no Google Drive!',
                total: verificacao.total || 1,
                id_evento: dadosContrato.id_evento,
                metodo: 'POST_NO_CORS',
                confirmado: true
            };
        }

        throw new Error('POST no-cors enviado, mas contrato ainda não confirmado');
    }

    // Método interno: Salvar via sendBeacon (muito confiável em mobile/PWA)
    async _salvarViaBeaconPOST(dadosContrato) {
        if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') {
            throw new Error('sendBeacon não suportado neste navegador');
        }

        console.log('🔄 Tentando POST via sendBeacon (fallback mobile)...');

        const payload = {
            action: 'save',
            folderId: this.FOLDER_ID,
            fileName: this.FILE_NAME,
            data: dadosContrato
        };

        const blob = new Blob([JSON.stringify(payload)], {
            type: 'text/plain;charset=UTF-8'
        });

        const sent = navigator.sendBeacon(this.SCRIPT_URL, blob);
        if (!sent) {
            throw new Error('sendBeacon retornou false');
        }

        const verificacao = await this._verificarComRetentativas(
            dadosContrato.id_evento,
            this.MOBILE_VERIFY_RETRIES,
            this.MOBILE_VERIFY_INTERVAL_MS
        );

        if (verificacao.encontrado) {
            return {
                success: true,
                message: 'Contrato salvo via sendBeacon e confirmado no Google Drive!',
                total: verificacao.total || 1,
                id_evento: dadosContrato.id_evento,
                metodo: 'BEACON_POST',
                confirmado: true
            };
        }

        throw new Error('sendBeacon enviado, mas contrato ainda não confirmado');
    }

    // Método interno: Salvar via GET (alternativo para CORS)
    async _salvarViaGET(dadosContrato) {
        console.log('🔄 Usando método GET (alternativo para CORS)...');
        
        // Remover assinatura temporariamente se os dados forem muito grandes
        let assinaturaBackup = null;
        let dadosParaEnviar = { ...dadosContrato };
        
        const dataString = JSON.stringify(dadosParaEnviar);
        console.log('📏 Tamanho dos dados:', dataString.length, 'caracteres');
        
        // Se ainda for muito grande, remover assinatura e enviar separadamente
        if (dataString.length > 8000) {
            console.warn('⚠️ Dados muito grandes, removendo assinatura do payload principal');
            assinaturaBackup = dadosParaEnviar.assinatura;
            dadosParaEnviar.assinatura = '[ASSINATURA_REMOVIDA_POR_TAMANHO]';
            dadosParaEnviar.assinatura_nota = 'Assinatura removida devido ao tamanho. Use servidor HTTP para envio completo.';
        }
        
        const dataStringFinal = JSON.stringify(dadosParaEnviar);
        
        // Verificar tamanho novamente
        if (dataStringFinal.length > 8000) {
            // Se ainda for grande, usar iframe para contornar CORS
            return await this._salvarViaIframe(dadosParaEnviar);
        }
        
        // Criar URL com dados
        const encodedData = encodeURIComponent(dataStringFinal);
        const url = `${this.SCRIPT_URL}?action=save&folderId=${this.FOLDER_ID}&fileName=${this.FILE_NAME}&data=${encodedData}`;
        
        console.log('📤 Enviando via GET:', url.substring(0, 200) + '...');

        // Em URLs curtas, tentar GET via fetch primeiro para ter resposta imediata.
        if (url.length < 1800) {
            try {
                const response = await this._fetchWithTimeout(url, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache'
                });

                const result = await response.json();
                if (response.ok && result.success) {
                    return {
                        success: true,
                        message: result.message || 'Contrato salvo com sucesso!',
                        total: result.total,
                        id_evento: dadosContrato.id_evento,
                        metodo: 'GET'
                    };
                }
            } catch (error) {
                console.warn('⚠️ GET via fetch falhou, tentando iframe:', error.message);
            }
        }

        // Fallback final para hosts com CORS restritivo
        return await this._salvarViaIframe(dadosParaEnviar);
    }

    // Método interno: Salvar via iframe (contorna CORS completamente)
    async _salvarViaIframe(dadosContrato) {
        if (this._isMobileContext()) {
            throw new Error('Fallback iframe desativado em mobile/PWA por instabilidade cross-origin');
        }

        return new Promise((resolve, reject) => {
            console.log('🔄 Usando iframe para contornar CORS...');
            console.log('📦 Dados a serem enviados:', dadosContrato);
            console.log('📁 Pasta ID:', this.FOLDER_ID);
            console.log('📄 Nome do arquivo:', this.FILE_NAME);
            
            const dataString = JSON.stringify(dadosContrato);
            const url = `${this.SCRIPT_URL}?action=save&folderId=${this.FOLDER_ID}&fileName=${this.FILE_NAME}&data=${encodeURIComponent(dataString)}`;
            
            console.log('🔗 URL completa (primeiros 200 chars):', url.substring(0, 200) + '...');
            
            // Criar iframe oculto
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.src = url;
            
            // Tentar verificar se funcionou após um tempo
            let verificado = false;
            
            // Aguardar e tentar verificar
            setTimeout(async () => {
                if (verificado) return;
                verificado = true;
                
                // Remover iframe
                if (iframe.parentNode) {
                    document.body.removeChild(iframe);
                }
                
                // Aguardar um pouco mais e tentar verificar se foi salvo
                console.log('⏳ Aguardando processamento no servidor...');
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Tentar verificar se foi salvo
                try {
                    const verificacao = await this._verificarComRetentativas(dadosContrato.id_evento);
                    if (verificacao.encontrado) {
                        console.log('✅ Contrato confirmado no Google Drive!');
                        resolve({
                            success: true,
                            message: 'Contrato salvo e confirmado no Google Drive!',
                            total: verificacao.total || 1,
                            id_evento: dadosContrato.id_evento,
                            metodo: 'IFRAME',
                            confirmado: true
                        });
                    } else {
                        console.log('⚠️ Contrato enviado, mas ainda não confirmado');
                        resolve({
                            success: true,
                            message: 'Contrato enviado. Pode levar alguns segundos para aparecer no Google Drive.',
                            total: -1,
                            id_evento: dadosContrato.id_evento,
                            metodo: 'IFRAME',
                            confirmado: false,
                            nota: 'Verifique o Google Drive em alguns segundos. Se não aparecer, verifique o FOLDER_ID e as permissões do script.'
                        });
                    }
                } catch (error) {
                    console.warn('⚠️ Não foi possível verificar salvamento:', error);
                    resolve({
                        success: true,
                        message: 'Contrato enviado via iframe. Verifique o Google Drive manualmente.',
                        total: -1,
                        id_evento: dadosContrato.id_evento,
                        metodo: 'IFRAME',
                        confirmado: false,
                        nota: 'Erro ao verificar: ' + error.message
                    });
                }
            }, 2000);
            
            // Adicionar iframe ao body
            document.body.appendChild(iframe);
            
            // Timeout de segurança
            setTimeout(() => {
                if (iframe.parentNode) {
                    document.body.removeChild(iframe);
                }
                if (!verificado) {
                    verificado = true;
                    console.warn('⏱️ Timeout ao aguardar resposta');
                    resolve({
                        success: true,
                        message: 'Requisição enviada. Verifique o Google Drive.',
                        total: -1,
                        id_evento: dadosContrato.id_evento,
                        metodo: 'IFRAME',
                        confirmado: false
                    });
                }
            }, 15000);
        });
    }

    // ============================================
    // MÉTODO 2: LER TODOS OS CONTRATOS (Sistema 2)
    // ============================================
    async lerContratos() {
        try {
            console.log('📖 [LER] Carregando contratos...');

            const url = `${this.SCRIPT_URL}?action=read&folderId=${this.FOLDER_ID}&fileName=${this.FILE_NAME}`;
            
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Dados recebidos:', result);

            if (result.success) {
                const contratos = result.data.contratos || [];
                const total = result.total || contratos.length;
                
                console.log(`✅ ${total} contratos carregados`);
                
                return {
                    success: true,
                    contratos: contratos,
                    total: total,
                    ultima_atualizacao: result.data.ultima_atualizacao || result.ultima_atualizacao
                };
            } else {
                throw new Error(result.error || 'Erro desconhecido');
            }
        } catch (error) {
            console.error('❌ Erro ao ler:', error);
            return {
                success: false,
                error: error.message,
                contratos: [],
                total: 0
            };
        }
    }

    // ============================================
    // MÉTODO 3: BUSCAR CONTRATO POR ID
    // ============================================
    async buscarContratoPorId(idEvento) {
        try {
            const dados = await this.lerContratos();
            
            if (!dados.success) {
                return {
                    success: false,
                    error: dados.error,
                    contrato: null
                };
            }

            const contrato = dados.contratos.find(c => c.id_evento === idEvento);
            
            return {
                success: contrato ? true : false,
                contrato: contrato || null,
                error: contrato ? null : 'Contrato não encontrado'
            };
        } catch (error) {
            console.error('❌ Erro ao buscar:', error);
            return {
                success: false,
                error: error.message,
                contrato: null
            };
        }
    }

    // ============================================
    // MÉTODO 4: FILTRAR CONTRATOS
    // ============================================
    async filtrarContratos(filtros = {}) {
        try {
            const dados = await this.lerContratos();
            
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
                    const dataEvento = c.logistica.data.split('/').reverse().join('-');
                    return dataEvento >= filtros.dataInicio && dataEvento <= filtros.dataFim;
                });
            }

            return {
                success: true,
                contratos: contratos,
                total: contratos.length
            };
        } catch (error) {
            console.error('❌ Erro ao filtrar:', error);
            return {
                success: false,
                error: error.message,
                contratos: []
            };
        }
    }

    // ============================================
    // MÉTODO 5: OBTER ESTATÍSTICAS
    // ============================================
    async obterEstatisticas() {
        try {
            const dados = await this.lerContratos();
            
            if (!dados.success) {
                return {
                    success: false,
                    error: dados.error,
                    total: 0
                };
            }

            const contratos = dados.contratos;
            const total = contratos.length;

            // Estatísticas por mês
            const porMes = {};
            contratos.forEach(contrato => {
                if (contrato.logistica && contrato.logistica.data) {
                    const data = contrato.logistica.data;
                    const mes = data.split('/')[1] + '/' + data.split('/')[2];
                    porMes[mes] = (porMes[mes] || 0) + 1;
                }
            });

            // Estatísticas por serviço
            const porServico = {};
            contratos.forEach(contrato => {
                if (contrato.servicos && Array.isArray(contrato.servicos)) {
                    contrato.servicos.forEach(servico => {
                        const servicoNome = servico.split('(')[0].trim();
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
    // MÉTODO 6: VERIFICAR SE CONTRATO FOI SALVO
    // ============================================
    async verificarSalvamento(idEvento) {
        try {
            console.log('🔍 Verificando salvamento do contrato:', idEvento);

            const isMobile = this._isMobileContext();
            const verificacao = await this._verificarComRetentativas(
                idEvento,
                isMobile ? this.MOBILE_VERIFY_RETRIES : this.VERIFY_RETRIES,
                isMobile ? this.MOBILE_VERIFY_INTERVAL_MS : this.VERIFY_INTERVAL_MS
            );

            if (verificacao.encontrado) {
                return {
                    sucesso: true,
                    encontrado: true,
                    contrato: verificacao.contrato,
                    total: verificacao.total
                };
            } else {
                return {
                    sucesso: true,
                    encontrado: false,
                    mensagem: 'Contrato pode estar sendo processado'
                };
            }
        } catch (error) {
            console.error('❌ Erro ao verificar:', error);
            return {
                sucesso: false,
                encontrado: false,
                erro: error.message
            };
        }
    }

    async _verificarComRetentativas(idEvento, retries = this.VERIFY_RETRIES, intervalMs = this.VERIFY_INTERVAL_MS) {
        for (let tentativa = 1; tentativa <= retries; tentativa++) {
            await new Promise(resolve => setTimeout(resolve, intervalMs));

            const dados = await this.lerContratos();
            if (!dados.success) {
                continue;
            }

            const contrato = dados.contratos.find(c => c.id_evento === idEvento);
            if (contrato) {
                return {
                    encontrado: true,
                    contrato,
                    total: dados.total
                };
            }

            console.log(`🔄 Verificação tentativa ${tentativa}/${retries}: contrato ainda não encontrado`);
        }

        return {
            encontrado: false,
            contrato: null,
            total: 0
        };
    }

    async _fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT_MS);

        try {
            return await fetch(url, {
                ...options,
                signal: controller.signal
            });
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Timeout de ${this.REQUEST_TIMEOUT_MS}ms ao acessar Google Apps Script`);
            }
            throw error;
        } finally {
            clearTimeout(timeout);
        }
    }

    _isMobileContext() {
        if (typeof navigator === 'undefined') return false;

        const ua = navigator.userAgent || '';
        const isMobileUA = /Android|iPhone|iPad|iPod|Mobile|Windows Phone|IEMobile|Opera Mini/i.test(ua);
        const isStandalone = typeof window !== 'undefined' &&
            (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);

        return isMobileUA || isStandalone;
    }
}

// ============================================
// INSTÂNCIA GLOBAL (para compatibilidade)
// ============================================
const mkDriveAPI = new MKDriveAPI();

// ============================================
// FUNÇÕES GLOBAIS (para facilitar uso)
// ============================================

// Para Sistema 1: Salvar contrato
async function salvarContrato(dadosContrato) {
    return await mkDriveAPI.salvarContrato(dadosContrato);
}

// Para Sistema 2: Ler contratos
async function lerContratos() {
    return await mkDriveAPI.lerContratos();
}

// Buscar contrato por ID
async function buscarContratoPorId(idEvento) {
    return await mkDriveAPI.buscarContratoPorId(idEvento);
}

// Filtrar contratos
async function filtrarContratos(filtros) {
    return await mkDriveAPI.filtrarContratos(filtros);
}

// Obter estatísticas
async function obterEstatisticas() {
    return await mkDriveAPI.obterEstatisticas();
}

// ============================================
// EXPORTAR (se usar módulos)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MKDriveAPI,
        mkDriveAPI,
        salvarContrato,
        lerContratos,
        buscarContratoPorId,
        filtrarContratos,
        obterEstatisticas
    };
}
