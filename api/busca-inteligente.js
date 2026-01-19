// Endpoint INTELIGENTE que interpreta texto livre do cliente
export default async function handler(req, res) {
  console.log('==================== 🤖 BUSCA INTELIGENTE ====================');
  console.log('🕒 Timestamp:', new Date().toISOString());
  console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  console.log('🔗 Query:', JSON.stringify(req.query, null, 2));
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Recebe mensagem do cliente (texto livre)
    const params = { ...req.query, ...req.body };
    const mensagem = params.mensagem || params.query || params.q || params.texto || '';
    
    console.log('💬 Mensagem do cliente:', mensagem);

    if (!mensagem) {
      return res.status(400).json({
        error: 'Mensagem não informada',
        hint: 'Envie: {mensagem: "jaleco azul tamanho M"}'
      });
    }

    // INTERPRETA a mensagem e monta query
    const magazordQuery = { limit: 10 };
    const msgLower = mensagem.toLowerCase();

    // Extrai limite se mencionado
    const matchLimit = msgLower.match(/(\d+)\s*(produto|item|jaleco|unidade)/);
    if (matchLimit) magazordQuery.limit = parseInt(matchLimit[1]);

    // Extrai código se mencionado
    const matchCodigo = msgLower.match(/c[óo]digo[:\s]*([\w-]+)/i);
    if (matchCodigo) {
      magazordQuery.codigo = matchCodigo[1].toUpperCase();
      magazordQuery.limit = 1;
    } else {
      // Monta busca por nome
      let termo = msgLower
        .replace(/tem\s+|quero\s+|preciso\s+de\s+|busca\s+|procuro\s+/g, '')
        .replace(/\?/g, '')
        .replace(/tamanho\s+[pmg]+/gi, '')
        .replace(/foto|imagem|mostra/gi, '')
        .replace(/\d+\s*(produto|item|unidade)/gi, '')
        .trim();
      if (termo) magazordQuery.nome = termo;
    }

    magazordQuery.disponivel = 1;

    console.log('📋 Query:', magazordQuery);

    // Fetch Magazord
    const BASE_URL = process.env.MAGAZORD_BASE_URL;
    const USER = process.env.MAGAZORD_USER;
    const PASS = process.env.MAGAZORD_PASS;

    const queryString = new URLSearchParams(magazordQuery).toString();
    const fullUrl = `${BASE_URL}/v2/site/produto?${queryString}`;
    
    const authToken = Buffer.from(`${USER}:${PASS}`).toString('base64');
    const apiResponse = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await apiResponse.json();

    // Processa produtos
    const produtos = data?.data?.items?.map(p => ({
      id: p.id,
      nome: p.nome,
      codigo: p.codigo,
      preco: p.preco_venda_por || p.preco_venda,
      estoque: p.estoque_disponivel,
      imagens: p.midias?.map(m => m.url_original || m.url) || [],
      tamanhos: p.derivacoes?.slice(0, 5).map(d => ({
        nome: d.nome,
        estoque: d.estoque,
        preco: d.preco
      })) || []
    })) || [];

    return res.status(200).json({
      success: true,
      total: data?.data?.total || 0,
      produtos: produtos.slice(0, 5)
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
