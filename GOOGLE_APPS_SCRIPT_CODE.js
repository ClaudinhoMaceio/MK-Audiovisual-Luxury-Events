/**
 * GOOGLE APPS SCRIPT - MK AUDIOVISUAL
 * 
 * INSTRUÇÕES DE INSTALAÇÃO:
 * 1. Acesse: https://script.google.com
 * 2. Clique em "Novo Projeto"
 * 3. Cole TODO este código no editor
 * 4. Salve o projeto (Ctrl+S)
 * 5. Clique em "Implantar" > "Nova implantação"
 * 6. Selecione "Tipo: Aplicativo da Web"
 * 7. Execute como: "Eu"
 * 8. Quem tem acesso: "Qualquer pessoa"
 * 9. Clique em "Implantar"
 * 10. Copie a URL gerada e use no sistema
 * 
 * CONFIGURAÇÕES:
 * - Pasta do Drive: 16kt50n_MFB60_h3JFgIA408k8YrjU6Rb
 * - Arquivo JSON: mk_audiovisual_contratos.json
 */

// ============================================
// FUNÇÃO PRINCIPAL: doGet (Ler Dados)
// ============================================
function doGet(e) {
  try {
    // Obter parâmetros
    const action = e.parameter.action || 'read';
    const folderId = e.parameter.folderId || '16kt50n_MFB60_h3JFgIA408k8YrjU6Rb';
    const fileName = e.parameter.fileName || 'mk_audiovisual_contratos.json';
    const callback = e.parameter.callback; // Para JSONP
    
    // Log para debug
    console.log('doGet chamado:', { action, folderId, fileName, callback });
    
    // Processar ação
    if (action === 'read') {
      return readData(folderId, fileName, callback);
    } else if (action === 'save' || action === 'saveFull') {
      // doGet também pode receber dados via GET (método alternativo para CORS)
      const dataParam = e.parameter.data;
      if (dataParam) {
        try {
          const payload = JSON.parse(decodeURIComponent(dataParam));
          console.log('Salvando via GET (método alternativo):', payload.action);
          
          // Verificar se é salvamento completo
          if (payload.action === 'saveFull' || (payload.data && payload.data.contratos && Array.isArray(payload.data.contratos))) {
            return saveFullData(payload.folderId || folderId, payload.fileName || fileName, payload.data);
          } else {
            return saveData(payload.folderId || folderId, payload.fileName || fileName, payload.data);
          }
        } catch (error) {
          return createErrorResponse('Erro ao processar dados: ' + error.toString());
        }
      } else {
        return createErrorResponse('Parâmetro "data" não fornecido');
      }
    } else {
      return createErrorResponse('Ação não reconhecida: ' + action);
    }
  } catch (error) {
    console.error('Erro em doGet:', error);
    return createErrorResponse('Erro ao processar requisição: ' + error.toString());
  }
}

// ============================================
// FUNÇÃO PRINCIPAL: doPost (Salvar Dados)
// ============================================
function doPost(e) {
  try {
    // Obter dados do POST
    let postData = e.postData ? e.postData.contents : '';
    
    // Se vier de formulário, pode estar em e.parameter
    if (!postData && e.parameter && e.parameter.data) {
      try {
        postData = e.parameter.data;
        // Se for string JSON, já está pronto
        if (typeof postData === 'string') {
          // Tentar parse
          const parsed = JSON.parse(postData);
          postData = JSON.stringify(parsed);
        }
      } catch (err) {
        // Se não for JSON válido, usar como está
      }
    }
    
    console.log('doPost chamado. Dados recebidos:', postData ? postData.substring(0, 200) + '...' : 'vazio');
    
    if (!postData) {
      return createErrorResponse('Nenhum dado recebido no POST');
    }
    
    let data;
    try {
      data = JSON.parse(postData);
    } catch (error) {
      return createErrorResponse('Erro ao fazer parse do JSON: ' + error.toString());
    }
    
    // Validar estrutura
    if (!data.action) {
      return createErrorResponse('Campo "action" não encontrado');
    }
    
    // Obter parâmetros
    const folderId = data.folderId || '16kt50n_MFB60_h3JFgIA408k8YrjU6Rb';
    const fileName = data.fileName || 'mk_audiovisual_contratos.json';
    const newData = data.data;
    
    if (!newData) {
      return createErrorResponse('Campo "data" não encontrado');
    }
    
    // Verificar se é salvamento completo ou individual
    if (data.action === 'saveFull' || (newData.contratos && Array.isArray(newData.contratos))) {
      // Salvar estado completo (contratos + dívidas)
      return saveFullData(folderId, fileName, newData);
    } else if (data.action === 'save') {
      // Salvar contrato individual
      return saveData(folderId, fileName, newData);
    } else {
      return createErrorResponse('Ação não reconhecida: ' + data.action);
    }
    
  } catch (error) {
    console.error('Erro em doPost:', error);
    return createErrorResponse('Erro ao processar POST: ' + error.toString());
  }
}

