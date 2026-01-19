# ✅ CONFIGURAÇÃO FINAL - MODELO ESTRUTURADO

## 🎯 ARQUITETURA

```
Cliente (WhatsApp) 
    ↓
IA Principal (interpreta mensagem)
    ↓
Tool de Busca (extrai campos: nome, codigo, ean, etc)
    ↓
Servidor Vercel (/api/buscar)
    ↓
Magazord API (autenticação Basic Auth)
    ↓
Retorna produtos
    ↓
IA Principal (interpreta JSON e responde naturalmente)
    ↓
Cliente recebe resposta
```

---

## 🔧 CONFIGURAÇÃO NO STEVO

### 1️⃣ ENDPOINT DA TOOL

**URL:**
```
https://zweu.vercel.app/api/buscar
```

**Método:**
```
POST
```

---

### 2️⃣ QUERY PARAMS (parâmetros que a IA pode enviar)

Configure ESTES parâmetros na Tool:

| Nome      | Tipo   | Obrigatório | Descrição                          |
|-----------|--------|-------------|------------------------------------|
| nome      | string | Não*        | Nome ou palavra-chave do produto   |
| codigo    | string | Não*        | Código exato do produto            |
| ean       | number | Não*        | Código de barras                   |
| categoria | number | Não*        | ID da categoria                    |
| marca     | number | Não*        | ID da marca                        |
| limit     | number | Não         | Quantidade de resultados (padrão: 10) |

***Pelo menos UM desses deve ser enviado!**

---

### 3️⃣ DESCRIÇÃO DA TOOL (campo grande de texto)

Cole TODO o conteúdo do arquivo:
```
PROMPT_TOOL_FINAL_STEVO.txt
```

Esse prompt ensina a IA a:
- Extrair campos da mensagem do cliente
- Montar requisição estruturada
- Interpretar resposta JSON
- Responder de forma natural

**Exemplo do que está no prompt:**
```
Cliente: "tem jaleco?"
→ Envie: nome = "jaleco"

Cliente: "busca código 300-MC-049"
→ Envie: codigo = "300-MC-049"
```

---

### 4️⃣ PROMPT DA IA PRINCIPAL

No campo de configuração GERAL do bot, cole:
```
PROMPT_IA_PRINCIPAL_PRODUCAO.txt
```

Esse prompt define:
- Personalidade da assistente
- Quando usar a ferramenta
- Como interpretar respostas
- Regras de ouro (não inventar dados)

---

## 📊 COMO FUNCIONA

### Fluxo Completo:

**1. Cliente envia mensagem:**
```
"tem jaleco branco tamanho G?"
```

**2. IA Principal (prompt geral) decide:**
```
"Cliente quer produto → usar ferramenta de busca"
```

**3. Tool (prompt da tool) extrai campos:**
```
nome = "jaleco branco"
limit = 10
```

**4. Servidor Vercel recebe:**
```
POST /api/buscar?nome=jaleco%20branco&limit=10
```

**5. Servidor valida parâmetros:**
```javascript
if (!params.nome && !params.codigo && !params.ean) {
  return erro 400
}
```

**6. Servidor autentica e chama Magazord:**
```
GET https://magazord.../v2/site/produto?nome=jaleco branco&limit=10
Authorization: Basic {credenciais}
```

**7. Magazord retorna JSON:**
```json
{
  "data": {
    "total": 45,
    "items": [{
      "id": 2258,
      "nome": "Jaleco Feminino Heloisa...",
      "preco_venda_por": 79.90,
      "estoque_disponivel": 150,
      "midias": [{url:"https://...", principal:true}],
      "derivacoes": [...]
    }]
  }
}
```

**8. Servidor formata resposta:**
```json
{
  "success": true,
  "total_produtos": 45,
  "produtos": [{
    "nome": "Jaleco Feminino Heloisa...",
    "preco_venda_por": 79.90,
    "estoque_disponivel": 150,
    "imagens": [{url:"https://...", principal:true}],
    "derivacoes": [...]
  }]
}
```

**9. Tool (prompt da tool) interpreta:**
```
total_produtos > 0 → temos produto
produtos[0].imagens → verificar se tem foto
produtos[0].preco_venda_por → pegar preço
```

**10. IA Principal responde naturalmente:**
```
"Sim! Temos 45 jalecos brancos disponíveis. 
O mais vendido é o Jaleco Feminino Heloisa por R$ 79,90.
Quer ver os tamanhos disponíveis?"
```

---

## ✅ VALIDAÇÕES IMPLEMENTADAS

