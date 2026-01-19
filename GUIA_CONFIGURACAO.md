═══════════════════════════════════════════════════════════════
  GUIA DE CONFIGURAÇÃO - STEVO IA + VERCEL
═══════════════════════════════════════════════════════════════

## 📋 RESUMO DO MVP

Cliente pergunta no WhatsApp → Stevo IA extrai termo → Envia para Vercel → Vercel consulta Magazord → Retorna dados → Stevo responde cliente

═══════════════════════════════════════════════════════════════
  PASSO 1: CONFIGURAÇÃO NO STEVO
═══════════════════════════════════════════════════════════════

### 1.1 - Criar a Ferramenta (Tool)

1. Acesse o painel do Stevo
2. Vá em "Ferramentas" ou "Tools"
3. Clique em "Adicionar Nova Ferramenta"
4. Configure:

**Nome da Ferramenta:** buscar_produto

**Descrição:**
Busca produtos no catálogo. Use quando o cliente perguntar sobre produtos, estoque, preço ou disponibilidade.

**Tipo:** API/HTTP Request

**OpenAPI Spec:** 
- Upload o arquivo: openapi.yaml
- OU cole a URL: https://zweu.vercel.app/openapi.yaml

═══════════════════════════════════════════════════════════════
  PASSO 2: CONFIGURAÇÃO DO ENDPOINT
═══════════════════════════════════════════════════════════════

### 2.1 - Dados do Servidor

**URL Base:** https://zweu.vercel.app
**Endpoint:** /api/buscar-produto
**Método:** POST
**Content-Type:** application/json

### 2.2 - Autenticação

**Tipo:** Nenhuma (público)
❌ NÃO configurar Basic Auth no Stevo
❌ NÃO adicionar headers de autenticação
✅ A autenticação com Magazord é feita internamente pelo servidor Vercel

═══════════════════════════════════════════════════════════════
  PASSO 3: PARÂMETROS DA FERRAMENTA
═══════════════════════════════════════════════════════════════

Configure os seguintes parâmetros no formulário da ferramenta:

┌─────────────┬──────────┬─────────────┬──────────────────────┐
│ Parâmetro   │ Tipo     │ Obrigatório │ Descrição            │
├─────────────┼──────────┼─────────────┼──────────────────────┤
│ nome        │ string   │ Não*        │ Nome do produto      │
│ codigo      │ string   │ Não*        │ Código do produto    │
│ produto     │ string   │ Não*        │ Termo alternativo    │
│ mensagem    │ string   │ Não*        │ Mensagem completa    │
│ limit       │ integer  │ Não         │ Qtd. resultados      │
└─────────────┴──────────┴─────────────┴──────────────────────┘

*Pelo menos um destes deve ser preenchido

### 3.1 - Validação

O OpenAPI já tem a validação "anyOf" que garante que pelo menos um parâmetro seja enviado.

═══════════════════════════════════════════════════════════════
  PASSO 4: INSTRUÇÕES PARA A IA
═══════════════════════════════════════════════════════════════

No campo "Instruções para IA" ou "System Prompt" da ferramenta, cole:

```
QUANDO USAR:
- Cliente pergunta sobre produtos
- Cliente pergunta sobre preço
- Cliente pergunta sobre estoque
- Cliente menciona nome de produto

COMO USAR:
1. Extraia o termo de busca da mensagem do cliente
2. Preencha o parâmetro "nome" com o termo
3. Adicione "limit": 10 (ou conforme cliente pedir)
4. Execute a ferramenta

EXEMPLOS:
- "tem jaleco?" → nome="jaleco", limit=10
- "mostra gorro" → nome="gorro", limit=10
- "código X123" → codigo="X123", limit=1

IMPORTANTE:
❌ NUNCA envie sem parâmetros
✅ SEMPRE extraia o termo da mensagem
```

═══════════════════════════════════════════════════════════════
  PASSO 5: TESTAR A FERRAMENTA
═══════════════════════════════════════════════════════════════

### 5.1 - Teste Manual

Envie uma requisição de teste:

```json
{
  "nome": "jaleco",
  "limit": 10
}
```

