// Google Apps Script API Manager
// VERSÃO UNIFICADA - Funciona para ambos os sistemas
// 
// NOTA: Este arquivo está sendo substituído por mk-drive-api-unificado.js
// Mantido para compatibilidade com código existente

class GoogleAppsScriptManager {
    constructor() {
        // URL do seu Google Apps Script Web App
        this.SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwlXdKn8UPygZLwqkimfA6YydFyD9EZmw51uYCNnmG0rX94B0dP6ONDATWWr9C7k8vT/exec';
        this.FOLDER_ID = '16kt50n_MFB60_h3JFgIA408k8YrjU6Rb'; // ID da pasta do Drive
        this.FILE_NAME = 'mk_audiovisual_contratos.json';
    }

    // Salvar dados no Google Drive via Apps Script
    async saveData(data) {
        try {
            console.log('🔵 Iniciando salvamento de dados...');
            console.log('📦 Dados a serem salvos:', data);
            console.log('🔗 URL do Script:', this.SCRIPT_URL);
            console.log('📁 Pasta ID:', this.FOLDER_ID);
            console.log('📄 Nome do arquivo:', this.FILE_NAME);
            
            // Método 1: Tentar POST com JSON
            try {
                const payload = {
                    action: 'save',
                    folderId: this.FOLDER_ID,
                    fileName: this.FILE_NAME,
                    data: data
                };

                console.log('📤 Enviando POST para:', this.SCRIPT_URL);
                console.log('📋 Payload:', JSON.stringify(payload).substring(0, 200) + '...');

                const response = await fetch(this.SCRIPT_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                console.log('📥 Status da resposta:', response.status, response.statusText);
                console.log('📥 Headers da resposta:', [...response.headers.entries()]);

                const responseText = await response.text();
                console.log('📥 Resposta completa (texto):', responseText);

                let result;
                try {
                    result = JSON.parse(responseText);
                    console.log('✅ Resposta parseada:', result);
                } catch (parseError) {
                    console.error('❌ Erro ao fazer parse da resposta:', parseError);
                    console.error('📄 Texto recebido:', responseText);
                    throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 200)}`);
                }

                if (response.ok) {
                    if (result.success) {
                        console.log('✅ Sucesso! Mensagem:', result.message);
                        console.log('📊 Total de contratos:', result.total);
                        return { 
                            success: true, 
                            message: result.message || 'Dados enviados com sucesso para o Google Drive!',
                            total: result.total
                        };
                    } else {
                        console.error('❌ Erro na resposta:', result.error);
                        throw new Error(result.error || 'Erro ao salvar');
                    }
                } else {
                    console.error('❌ Erro HTTP:', response.status);
                    throw new Error(`Erro HTTP ${response.status}: ${responseText.substring(0, 200)}`);
                }
            } catch (postError) {
                console.warn('⚠️ POST falhou, tentando método alternativo:', postError);
                console.warn('📝 Detalhes do erro:', postError.message);
                // Se POST falhar, tentar método alternativo
                return await this.saveDataAlternative(data);
            }
        } catch (error) {
            console.error('❌ Erro ao salvar dados:', error);
            console.error('📝 Stack trace:', error.stack);
            throw error;
        }
    }

    // Método alternativo usando GET (mais compatível)
    async saveDataAlternative(data) {
        try {
            console.log('🔄 Usando método alternativo (GET) para salvar...');
            const dataString = JSON.stringify(data);
            console.log('📏 Tamanho dos dados:', dataString.length, 'caracteres');
            
            // Verificar tamanho dos dados (URLs têm limite de ~2000 caracteres)
            if (dataString.length > 1500) {
                console.error('❌ Dados muito grandes para método GET');
                throw new Error('Dados muito grandes para método GET. Use POST.');
            }
            
            // Usar GET com dados na URL
            const url = `${this.SCRIPT_URL}?action=save&folderId=${this.FOLDER_ID}&fileName=${this.FILE_NAME}&data=${encodeURIComponent(dataString)}`;
            
            console.log('📤 Enviando via GET:', url.substring(0, 200) + '...');
            
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });

            console.log('📥 Status da resposta (GET):', response.status);

            const responseText = await response.text();
            console.log('📥 Resposta completa (texto):', responseText);

            if (response.ok) {
                let result;
                try {
                    result = JSON.parse(responseText);
                    console.log('✅ Resposta parseada (GET):', result);
                } catch (parseError) {
                    console.error('❌ Erro ao fazer parse da resposta (GET):', parseError);
                    throw new Error(`Resposta inválida: ${responseText.substring(0, 200)}`);
                }

                if (result.success) {
                    return { 
                        success: true, 
                        message: result.message || 'Dados enviados para o Google Drive!',
                        total: result.total
                    };
                } else {
                    throw new Error(result.error || 'Erro ao salvar');
                }
            } else {
                throw new Error(`Erro HTTP ${response.status}: ${responseText.substring(0, 200)}`);
            }
        } catch (error) {
            console.error('❌ Erro no método alternativo:', error);
            throw new Error('Não foi possível salvar os dados: ' + error.message);
        }
    }

    // Ler dados do Google Drive via Apps Script
    async readData() {
        try {
            const params = new URLSearchParams({
                action: 'read',
                folderId: this.FOLDER_ID,
                fileName: this.FILE_NAME
            });

            const url = `${this.SCRIPT_URL}?${params.toString()}`;
            
            console.log('Tentando ler dados de:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });

            console.log('Resposta recebida:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na resposta:', errorText);
                throw new Error(`Erro ao ler dados: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Dados recebidos:', result);
            
            // Verificar se a resposta tem a estrutura esperada
            if (result.success && result.data) {
                return result.data;
            } else if (result.data) {
                // Se não tiver success mas tiver data
                return result.data;
            } else if (result.contratos) {
                // Se os dados vieram diretamente
                return result;
            } else {
                console.warn('Estrutura de dados inesperada:', result);
                return { contratos: [] };
            }
        } catch (error) {
            console.error('Erro ao ler dados:', error);
            console.error('Detalhes do erro:', error.message, error.stack);
            
            // Tentar método alternativo sem CORS
            try {
                return await this.readDataAlternative();
            } catch (altError) {
                console.error('Método alternativo também falhou:', altError);
                return { contratos: [] };
            }
        }
    }

    // Método alternativo para ler dados (usando JSONP ou iframe)
    async readDataAlternative() {
        return new Promise((resolve, reject) => {
            // Criar um script temporário para fazer JSONP
            const script = document.createElement('script');
            const callbackName = 'readDataCallback_' + Date.now();
            
            window[callbackName] = (data) => {
                delete window[callbackName];
                document.body.removeChild(script);
                resolve(data.data || data || { contratos: [] });
            };
            
            const url = `${this.SCRIPT_URL}?action=read&folderId=${this.FOLDER_ID}&fileName=${this.FILE_NAME}&callback=${callbackName}`;
            script.src = url;
            script.onerror = () => {
                delete window[callbackName];
                document.body.removeChild(script);
                reject(new Error('Erro ao carregar dados'));
            };
            
            document.body.appendChild(script);
            
            // Timeout de 10 segundos
            setTimeout(() => {
                if (window[callbackName]) {
                    delete window[callbackName];
                    document.body.removeChild(script);
                    reject(new Error('Timeout ao ler dados'));
                }
            }, 10000);
        });
    }

    // Obter estatísticas dos contratos
    async getStats() {
        try {
            const data = await this.readData();
            return {
                total: data.contratos ? data.contratos.length : 0,
                ultima_atualizacao: data.ultima_atualizacao || 'Nunca',
                contratos: data.contratos || []
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return { total: 0, ultima_atualizacao: 'Erro', contratos: [] };
        }
    }

    // Verificar se está configurado
    isConfigured() {
        return this.SCRIPT_URL && this.SCRIPT_URL.includes('script.google.com');
    }

    // Verificar se o contrato foi salvo com sucesso (lendo de volta)
    async verificarSalvamento(idEvento) {
        try {
            console.log('🔍 Verificando se o contrato foi salvo...');
            console.log('🆔 ID do evento a verificar:', idEvento);
            
            // Aguardar um pouco para garantir que o arquivo foi escrito
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const dados = await this.readData();
            console.log('📊 Dados lidos:', dados);
            
            if (dados.contratos && Array.isArray(dados.contratos)) {
                const contratoEncontrado = dados.contratos.find(c => c.id_evento === idEvento);
                
                if (contratoEncontrado) {
                    console.log('✅ Contrato encontrado no banco de dados!');
                    return {
                        sucesso: true,
                        encontrado: true,
                        total: dados.contratos.length,
                        contrato: contratoEncontrado
                    };
                } else {
                    console.warn('⚠️ Contrato não encontrado no banco de dados');
                    return {
                        sucesso: true,
                        encontrado: false,
                        total: dados.contratos.length,
                        mensagem: 'Contrato pode estar sendo processado. Aguarde alguns segundos.'
                    };
                }
            } else {
                console.warn('⚠️ Estrutura de dados inesperada');
                return {
                    sucesso: false,
                    encontrado: false,
                    mensagem: 'Não foi possível verificar o salvamento'
                };
            }
        } catch (error) {
            console.error('❌ Erro ao verificar salvamento:', error);
            return {
                sucesso: false,
                encontrado: false,
                erro: error.message
            };
        }
    }
}

// Instância global
const driveManager = new GoogleAppsScriptManager();
