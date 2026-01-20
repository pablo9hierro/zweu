# 📋 LISTA COMPLETA DE PARÂMETROS - CUSTOM TOOL STEVO

## 🎯 CONFIGURE ESTES PARÂMETROS NO STEVO

Adicione como **Query Params** na Custom Tool:

---

### 🔍 **BUSCA BÁSICA**

| Parâmetro | Tipo | Obrigatório | Descrição | Exemplo |
|-----------|------|-------------|-----------|---------|
| `nome` | string | ❌ | Nome ou descrição do produto | `jaleco` |
| `codigo` | string | ❌ | Código/SKU do produto | `300-MC-049` |
| `ean` | string | ❌ | Código de barras | `7898357417711` |

---

### 🎨 **FILTROS**

| Parâmetro | Tipo | Obrigatório | Descrição | Exemplo |
|-----------|------|-------------|-----------|---------|
| `categoria` | string | ❌ | ID da categoria | `15` |
| `marca` | string | ❌ | ID da marca | `10` |
| `loja` | string | ❌ | ID da loja | `1` |
| `ativo` | string | ❌ | Apenas ativos: 0 ou 1 | `1` |
| `disponivel` | string | ❌ | Apenas disponíveis: 0 ou 1 | `1` |

---

### 💰 **PREÇO**

| Parâmetro | Tipo | Obrigatório | Descrição | Exemplo |
|-----------|------|-------------|-----------|---------|
| `precoMin` | string | ❌ | Preço mínimo | `50.00` |
| `precoMax` | string | ❌ | Preço máximo | `150.00` |

---

### 📊 **ORDENAÇÃO**

| Parâmetro | Tipo | Obrigatório | Descrição | Valores Aceitos |
|-----------|------|-------------|-----------|-----------------|
| `order` | string | ❌ | Campo para ordenar | `id`, `nome`, `preco` |
| `orderDirection` | string | ❌ | Direção da ordenação | `asc`, `desc` |

---

### 📄 **PAGINAÇÃO**

| Parâmetro | Tipo | Obrigatório | Descrição | Padrão |
|-----------|------|-------------|-----------|--------|
| `limit` | string | ✅ | Quantidade de resultados | `10` |
| `page` | string | ❌ | Número da página | `1` |

---

### 📅 **DATAS**

| Parâmetro | Tipo | Obrigatório | Descrição | Formato |
|-----------|------|-------------|-----------|---------|
| `dataAtualizacaoInicio` | string | ❌ | Data início | `2026-01-01T00:00:00Z` |
| `dataAtualizacaoFim` | string | ❌ | Data fim | `2026-01-31T23:59:59Z` |

---

## 💡 EXEMPLOS DE USO:

### **Cliente: "Tem jaleco disponível?"**
IA preenche:
```
nome = "jaleco"
disponivel = "1"
limit = "10"
```

### **Cliente: "Mostra jaleco entre R$ 50 e R$ 100"**
IA preenche:
```
nome = "jaleco"
precoMin = "50"
precoMax = "100"
limit = "10"
```

### **Cliente: "Quero os últimos produtos atualizados"**
IA preenche:
```
order = "id"
orderDirection = "desc"
limit = "10"
```

### **Cliente: "Produtos da categoria médica em ordem alfabética"**
IA preenche:
```
categoria = "15"
order = "nome"
orderDirection = "asc"
limit = "20"
```

---

## 📸 RESPOSTA INCLUI IMAGENS!

Cada produto retorna:
```json
{
  "id": 12345,
  "nome": "Jaleco Branco",
  "codigo": "300-MC-049",
  "preco": 89.90,
  "preco_promocional": 69.90,
  "estoque_disponivel": 50,
  "imagens": [
    {
      "url": "https://cdn.magazord.com.br/produto/12345/imagem.jpg",
      "principal": true
    }
  ],
  "derivacoes": [
    {
      "codigo": "300-MC-049-P",
      "nome": "Tamanho P",
      "estoque": 10,
      "preco": 89.90
    }
  ]
}
```

---

## ✅ DEPLOY:

```powershell
cd C:\Users\pablo\OneDrive\Documentos\zweu
git add .
git commit -m "feat: adiciona TODOS os parâmetros de busca Magazord"
git push
```

Aguarde 30 segundos e teste!
