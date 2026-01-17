# 🚀 ZWEU - Proxy Magazord para Stevo IA

Servidor proxy serverless na Vercel para integração entre Stevo IA e API do Magazord.

## 📋 Arquitetura

```
Cliente (Stevo IA)
    ↓ POST /api/magazord
Servidor Vercel (proxy)
    ↓ HTTP autenticado
API Magazord
    ↓ JSON response
Servidor Vercel
    ↓ JSON response
Cliente
```

## 🔧 Tecnologias

- **Runtime**: Node.js 18+
- **Deploy**: Vercel Serverless Functions
- **Autenticação**: HTTP Basic Auth
- **Formato**: JSON

## 📁 Estrutura

```
/
├── api/
│   └── magazord.js     # Endpoint principal
├── .gitignore
├── package.json
├── vercel.json         # Configuração Vercel
└── README.md
```

## 🚀 Deploy na Vercel

### 1. Instalar Vercel CLI (opcional)
```bash
npm install -g vercel
```

### 2. Fazer Deploy
```bash
# Login na Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Configurar Variáveis de Ambiente na Vercel

No painel da Vercel (https://vercel.com), vá em:
**Settings → Environment Variables**

Adicione:

| Nome | Valor |
|------|-------|
| `MAGAZORD_BASE_URL` | `https://danajalecos.painel.magazord.com.br/api` |
| `MAGAZORD_USER` | `MZDKe610ed8d77404c8ebe37b79a35b579a5e4e85682c15d6bd89f30d5852757` |
| `MAGAZORD_PASS` | `o#W51myRIS@j` |

## 📡 Uso da API

### Endpoint
```
POST https://seu-projeto.vercel.app/api/magazord
```

### Formato da Requisição

```json
{
  "method": "GET",
  "endpoint": "/v2/site/produto",
  "query": {
    "search": "jaleco",
    "limit": 10
  }
}
```

### Exemplo com Body (POST/PUT)

```json
{
  "method": "POST",
  "endpoint": "/v2/site/produto",
  "body": {
    "nome": "Produto Novo",
    "preco": 99.90
  }
}
```

### Resposta de Sucesso

```json
{
  "success": true,
  "status": 200,
  "data": {
    // Resposta da API Magazord
  }
}
```

### Resposta de Erro

```json
{
  "error": "Descrição do erro",
  "message": "Detalhes"
}
```

## 🤖 Configuração no Stevo (Custom Tool)

### Nome da Tool
`buscar_produto`

### Descrição
```
Busca informações de um produto no estoque pelo código. 
Usa quando cliente perguntar sobre disponibilidade ou preço.
```

### Método
`GET`

### URL do Endpoint
```
https://seu-projeto.vercel.app/api/magazord
```

### Headers
```
Authorization: Bearer {{token}}
```

### Query Params
```
search: {{termo}}
limit: {{qtermo}} (padrão: 10)
```

### Parâmetros que a IA pode passar
- `codigo` (string) - Código do produto

### Exemplo de Payload no Stevo
```json
{
  "method": "GET",
  "endpoint": "/v2/site/produto",
  "query": {
    "search": "{{codigo}}",
    "limit": 1
  }
}
```

## 🔐 Segurança

- ✅ Todas as credenciais em variáveis de ambiente
- ✅ Zero exposição de credenciais no código
- ✅ HTTPS obrigatório
- ✅ Validação de métodos HTTP
- ✅ Tratamento de erros

## 📝 Licença

MIT
