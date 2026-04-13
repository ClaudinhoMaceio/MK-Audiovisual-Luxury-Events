# 🔧 ATUALIZAR CÓDIGO NO GOOGLE APPS SCRIPT

## ⚠️ PROBLEMA IDENTIFICADO

O erro `file.getContentText is not a function` indica que o código no Google Apps Script precisa ser atualizado.

## 📋 INSTRUÇÕES PARA CORRIGIR

### Passo 1: Acessar o Google Apps Script
1. Acesse: https://script.google.com
2. Encontre o projeto "MK Audiovisual" (ou o nome que você deu)
3. Clique para abrir o projeto

### Passo 2: Atualizar o Código
1. Abra o arquivo `GOOGLE_APPS_SCRIPT_CODE.js` nesta pasta
2. **COPIE TODO O CONTEÚDO** do arquivo
3. No Google Apps Script, **SUBSTITUA TODO O CÓDIGO** pelo código copiado
4. Salve o projeto (Ctrl+S ou Cmd+S)

### Passo 3: Reimplantar o Web App
1. Clique em **"Implantar"** > **"Gerenciar implantações"**
2. Clique no ícone de **lápis (editar)** ao lado da implantação existente
3. Clique em **"Nova versão"** (ou mantenha a versão atual)
4. Clique em **"Implantar"**
5. **COPIE A NOVA URL** (se houver mudança)

### Passo 4: Verificar Configurações
Certifique-se de que:
- ✅ **Executar como:** "Eu"
- ✅ **Quem tem acesso:** "Qualquer pessoa"
- ✅ A URL está correta no sistema

## 🔍 O QUE FOI CORRIGIDO

1. **Método de leitura de arquivo corrigido:**
   - Antes: `file.getContentText()` (não funciona)
   - Agora: `file.getBlob().getDataAsString('UTF-8')` (método correto)

2. **Tratamento de erros melhorado:**
   - Adicionado método alternativo caso o primeiro falhe
   - Mensagens de erro mais claras

3. **Compatibilidade:**
   - Funciona com todas as versões do Google Apps Script

## ✅ TESTAR APÓS ATUALIZAÇÃO

1. Abra o arquivo `index.html` no navegador
2. Clique em **"🧪 Testar Conexão"**
3. Se aparecer **"✅ Conexão OK!"**, está funcionando!

## 📝 NOTA SOBRE CORS

O erro de CORS é normal quando você abre o HTML diretamente no navegador (file://). O sistema já tem um método alternativo (iframe) que funciona mesmo com CORS. Para evitar o erro de CORS completamente, use um servidor HTTP local (veja SOLUCAO_CORS.md).

## 🆘 SE AINDA HOUVER ERRO

1. Verifique os logs do Google Apps Script:
   - No Google Apps Script, clique em **"Execuções"** (menu lateral)
   - Veja se há erros nas execuções recentes

2. Verifique a URL:
   - Certifique-se de que a URL no sistema está correta
   - A URL deve terminar com `/exec`

3. Verifique permissões:
   - O script precisa ter permissão para acessar o Google Drive
   - Na primeira execução, você precisará autorizar o acesso
