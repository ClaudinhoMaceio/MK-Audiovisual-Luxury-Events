# 📘 Guia de Uso - API Unificada MK Drive

## 🎯 Visão Geral

Agora você tem **UM ÚNICO ARQUIVO** que funciona para **AMBOS os sistemas**:

- ✅ **Sistema 1 (Contratos)**: Salvar dados no JSON
- ✅ **Sistema 2 (Dashboard)**: Ler dados do JSON

---

## 📁 Arquivos do Sistema

### 1. **mk-drive-api-unificado.js**
**Arquivo principal** - Use este arquivo em ambos os sistemas!

### 2. **GOOGLE_APPS_SCRIPT_CODE.js**
**Código do Google Apps Script** - Cole no Google Apps Script (apenas uma vez)

---

## 🚀 Como Usar

### Para o Sistema 1 (Contratos - Salvar Dados)

1. **Inclua o arquivo no HTML:**
```html
<script src="mk-drive-api-unificado.js"></script>
```

2. **Salve um contrato:**
```javascript
// Dados do contrato
const dadosContrato = {
    id_evento: Date.now(),
    data_emissao: new Date().toLocaleString(),
    cliente: {
        nome: "João Silva",
        doc: "123.456.789-00",
        fone: "(11) 99999-9999"
    },
    logistica: {
        data: "15/01/2024",
        endereco: "Rua Exemplo, 123",
        cidade: "São Paulo/SP"
    },
    servicos: ["Plataforma 360º (3h)", "Som e Iluminação (4h)"],
    assinatura: "data:image/png;base64,..."
};

// Salvar
try {
    const resultado = await mkDriveAPI.salvarContrato(dadosContrato);
    console.log('✅ Salvo!', resultado);
    alert(`Contrato salvo! Total: ${resultado.total}`);
} catch (error) {
    console.error('❌ Erro:', error);
    alert('Erro ao salvar: ' + error.message);
}
```

### Para o Sistema 2 (Dashboard - Ler Dados)

1. **Inclua o arquivo no HTML:**
```html
<script src="mk-drive-api-unificado.js"></script>
```

2. **Leia todos os contratos:**
```javascript
// Ler todos os contratos
const dados = await mkDriveAPI.lerContratos();

if (dados.success) {
    console.log(`Total: ${dados.total} contratos`);
    dados.contratos.forEach(contrato => {
        console.log(`- ${contrato.cliente.nome} - ${contrato.logistica.data}`);
    });
} else {
    console.error('Erro:', dados.error);
}
```

---

## 📚 Métodos Disponíveis

### 1. `salvarContrato(dadosContrato)`
**Sistema 1** - Salva um novo contrato no JSON

```javascript
const resultado = await mkDriveAPI.salvarContrato(dadosContrato);
// Retorna: { success: true, message: "...", total: 5 }
```

### 2. `lerContratos()`
**Sistema 2** - Lê todos os contratos do JSON

```javascript
const dados = await mkDriveAPI.lerContratos();
// Retorna: { success: true, contratos: [...], total: 5 }
```

### 3. `buscarContratoPorId(idEvento)`
Busca um contrato específico pelo ID

```javascript
const resultado = await mkDriveAPI.buscarContratoPorId(1234567890);
// Retorna: { success: true, contrato: {...} }
```

### 4. `filtrarContratos(filtros)`
Filtra contratos por critérios

```javascript
const filtros = {
    nomeCliente: 'João',
    servico: '360',
    dataInicio: '2024-01-01',
    dataFim: '2024-12-31'
};
const resultado = await mkDriveAPI.filtrarContratos(filtros);
// Retorna: { success: true, contratos: [...], total: 3 }
```

### 5. `obterEstatisticas()`
Obtém estatísticas dos contratos

```javascript
const stats = await mkDriveAPI.obterEstatisticas();
// Retorna: { success: true, total: 10, por_mes: {...}, por_servico: {...} }
```

### 6. `verificarSalvamento(idEvento)`
Verifica se um contrato foi salvo com sucesso

