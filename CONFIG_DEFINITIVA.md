# 🎯 CONFIGURAÇÃO DEFINITIVA - STEVO + MAGAZORD

## 📝 CONFIGURAÇÃO DA CUSTOM TOOL

**Nome:**
```
buscar_produto
```

**Descrição (Instruções para IA):**
```
Busca produtos no estoque Magazord.

Quando cliente perguntar:
- "Tem jaleco?" → Preencha: nome = "jaleco"
- "Produto código X" → Preencha: codigo = "X"  
- "Categoria 10" → Preencha: categoria = 10

SEMPRE preencha limit = 10
```

**Método:**
```
POST
```

**URL:**
```
https://zweu.vercel.app/api/buscar
```

**Timeout:**
```
15000
```

---

## ⚙️ PARÂMETROS (ADICIONE ESSES):

### Parâmetro 1:
- **Nome:** `nome`
- **Tipo:** `string`
- **Obrigatório:** ❌ Não
- **Descrição:** Nome ou descrição do produto

### Parâmetro 2:
- **Nome:** `codigo`
- **Tipo:** `string`
- **Obrigatório:** ❌ Não
- **Descrição:** Código/SKU do produto

### Parâmetro 3:
- **Nome:** `limit`
- **Tipo:** `number`
- **Obrigatório:** ✅ Sim
- **Valor padrão:** `10`
- **Descrição:** Quantidade de resultados

### Parâmetro 4:
- **Nome:** `categoria`
- **Tipo:** `number`
- **Obrigatório:** ❌ Não
- **Descrição:** ID da categoria

---

## 🚀 DEPLOY

Execute no PowerShell:

```powershell
cd C:\Users\pablo\OneDrive\Documentos\zweu
git add api/buscar.js
git commit -m "feat: endpoint /api/buscar adaptado para parâmetros Stevo"
git push
```

Aguarde 30 segundos.

---

## 🧪 TESTE

1. Configure a tool conforme acima
2. Teste com "Tem jaleco?"
3. A IA vai preencher: nome="jaleco", limit=10
4. Servidor vai buscar no Magazord
5. Retorna produtos

---

## ✅ ISSO VAI FUNCIONAR!

Stevo não monta JSON livre, mas preenche parâmetros que você define.
O servidor recebe esses parâmetros e monta a requisição pro Magazord.