// ============================================
// FUNÇÃO: Ler Dados do Google Drive
// ============================================
function readData(folderId, fileName, callback) {
  try {
    console.log('Lendo dados. Pasta:', folderId, 'Arquivo:', fileName, 'Callback:', callback);
    
    // Obter pasta
    let folder;
    try {
      folder = DriveApp.getFolderById(folderId);
    } catch (error) {
      return createErrorResponse('Pasta não encontrada. Verifique o ID: ' + folderId);
    }
    
    // Procurar arquivo
    const files = folder.getFilesByName(fileName);
    
    if (!files.hasNext()) {
      // Arquivo não existe, retornar estrutura vazia
      console.log('Arquivo não encontrado, retornando estrutura vazia');
      return createSuccessResponse({
        contratos: [],
        dividas: [],
        ultima_atualizacao: null
      }, 0, callback);
    }
    
    // Ler arquivo
    const file = files.next();
    const content = file.getBlob().getDataAsString();
    
    let jsonData;
    try {
      jsonData = JSON.parse(content);
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error);
      return createErrorResponse('Arquivo JSON inválido: ' + error.toString());
    }
    
    // Garantir estrutura correta
    if (!jsonData.contratos) {
      jsonData.contratos = [];
    }
    if (!jsonData.dividas) {
      jsonData.dividas = [];
    }
    
    const totalContratos = jsonData.contratos.length;
    const totalDividas = jsonData.dividas.length;
    console.log('Dados lidos com sucesso. Contratos:', totalContratos, 'Dívidas:', totalDividas);
    
    return createSuccessResponse(jsonData, totalContratos, callback);
    
  } catch (error) {
    console.error('Erro ao ler dados:', error);
    return createErrorResponse('Erro ao ler dados: ' + error.toString());
  }
}

// ============================================
// FUNÇÃO: Salvar Estado Completo (Contratos + Dívidas)
// ============================================
function saveFullData(folderId, fileName, fullData) {
  try {
    console.log('Salvando estado completo. Pasta:', folderId, 'Arquivo:', fileName);
    
    // Obter pasta
    let folder;
    try {
      folder = DriveApp.getFolderById(folderId);
    } catch (error) {
      return createErrorResponse('Pasta não encontrada. Verifique o ID: ' + folderId);
    }
    
    // Garantir estrutura correta
    const dataToSave = {
      contratos: fullData.contratos || [],
      dividas: fullData.dividas || [],
      ultima_atualizacao: new Date().toISOString()
    };
    
    // Converter para JSON
    const jsonString = JSON.stringify(dataToSave, null, 2);
    
    // Procurar arquivo existente
    let file = null;
    const files = folder.getFilesByName(fileName);
    if (files.hasNext()) {
      file = files.next();
      // Atualizar arquivo existente
      file.setContent(jsonString);
      console.log('Arquivo atualizado com sucesso');
    } else {
      // Criar novo arquivo
      file = folder.createFile(fileName, jsonString, 'application/json');
      console.log('Arquivo criado com sucesso');
    }
    
    const totalContratos = dataToSave.contratos.length;
    const totalDividas = dataToSave.dividas.length;
    console.log('Salvamento concluído. Contratos:', totalContratos, 'Dívidas:', totalDividas);
    
    return createSuccessResponse({
      message: 'Estado completo salvo com sucesso!',
      contratos: totalContratos,
      dividas: totalDividas,
      folderId: folderId,
      fileName: fileName
    }, totalContratos);
    
  } catch (error) {
    console.error('Erro ao salvar estado completo:', error);
    return createErrorResponse('Erro ao salvar estado completo: ' + error.toString());
  }
}