```javascript
const verificacao = await mkDriveAPI.verificarSalvamento(1234567890);
// Retorna: { sucesso: true, encontrado: true, contrato: {...} }
```

---

## 🔧 Configuração

### Alterar URL do Google Apps Script

Abra `mk-drive-api-unificado.js` e altere:

```javascript
const MK_DRIVE_CONFIG = {
    SCRIPT_URL: 'SUA_URL_AQUI',
    FOLDER_ID: '16kt50n_MFB60_h3JFgIA408k8YrjU6Rb',
    FILE_NAME: 'mk_audiovisual_contratos.json'
};
```

### Usar Configuração Personalizada

```javascript
const minhaAPI = new MKDriveAPI({
    SCRIPT_URL: 'https://script.google.com/macros/s/.../exec',
    FOLDER_ID: 'meu-folder-id',
    FILE_NAME: 'meu-arquivo.json'
});

// Usar
await minhaAPI.salvarContrato(dados);
```

---

## 💡 Exemplos Completos

### Exemplo 1: Sistema de Contratos (Salvar)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Sistema de Contratos</title>
    <script src="mk-drive-api-unificado.js"></script>
</head>
<body>
    <button onclick="salvarContrato()">Salvar Contrato</button>
    
    <script>
        async function salvarContrato() {
            const dados = {
                id_evento: Date.now(),
                data_emissao: new Date().toLocaleString(),
                cliente: {
                    nome: "João Silva",
                    doc: "123.456.789-00",
                    fone: "(11) 99999-9999"
                },
                logistica: {
                    data: "15/01/2024",
                    endereco: "Rua Exemplo, 123",
                    cidade: "São Paulo/SP"
                },
                servicos: ["Plataforma 360º (3h)"],
                assinatura: "data:image/png;base64,..."
            };
            
            try {
                const resultado = await mkDriveAPI.salvarContrato(dados);
                alert(`✅ Salvo! Total: ${resultado.total}`);
            } catch (error) {
                alert(`❌ Erro: ${error.message}`);
            }
        }
    </script>
</body>
</html>
```

### Exemplo 2: Dashboard (Ler)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
    <script src="mk-drive-api-unificado.js"></script>
</head>
<body>
    <button onclick="carregarContratos()">Carregar Contratos</button>
    <div id="lista"></div>
    
    <script>
        async function carregarContratos() {
            const dados = await mkDriveAPI.lerContratos();
            
            if (dados.success) {
                const lista = document.getElementById('lista');
                lista.innerHTML = `<h2>Total: ${dados.total} contratos</h2>`;
                
                dados.contratos.forEach(contrato => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <h3>${contrato.cliente.nome}</h3>
                        <p>Data: ${contrato.logistica.data}</p>
                        <p>Serviços: ${contrato.servicos.join(', ')}</p>
                    `;
                    lista.appendChild(div);
                });
            } else {
                alert('Erro: ' + dados.error);
            }
        }
    </script>
</body>
</html>
```

---

## ✅ Checklist

- [ ] Google Apps Script instalado e funcionando
- [ ] Arquivo `mk-drive-api-unificado.js` incluído no Sistema 1
- [ ] Arquivo `mk-drive-api-unificado.js` incluído no Sistema 2
- [ ] URL do Google Apps Script configurada
- [ ] Teste de salvamento realizado (Sistema 1)
- [ ] Teste de leitura realizado (Sistema 2)

---

## 🐛 Solução de Problemas

### Erro: "mkDriveAPI is not defined"

**Solução:** Verifique se o arquivo `mk-drive-api-unificado.js` está incluído antes de usar.

### Erro: "Failed to fetch"

**Solução:** 
- Verifique a URL do Google Apps Script
- Verifique se o Google Apps Script está implantado
- Verifique se está configurado como "Qualquer pessoa"

### Erro: "Pasta não encontrada"

**Solução:**
- Verifique o FOLDER_ID
- Verifique se a pasta existe
- Verifique permissões do Google Apps Script

---

**Versão:** 2.0 Unificada  
**Data:** 2024  
**Status:** ✅ Pronto para uso em ambos os sistemas
