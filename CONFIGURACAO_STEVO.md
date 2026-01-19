# 🚀 CONFIGURAÇÃO FINAL - STEVO CUSTOM TOOL

## 📋 PASSO A PASSO

### 1️⃣ CRIAR CUSTOM TOOL NO STEVO

**Nome da Tool:**
```
Buscar Produtos Magazord
```

**URL do Endpoint:**
```
https://zweu.vercel.app/api/busca-inteligente
```

**Método HTTP:**
```
POST
```

**Tipo de Parâmetros:**
```
Query Params
```

---

### 2️⃣ CONFIGURAR PARÂMETROS

Adicione APENAS este parâmetro:

| Nome      | Tipo   | Obrigatório | Descrição                           |
|-----------|--------|-------------|-------------------------------------|
| mensagem  | string | Sim         | Mensagem completa que o cliente enviou |

**⚠️ IMPORTANTE:** Configure para que o Stevo envie a mensagem do usuário diretamente neste parâmetro!

---

### 3️⃣ DESCRIÇÃO DA TOOL (AI Instructions)

Cole o conteúdo completo do arquivo:
```
PROMPT_TOOL_PRODUCAO.txt
```

Esse prompt ensina a IA:
- Quando usar a ferramenta
- Como interpretar a resposta
- Como ler imagens (produtos[0].imagens[0])
- Como ler preços (produtos[0].preco)
- Como ler tamanhos (produtos[0].tamanhos)
- O que fazer quando não tem imagem

---

### 4️⃣ PROMPT DA IA PRINCIPAL

No campo de configuração principal do bot Stevo, cole:
```
PROMPT_IA_PRINCIPAL_PRODUCAO.txt
```

Esse prompt define:
- Tom de voz da assistente
- Quando usar a ferramenta
- Como responder cada tipo de pergunta
- Regras de ouro (não inventar dados)
- Exemplos de conversas ideais

---

## 🧪 TESTAR APÓS CONFIGURAR

### Teste 1: Produto simples
```
Cliente: "tem jaleco?"
Esperado: IA usa ferramenta → responde com quantidade e preços
```

### Teste 2: Pedir foto
```
Cliente: "mostra foto do jaleco"
Esperado: 
- Se tem imagem → mostra URL
- Se não tem → "Este produto não tem foto cadastrada"
```

### Teste 3: Preço
```
Cliente: "quanto custa o gorro?"
Esperado: IA busca gorro → responde "R$ XX,XX"
```

### Teste 4: Tamanho
```
Cliente: "que tamanhos tem?"
Esperado: IA lista "P, M, G, GG" com estoques
```

### Teste 5: Produto inexistente
```
Cliente: "tem camiseta?"
Esperado: "Não encontrei esse produto no catálogo"
```

---

## 📊 ESTRUTURA DA RESPOSTA DA API

A ferramenta retorna:
```json
{
  "success": true,
  "total": 279,
  "produtos": [
    {
      "id": 2258,
      "nome": "Jaleco Feminino Heloisa...",
      "codigo": "300-MC-049-000-F",
      "preco": 79.90,
      "estoque": 150,
      "imagens": ["https://...", "https://..."],
      "tamanhos": [
        {
          "nome": "Jaleco ... - P",
          "estoque": 20,
          "preco": 79.90
        }
      ]
    }
  ]
}
```

**Campos importantes para a IA:**
- `total` → quantidade de produtos encontrados
- `produtos[0].nome` → nome do produto
- `produtos[0].preco` → preço
- `produtos[0].imagens` → **array de URLs (pode estar vazio!)**
- `produtos[0].tamanhos` → variações de tamanho

---

## ⚠️ TROUBLESHOOTING

### Problema: IA não usa a ferramenta
**Solução:** Verifique se o prompt principal instrui claramente "SEMPRE use a ferramenta quando cliente perguntar sobre produto"

### Problema: IA diz que não tem imagem quando tem
**Solução:** Confirme que o prompt da Tool ensina a ler `produtos[0].imagens[0]`

### Problema: IA inventa preços
**Solução:** Reforce no prompt: "NUNCA invente informações - use APENAS dados da API"

### Problema: Stevo não preenche parâmetro "mensagem"
**Solução:** Configure a Tool para enviar automaticamente a mensagem do usuário no parâmetro

### Problema: Erro 400 "Nenhum parâmetro fornecido"
**Solução:** Significa que Stevo está enviando `{}` vazio. Configure corretamente o parâmetro "mensagem"

---

## 🔍 VERIFICAR LOGS VERCEL

Acesse: https://vercel.com/seu-projeto/logs

Procure por:
```
==================== 🤖 BUSCA INTELIGENTE ====================
📦 Body: {...}
🔗 Query: {...}
💬 Mensagem interpretada: [texto aqui]
```

Se aparecer `Mensagem interpretada: ` vazio → Stevo não está enviando parâmetro!

---

## ✅ CHECKLIST FINAL

- [ ] Custom Tool criada no Stevo
- [ ] URL: `https://zweu.vercel.app/api/busca-inteligente`
- [ ] Método: POST
- [ ] Parâmetro "mensagem" configurado
- [ ] Prompt da Tool colado (PROMPT_TOOL_PRODUCAO.txt)
- [ ] Prompt da IA Principal colado (PROMPT_IA_PRINCIPAL_PRODUCAO.txt)
- [ ] Testado 5 cenários acima
- [ ] Verificado logs Vercel mostrando mensagens corretas

---

## 🎯 RESULTADO ESPERADO

Cliente deve conseguir:
1. Perguntar sobre qualquer produto
2. Ver preços em tempo real
3. Saber estoques disponíveis
4. Ver fotos (quando produto tiver)
5. Escolher tamanhos
6. Fazer pedidos

Tudo de forma NATURAL pelo WhatsApp, como se conversasse com vendedor humano!
