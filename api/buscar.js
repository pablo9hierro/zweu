// Endpoint adaptado para receber parâmetros simples do Stevo
export default async function handler(req, res) {
  console.log('==================== 🚀 NOVA REQUISIÇÃO ====================');
  console.log('🕒 Timestamp:', new Date().toISOString());
  console.log('📡 Método HTTP:', req.method);
  console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  console.log('🔗 Query:', JSON.stringify(req.query, null, 2));
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight OPTIONS');
    return res.status(200).end();
  }

  try {
    // Aceita tanto body quanto query params
    const params = { ...req.query, ...req.body };
    console.log('📝 Parâmetros unificados:', JSON.stringify(params, null, 2));

    // Extrai termo de busca de QUALQUER lugar
    let termoBusca = '';
    if (params.nome) termoBusca = String(params.nome).trim();
    else if (params.codigo) termoBusca = String(params.codigo).trim();
    else if (params.mensagem) termoBusca = String(params.mensagem).trim();
    else if (params.produto) termoBusca = String(params.produto).trim();
    
    // Se AINDA vazio, pega QUALQUER string
    if (!termoBusca) {
      const valores = Object.values(params).filter(v => 
        v && typeof v === 'string' && v.trim().length > 0 && v !== 'undefined'
      );
      termoBusca = valores[0] || '';
    }
    
    console.log('🔍 Termo extraído:', termoBusca);
    
    // Se AINDA vazio, busca catálogo geral
    if (!termoBusca) {
      console.log('⚠️ Sem termo - buscando catálogo');
      termoBusca = 'jaleco gorro avental touca scrub';
    }

    // Monta query para Magazord
    const magazordQuery = {
      nome: termoBusca,
      limit: parseInt(params.limit) || 10
    };

    console.log('🔍 Query montada para Magazord:', JSON.stringify(magazordQuery, null, 2));

    // Credenciais
    const BASE_URL = process.env.MAGAZORD_BASE_URL;
    const USER = process.env.MAGAZORD_USER;
    const PASS = process.env.MAGAZORD_PASS;

    if (!BASE_URL || !USER || !PASS) {
      console.log('❌ Env vars faltando!');
      return res.status(500).json({
        error: 'Configuração incorreta',
        hasBaseUrl: !!BASE_URL,
        hasUser: !!USER,
        hasPass: !!PASS
      });
    }

    // Monta URL
    const queryString = new URLSearchParams(magazordQuery).toString();
    const fullUrl = `${BASE_URL}/v2/site/produto?${queryString}`;
    console.log('🌐 URL final:', fullUrl);

    // Basic Auth
    const authToken = Buffer.from(`${USER}:${PASS}`).toString('base64');
    console.log('🔑 Auth token gerado');

    // Fetch
    console.log('🚀 Chamando Magazord...');
    const apiResponse = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('📥 Resposta:', apiResponse.status, apiResponse.statusText);

    const data = await apiResponse.json();
    console.log('📦 Produtos encontrados:', data?.data?.total || 0);

    const response = {
      success: apiResponse.ok,
      status: apiResponse.status,
      total_produtos: data?.data?.total || 0,
      produtos: data?.data?.items?.slice(0, 5).map(p => ({
        id: p.id,
        nome: p.nome,
        codigo: p.codigo,
        ativo: p.ativo,
        preco_venda: p.preco_venda,
        preco_venda_por: p.preco_venda_por,
        estoque_disponivel: p.estoque_disponivel,
        imagens: p.midias?.map(m => ({
          url: m.url_original || m.url,
          principal: m.principal || false
        })) || [],
        derivacoes: p.derivacoes?.map(d => ({
          codigo: d.codigo,
          nome: d.nome,
          estoque: d.estoque,
          preco: d.preco
        })) || []
      })) || [],
      busca_realizada: magazordQuery
    };

    console.log('✅ Retornando', response.total_produtos, 'produtos');
    console.log('==================== FIM ====================\n');

    return res.status(200).json(response);

  } catch (error) {
    console.log('💥 ERRO:', error.message);
    console.log('Stack:', error.stack);
    console.log('==================== FIM COM ERRO ====================\n');
    
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
