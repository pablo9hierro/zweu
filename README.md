# 🏥 ZWEU - API de Busca de Produtos Magazord

MVP simples para integração Stevo IA + Magazord via Vercel

## 🎯 O que faz?

1. Cliente pergunta no WhatsApp: "tem jaleco?"
2. Stevo IA entende e extrai: `nome="jaleco"`
3. Envia para Vercel: `POST /api/buscar-produto`
4. Vercel consulta Magazord (autenticado)
5. Retorna produtos com preço, estoque, imagens
6. Stevo responde o cliente com dados reais

## 🚀 Deploy

```bash
# Clone o repositório
git clone https://github.com/pablo9hierro/zweu.git
cd zweu

# Configure as variáveis de ambiente no Vercel:
# MAGAZORD_BASE_URL=https://urlmagazord.com.br/api
# MAGAZORD_USER=seu_usuario
# MAGAZORD_PASS=sua_senha

# Deploy
vercel --prod
```

## 📡 Endpoint

**URL:** `https://zweu.vercel.app/api/buscar-produto`  
**Método:** `POST`  
**Content-Type:** `application/json`

### Request

```json
{
  "nome": "jaleco",
  "limit": 10
}
```

**Parâmetros aceitos:**
- `nome` (string) - palavra-chave do produto
- `codigo` (string) - código exato do produto
- `produto` (string) - termo alternativo
- `mensagem` (string) - mensagem completa do usuário
- `limit` (integer) - quantidade de resultados (padrão: 10)

⚠️ **Pelo menos um parâmetro é obrigatório**

### Response (200 OK)

```json
{
  "sucesso": true,
  "total_produtos": 15,
  "produtos": [
    {
      "id": 12345,
      "codigo": "300-MC-049",
      "nome": "Jaleco Branco Manga Longa",
      "ativo": true,
      "preco": 89.90,
      "preco_promocional": 69.90,
      "estoque_disponivel": 50,
      "imagens": [
        {
          "url": "https://...",
          "principal": true
        }
      ],
      "derivacoes": [
        {
          "codigo": "300-MC-049-P",
          "nome": "Tamanho P",
          "estoque": 10,
          "preco": 89.90
        }
      ]
    }
  ],
  "busca_realizada": {
    "termo": "jaleco",
    "limit": 10
  }
}
```

### Response (400 Bad Request)

```json
{
  "error": "Parâmetro obrigatório não fornecido",
  "mensagem": "Você deve fornecer pelo menos um dos parâmetros: nome, codigo, produto ou mensagem",
  "exemplo": {
    "nome": "jaleco",
    "limit": 10
  }
}
```

## 🔧 Configuração no Stevo

### 1. Criar Ferramenta

- **Nome:** `buscar_produto`
- **Tipo:** API/HTTP Request
- **URL Base:** `https://zweu.vercel.app`
- **Endpoint:** `/api/buscar-produto`
- **Método:** `POST`

### 2. OpenAPI Spec

Use o arquivo [openapi.yaml](./openapi.yaml) ou a URL:
```
https://zweu.vercel.app/openapi.yaml
```

### 3. Instruções para IA

```
QUANDO USAR: Cliente pergunta sobre produtos, preço ou estoque

COMO USAR:
1. Extraia o termo de busca da mensagem
2. Preencha o parâmetro "nome" 
3. Execute a ferramenta

EXEMPLOS:
- "tem jaleco?" → nome="jaleco", limit=10
- "código X123" → codigo="X123", limit=1

IMPORTANTE: NUNCA envie sem parâmetros
```

## 📁 Estrutura

```
zweu/
├── api/
│   └── buscar-produto.js       # Único endpoint
├── openapi.yaml                # Especificação OpenAPI
├── PROMPT_IA_PRINCIPAL.txt     # Instruções gerais
├── PROMPT_TOOL.txt             # Instruções da ferramenta
├── GUIA_CONFIGURACAO.md        # Guia completo de setup
└── README.md                   # Este arquivo
```

## ✅ Validações

- ✅ SEM dados mockados
- ✅ ERRO 400 se não receber parâmetros
- ✅ Autenticação Basic Auth com Magazord
- ✅ Logs detalhados no console
- ✅ CORS habilitado
- ✅ Resposta formatada e limpa

## 🐛 Troubleshooting

### Erro 400: "Parâmetro obrigatório não fornecido"
❌ Stevo não está enviando parâmetros  
✅ Verifique as instruções da ferramenta no Stevo

### Erro 500: "Variáveis de ambiente ausentes"
❌ Credenciais não configuradas  
✅ Configure as env vars no Vercel

### IA não chama a ferramenta
❌ Ferramenta não está ativa ou instruções unclear  
✅ Ative a ferramenta e atualize as instruções

## 📚 Documentação

- [GUIA_CONFIGURACAO.md](./GUIA_CONFIGURACAO.md) - Passo a passo completo
- [PROMPT_TOOL.txt](./PROMPT_TOOL.txt) - Instruções da ferramenta
- [PROMPT_IA_PRINCIPAL.txt](./PROMPT_IA_PRINCIPAL.txt) - Instruções gerais da IA

## 🔐 Segurança

- Credenciais Magazord armazenadas como variáveis de ambiente
- Sem exposição de senhas no código
- CORS configurado
- Validação de parâmetros

## 📝 Licença

MIT

---

**Desenvolvido por:** Pablo  
**Versão:** 1.0.0  
**Status:** ✅ MVP Funcional