// ============================================
// FUNÇÃO: Salvar Dados no Google Drive (Contrato Individual)
// ============================================
function saveData(folderId, fileName, newData) {
  try {
    console.log('Salvando dados. Pasta:', folderId, 'Arquivo:', fileName);
    newData = normalizeContractData(newData);
    console.log('Novo contrato ID:', newData.id_evento);
    
    // Obter pasta
    let folder;
    try {
      folder = DriveApp.getFolderById(folderId);
    } catch (error) {
      return createErrorResponse('Pasta não encontrada. Verifique o ID: ' + folderId);
    }
    
    // Procurar arquivo existente
    let file = null;
    let existingData = { contratos: [] };
    
    const files = folder.getFilesByName(fileName);
    if (files.hasNext()) {
      file = files.next();
      try {
        const content = file.getBlob().getDataAsString();
        if (content && content.trim() !== '') {
          existingData = JSON.parse(content);
        }
      } catch (error) {
        console.warn('Erro ao ler arquivo existente, criando novo:', error);
        existingData = { contratos: [] };
      }
    }
    
    // Garantir estrutura correta
    if (!existingData.contratos) {
      existingData.contratos = [];
    }
    if (!existingData.dividas) {
      existingData.dividas = [];
    }
    
    // Verificar se o contrato já existe (por ID)
    const idEvento = newData.id_evento;
    if (!idEvento) {
      return createErrorResponse('ID do evento não fornecido');
    }
    
    const indexExistente = existingData.contratos.findIndex(c => c.id_evento === idEvento);
    
    if (indexExistente >= 0) {
      // Atualizar contrato existente
      console.log('Atualizando contrato existente no índice:', indexExistente);
      existingData.contratos[indexExistente] = newData;
    } else {
      // Adicionar novo contrato
      console.log('Adicionando novo contrato');
      existingData.contratos.push(newData);
    }
    
    // Atualizar timestamp
    existingData.ultima_atualizacao = new Date().toISOString();
    
    // Converter para JSON
    const jsonString = JSON.stringify(existingData, null, 2);
    
    // Salvar arquivo
    if (file) {
      // Atualizar arquivo existente
      file.setContent(jsonString);
      console.log('Arquivo atualizado com sucesso');
    } else {
      // Criar novo arquivo
      file = folder.createFile(fileName, jsonString, 'application/json');
      console.log('Arquivo criado com sucesso');
    }
    
    const total = existingData.contratos.length;
    console.log('Salvamento concluído. Total de contratos:', total);
    
    return createSuccessResponse({
      message: 'Contrato salvo com sucesso!',
      total: total,
      folderId: folderId,
      fileName: fileName,
      id_evento: idEvento
    }, total);
    
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return createErrorResponse('Erro ao salvar dados: ' + error.toString());
  }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function normalizeContractData(contrato) {
  const safeContrato = contrato || {};
  const safeLogistica = safeContrato.logistica || {};

  const valorRaw = safeLogistica.valor_evento || safeContrato.valor_evento || '';
  const valorNumeroRaw = safeLogistica.valor_evento_numero;
  const valorNumero = parseValorParaNumero(valorNumeroRaw || valorRaw);
  const valorFormatado = valorNumero > 0 ? formatBRL(valorNumero) : (valorRaw || '');

  safeContrato.logistica = {
    ...safeLogistica,
    valor_evento: valorFormatado,
    valor_evento_numero: valorNumero
  };

  return safeContrato;
}

function parseValorParaNumero(valor) {
  if (valor === null || valor === undefined) return 0;
  if (typeof valor === 'number') {
    return isFinite(valor) ? valor : 0;
  }

  const normalized = String(valor)
    .replace(/\s/g, '')
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();

  const number = parseFloat(normalized);
  return isFinite(number) ? number : 0;
}

function formatBRL(valorNumero) {
  if (!valorNumero || !isFinite(valorNumero)) return '';
  return 'R$ ' + valorNumero.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Criar resposta de sucesso
function createSuccessResponse(data, total, callback) {
  const response = {
    success: true,
    data: data,
    total: total || (data.contratos ? data.contratos.length : 0),
    timestamp: new Date().toISOString()
  };
  
  // Se data já tem contratos, incluir na resposta
  if (data.contratos) {
    response.ultima_atualizacao = data.ultima_atualizacao;
  }
  
  let output;
  
  if (callback) {
    // Resposta JSONP
    const jsonpResponse = callback + '(' + JSON.stringify(response) + ');';
    output = ContentService
      .createTextOutput(jsonpResponse)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // Resposta JSON normal
    output = ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return output;
}

// Criar resposta de erro
function createErrorResponse(errorMessage) {
  const response = {
    success: false,
    error: errorMessage,
    timestamp: new Date().toISOString()
  };
  
  const output = ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
  
  return output;
}
