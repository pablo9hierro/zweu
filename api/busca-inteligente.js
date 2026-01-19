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
    
    // VALIDAÇÃO OBRIGATÓRIA - precisa ter pelo menos um parâmetro
    const temNome = params.nome && String(params.nome).trim().length > 0;
    const temCodigo = params.codigo && String(params.codigo).trim().length > 0;
    const temMensagem = params.mensagem && String(params.mensagem).trim().length > 0;
    
    console.log('🔍 Validação:', { temNome, temCodigo, temMensagem });
    
    if (!temNome && !temCodigo && !temMensagem) {
      console.log('❌ ERRO: Nenhum parâmetro válido recebido');
      return res.status(400).json({
        success: false,
        error: 'Parâmetros vazios',
        message: 'O Stevo DEVE preencher pelo menos um parâmetro: nome, codigo ou mensagem',
        recebido: params,
        instrucao: 'Configure a Tool no Stevo para preencher os parâmetros corretamente'
      });
    }
    
    // Extrai termo de busca
    let termoBusca = params.nome || params.codigo || params.mensagem || '';
    termoBusca = String(termoBusca).trim();
    
    console.log('✅ Termo de busca:', termoBusca);
    
    // Monta query Magazord
    const magazordQuery = {
      limit: parseInt(params.limit) || 10
    };
    
    if (params.codigo) {
      magazordQuery.codigo = params.codigo;
    } else {
      magazordQuery.nome = termoBusca;
    }

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
