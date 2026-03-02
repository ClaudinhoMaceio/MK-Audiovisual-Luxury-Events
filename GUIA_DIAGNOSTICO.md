# 🔍 Guia de Diagnóstico - Problema com Google Drive

## ❌ Problema: Arquivo JSON não está chegando no Google Drive

### 📋 Checklist de Verificação

#### 1. ✅ Verificar se o Google Apps Script está configurado

Acesse o Google Apps Script:
```
https://script.google.com/home/projects/AKfycbwlXdKn8UPygZLwqkimfA6YydFyD9EZmw51uYCNnmG0rX94B0dP6ONDATWWr9C7k8vT/edit
```

**O script DEVE ter estas funções:**

```javascript
function doGet(e) {
  // Código para ler dados
}

function doPost(e) {
  // Código para salvar dados
}
```

#### 2. 🧪 Testar a Conexão

No seu sistema (index.html), clique no botão **"🧪 Testar Conexão"** no canto superior direito.

Isso vai:
- Verificar se o Google Apps Script está respondendo
- Mostrar a resposta recebida
- Indicar se há erros

#### 3. 📊 Verificar o Console do Navegador

1. Abra o sistema no navegador
2. Pressione **F12** para abrir o DevTools
3. Vá na aba **Console**
4. Tente salvar um contrato
5. Procure por mensagens com emojis:
   - 🔵 = Iniciando processo
   - 📤 = Enviando dados
   - 📥 = Recebendo resposta
   - ✅ = Sucesso
   - ❌ = Erro

#### 4. 🔗 Verificar URL do Script

A URL configurada é:
```
https://script.google.com/macros/s/AKfycbwlXdKn8UPygZLwqkimfA6YydFyD9EZmw51uYCNnmG0rX94B0dP6ONDATWWr9C7k8vT/exec
```

**Teste diretamente no navegador:**
```
https://script.google.com/macros/s/AKfycbwlXdKn8UPygZLwqkimfA6YydFyD9EZmw51uYCNnmG0rX94B0dP6ONDATWWr9C7k8vT/exec?action=read
```

**O que deve aparecer:**
- Se aparecer JSON com `{"success": true, ...}` = ✅ Funcionando
- Se aparecer erro = ❌ Problema no script

#### 5. 📁 Verificar Permissões da Pasta

A pasta do Drive é:
```
ID: 16kt50n_MFB60_h3JFgIA408k8YrjU6Rb
URL: https://drive.google.com/drive/folders/16kt50n_MFB60_h3JFgIA408k8YrjU6Rb
```

**Verifique:**
- ✅ A pasta existe?
- ✅ O script tem permissão para escrever nela?
- ✅ O arquivo `mk_audiovisual_contratos.json` aparece na pasta?

#### 6. 🔐 Verificar Permissões do Google Apps Script

No Google Apps Script:
1. Vá em **Execuções** (menu lateral)
2. Veja se há erros de permissão
3. Se aparecer erro de permissão, clique para autorizar

**Permissões necessárias:**
- ✅ Acesso ao Google Drive
- ✅ Permissão para criar/editar arquivos

#### 7. 📝 Verificar Logs do Google Apps Script

No Google Apps Script:
1. Vá em **Execuções** (menu lateral)
2. Veja as últimas execuções
3. Clique em uma execução para ver detalhes
4. Procure por erros ou mensagens

---

## 🛠️ Soluções Comuns

### Problema 1: "Script function not found: doGet"

**Solução:**
O Google Apps Script precisa ter as funções `doGet` e `doPost` implementadas.

**Código mínimo necessário:**

```javascript
function doGet(e) {
  try {
    const action = e.parameter.action || 'read';
    const folderId = e.parameter.folderId || '16kt50n_MFB60_h3JFgIA408k8YrjU6Rb';
    const fileName = e.parameter.fileName || 'mk_audiovisual_contratos.json';
    
    if (action === 'read') {
      return readData(folderId, fileName);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Ação não reconhecida'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'save';
    
    if (action === 'save') {
      return saveData(data.folderId, data.fileName, data.data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Ação não reconhecida'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function readData(folderId, fileName) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFilesByName(fileName);
    
    if (!files.hasNext()) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: { contratos: [], ultima_atualizacao: null },
        total: 0
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const file = files.next();
    const content = file.getBlob().getDataAsString();
    const jsonData = JSON.parse(content);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: jsonData,
      total: jsonData.contratos ? jsonData.contratos.length : 0,
      ultima_atualizacao: jsonData.ultima_atualizacao
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      data: { contratos: [] }
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function saveData(folderId, fileName, newData) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    let file;
    let existingData = { contratos: [] };
    
    // Procurar arquivo existente
    const files = folder.getFilesByName(fileName);
    if (files.hasNext()) {
      file = files.next();
      const content = file.getBlob().getDataAsString();
      existingData = JSON.parse(content);
    }
    
    // Adicionar novo contrato
    if (!existingData.contratos) {
      existingData.contratos = [];
    }
    existingData.contratos.push(newData);
    existingData.ultima_atualizacao = new Date().toISOString();
    
    // Salvar arquivo
    const jsonString = JSON.stringify(existingData, null, 2);
    const blob = Utilities.newBlob(jsonString, 'application/json', fileName);
    
    if (file) {
      file.setContent(blob.getDataAsString());
    } else {
      file = folder.createFile(blob);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Contrato salvo com sucesso!',
      total: existingData.contratos.length,
      folderId: folderId,
      fileName: fileName
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Problema 2: Erro de CORS

**Solução:**
O Google Apps Script precisa retornar headers CORS. Adicione no início das funções:

```javascript
function doGet(e) {
  // ... código ...
}

function doPost(e) {
  // ... código ...
}
```

O Google Apps Script já retorna CORS automaticamente, mas verifique se não há erros.

### Problema 3: Pasta não encontrada

**Solução:**
1. Verifique se o ID da pasta está correto: `16kt50n_MFB60_h3JFgIA408k8YrjU6Rb`
2. Verifique se o script tem permissão para acessar a pasta
3. Compartilhe a pasta com a conta do Google Apps Script (se necessário)

---

## 📞 Próximos Passos

1. **Teste a conexão** usando o botão "🧪 Testar Conexão"
2. **Verifique o console** (F12) para ver mensagens de erro
3. **Verifique o Google Apps Script** para ver se há erros nas execuções
4. **Teste a URL diretamente** no navegador

---

## 💡 Dica

Se nada funcionar, copie TODAS as mensagens do console (F12) e envie para análise.
