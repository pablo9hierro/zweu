# 🔧 COMO CONFIGURAR A FERRAMENTA NO STEVO

## 📋 PASSO A PASSO

### 1️⃣ Acesse o Stevo IA
- Entre na sua conta do Stevo
- Vá em **Configurações** > **Ferramentas (Tools)**

### 2️⃣ Adicione Nova Ferramenta
- Clique em **"+ Nova Ferramenta"** ou **"Add Tool"**
- Selecione **"OpenAPI"** ou **"Custom API"**

### 3️⃣ Cole a Especificação OpenAPI
- Abra o arquivo [`openapi.yaml`](openapi.yaml)
- **COPIE TODO O CONTEÚDO** do arquivo
- **COLE** no campo de especificação do Stevo

### 4️⃣ Configure o Nome da Ferramenta
```
Nome: buscar_produto
Descrição: Buscar produtos no catálogo
```

### 5️⃣ Ative a Ferramenta
- Marque a opção **"Ativo"** ou **"Enabled"**
- Salve as configurações

---

## ⚠️ CONFIGURAÇÃO CRÍTICA: PROMPT DA IA

No Stevo, você precisa adicionar estas instruções na **configuração da IA**:

### 📝 Cole este texto no "Prompt da IA" ou "System Instructions":

```
═══════════════════════════════════════════════════════════════
REGRA OBRIGATÓRIA: BUSCA DE PRODUTOS
═══════════════════════════════════════════════════════════════

Quando o cliente perguntar sobre produtos, estoque, preço ou 
disponibilidade, você DEVE:

1. Identificar o PRODUTO mencionado na mensagem
2. Extrair a PALAVRA-CHAVE
3. Chamar a ferramenta "buscar_produto"
4. Preencher o parâmetro "nome" com a palavra extraída

EXEMPLOS:

Cliente: "tem jaleco?"
→ Você chama: buscar_produto({ "nome": "jaleco" })

Cliente: "mostra gorro azul"
→ Você chama: buscar_produto({ "nome": "gorro azul" })

Cliente: "quero avental"
→ Você chama: buscar_produto({ "nome": "avental" })

❌ NUNCA envie: buscar_produto({})
❌ NUNCA envie: buscar_produto({ "nome": "" })
✅ SEMPRE envie: buscar_produto({ "nome": "palavra_extraida" })

═══════════════════════════════════════════════════════════════
```

---

## 🧪 COMO TESTAR

### Teste 1: Busca Simples
```
Você: "tem jaleco?"
```
**Esperado**: Stevo extrai "jaleco" e chama a ferramenta

### Teste 2: Busca com Cor
```
Você: "mostra gorro azul"
```
**Esperado**: Stevo extrai "gorro azul" e chama a ferramenta

### Teste 3: Busca com Quantidade
```
Você: "quero 5 aventais"
```
**Esperado**: Stevo extrai "avental" e envia limit=5

---

## 🐛 PROBLEMAS COMUNS

### ❌ Problema: "Erro 400 - Parâmetro obrigatório não fornecido"

**Causa**: Stevo não está extraindo os parâmetros

**Solução**:
1. Verifique se colou TODO o conteúdo do [`openapi.yaml`](openapi.yaml)
2. Verifique se adicionou as instruções no "Prompt da IA"
3. Verifique se a ferramenta está **ATIVA**

### ❌ Problema: Stevo não chama a ferramenta

**Causa**: Falta instrução no prompt da IA

**Solução**:
1. Adicione as instruções na configuração da IA (veja acima)
2. Seja explícito: "SEMPRE use a ferramenta buscar_produto"

### ❌ Problema: Stevo inventa dados sem chamar a ferramenta

**Causa**: Falta instrução de NÃO inventar

**Solução**:
Adicione no prompt da IA:
```
NUNCA invente informações sobre produtos.
SEMPRE consulte a ferramenta buscar_produto.
NUNCA responda sem chamar a ferramenta.
```

---

## ✅ CHECKLIST FINAL

- [ ] OpenAPI colado no Stevo
- [ ] Ferramenta criada com nome "buscar_produto"
- [ ] Ferramenta marcada como ATIVA
- [ ] Instruções adicionadas no "Prompt da IA"
- [ ] Testado com "tem jaleco?" e funcionou

---

## 📞 SUPORTE

Se ainda não funcionar:

1. Exporte os logs do Stevo
2. Verifique se a ferramenta está sendo chamada
3. Verifique os parâmetros enviados
4. Compare com os exemplos no [`openapi.yaml`](openapi.yaml)

---

## 🎯 LEMBRE-SE

O Stevo PRECISA:
- **IDENTIFICAR** o produto na mensagem
- **EXTRAIR** a palavra-chave
- **PREENCHER** o parâmetro "nome"
- **CHAMAR** a ferramenta

Se qualquer um desses passos falhar, não vai funcionar!
