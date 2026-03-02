# 🔧 SOLUÇÃO: Dados Não Estão Sendo Salvos no JSON

## 🔍 PROBLEMA IDENTIFICADO

Os dados não estão sendo salvos porque:

1. **FOLDER_ID pode estar incorreto** - O link que você forneceu é de um **ARQUIVO**, não de uma **PASTA**
2. **Método iframe não verifica se funcionou** - O sistema assume que funcionou, mas não confirma
3. **Falta de verificação** - Não há confirmação real de que os dados foram salvos

## ✅ SOLUÇÕES APLICADAS

### 1. Melhorias no Código
- ✅ Método iframe agora tenta verificar se o salvamento funcionou
- ✅ Mensagens de erro mais claras
- ✅ Logs mais detalhados para debug

### 2. Código Atualizado
- ✅ `mk-drive-api-unificado.js` - Melhorado método de salvamento
- ✅ `GOOGLE_APPS_SCRIPT_CODE.js` - Mensagens de erro mais claras

## 📋 O QUE VOCÊ PRECISA FAZER AGORA

### Passo 1: Descobrir o FOLDER_ID Correto

O sistema precisa do ID da **PASTA**, não do arquivo!

**Opção A: Descobrir a pasta do arquivo existente**
1. Abra o link: https://drive.google.com/file/d/1cjM746_XBeh6rzjvB2gB-HwOgdHbt6w9/view?usp=drive_link
2. Clique com botão direito no arquivo > "Ver detalhes"
3. Veja qual é a pasta pai
4. Abra a pasta e copie o ID da URL (parte após `/folders/`)

**Opção B: Criar uma nova pasta**
1. Acesse: https://drive.google.com
2. Crie uma nova pasta (ex: "MK Audiovisual Contratos")
3. Abra a pasta e copie o ID da URL

### Passo 2: Atualizar o FOLDER_ID no Código

1. Abra o arquivo: `mk-drive-api-unificado.js`
2. Encontre a linha 19:
   ```javascript
   FOLDER_ID: '16kt50n_MFB60_h3JFgIA408k8YrjU6Rb',
   ```
3. Substitua pelo ID da sua pasta:
   ```javascript
   FOLDER_ID: 'SEU_FOLDER_ID_AQUI',
   ```

### Passo 3: Atualizar no Google Apps Script

1. Abra: https://script.google.com
2. Encontre seu projeto "MK Audiovisual"
3. Abra o arquivo `GOOGLE_APPS_SCRIPT_CODE.js` (desta pasta)
4. Copie TODO o conteúdo
5. Cole no Google Apps Script (substituindo o código antigo)
6. Encontre a linha 28:
   ```javascript
   const folderId = e.parameter.folderId || '16kt50n_MFB60_h3JFgIA408k8YrjU6Rb';
   ```
7. Substitua pelo ID da sua pasta:
   ```javascript
   const folderId = e.parameter.folderId || 'SEU_FOLDER_ID_AQUI';
   ```
8. Salve (Ctrl+S)
9. Reimplante: "Implantar" > "Gerenciar implantações" > Editar > "Nova versão" > "Implantar"

### Passo 4: Testar

1. Abra o arquivo `index.html` no navegador
2. Clique em **"🧪 Testar Conexão"**
3. Se aparecer **"✅ Conexão OK!"**, está funcionando!
4. Tente criar um contrato e verificar se salva no Google Drive

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

### Método 1: Teste de Conexão
- Clique em "🧪 Testar Conexão"
- Deve aparecer "✅ Conexão OK!" e mostrar o total de contratos

### Método 2: Verificar no Google Drive
1. Acesse a pasta no Google Drive
2. Procure pelo arquivo: `mk_audiovisual_contratos.json`
3. Abra o arquivo e verifique se contém os contratos salvos

### Método 3: Ver Logs do Google Apps Script
1. Acesse: https://script.google.com
2. Abra seu projeto
3. Clique em **"Execuções"** (menu lateral)
4. Veja as execuções recentes e verifique se há erros

## 🆘 SE AINDA NÃO FUNCIONAR

### Verificar Permissões
1. Na primeira execução, o Google Apps Script pedirá permissão
2. Autorize o acesso ao Google Drive
3. Certifique-se de que a pasta está acessível

### Verificar Erros
1. Abra o console do navegador (F12)
2. Veja se há erros em vermelho
3. Copie as mensagens de erro para diagnóstico

### Verificar FOLDER_ID
1. Certifique-se de que o ID é da **PASTA**, não do arquivo
2. O ID da pasta aparece na URL quando você abre a pasta:
   ```
   https://drive.google.com/drive/folders/SEU_FOLDER_ID_AQUI
   ```

## 📝 ARQUIVOS DE AJUDA

- `DESCOBRIR_FOLDER_ID.md` - Guia completo para descobrir o FOLDER_ID
- `ATUALIZAR_GOOGLE_APPS_SCRIPT.md` - Como atualizar o código no Google Apps Script
- `SOLUCAO_CORS.md` - Solução para problemas de CORS

## ✅ CHECKLIST

- [ ] FOLDER_ID atualizado no `mk-drive-api-unificado.js`
- [ ] Código atualizado no Google Apps Script
- [ ] Google Apps Script reimplantado
- [ ] Teste de conexão funcionando
- [ ] Contrato de teste salvo com sucesso
- [ ] Arquivo JSON visível no Google Drive