### No Servidor (/api/buscar):

```javascript
// ❌ Retorna erro 400 se NENHUM parâmetro de busca
if (!nome && !codigo && !ean && !categoria && !marca) {
  return erro
}

// ✅ Aceita se pelo menos UM parâmetro foi enviado
if (nome || codigo || ean) {
  // busca no Magazord
}
```

### Na IA (via prompts):

```
⚠️ REGRA: SEMPRE extraia pelo menos "nome" da mensagem!

Cliente: "tem jaleco?"
→ Envie: nome = "jaleco"  ✅

Cliente: "quanto custa gorro?"
→ Envie: nome = "gorro"  ✅

❌ NUNCA deixe todos parâmetros vazios!
```

---

## 🧪 TESTES ESPERADOS

### Teste 1: Busca simples
```
Cliente: "tem jaleco?"
IA extrai: nome="jaleco"
API retorna: 279 produtos
IA responde: "Sim! Temos 279 jalecos..."
```

### Teste 2: Busca com detalhes
```
Cliente: "mostra gorro azul"
IA extrai: nome="gorro azul"
API retorna: 12 produtos
IA responde: "Temos 12 gorros azuis! Preço: R$ XX,XX"
```

### Teste 3: Busca por código
```
Cliente: "busca código 300-MC-049"
IA extrai: codigo="300-MC-049"
API retorna: 1 produto específico
IA responde: "Encontrei! Jaleco Feminino Heloisa - R$ 79,90"
```

### Teste 4: Pedir foto
```
Cliente: "tem foto do jaleco?"
IA extrai: nome="jaleco"
API retorna: imagens=[{url:"https://..."}]
IA responde: "Aqui está: https://cdn.magazord..."
```

### Teste 5: Produto sem foto
```
Cliente: "mostra foto do gorro"
IA extrai: nome="gorro"
API retorna: imagens=[]
IA responde: "Este produto não tem foto cadastrada, mas posso te dar todas as informações!"
```

### Teste 6: Produto inexistente
```
Cliente: "tem camiseta?"
IA extrai: nome="camiseta"
API retorna: total_produtos=0
IA responde: "Não encontrei esse produto no catálogo"
```

---

## ⚠️ TROUBLESHOOTING

### Erro: "Parâmetros insuficientes"
**Causa:** IA não enviou nenhum parâmetro (nome, codigo, ean vazio)
**Solução:** Verifique se o prompt da Tool está ensinando a extrair campos

### Erro: IA não usa a ferramenta
**Causa:** Prompt da IA Principal não instrui claramente
**Solução:** Verifique se tem "SEMPRE use a ferramenta quando cliente perguntar sobre produto"

### Erro: IA inventa preços
**Causa:** Prompt não reforça "use APENAS dados da API"
**Solução:** Adicione regra "NUNCA invente informações"

### Logs Vercel mostram Query: {}
**Causa:** Stevo não está enviando parâmetros
**Solução:** Verifique configuração dos Query Params na Tool

---

## 🎯 DIFERENÇAS DO MODELO ANTERIOR

### ❌ MODELO ANTIGO (busca-inteligente):
```
Cliente: "tem jaleco?"
→ IA envia: mensagem="tem jaleco?"  (texto livre)
→ Servidor interpreta com regex
→ Problema: IA enviava vazio "", fallback necessário
```

### ✅ MODELO NOVO (buscar):
```
Cliente: "tem jaleco?"
→ IA extrai: nome="jaleco" (campo estruturado)
→ Servidor valida parâmetros
→ Sem fallback, erro se vazio
```

**Vantagens:**
1. Mais previsível (campos estruturados)
2. Validação clara (erro 400 se vazio)
3. Logs melhores (vê exatamente o que foi enviado)
4. Compatível com OpenAPI spec do Magazord
5. IA aprende a extrair campos específicos

---

## 📁 ARQUIVOS CRIADOS

1. **PROMPT_TOOL_FINAL_STEVO.txt** → Cole na descrição da Custom Tool
2. **PROMPT_IA_PRINCIPAL_PRODUCAO.txt** → Cole no prompt geral do bot
3. **CONFIGURACAO_FINAL.md** → Este guia
4. **api/buscar.js** → Endpoint estruturado com validação

---

## 🚀 DEPLOY REALIZADO

Commit: `c5b70da`
Mensagem: "PROD: modelo estruturado - IA extrai campos + validação obrigatória"

Endpoint ativo:
```
https://zweu.vercel.app/api/buscar
```

Status: ✅ PRONTO PARA PRODUÇÃO
