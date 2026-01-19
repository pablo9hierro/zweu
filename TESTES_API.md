# 🧪 TESTES DA API

## ✅ Teste 1: Busca Simples - "tem jaleco?"

```bash
curl -X POST https://zweu.vercel.app/api/buscar-produto \
  -H "Content-Type: application/json" \
  -d '{"nome": "jaleco"}'
```

**Esperado**: Lista de jalecos disponíveis

---

## ✅ Teste 2: Busca com Cor - "mostra gorro azul"

```bash
curl -X POST https://zweu.vercel.app/api/buscar-produto \
  -H "Content-Type: application/json" \
  -d '{"nome": "gorro azul"}'
```

**Esperado**: Lista de gorros azuis

---

## ✅ Teste 3: Busca com Limite - "quero 5 aventais"

```bash
curl -X POST https://zweu.vercel.app/api/buscar-produto \
  -H "Content-Type: application/json" \
  -d '{"nome": "avental", "limit": 5}'
```

**Esperado**: Até 5 aventais

---

## ✅ Teste 4: Busca por Código

```bash
curl -X POST https://zweu.vercel.app/api/buscar-produto \
  -H "Content-Type: application/json" \
  -d '{"codigo": "300-MC-049"}'
```

**Esperado**: Produto específico com código 300-MC-049

---

## ❌ Teste de Erro: Sem Parâmetros

```bash
curl -X POST https://zweu.vercel.app/api/buscar-produto \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Esperado**: 
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

---

## ❌ Teste de Erro: Parâmetro Vazio

```bash
curl -X POST https://zweu.vercel.app/api/buscar-produto \
  -H "Content-Type: application/json" \
  -d '{"nome": ""}'
```

**Esperado**: Erro 400

---

## 🔍 Como Verificar os Logs

1. Acesse: https://vercel.com/dashboard
2. Entre no projeto "zweu"
3. Vá em **Deployments** > **Latest**
4. Clique em **Functions** > **api/buscar-produto.js**
5. Veja os logs em tempo real

---

## 📊 Exemplo de Resposta de Sucesso

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
          "url": "https://cdn.magazord.com.br/...",
          "principal": true
        }
      ],
      "derivacoes": [
        {
          "codigo": "300-MC-049-P",
          "nome": "Tamanho P",
          "estoque": 10,
          "preco": 89.90
        },
        {
          "codigo": "300-MC-049-M",
          "nome": "Tamanho M",
          "estoque": 15,
          "preco": 89.90
        },
        {
          "codigo": "300-MC-049-G",
          "nome": "Tamanho G",
          "estoque": 25,
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

---

## 🎯 O que Verificar

✅ **sucesso**: true
✅ **total_produtos**: > 0
✅ **produtos**: array com produtos
✅ **estoque_disponivel**: número
✅ **preco**: valor
✅ **imagens**: array com URLs
✅ **derivacoes**: tamanhos/variações

---

## 🐛 Debugging no PowerShell

```powershell
# Teste básico
$body = @{
    nome = "jaleco"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zweu.vercel.app/api/buscar-produto" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

```powershell
# Teste com limite
$body = @{
    nome = "gorro"
    limit = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zweu.vercel.app/api/buscar-produto" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

---

## 📝 Notas Importantes

1. **SEMPRE envie pelo menos um parâmetro**
2. **NUNCA envie {} vazio**
3. **NUNCA envie "nome": ""**
4. A API retorna dados REAIS do Magazord
5. Sem dados mockados
6. Autenticação Basic já configurada no servidor
