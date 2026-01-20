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

    // Monta query para Magazord - ACEITA TODOS OS PARÂMETROS
    const magazordQuery = {};
    
    // Básicos
    if (params.nome) magazordQuery.nome = params.nome;
    if (params.codigo) magazordQuery.codigo = params.codigo;
    if (params.ean) magazordQuery.ean = parseInt(params.ean);
    
    // Filtros
    if (params.categoria) magazordQuery.categoria = parseInt(params.categoria);
    if (params.marca) magazordQuery.marca = parseInt(params.marca);
    if (params.loja) magazordQuery.loja = parseInt(params.loja);
    if (params.ativo !== undefined) magazordQuery.ativo = parseInt(params.ativo);
    if (params.disponivel !== undefined) magazordQuery.disponivel = parseInt(params.disponivel);
    
    // Preço
    if (params.precoMin) magazordQuery.precoMin = parseFloat(params.precoMin);
    if (params.precoMax) magazordQuery.precoMax = parseFloat(params.precoMax);
    
    // Ordenação
    if (params.order) magazordQuery.order = params.order;
    if (params.orderDirection) magazordQuery.orderDirection = params.orderDirection;
    
    // Paginação
    if (params.page) magazordQuery.page = parseInt(params.page);
    if (params.limit) magazordQuery.limit = parseInt(params.limit) || 10;
    else magazordQuery.limit = 10; // Default
    
    // Datas
    if (params.dataAtualizacaoInicio) magazordQuery.dataAtualizacaoInicio = params.dataAtualizacaoInicio;
    if (params.dataAtualizacaoFim) magazordQuery.dataAtualizacaoFim = params.dataAtualizacaoFim;

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
        ativo: p.ativo
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
