# 🚀 Guia Completo de Configuração - Google Apps Script

## ⚠️ PROBLEMA IDENTIFICADO

O erro **"Script function not found: doGet"** indica que o Google Apps Script não tem as funções necessárias implementadas.

## ✅ SOLUÇÃO PASSO A PASSO

### 📋 Passo 1: Acessar o Google Apps Script

1. Acesse: https://script.google.com
2. Faça login com sua conta Google
3. Procure pelo projeto com ID: `AKfycbz4i-6j6QT4KjYWWGvBFvCShB4sRs9c3_JB6xsqt5kZeVcf2rtL-qOCvsx_MHDmnM_b`
   - Ou acesse diretamente: https://script.google.com/home/projects/AKfycbz4i-6j6QT4KjYWWGvBFvCShB4sRs9c3_JB6xsqt5kZeVcf2rtL-qOCvsx_MHDmnM_b/edit

### 📋 Passo 2: Limpar o Código Atual

1. Selecione TODO o código no editor (Ctrl+A)
2. Delete tudo (Delete ou Backspace)
3. Certifique-se de que o editor está vazio

### 📋 Passo 3: Copiar o Código Correto

1. Abra o arquivo: `GOOGLE_APPS_SCRIPT_CODE.js`
2. Selecione TODO o conteúdo (Ctrl+A)
3. Copie (Ctrl+C)

### 📋 Passo 4: Colar no Google Apps Script

1. Volte para o Google Apps Script
2. Cole o código no editor (Ctrl+V)
3. Verifique se o código foi colado completamente

### 📋 Passo 5: Salvar o Projeto

1. Clique em **"Salvar"** (ícone de disquete) ou pressione **Ctrl+S**
2. Dê um nome ao projeto (ex: "MK Audiovisual API")
3. Aguarde a confirmação de salvamento

### 📋 Passo 6: Autorizar Permissões (Primeira Vez)

1. Clique no menu **"Executar"** (▶️) no topo
2. Selecione qualquer função (ex: `doGet`)
3. Clique em **"Autorizar acesso"**
4. Selecione sua conta Google
5. Clique em **"Avançado"** > **"Ir para [Nome do Projeto] (não seguro)"**
6. Clique em **"Permitir"** para dar acesso ao Google Drive

### 📋 Passo 7: Criar Nova Implantação

1. Clique em **"Implantar"** no canto superior direito
2. Selecione **"Nova implantação"**
3. Clique no ícone de engrenagem ⚙️ ao lado de **"Selecionar tipo"**
4. Escolha **"Aplicativo da Web"**

### 📋 Passo 8: Configurar a Implantação

Configure os seguintes campos:

- **Descrição**: `MK Audiovisual - API v1.0` (ou qualquer nome)
- **Execute como**: **"Eu"** (sua conta)
- **Quem tem acesso**: **"Qualquer pessoa"** ⚠️ IMPORTANTE!

### 📋 Passo 9: Implantar

1. Clique em **"Implantar"**
2. Aguarde alguns segundos
3. Uma nova janela aparecerá com a URL de implantação
4. **COPIE A URL** (ela deve terminar com `/exec`)

### 📋 Passo 10: Verificar a URL

A URL deve ser algo como:
```
https://script.google.com/macros/s/AKfycbz4i-6j6QT4KjYWWGvBFvCShB4sRs9c3_JB6xsqt5kZeVcf2rtL-qOCvsx_MHDmnM_b/exec
```

⚠️ **IMPORTANTE**: Se a URL for diferente, você precisa atualizar no arquivo HTML!

### 📋 Passo 11: Testar a API

1. Abra uma nova aba no navegador
2. Cole a URL e adicione: `?action=read`
3. Exemplo completo:
   ```
   https://script.google.com/macros/s/AKfycbz4i-6j6QT4KjYWWGvBFvCShB4sRs9c3_JB6xsqt5kZeVcf2rtL-qOCvsx_MHDmnM_b/exec?action=read
   ```
4. Você deve ver uma resposta JSON como:
   ```json
   {
     "success": true,
     "data": {
       "contratos": [],
       "dividas": []
     },
     "total": 0
   }
   ```

✅ **Se aparecer isso, está funcionando!**

❌ **Se aparecer erro, volte ao Passo 1 e verifique tudo novamente**

### 📋 Passo 12: Atualizar o HTML (Se Necessário)

Se a URL mudou após a nova implantação:

1. Abra o arquivo: `TESTE_LEITURA.html`
2. Procure pela linha:
   ```javascript
   const DEPLOY_URL = "https://script.google.com/macros/s/...";
   ```
3. Substitua pela nova URL copiada no Passo 9
4. Salve o arquivo

## 🔍 VERIFICAÇÃO FINAL

### ✅ Checklist de Verificação

- [ ] Código completo colado no Google Apps Script
- [ ] Projeto salvo com sucesso
- [ ] Permissões autorizadas
- [ ] Nova implantação criada
- [ ] URL copiada e testada
- [ ] Teste no navegador retornou JSON válido
- [ ] URL atualizada no arquivo HTML (se necessário)

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### Problema 1: "Script function not found: doGet"

**Causa**: O código não foi colado corretamente ou está incompleto.

**Solução**:
1. Verifique se TODO o código do arquivo `GOOGLE_APPS_SCRIPT_CODE.js` foi colado
2. Certifique-se de que as funções `doGet` e `doPost` estão presentes
3. Salve o projeto novamente
4. Crie uma nova implantação

### Problema 2: "Pasta não encontrada"

**Causa**: O ID da pasta do Drive está incorreto.

**Solução**:
1. Abra o Google Drive
2. Acesse a pasta desejada
3. Copie o ID da pasta da URL
   - Exemplo: `https://drive.google.com/drive/folders/16kt50n_MFB60_h3JFgIA408k8YrjU6Rb`
   - O ID é: `16kt50n_MFB60_h3JFgIA408k8YrjU6Rb`
4. Atualize no código do Google Apps Script (linha 28 e 82)
5. Atualize no arquivo HTML (linha 237)

### Problema 3: "Erro de permissão"

**Causa**: O script não tem permissão para acessar o Drive.

**Solução**:
1. Vá em **"Executar"** > Selecione `doGet` > **"Autorizar acesso"**
2. Permita todas as permissões solicitadas
3. Teste novamente

### Problema 4: "Acesso negado" ao testar a URL

**Causa**: A implantação não está configurada como "Qualquer pessoa".

**Solução**:
1. Vá em **"Implantar"** > **"Gerenciar implantações"**
2. Clique nos três pontos (⋮) da implantação
3. Clique em **"Editar"**
4. Altere **"Quem tem acesso"** para **"Qualquer pessoa"**
5. Clique em **"Implantar"** novamente

## 📞 SUPORTE

Se ainda tiver problemas:

1. Abra o console do Google Apps Script (menu lateral > "Execuções")
2. Veja os logs de erro
3. Copie as mensagens de erro
4. Verifique se todas as etapas foram seguidas corretamente

## 🎯 CONFIGURAÇÕES ATUAIS

- **URL do Script**: `https://script.google.com/macros/s/AKfycbz4i-6j6QT4KjYWWGvBFvCShB4sRs9c3_JB6xsqt5kZeVcf2rtL-qOCvsx_MHDmnM_b/exec`
- **ID da Pasta**: `16kt50n_MFB60_h3JFgIA408k8YrjU6Rb`
- **Nome do Arquivo**: `mk_audiovisual_contratos.json`

---

**✅ Após seguir todos os passos, o sistema deve funcionar perfeitamente!**
