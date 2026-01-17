# 🧪 TESTE DO SERVIDOR - BUSCA DE PRODUTOS

## Como usar este arquivo:

Este arquivo contém exemplos práticos de requisições para testar seu servidor proxy.

---

## 🔥 TESTE 1: Buscar produtos por nome

```powershell
$body = @{
    method = "GET"
    endpoint = "/v2/site/produto"
    query = @{
        nome = "jaleco"
        limit = 5
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zweu.vercel.app/api/magazord" -Method POST -ContentType "application/json" -Body $body
```

---

## 🔥 TESTE 2: Buscar produto por código

```powershell
$body = @{
    method = "GET"
    endpoint = "/v2/site/produto"
    query = @{
        codigo = "CODIGO_TESTE"
        limit = 1
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zweu.vercel.app/api/magazord" -Method POST -ContentType "application/json" -Body $body
```

---

## 🔥 TESTE 3: Buscar produtos de uma categoria

```powershell
$body = @{
    method = "GET"
    endpoint = "/v2/site/produto"
    query = @{
        categoria = 1
        limit = 10
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zweu.vercel.app/api/magazord" -Method POST -ContentType "application/json" -Body $body
```

---

## 🔥 TESTE 4: Buscar produtos ordenados por nome

```powershell
$body = @{
    method = "GET"
    endpoint = "/v2/site/produto"
    query = @{
        order = "nome"
        orderDirection = "asc"
        limit = 20
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zweu.vercel.app/api/magazord" -Method POST -ContentType "application/json" -Body $body
```

---

## 🔥 TESTE 5: Buscar produtos por EAN (código de barras)

```powershell
$body = @{
    method = "GET"
    endpoint = "/v2/site/produto"
    query = @{
        ean = 7898357417711
        limit = 1
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zweu.vercel.app/api/magazord" -Method POST -ContentType "application/json" -Body $body
```

---

## ✅ Como saber se funcionou?

Se a resposta vier assim, está funcionando:

```json
{
  "success": true,
  "status": 200,
  "data": {
    "status": "success",
    "data": {
      "items": [...],
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 5
    }
  }
}
```

## ❌ Se der erro de autenticação:

Verifique se as variáveis de ambiente estão configuradas na Vercel:
- MAGAZORD_BASE_URL
- MAGAZORD_USER
- MAGAZORD_PASS

## 📊 Resultado esperado

Os testes devem retornar produtos cadastrados no seu Magazord.
