/**
 * MVP - Endpoint único para busca de produtos
 * Recebe parâmetros do Stevo, consulta Magazord, retorna resultado
 * SEM DADOS MOCKADOS - Se não receber parâmetros, retorna erro
 */
export default async function handler(req, res) {
  console.log('========== BUSCAR PRODUTO ==========');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Unifica body + query params
    const params = { ...req.query, ...req.body };
    
    console.log('🔍 Todos os parâmetros recebidos:', params);
    
    // Extrai termo de busca - ACEITA QUALQUER VARIAÇÃO
    let termoBusca = 
      params.nome || 
      params.codigo || 
      params.produto || 
      params.mensagem || 
      params.search ||      // ← NOVO: Stevo usa "search"
      params.query ||       // ← NOVO: Pode usar "query"
      params.termo ||       // ← NOVO: Pode usar "termo"
      params.text ||        // ← NOVO: Pode usar "text"
      params.palavra ||     // ← NOVO: Pode usar "palavra"
      '';
    
    // Se AINDA vazio, pega QUALQUER valor string não vazio
    if (!termoBusca || termoBusca.trim() === '') {
      const todosValores = Object.values(params).filter(v => 
        v && 
        typeof v === 'string' && 
        v.trim().length > 0 && 
        v !== 'undefined' &&
        !isNaN(v) === false // não é número
      );
      
      if (todosValores.length > 0) {
        termoBusca = todosValores[0];
        console.log('⚡ Termo extraído automaticamente:', termoBusca);
      }
    }
    
    // VALIDAÇÃO: SEM PARÂMETROS = ERRO
    if (!termoBusca || termoBusca.trim() === '') {
      console.log('❌ ERRO: Nenhum parâmetro de busca fornecido');
      console.log('💡 Dica: Configure o Stevo para preencher "nome" ou "search" com o termo');
      return res.status(400).json({
        error: 'Parâmetro obrigatório não fornecido',
        mensagem: 'Você deve fornecer pelo menos um dos parâmetros: nome, search, codigo, produto ou mensagem',
        parametros_recebidos: params,
        dica: 'Configure o Stevo para extrair o termo da mensagem do cliente e preencher o parâmetro "nome"',
        exemplo: {
          nome: 'jaleco',
          limit: 10
        }
      });
    }

    const limit = parseInt(params.limit) || 10;
    
    console.log('🔍 Buscando:', termoBusca, '| Limit:', limit);

    // Credenciais do Magazord
    const BASE_URL = process.env.MAGAZORD_BASE_URL;
    const USER = process.env.MAGAZORD_USER;
    const PASS = process.env.MAGAZORD_PASS;

    if (!BASE_URL || !USER || !PASS) {
      console.log('❌ Variáveis de ambiente não configuradas');
      return res.status(500).json({
        error: 'Servidor não configurado corretamente',
        detalhes: 'Variáveis de ambiente ausentes'
      });
    }

    // Monta query para Magazord
    const magazordParams = new URLSearchParams({
      nome: termoBusca,
      limit: limit.toString()
    });

    const url = `${BASE_URL}/v2/site/produto?${magazordParams}`;
    console.log('🌐 URL:', url);

    // Autenticação Basic
    const auth = Buffer.from(`${USER}:${PASS}`).toString('base64');

    // Requisição ao Magazord
    console.log('📡 Consultando Magazord...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('📥 Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Erro Magazord:', errorText);
      return res.status(response.status).json({
        error: 'Erro ao consultar Magazord',
        status: response.status,
        detalhes: errorText
      });
    }

    const data = await response.json();
    const produtos = data?.data?.items || [];
    const total = data?.data?.total || 0;

    console.log('✅ Produtos encontrados:', total);

    // Limita produtos retornados (máximo 10 para não sobrecarregar)
    const produtosLimitados = produtos.slice(0, Math.min(limit, 10));
    console.log('📤 Retornando:', produtosLimitados.length, 'produtos');

    // Formata resposta com mensagem de texto clara
    const resultado = {
      sucesso: true,
      total_produtos: total,
      produtos_retornados: produtosLimitados.length,
      mensagem_para_cliente: total > 0 
        ? `Encontrei ${total} produto(s). Aqui estão os primeiros ${produtosLimitados.length}:`
        : `Não encontrei produtos com o termo "${termoBusca}".`,
      produtos: produtosLimitados.map(p => ({
        id: p.id,
        codigo: p.codigo,
        nome: p.nome,
        ativo: p.ativo,
        preco: p.preco_venda,
        preco_promocional: p.preco_venda_por,
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
      })),
      busca_realizada: {
        termo: termoBusca,
        limit: limit
      }
    };

    console.log('========== SUCESSO ==========\n');
    return res.status(200).json(resultado);

  } catch (error) {
    console.log('💥 ERRO:', error.message);
    console.log('Stack:', error.stack);
    console.log('========== ERRO ==========\n');
    
    return res.status(500).json({
      error: 'Erro interno do servidor',
      mensagem: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
