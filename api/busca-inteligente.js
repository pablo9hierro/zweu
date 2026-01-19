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
    // Recebe parâmetros
    const params = { ...req.query, ...req.body };
    console.log('📥 Parâmetros recebidos:', params);
    
    // Extrai termo de busca de QUALQUER lugar
    let termoBusca = '';
    
    // Tenta pegar de qualquer campo
    if (params.nome) termoBusca = String(params.nome).trim();
    else if (params.codigo) termoBusca = String(params.codigo).trim();
    else if (params.mensagem) termoBusca = String(params.mensagem).trim();
    else if (params.query) termoBusca = String(params.query).trim();
    else if (params.produto) termoBusca = String(params.produto).trim();
    else if (params.texto) termoBusca = String(params.texto).trim();
    
    // Se AINDA está vazio, pega QUALQUER string que vier
    if (!termoBusca) {
      const valores = Object.values(params).filter(v => 
        v && typeof v === 'string' && v.trim().length > 0
      );
      termoBusca = valores[0] || '';
    }
    
    console.log('🔍 Termo extraído:', termoBusca);
    
    // Se AINDA está vazio, usa busca geral
    if (!termoBusca) {
      console.log('⚠️ Nenhum termo - buscando catálogo completo');
      termoBusca = 'jaleco gorro avental touca scrub';
    }
    
    // Monta query Magazord
    const magazordQuery = {
      nome: termoBusca,
      limit: parseInt(params.limit) || 10
    };

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