**Resposta Esperada:**
```json
{
  "sucesso": true,
  "total_produtos": 15,
  "produtos": [ ... ]
}
```

### 5.2 - Teste com a IA

No chat do Stevo, teste:
- "tem jaleco?"
- "mostra gorro azul"
- "qual o preço do avental?"

A IA deve automaticamente chamar a ferramenta e retornar os dados.

═══════════════════════════════════════════════════════════════
  PASSO 6: VARIÁVEIS DE AMBIENTE NO VERCEL
═══════════════════════════════════════════════════════════════

Certifique-se que essas variáveis estão configuradas no Vercel:

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione:

**MAGAZORD_BASE_URL**
Valor: https://urlmagazord.com.br/api

**MAGAZORD_USER**
Valor: seu_usuario_magazord

**MAGAZORD_PASS**
Valor: sua_senha_magazord

3. Clique em "Save"
4. Faça redeploy do projeto

═══════════════════════════════════════════════════════════════
  ESTRUTURA DE ARQUIVOS DO PROJETO
═══════════════════════════════════════════════════════════════

zweu/
├── api/
│   └── buscar-produto.js     ← Único endpoint (MVP)
├── openapi.yaml              ← Especificação da API
├── PROMPT_IA_PRINCIPAL.txt   ← Instruções gerais para IA
├── PROMPT_TOOL.txt           ← Instruções da ferramenta
├── package.json
└── README.md

═══════════════════════════════════════════════════════════════
  FLUXO COMPLETO
═══════════════════════════════════════════════════════════════

1. Cliente: "tem jaleco?" (WhatsApp)
   ↓
2. Stevo IA: Identifica que é pergunta sobre produto
   ↓
3. Stevo IA: Extrai termo "jaleco"
   ↓
4. Stevo IA: Chama ferramenta buscar_produto
   POST https://zweu.vercel.app/api/buscar-produto
   { "nome": "jaleco", "limit": 10 }
   ↓
5. Vercel: Recebe requisição
   ↓
6. Vercel: Autentica no Magazord (Basic Auth interno)
   ↓
7. Vercel: Consulta API do Magazord
   GET https://urlmagazord.com.br/api/v2/site/produto?nome=jaleco&limit=10
   ↓
8. Magazord: Retorna produtos
   ↓
9. Vercel: Formata resposta e retorna para Stevo
   ↓
10. Stevo IA: Processa resposta
    ↓
11. Stevo IA: Responde cliente com dados reais:
    "Sim! Temos 15 jalecos disponíveis. O Jaleco Branco Manga Longa custa R$ 89,90..."

═══════════════════════════════════════════════════════════════
  CHECKLIST FINAL
═══════════════════════════════════════════════════════════════

Backend (Vercel):
✅ Endpoint /api/buscar-produto.js criado
✅ Variáveis de ambiente configuradas
✅ Projeto deployado no Vercel
✅ Teste manual funcionando

Stevo IA:
✅ Ferramenta "buscar_produto" criada
✅ OpenAPI spec carregado
✅ Parâmetros configurados
✅ Instruções para IA adicionadas
✅ Teste com IA funcionando

Validações:
✅ SEM dados mockados
✅ ERRO quando sem parâmetros
✅ Autenticação Magazord funcionando
✅ Resposta formatada corretamente

═══════════════════════════════════════════════════════════════
  TROUBLESHOOTING
═══════════════════════════════════════════════════════════════

### Erro 400 - "Parâmetro obrigatório não fornecido"
❌ Problema: Stevo não está enviando parâmetros
✅ Solução: Verifique as instruções da ferramenta, garanta que a IA extraia o termo

### Erro 500 - "Variáveis de ambiente ausentes"
❌ Problema: Credenciais Magazord não configuradas
✅ Solução: Configure MAGAZORD_BASE_URL, MAGAZORD_USER, MAGAZORD_PASS no Vercel

### Erro 401/403 no Magazord
❌ Problema: Credenciais incorretas
✅ Solução: Verifique usuário e senha do Magazord

### IA não chama a ferramenta
❌ Problema: Instruções unclear ou ferramenta não ativada
✅ Solução: Verifique se ferramenta está ativa e instruções estão claras

═══════════════════════════════════════════════════════════════
