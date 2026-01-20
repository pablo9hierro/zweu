# 🎯 CONFIGURAÇÃO FINAL - COMUNICAÇÃO VIA TEXTO

## 📝 1. PROMPT DA IA PRINCIPAL (COLE NO STEVO)

Arquivo: `PROMPT_IA_PRINCIPAL.txt` (já atualizado)

---

## ⚙️ 2. CONFIGURAÇÃO DA CUSTOM TOOL

**Nome:**
```
buscar_produto
```

**Descrição:**
```
Ferramenta de busca de produtos. 
Envie o comando estruturado que você montou.
```

**Método:**
```
POST
```

**URL:**
```
https://zweu.vercel.app/api/texto
```

**Content-Type:**
```
text/plain
```

**Timeout:**
```
15000
```

---

## 📋 3. PARÂMETROS DA TOOL

**UM ÚNICO PARÂMETRO:**

- **Nome:** `query` ou `text` ou `message`
- **Tipo:** `string`
- **Obrigatório:** ✅ Sim
- **Descrição:** Comando estruturado em tags XML

**A IA vai preencher esse parâmetro com:**
```xml
<busca><acao>buscar_produto</acao><nome>jaleco</nome><limit>10</limit></busca>
```

---

## 🚀 4. FLUXO COMPLETO

```
Cliente WhatsApp: "Tem jaleco?"
    ↓
IA Principal (lê PROMPT_IA_PRINCIPAL.txt):
  - Entende que precisa buscar produto
  - Monta: <busca><acao>buscar_produto</acao><nome>jaleco</nome><limit>10</limit></busca>
    ↓
Stevo envia para Custom Tool "buscar_produto"
    ↓
Tool envia POST https://zweu.vercel.app/api/texto
Body: { "query": "<busca>...</busca>" }
    ↓
Servidor /api/texto:
  - Parseia as tags XML
  - Extrai: acao=buscar_produto, nome=jaleco, limit=10
  - Monta URL: https://magazord.../v2/site/produto?nome=jaleco&limit=10
  - Busca no Magazord
  - Retorna XML:
    <resposta>
      <total>279</total>
      <produtos>
        <produto>...</produto>
      </produtos>
    </resposta>
    ↓
IA Principal recebe XML e responde ao cliente:
"Encontrei 279 jalecos! Aqui estão alguns:
1. Jaleco Feminino... - R$ 89,90
..."
```

---

## 🧪 5. TESTAR

1. Faça deploy:
```powershell
cd C:\Users\pablo\OneDrive\Documentos\zweu
git add .
git commit -m "feat: comunicação via texto estruturado XML"
git push
```

2. Configure a tool conforme acima

3. Digite no chat: **"Tem jaleco?"**

4. Veja nos logs do Vercel:
   - O texto recebido
   - Os campos extraídos
   - A URL montada
   - O XML retornado

---

## ✅ ISSO VAI FUNCIONAR!

A IA monta o texto estruturado, o servidor parseia e busca no Magazord, retorna XML estruturado, a IA lê e responde ao cliente.

**COMUNICAÇÃO VIA TEXTO BRUTO!** 🚀
