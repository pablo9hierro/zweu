# 📝 FORMULÁRIO DA TOOL NO STEVO - PASSO A PASSO

## 🎯 Acesse o Stevo e crie a ferramenta

1. Login no painel do Stevo
2. Menu: **Ferramentas** ou **Tools** ou **Integrações**
3. Botão: **Nova Ferramenta** ou **Add Tool**

---

## 📋 PREENCHA O FORMULÁRIO

### 📌 Informações Básicas

| Campo | Valor |
|-------|-------|
| **Nome da Ferramenta** | `buscar_produto` |
| **Nome de Exibição** | Buscar Produto no Catálogo |
| **Descrição** | Busca produtos no catálogo Magazord. Use quando o cliente perguntar sobre produtos, estoque, preço ou disponibilidade. |
| **Tipo** | API / HTTP Request / Custom API |

---

### 🌐 Configuração do Endpoint

| Campo | Valor |
|-------|-------|
| **URL Base** | `https://zweu.vercel.app` |
| **Endpoint / Path** | `/api/buscar-produto` |
| **Método HTTP** | `POST` |
| **Content-Type** | `application/json` |

---

### 🔐 Autenticação

| Campo | Valor |
|-------|-------|
| **Tipo de Autenticação** | Nenhuma / None |
| **Headers Customizados** | *deixe vazio* |

> ⚠️ **IMPORTANTE**: NÃO configure autenticação aqui. A autenticação com Magazord é feita internamente pelo servidor Vercel.

---

### 📥 Parâmetros de Entrada (Request Body)

Configure os seguintes parâmetros:

#### Parâmetro 1: nome
- **Nome:** `nome`
- **Tipo:** `string` / `text`
- **Obrigatório:** ❌ Não (mas pelo menos um dos 4 primeiros é necessário)
- **Descrição:** Nome ou palavra-chave do produto
- **Exemplo:** `jaleco`

#### Parâmetro 2: codigo
- **Nome:** `codigo`
- **Tipo:** `string` / `text`
- **Obrigatório:** ❌ Não
- **Descrição:** Código exato do produto
- **Exemplo:** `300-MC-049`

#### Parâmetro 3: produto
- **Nome:** `produto`
- **Tipo:** `string` / `text`
- **Obrigatório:** ❌ Não
- **Descrição:** Termo alternativo para busca
- **Exemplo:** `avental`

#### Parâmetro 4: mensagem
- **Nome:** `mensagem`
- **Tipo:** `string` / `text`
- **Obrigatório:** ❌ Não
- **Descrição:** Mensagem completa do usuário
- **Exemplo:** `preciso de um jaleco branco`

#### Parâmetro 5: limit
- **Nome:** `limit`
- **Tipo:** `integer` / `number`
- **Obrigatório:** ❌ Não
- **Valor Padrão:** `10`
- **Descrição:** Quantidade máxima de resultados
- **Exemplo:** `10`

---

### 📤 Schema de Resposta (Response)

Configure os campos que a API retorna:

```json
{
  "sucesso": "boolean",
  "total_produtos": "integer",
  "produtos": [
    {
      "id": "integer",
      "codigo": "string",
      "nome": "string",
      "ativo": "boolean",
      "preco": "number",
      "preco_promocional": "number",
      "estoque_disponivel": "integer",
      "imagens": [
        {
          "url": "string",
          "principal": "boolean"
        }
      ],
      "derivacoes": [
        {
          "codigo": "string",
          "nome": "string",
          "estoque": "integer",
          "preco": "number"
        }
      ]
    }
  ],
  "busca_realizada": {
    "termo": "string",
    "limit": "integer"
  }
}
```

---

### 🤖 Instruções para a IA

Cole este texto no campo **"Instruções para IA"** ou **"System Prompt"** ou **"AI Instructions"**:

