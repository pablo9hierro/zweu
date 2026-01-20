# 🔧 CONFIGURAÇÃO CORRETA DO STEVO - PASSO A PASSO

## ❌ PROBLEMA IDENTIFICADO

Nos logs do Vercel:
```
Body: {}
Query: {}
❌ ERRO: Nenhum parâmetro de busca fornecido
```

**O Stevo NÃO está preenchendo os parâmetros!**

---

## ✅ SOLUÇÃO - Configure assim:

### 1️⃣ PARÂMETROS QUE A IA PODE PASSAR

Na seção **"Parâmetros (o que a IA pode passar)"**, configure EXATAMENTE assim:

```
nome (string) - OBRIGATÓRIO
  Tipo: string
  Obrigatório: SIM ✓
  Descrição: Palavra-chave do produto que o cliente mencionou
```

**IMPORTANTE:** 
- ✅ Marque como **OBRIGATÓRIO**
- ✅ Nome do parâmetro: `nome` (tudo minúsculo)
- ✅ Tipo: `string`

---

### 2️⃣ REMOVA Query Params

Na seção **"Query Params (parâmetros na URL)"**:

❌ **REMOVA** `limit`, `codigo`, `search`

Motivo: Esses devem ir no BODY, não na URL.

---

### 3️⃣ CONFIGURE O PROMPT DA IA

**CRÍTICO:** Adicione estas instruções no campo de **"Instruções para IA"** ou **"System Prompt"**:

```
═══════════════════════════════════════════════════════════════
REGRA OBRIGATÓRIA: BUSCA DE PRODUTOS
═══════════════════════════════════════════════════════════════

Quando o cliente perguntar sobre produtos, você DEVE:

1. Identificar o PRODUTO na mensagem do cliente
2. Extrair a PALAVRA-CHAVE
3. Chamar a ferramenta buscar_produto
4. PREENCHER o parâmetro "nome" com a palavra extraída

EXEMPLOS OBRIGATÓRIOS:

Cliente: "tem jaleco?"
→ Você DEVE chamar: buscar_produto({ "nome": "jaleco" })

Cliente: "mostra gorro azul"  
→ Você DEVE chamar: buscar_produto({ "nome": "gorro azul" })

Cliente: "quero avental"
→ Você DEVE chamar: buscar_produto({ "nome": "avental" })

Cliente: "código 300-MC-049"
→ Você DEVE chamar: buscar_produto({ "codigo": "300-MC-049" })

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CRÍTICO: NUNCA chame buscar_produto({}) vazio
⚠️ CRÍTICO: SEMPRE preencha o parâmetro "nome"
⚠️ CRÍTICO: SEMPRE extraia a palavra antes de chamar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 4️⃣ FORMATO DA REQUISIÇÃO

O Stevo deve enviar assim:

```json
POST https://zweu.vercel.app/api/buscar-produto
Content-Type: application/json

{
  "nome": "jaleco"
}
```

**NÃO deve enviar:**
- ❌ Query string: `?search=jaleco`
- ❌ Body vazio: `{}`
- ❌ Parâmetros vazios: `{ "nome": "" }`

---

### 5️⃣ TESTE IMEDIATAMENTE

Após configurar, teste:

**Você envia no WhatsApp:** "tem jaleco?"

**Stevo DEVE:**
1. Identificar: "jaleco"
2. Chamar API com: `{ "nome": "jaleco" }`
3. Receber: 279 produtos
4. Responder: "Sim! Encontrei 279 jalecos..."

---

## 🔍 COMO VERIFICAR SE FUNCIONOU

### ✅ Logs que você QUER ver no Vercel:

```
Body: { "nome": "jaleco" }
Query: {}
🔍 Buscando: jaleco | Limit: 10
✅ Produtos encontrados: 279
```

### ❌ Logs que indicam problema:

```
Body: {}
Query: {}
❌ ERRO: Nenhum parâmetro de busca fornecido
```

---

## 🐛 TROUBLESHOOTING

### Problema 1: Stevo ainda não preenche parâmetros

**Causa:** Prompt da IA não está claro o suficiente

**Solução:**
1. Vá em Configurações da IA (não da tool)
2. Adicione no **System Prompt Global**:

```
Sempre que chamar a ferramenta buscar_produto:
- EXTRAIA a palavra-chave da mensagem do cliente
- PREENCHA o parâmetro "nome"
- NUNCA deixe vazio

Exemplo:
Cliente: "tem jaleco?"
Você chama: buscar_produto({ "nome": "jaleco" })
```

### Problema 2: Parâmetro vai vazio

**Causa:** Parâmetro não está marcado como obrigatório

**Solução:**
- Edite a tool
- Parâmetro "nome"
- Marque ✓ **Obrigatório**
- Salve

### Problema 3: Usa "search" ao invés de "nome"

**Causa:** Configuração errada

**Solução:**
- API agora aceita "search" também
- Mas o correto é usar "nome"
- Renomeie o parâmetro para "nome"

---

## 📊 CHECKLIST FINAL

Antes de testar, verifique:

- [ ] Parâmetro "nome" existe e está marcado como OBRIGATÓRIO
- [ ] Tipo do parâmetro "nome" é `string`
- [ ] Query Params estão vazios (sem limit, codigo, search)
- [ ] Prompt da IA tem instruções de EXTRAIR + PREENCHER
- [ ] Método é POST
- [ ] URL é `https://zweu.vercel.app/api/buscar-produto`
- [ ] Content-Type é `application/json`

---

## 🎯 CONFIGURAÇÃO VISUAL

Baseado na sua imagem, ajuste assim:

**ANTES (Errado):**
```
Query Params: limit, codigo, search ❌
Parâmetros: nome, limit, codigo ❌ (nenhum obrigatório)
```

**DEPOIS (Correto):**
```
Query Params: (vazio) ✅
Parâmetros: 
  - nome (string, OBRIGATÓRIO) ✅
  - limit (integer, opcional)
  - codigo (string, opcional)
```

---

## 🚀 APÓS CONFIGURAR

1. **Salve** a configuração
2. **Teste** no WhatsApp: "tem jaleco?"
3. **Verifique** os logs do Vercel
4. **Confirme** que `Body: { "nome": "jaleco" }`

Se ainda não funcionar, compartilhe:
- Screenshot da configuração da tool
- Logs do Vercel completos
- Mensagem de teste enviada

---

**Última atualização:** 19/01/2026  
**Status:** API corrigida para aceitar múltiplas variações (nome, search, query, etc)
