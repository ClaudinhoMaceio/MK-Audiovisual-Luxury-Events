# 📋 Instruções de Instalação - Google Apps Script

## 🎯 Objetivo

Criar um script no Google Apps Script que funciona como intermediário entre seu sistema e o Google Drive, permitindo:
- **Sistema 1 (Contratos)**: Salvar dados no arquivo JSON
- **Sistema 2 (Dashboard)**: Ler dados do arquivo JSON

---

## 📝 Passo a Passo

### 1️⃣ Acessar o Google Apps Script

1. Acesse: https://script.google.com
2. Faça login com sua conta Google
3. Clique em **"Novo Projeto"** (ou **"New Project"**)

### 2️⃣ Colar o Código

1. Abra o arquivo `GOOGLE_APPS_SCRIPT_CODE.js` que está nesta pasta
2. **Copie TODO o conteúdo** do arquivo
3. Cole no editor do Google Apps Script
4. **Apague** o código padrão que vem no projeto novo

### 3️⃣ Salvar o Projeto

1. Clique em **"Salvar"** (ou pressione `Ctrl+S`)
2. Dê um nome ao projeto, por exemplo: **"MK Audiovisual - API Drive"**
3. Clique em **"OK"**

### 4️⃣ Configurar Permissões

1. Na primeira execução, o Google vai pedir permissões
2. Clique em **"Revisar permissões"**
3. Selecione sua conta Google
4. Clique em **"Avançado"** > **"Ir para [nome do projeto] (não seguro)"**
5. Clique em **"Permitir"**

**Permissões necessárias:**
- ✅ Acesso ao Google Drive
- ✅ Criar e editar arquivos

### 5️⃣ Implantar como Aplicativo da Web

1. Clique em **"Implantar"** (menu superior) > **"Nova implantação"**
2. Clique no ícone de **engrenagem** ⚙️ ao lado de **"Tipo"**
3. Selecione **"Aplicativo da Web"**
4. Configure:
   - **Descrição**: "API MK Audiovisual"
   - **Execute como**: **"Eu"**
   - **Quem tem acesso**: **"Qualquer pessoa"** (importante!)
5. Clique em **"Implantar"**
6. Clique em **"Autorizar acesso"** (se solicitado)
7. Selecione sua conta e permita as permissões

### 6️⃣ Copiar a URL

1. Após implantar, você verá uma tela com a **URL do aplicativo da web**
2. **COPIE essa URL** - ela será algo como:
   ```
   https://script.google.com/macros/s/AKfycbwlXdKn8UPygZLwqkimfA6YydFyD9EZmw51uYCNnmG0rX94B0dP6ONDATWWr9C7k8vT/exec
   ```
3. **IMPORTANTE**: Use essa URL no arquivo `google-apps-script-api.js`

### 7️⃣ Atualizar o Sistema

1. Abra o arquivo `google-apps-script-api.js`
2. Localize a linha:
   ```javascript
   this.SCRIPT_URL = 'https://script.google.com/macros/s/SUA_URL_AQUI/exec';
   ```
3. Substitua `SUA_URL_AQUI` pela URL que você copiou no passo 6
4. Salve o arquivo

---

## ✅ Verificar se Está Funcionando

### Teste 1: Verificar URL

Abra no navegador a URL do seu script:
```
https://script.google.com/macros/s/SUA_URL/exec?action=read
```

**Deve retornar:**
```json
{
  "success": true,
  "data": {
    "contratos": [],
    "ultima_atualizacao": null
  },
  "total": 0
}
```

### Teste 2: Usar o Botão de Teste

1. Abra o sistema (`index.html`)
2. Clique no botão **"🧪 Testar Conexão"** no canto superior direito
3. Deve aparecer uma mensagem de sucesso

### Teste 3: Salvar um Contrato

1. Preencha um contrato de teste no sistema
2. Complete todas as etapas
3. Assine e finalize
4. Deve aparecer um modal confirmando o salvamento

---

## 🔧 Configurações Importantes

### Pasta do Google Drive

A pasta configurada é:
- **ID**: `16kt50n_MFB60_h3JFgIA408k8YrjU6Rb`
- **URL**: https://drive.google.com/drive/folders/16kt50n_MFB60_h3JFgIA408k8YrjU6Rb

**Verifique:**
- ✅ A pasta existe
- ✅ Você tem acesso a ela
- ✅ O script tem permissão para escrever nela

### Arquivo JSON

O arquivo criado será:
- **Nome**: `mk_audiovisual_contratos.json`
- **Localização**: Dentro da pasta do Drive configurada

---

## 🐛 Solução de Problemas

### Problema: "Script function not found: doGet"

**Solução:**
- Verifique se você colou TODO o código
- Verifique se não há erros de sintaxe (linhas vermelhas)
- Salve o projeto novamente

### Problema: Erro de Permissões

**Solução:**
1. Vá em **"Execuções"** (menu lateral)
2. Veja se há erros de permissão
3. Clique para autorizar novamente

### Problema: "Pasta não encontrada"

**Solução:**
1. Verifique se o ID da pasta está correto
2. Verifique se você tem acesso à pasta
3. Compartilhe a pasta com a conta do Google Apps Script (se necessário)

### Problema: URL não funciona

**Solução:**
1. Verifique se você selecionou **"Qualquer pessoa"** no acesso
2. Verifique se a URL está completa (termina com `/exec`)
3. Tente criar uma nova implantação

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs em **"Execuções"** no Google Apps Script
2. Verifique o console do navegador (F12)
3. Teste a URL diretamente no navegador

---

## 📚 Estrutura do JSON

O arquivo JSON terá esta estrutura:

```json
{
  "contratos": [
    {
      "id_evento": 1234567890,
      "data_emissao": "01/01/2024 10:30:00",
      "cliente": {
        "nome": "João Silva",
        "doc": "123.456.789-00",
        "fone": "(11) 99999-9999"
      },
      "logistica": {
        "data": "15/01/2024",
        "endereco": "Rua Exemplo, 123",
        "cidade": "São Paulo/SP"
      },
      "servicos": ["Plataforma 360º (3h)", "Som e Iluminação (4h)"],
      "assinatura": "data:image/png;base64,..."
    }
  ],
  "ultima_atualizacao": "2024-01-01T10:30:00.000Z"
}
```

---

**Versão:** 2.0  
**Última Atualização:** 2024
