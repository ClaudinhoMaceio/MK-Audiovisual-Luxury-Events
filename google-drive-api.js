// Google Drive API Manager
// Gerencia envio e recebimento de dados JSON no Google Drive

class GoogleDriveManager {
    constructor() {
        this.CLIENT_ID = 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com';
        this.API_KEY = 'SUA_API_KEY_AQUI';
        this.DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
        this.SCOPES = 'https://www.googleapis.com/auth/drive.file';
        this.gapi = null;
        this.isSignedIn = false;
        this.FILE_NAME = 'mk_audiovisual_contratos.json';
        this.FILE_ID = null;
    }

    // Inicializar a API do Google
    async init() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                window.gapi.load('client:auth2', () => {
                    window.gapi.client.init({
                        apiKey: this.API_KEY,
                        clientId: this.CLIENT_ID,
                        discoveryDocs: this.DISCOVERY_DOCS,
                        scope: this.SCOPES
                    }).then(() => {
                        this.gapi = window.gapi;
                        this.authInstance = this.gapi.auth2.getAuthInstance();
                        resolve();
                    }).catch(reject);
                });
            } else {
                reject(new Error('Google API não carregada. Verifique se o script está incluído.'));
            }
        });
    }

    // Fazer login no Google
    async signIn() {
        try {
            if (!this.gapi) await this.init();
            const authInstance = this.gapi.auth2.getAuthInstance();
            const user = await authInstance.signIn();
            this.isSignedIn = true;
            return user;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    }

    // Fazer logout
    async signOut() {
        try {
            if (this.authInstance) {
                await this.authInstance.signOut();
                this.isSignedIn = false;
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            throw error;
        }
    }

    // Verificar se está logado
    isAuthenticated() {
        if (!this.authInstance) return false;
        return this.authInstance.isSignedIn.get();
    }

    // Buscar arquivo JSON existente no Drive
    async findFile() {
        try {
            const response = await this.gapi.client.drive.files.list({
                q: `name='${this.FILE_NAME}' and trashed=false`,
                fields: 'files(id, name, modifiedTime)',
                spaces: 'drive'
            });
            
            if (response.result.files && response.result.files.length > 0) {
                this.FILE_ID = response.result.files[0].id;
                return response.result.files[0];
            }
            return null;
        } catch (error) {
            console.error('Erro ao buscar arquivo:', error);
            throw error;
        }
    }

    // Ler dados do arquivo JSON do Drive
    async readData() {
        try {
            if (!this.isAuthenticated()) {
                await this.signIn();
            }

            let file = await this.findFile();
            
            if (!file) {
                // Criar arquivo vazio se não existir
                return { contratos: [] };
            }

            this.FILE_ID = file.id;
            
            // Baixar conteúdo do arquivo
            const response = await this.gapi.client.drive.files.get({
                fileId: this.FILE_ID,
                alt: 'media'
            });

            try {
                return JSON.parse(response.body);
            } catch (e) {
                // Se não for JSON válido, retornar estrutura vazia
                return { contratos: [] };
            }
        } catch (error) {
            console.error('Erro ao ler dados:', error);
            // Retornar estrutura vazia em caso de erro
            return { contratos: [] };
        }
    }

    // Salvar dados no arquivo JSON do Drive
    async saveData(data) {
        try {
            if (!this.isAuthenticated()) {
                await this.signIn();
            }

            let file = await this.findFile();
            let dadosExistentes = { contratos: [] };

            // Se o arquivo existe, ler dados existentes
            if (file) {
                this.FILE_ID = file.id;
                try {
                    const response = await this.gapi.client.drive.files.get({
                        fileId: this.FILE_ID,
                        alt: 'media'
                    });
                    dadosExistentes = JSON.parse(response.body);
                } catch (e) {
                    console.log('Arquivo vazio ou inválido, criando novo');
                }
            }

            // Adicionar novo contrato aos dados existentes
            if (!dadosExistentes.contratos) {
                dadosExistentes.contratos = [];
            }
            dadosExistentes.contratos.push(data);
            dadosExistentes.ultima_atualizacao = new Date().toISOString();

            // Converter para JSON
            const jsonData = JSON.stringify(dadosExistentes, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });

            if (file) {
                // Atualizar arquivo existente
                const form = new FormData();
                form.append('metadata', new Blob([JSON.stringify({
                    name: this.FILE_NAME,
                    mimeType: 'application/json'
                })], { type: 'application/json' }));
                form.append('file', blob);

                const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${this.FILE_ID}?uploadType=multipart`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
                    },
                    body: form
                });

                if (!response.ok) throw new Error('Erro ao atualizar arquivo');
            } else {
                // Criar novo arquivo
                const form = new FormData();
                form.append('metadata', new Blob([JSON.stringify({
                    name: this.FILE_NAME,
                    mimeType: 'application/json'
                })], { type: 'application/json' }));
                form.append('file', blob);

                const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
                    },
                    body: form
                });

                const result = await response.json();
                if (!response.ok) throw new Error('Erro ao criar arquivo');
                this.FILE_ID = result.id;
            }

            return { success: true, message: 'Dados salvos com sucesso no Google Drive!' };
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            throw error;
        }
    }

    // Método simplificado usando fetch API
    async saveDataSimple(data) {
        try {
            if (!this.isAuthenticated()) {
                await this.signIn();
            }

            let file = await this.findFile();
            let dadosExistentes = { contratos: [] };

            // Ler dados existentes se o arquivo já existe
            if (file) {
                this.FILE_ID = file.id;
                try {
                    const response = await this.gapi.client.drive.files.get({
                        fileId: this.FILE_ID,
                        alt: 'media'
                    });
                    if (response.body) {
                        dadosExistentes = JSON.parse(response.body);
                    }
                } catch (e) {
                    console.log('Arquivo vazio ou erro ao ler, criando novo');
                }
            }

            // Adicionar novo contrato
            if (!dadosExistentes.contratos) {
                dadosExistentes.contratos = [];
            }
            dadosExistentes.contratos.push(data);
            dadosExistentes.ultima_atualizacao = new Date().toISOString();

            const jsonData = JSON.stringify(dadosExistentes, null, 2);
            const accessToken = this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

            if (file) {
                // Atualizar arquivo existente usando uploadType=media
                const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${this.FILE_ID}?uploadType=media`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: jsonData
                });

                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(`Erro ao atualizar: ${error}`);
                }
            } else {
                // Criar novo arquivo usando multipart upload
                const boundary = '----WebKitFormBoundary' + Date.now();
                const delimiter = '\r\n--' + boundary + '\r\n';
                const closeDelim = '\r\n--' + boundary + '--';

                const metadata = {
                    name: this.FILE_NAME,
                    mimeType: 'application/json'
                };

                const multipartBody =
                    delimiter +
                    'Content-Type: application/json\r\n\r\n' +
                    JSON.stringify(metadata) +
                    delimiter +
                    'Content-Type: application/json\r\n\r\n' +
                    jsonData +
                    closeDelim;

                const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': `multipart/related; boundary="${boundary}"`
                    },
                    body: multipartBody
                });

                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(`Erro ao criar: ${error}`);
                }

                const result = await response.json();
                this.FILE_ID = result.id;
            }

            return { success: true, message: 'Dados salvos com sucesso no Google Drive!' };
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            throw error;
        }
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
}

// Instância global
const driveManager = new GoogleDriveManager();
