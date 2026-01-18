# 📋 INSTRUÇÕES DE CONFIGURAÇÃO MVP - STEVO + MAGAZORD

## 🎯 OBJETIVO
Fazer a IA do Stevo buscar produtos no Magazord e retornar dados reais.

---

## 📝 PASSO 1: CONFIGURAR IA PRINCIPAL DO STEVO

**Onde:** Configurações > Stevo IA > Prompt Personalizado

**Cole isso:**
```
Quando o cliente perguntar sobre produtos, estoque, preço ou disponibilidade, USE A TOOL "buscar_produto".

Exemplos:
- "Tem jaleco?" → Acione buscar_produto
- "Qual o preço do produto X?" → Acione buscar_produto  
- "Produto código Y está disponível?" → Acione buscar_produto

NÃO responda sem consultar. SEMPRE use a tool para buscar dados reais do estoque.
```

---

## 🔧 PASSO 2: CONFIGURAR CUSTOM TOOL "buscar_produto"

**Nome da Tool:**
```
buscar_produto
```

**Descrição (IA da Tool):**
```
Você busca produtos no estoque. Recebe pergunta do cliente e retorna JSON.

FORMATO DE SAÍDA (SEMPRE):
{
  "method": "GET",
  "endpoint": "/v2/site/produto",
  "query": {
    "nome": "termo_busca",
    "limit": 10
  }
}

REGRAS:
- Cliente pergunta "Tem jaleco?" → nome: "jaleco"
- Cliente pergunta "Produto código X" → codigo: "X"
- SEMPRE inclua "limit": 10
- SEMPRE use method: "GET"
- SEMPRE use endpoint: "/v2/site/produto"

EXEMPLOS:

Pergunta: "Tem jaleco feminino?"
Resposta:
{
  "method": "GET",
  "endpoint": "/v2/site/produto",
  "query": {
    "nome": "jaleco feminino",
    "limit": 10
  }
}

Pergunta: "Código 300-MC-049"
Resposta:
{
  "method": "GET",
  "endpoint": "/v2/site/produto",
  "query": {
    "codigo": "300-MC-049",
    "limit": 1
  }
}

RETORNE APENAS O JSON. SEM TEXTO ADICIONAL.
```

**Método:**
```
POST
```

**URL do Endpoint:**
```
https://zweu.vercel.app/api/magazord
```

**Timeout (ms):**
```
15000
```

**Headers:**
```
DEIXE VAZIO (sem headers customizados)
```

**Query Params (parâmetros na URL):**
```
DEIXE VAZIO
```

**Parâmetros (o que a IA pode passar):**
```
DEIXE VAZIO (a IA vai montar o JSON completo no body)
```

---

## 🧪 PASSO 3: TESTAR

1. Clique em **"Testar Tool"** no Stevo
2. Se aparecer erro → Vá para Vercel Logs
3. Logs do Vercel vão mostrar EXATAMENTE o que Stevo enviou

---

## 📊 PASSO 4: VER LOGS NO VERCEL

1. Acesse: https://vercel.com/pablo-s-projects-4d0aa9d2/zweu/logs
2. Filtre por `/api/magazord`
3. Você vai ver:
   - 📦 Body que Stevo enviou
   - 🔍 O que o servidor extraiu
   - 🚀 Requisição para Magazord
   - 📥 Resposta do Magazord
   - ✅ ou ❌ Status final

---

## 🎯 FLUXO ESPERADO

```
Cliente WhatsApp: "Tem jaleco?"
    ↓
IA Principal do Stevo: "Vou usar buscar_produto"
    ↓
IA da Tool: Monta JSON {"method":"GET","endpoint":"/v2/site/produto","query":{"nome":"jaleco","limit":10}}
    ↓
Stevo envia POST para https://zweu.vercel.app/api/magazord
    ↓
Vercel recebe, loga TUDO, encaminha para Magazord
    ↓
Magazord retorna 279 jalecos
    ↓
Vercel devolve para Stevo
    ↓
Stevo responde cliente: "Encontrei 279 jalecos disponíveis..."
```

---

## ❌ SE DER ERRO

**Erro 400:** Stevo não está enviando `method` ou `endpoint` no JSON
**Erro 500:** Problema no servidor (veja logs Vercel)
**Timeout:** Magazord demorou muito (aumente timeout)
**CORS:** Navegador bloqueou (verifique se Stevo está fazendo server-side)

---

## ✅ CHECKLIST

- [ ] Prompt da IA Principal colado
- [ ] Custom Tool criada: `buscar_produto`
- [ ] Descrição da Tool colada (prompt completo)
- [ ] URL configurada: `https://zweu.vercel.app/api/magazord`
- [ ] Método: POST
- [ ] Timeout: 15000
- [ ] Headers: VAZIO
- [ ] Query Params: VAZIO
- [ ] Parâmetros: VAZIO
- [ ] Testado clicando "Testar Tool"
- [ ] Logs do Vercel abertos para debug

---

**AGORA TESTE E ME DIGA O QUE APARECE NOS LOGS DO VERCEL!** 🚀
