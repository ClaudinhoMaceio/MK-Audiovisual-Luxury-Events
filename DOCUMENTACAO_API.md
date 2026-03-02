# 📚 Documentação da API - MK Audiovisual

## 🎯 Visão Geral

Esta API possui **DOIS CAMINHOS PRINCIPAIS**:

1. **ENVIO (SAVE)** - Sistema de Contratos salva dados
2. **RECEBIMENTO (READ)** - Dashboard lê dados

---

## 🔵 CAMINHO 1: ENVIO DE DADOS (SAVE)

### Descrição
Usado pelo sistema de contratos para salvar novos contratos no Google Drive.

### Endpoint
```
POST: https://script.google.com/macros/s/SEU_ID/exec
GET:  https://script.google.com/macros/s/SEU_ID/exec?action=save&data=...
```

### Método POST (Recomendado)

**Request:**
```json
{
  "action": "save",
  "folderId": "16kt50n_MFB60_h3JFgIA408k8YrjU6Rb",
  "fileName": "mk_audiovisual_contratos.json",
  "data": {
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
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "message": "Contrato salvo com sucesso!",
  "total": 5,
  "folderId": "16kt50n_MFB60_h3JFgIA408k8YrjU6Rb",
  "fileName": "mk_audiovisual_contratos.json"
}
```

**Response (Erro):**
```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

### Método GET (Alternativo)

**URL:**
```
https://script.google.com/macros/s/SEU_ID/exec?action=save&folderId=16kt50n_MFB60_h3JFgIA408k8YrjU6Rb&fileName=mk_audiovisual_contratos.json&data=ENCODED_JSON
```

**Exemplo JavaScript:**
```javascript
const data = {
  id_evento: 1234567890,
  cliente: { nome: "João Silva", doc: "123.456.789-00" },
  // ... outros dados
};

const url = `https://script.google.com/macros/s/SEU_ID/exec?action=save&data=${encodeURIComponent(JSON.stringify(data))}`;
fetch(url, { method: 'GET' });
```

---

## 🟢 CAMINHO 2: RECEBIMENTO DE DADOS (READ)

### Descrição
Usado pelo **dashboard** para ler todos os contratos salvos.

### Endpoint
```
GET: https://script.google.com/macros/s/SEU_ID/exec?action=read
```

### Request

**URL Simples:**
```
https://script.google.com/macros/s/SEU_ID/exec?action=read
```

**URL com Parâmetros Opcionais:**
```
https://script.google.com/macros/s/SEU_ID/exec?action=read&folderId=16kt50n_MFB60_h3JFgIA408k8YrjU6Rb&fileName=mk_audiovisual_contratos.json
```

### Response (Sucesso)

```json
{
  "success": true,
  "data": {
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
      // ... mais contratos
    ],
    "ultima_atualizacao": "2024-01-01T10:30:00.000Z"
  },
  "total": 5,
  "ultima_atualizacao": "2024-01-01T10:30:00.000Z"
}
```

### Response (Arquivo Vazio)

```json
{
  "success": true,
  "data": {
    "contratos": [],
    "ultima_atualizacao": null
  },
  "total": 0,
  "ultima_atualizacao": null
}
```

### Response (Erro)

```json
{
  "success": false,
  "error": "Mensagem de erro",
  "data": {
    "contratos": []
  }
}
```

---

## 💻 Exemplos de Uso

### Exemplo 1: Dashboard JavaScript (Ler Dados)

```javascript
async function carregarContratos() {
  const url = 'https://script.google.com/macros/s/SEU_ID/exec?action=read';
  
  try {
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      const contratos = result.data.contratos;
      console.log(`Total de contratos: ${result.total}`);
      
      // Usar os dados no dashboard
      contratos.forEach(contrato => {
        console.log(contrato.cliente.nome);
        console.log(contrato.logistica.data);
      });
    } else {
      console.error('Erro:', result.error);
    }
  } catch (error) {
    console.error('Erro ao carregar:', error);
  }
}
```

### Exemplo 2: Dashboard Python (Ler Dados)

```python
import requests
import json

url = 'https://script.google.com/macros/s/SEU_ID/exec?action=read'

response = requests.get(url)
data = response.json()

if data['success']:
    contratos = data['data']['contratos']
    print(f"Total de contratos: {data['total']}")
    
    for contrato in contratos:
        print(f"Cliente: {contrato['cliente']['nome']}")
        print(f"Data: {contrato['logistica']['data']}")
else:
    print(f"Erro: {data['error']}")
```

### Exemplo 3: Sistema de Contratos (Salvar Dados)

```javascript
async function salvarContrato(dadosContrato) {
  const url = 'https://script.google.com/macros/s/SEU_ID/exec';
  
  const payload = {
    action: 'save',
    folderId: '16kt50n_MFB60_h3JFgIA408k8YrjU6Rb',
    fileName: 'mk_audiovisual_contratos.json',
    data: dadosContrato
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Contrato salvo! Total:', result.total);
    } else {
      console.error('Erro:', result.error);
    }
  } catch (error) {
    console.error('Erro ao salvar:', error);
  }
}
```

---

## 📊 Estrutura dos Dados

### Estrutura do JSON no Google Drive

```json
{
  "contratos": [
    {
      "id_evento": 1234567890,
      "data_emissao": "01/01/2024 10:30:00",
      "cliente": {
        "nome": "Nome Completo",
        "doc": "CPF ou CNPJ",
        "fone": "Telefone"
      },
      "logistica": {
        "data": "DD/MM/AAAA",
        "endereco": "Endereço completo",
        "cidade": "Cidade/UF"
      },
      "servicos": [
        "Serviço 1",
        "Serviço 2"
      ],
      "assinatura": "data:image/png;base64,..."
    }
  ],
  "ultima_atualizacao": "2024-01-01T10:30:00.000Z"
}
```

---

## 🔒 Segurança e CORS

- A API está configurada com CORS aberto (`Access-Control-Allow-Origin: *`)
- Qualquer sistema pode acessar os dados (público)
- Para produção, considere adicionar autenticação

---

## 📝 Notas Importantes

1. **URL do Script:** Substitua `SEU_ID` pela URL real do seu Google Apps Script
2. **Pasta do Drive:** O arquivo é salvo na pasta: `16kt50n_MFB60_h3JFgIA408k8YrjU6Rb`
3. **Nome do Arquivo:** `mk_audiovisual_contratos.json`
4. **Formato:** Todos os dados são em JSON
5. **Encoding:** Use UTF-8 para caracteres especiais

---

## 🧪 Testar a API

### Teste 1: Verificar Status
```
https://script.google.com/macros/s/SEU_ID/exec
```
Deve retornar informações da API.

### Teste 2: Ler Dados (Dashboard)
```
https://script.google.com/macros/s/SEU_ID/exec?action=read
```
Deve retornar todos os contratos.

### Teste 3: Salvar Dados (Sistema)
Use o sistema de contratos para salvar um contrato de teste.

---

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs no Google Apps Script (Execuções)
2. Verifique o console do navegador (F12)
3. Teste os endpoints diretamente no navegador

---

**Versão:** 1.0  
**Última Atualização:** 2024