```
═══════════════════════════════════════════════════════════════
QUANDO USAR ESTA FERRAMENTA
═══════════════════════════════════════════════════════════════

Use quando o cliente perguntar sobre:
- Produtos disponíveis
- Preços
- Estoque
- Disponibilidade
- Características de produtos

═══════════════════════════════════════════════════════════════
COMO USAR
═══════════════════════════════════════════════════════════════

1. Leia a mensagem do cliente
2. Identifique o produto mencionado
3. Extraia o termo de busca
4. Preencha o parâmetro "nome" com o termo
5. Adicione "limit": 10 (ou conforme cliente pedir)
6. Execute a ferramenta

═══════════════════════════════════════════════════════════════
EXEMPLOS
═══════════════════════════════════════════════════════════════

Cliente: "tem jaleco?"
VOCÊ ENVIA: { "nome": "jaleco", "limit": 10 }

Cliente: "mostra gorro azul"
VOCÊ ENVIA: { "nome": "gorro azul", "limit": 10 }

Cliente: "código 300-MC-049"
VOCÊ ENVIA: { "codigo": "300-MC-049", "limit": 1 }

Cliente: "quero 5 aventais"
VOCÊ ENVIA: { "nome": "avental", "limit": 5 }

Cliente: "tem jaleco, gorro e avental?"
VOCÊ ENVIA: { "nome": "jaleco gorro avental", "limit": 15 }

═══════════════════════════════════════════════════════════════
REGRAS CRÍTICAS
═══════════════════════════════════════════════════════════════

❌ NUNCA envie requisição sem parâmetros
❌ NUNCA deixe os campos vazios
❌ NUNCA invente dados se a API retornar vazio

✅ SEMPRE extraia o termo da mensagem do cliente
✅ SEMPRE preencha pelo menos um parâmetro
✅ SEMPRE use os dados reais retornados pela API

═══════════════════════════════════════════════════════════════
O QUE FAZER COM A RESPOSTA
═══════════════════════════════════════════════════════════════

1. Verifique "total_produtos"
   - Se 0: informe que o produto não foi encontrado
   - Se > 0: mostre os produtos ao cliente

2. Para cada produto, informe:
   - Nome
   - Preço (use preco_promocional se disponível)
   - Estoque disponível
   - Derivações (tamanhos, cores) se houver

3. Se houver imagens, mostre a imagem principal

4. Seja natural e conversacional na resposta

═══════════════════════════════════════════════════════════════
```

---

### 📄 OpenAPI Specification (Opcional mas Recomendado)

Se o Stevo suportar upload ou URL de OpenAPI:

**Opção 1 - Upload de arquivo:**
- Faça upload do arquivo `openapi.yaml` do repositório

**Opção 2 - URL:**
- Cole a URL: `https://zweu.vercel.app/openapi.yaml`

**Opção 3 - Colar conteúdo:**
- Copie o conteúdo do arquivo `openapi.yaml` e cole no campo

---

### ✅ Teste a Ferramenta

Antes de salvar, teste a ferramenta com estes dados:

**Teste 1 - Sucesso:**
```json
{
  "nome": "jaleco",
  "limit": 5
}
```

Resposta esperada: Status 200, produtos retornados

**Teste 2 - Erro (proposital):**
```json
{}
```

Resposta esperada: Status 400, mensagem de erro sobre parâmetros

---

### 💾 Salvar e Ativar

1. Clique em **Salvar** ou **Save**
2. Marque a ferramenta como **Ativa** ou **Enabled**
3. Associe a ferramenta ao seu assistente/agente

---

## 🧪 Teste no Chat

Após configurar, teste no chat do Stevo:

1. "tem jaleco?"
2. "mostra gorro azul"
3. "qual o preço do avental?"

A IA deve automaticamente chamar a ferramenta e retornar os dados reais.

---

## 🐛 Troubleshooting

### ❌ Erro 400 ao testar
**Problema:** Parâmetros não estão sendo enviados  
**Solução:** Verifique se preencheu pelo menos um parâmetro no teste

### ❌ Erro 404
**Problema:** URL incorreta  
**Solução:** Verifique se a URL é `https://zweu.vercel.app/api/buscar-produto`

### ❌ Timeout ou sem resposta
**Problema:** Servidor Vercel pode estar em cold start  
**Solução:** Aguarde alguns segundos e tente novamente

### ❌ IA não chama a ferramenta
**Problema:** Instruções unclear ou ferramenta não ativada  
**Solução:** 
- Verifique se a ferramenta está marcada como ativa
- Revise as instruções para IA
- Teste manualmente primeiro

---

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs no Vercel: https://vercel.com/seu-projeto/logs
2. Teste o endpoint manualmente: Use o arquivo `teste-rapido.js`
3. Consulte: `GUIA_CONFIGURACAO.md` para mais detalhes

---

**Última atualização:** 19/01/2026  
**Versão:** 1.0.0
