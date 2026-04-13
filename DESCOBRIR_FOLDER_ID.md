# 🔍 COMO DESCOBRIR O FOLDER_ID CORRETO

## ⚠️ PROBLEMA

O link que você forneceu é de um **ARQUIVO**, não de uma **PASTA**. O sistema precisa do ID da **PASTA** onde o arquivo JSON será salvo.

## 📋 MÉTODO 1: Descobrir ID da Pasta pelo Link do Arquivo

### Passo 1: Abrir o arquivo no Google Drive
1. Acesse o link: https://drive.google.com/file/d/1cjM746_XBeh6rzjvB2gB-HwOgdHbt6w9/view?usp=drive_link
2. Clique com o botão direito no arquivo
3. Selecione **"Ver detalhes"** ou **"Propriedades"**

### Passo 2: Ver a pasta pai
1. Nas informações do arquivo, procure por **"Localização"** ou **"Pasta"**
2. Clique na pasta para abrir
3. Na barra de endereço, você verá algo como:
   ```
   https://drive.google.com/drive/folders/16kt50n_MFB60_h3JFgIA408k8YrjU6Rb
   ```
4. O ID da pasta é a parte após `/folders/`: `16kt50n_MFB60_h3JFgIA408k8YrjU6Rb`

## 📋 MÉTODO 2: Criar uma Nova Pasta

### Passo 1: Criar pasta no Google Drive
1. Acesse: https://drive.google.com
2. Clique em **"Novo"** > **"Pasta"**
3. Dê um nome (ex: "MK Audiovisual Contratos")
4. Clique em **"Criar"**

### Passo 2: Obter ID da pasta
1. Abra a pasta criada
2. Na barra de endereço, você verá:
   ```
   https://drive.google.com/drive/folders/SEU_FOLDER_ID_AQUI
   ```
3. Copie o ID (a parte após `/folders/`)

### Passo 3: Atualizar o código
1. Abra o arquivo `mk-drive-api-unificado.js`
2. Encontre a linha:
   ```javascript
   FOLDER_ID: '16kt50n_MFB60_h3JFgIA408k8YrjU6Rb',
   ```
3. Substitua pelo ID da sua pasta:
   ```javascript
   FOLDER_ID: 'SEU_FOLDER_ID_AQUI',
   ```

## 📋 MÉTODO 3: Usar o Arquivo Existente

Se você quer usar o arquivo que já existe no link fornecido:

1. O ID do arquivo é: `1cjM746_XBeh6rzjvB2gB-HwOgdHbt6w9`
2. Mas o sistema precisa do ID da **PASTA**, não do arquivo
3. Siga o **MÉTODO 1** para descobrir a pasta pai

## ✅ VERIFICAR SE ESTÁ CORRETO

1. Abra o arquivo `index.html` no navegador
2. Clique em **"🧪 Testar Conexão"**
3. Se aparecer **"✅ Conexão OK!"**, o FOLDER_ID está correto
4. Se aparecer erro de "Pasta não encontrada", o FOLDER_ID está errado

## 🔧 ATUALIZAR NO GOOGLE APPS SCRIPT

Depois de descobrir o FOLDER_ID correto, você também precisa atualizar no Google Apps Script:

1. Abra: https://script.google.com
2. Encontre seu projeto "MK Audiovisual"
3. No código, encontre a linha:
   ```javascript
   const folderId = e.parameter.folderId || '16kt50n_MFB60_h3JFgIA408k8YrjU6Rb';
   ```
4. Substitua pelo ID da sua pasta:
   ```javascript
   const folderId = e.parameter.folderId || 'SEU_FOLDER_ID_AQUI';
   ```
5. Salve e reimplante o Web App

## 🆘 SE AINDA NÃO FUNCIONAR

1. Verifique se a pasta existe no Google Drive
2. Verifique se o Google Apps Script tem permissão para acessar a pasta
3. Na primeira execução, você precisará autorizar o acesso
4. Verifique os logs do Google Apps Script (menu "Execuções")
