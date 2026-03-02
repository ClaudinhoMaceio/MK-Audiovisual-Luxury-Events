# 🔧 Solução para Erro de CORS

## ❌ Problema

Erro ao salvar dados:
```
Access to fetch at 'https://script.google.com/...' from origin 'null' 
has been blocked by CORS policy
```

## 🔍 Causa

O arquivo está sendo aberto diretamente (`file://`) em vez de ser servido por um servidor HTTP. Navegadores bloqueiam requisições CORS quando o arquivo é aberto diretamente.

## ✅ Soluções

### Solução 1: Usar Servidor HTTP Local (RECOMENDADO)

#### Opção A: Python (Mais Simples)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Depois acesse: `http://localhost:8000/index.html`

#### Opção B: Node.js
```bash
# Instalar http-server globalmente
npm install -g http-server

# Executar
http-server -p 8000
```

Depois acesse: `http://localhost:8000/index.html`

#### Opção C: VS Code Live Server
1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito no `index.html`
3. Selecione "Open with Live Server"

### Solução 2: Método Alternativo (Já Implementado)

O código já tem um método alternativo que usa GET quando POST falha por CORS. Ele funciona mesmo abrindo o arquivo diretamente, mas:

⚠️ **Limitações:**
- Não retorna confirmação imediata
- Dados limitados a ~1500 caracteres
- Menos seguro

✅ **Vantagens:**
- Funciona sem servidor
- Funciona mesmo com CORS bloqueado

### Solução 3: Configurar CORS no Google Apps Script

O Google Apps Script já retorna CORS automaticamente, mas você pode verificar:

1. Acesse o Google Apps Script
2. Vá em **Execuções**
3. Verifique se não há erros
4. Certifique-se de que está implantado como **"Qualquer pessoa"**

## 🚀 Como Usar

### Se usar Servidor HTTP:
1. Execute um servidor HTTP local (veja Solução 1)
2. Acesse via `http://localhost:8000`
3. O método POST funcionará normalmente

### Se abrir arquivo diretamente:
1. O código tentará POST primeiro
2. Se falhar por CORS, usará GET automaticamente
3. Você verá uma mensagem: "Contrato enviado (método alternativo)"

## 📝 Verificar se Funcionou

1. Abra o Google Drive
2. Vá para a pasta: `16kt50n_MFB60_h3JFgIA408k8YrjU6Rb`
3. Verifique se o arquivo `mk_audiovisual_contratos.json` foi criado/atualizado
4. Abra o arquivo e verifique se o contrato está lá

## 💡 Recomendação

**Use um servidor HTTP local** para melhor experiência:
- ✅ Confirmação imediata de salvamento
- ✅ Sem limitações de tamanho
- ✅ Mais seguro
- ✅ Melhor para desenvolvimento

---

**Versão:** 1.0  
**Data:** 2024
