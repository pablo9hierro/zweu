// Parser de texto estruturado para Magazord
export default async function handler(req, res) {
  console.log('==================== 📥 TEXTO RECEBIDO ====================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Pega o texto de qualquer lugar (body, query, ou parâmetro text)
    let textoRecebido = '';
    
    if (typeof req.body === 'string') {
      textoRecebido = req.body;
    } else if (req.body?.text || req.body?.message || req.body?.query) {
      textoRecebido = req.body.text || req.body.message || req.body.query;
    } else if (req.query?.text || req.query?.message || req.query?.query) {
      textoRecebido = req.query.text || req.query.message || req.query.query;
    } else {
      // Se veio JSON, pega primeiro valor string
      const firstValue = Object.values(req.body || req.query || {})[0];
      if (typeof firstValue === 'string') {
        textoRecebido = firstValue;
      }
    }

    console.log('📝 Texto extraído:', textoRecebido);

    if (!textoRecebido) {
      console.log('❌ Nenhum texto encontrado');
      return res.status(400).json({ 
        error: 'Nenhum texto recebido',
        exemplo: '<busca><acao>buscar_produto</acao><nome>jaleco</nome><limit>10</limit></busca>'
      });
    }

    // Parser das tags XML
    const extrairTag = (texto, tag) => {
      const regex = new RegExp(`<${tag}>([^<]+)</${tag}>`, 'i');
      const match = texto.match(regex);
      return match ? match[1].trim() : null;
    };

    const acao = extrairTag(textoRecebido, 'acao');
    const nome = extrairTag(textoRecebido, 'nome');
    const codigo = extrairTag(textoRecebido, 'codigo');
    const categoria = extrairTag(textoRecebido, 'categoria');
    const limit = extrairTag(textoRecebido, 'limit') || '10';

    console.log('🔍 Campos extraídos:');
    console.log('  - acao:', acao);
    console.log('  - nome:', nome);
    console.log('  - codigo:', codigo);
    console.log('  - categoria:', categoria);
    console.log('  - limit:', limit);

    if (acao !== 'buscar_produto') {
      return res.status(400).json({
        error: 'Ação desconhecida',
        recebido: acao,
        esperado: 'buscar_produto'
      });
    }

    // Monta query para Magazord
    const query = { limit: parseInt(limit) };
    if (nome) query.nome = nome;
    if (codigo) query.codigo = codigo;
    if (categoria) query.categoria = parseInt(categoria);

    console.log('🔧 Query montada:', query);

    // Credenciais
    const BASE_URL = process.env.MAGAZORD_BASE_URL;
    const USER = process.env.MAGAZORD_USER;
    const PASS = process.env.MAGAZORD_PASS;

    if (!BASE_URL || !USER || !PASS) {
      console.log('❌ Env vars faltando');
      return res.status(500).json({ error: 'Configuração incorreta' });
    }

    // Monta URL
    const params = new URLSearchParams(query).toString();
    const fullUrl = `${BASE_URL}/v2/site/produto?${params}`;
    console.log('🌐 URL Magazord:', fullUrl);

    // Busca
    const authToken = Buffer.from(`${USER}:${PASS}`).toString('base64');
    console.log('🚀 Chamando Magazord...');
    
    const apiResponse = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await apiResponse.json();
    const total = data?.data?.total || 0;
    const items = data?.data?.items || [];

    console.log('📦 Total produtos:', total);
    console.log('📋 Produtos retornados:', items.length);

    // Monta resposta em XML
    let xmlProdutos = '';
    items.slice(0, 5).forEach(p => {
      xmlProdutos += `
  <produto>
    <id>${p.id}</id>
    <nome>${p.nome || 'Sem nome'}</nome>
    <codigo>${p.codigo || 'Sem código'}</codigo>
    <preco>${p.preco_venda_por || '0.00'}</preco>
    <ativo>${p.ativo ? 'sim' : 'nao'}</ativo>
  </produto>`;
    });

    const xmlResposta = `<resposta>
<status>sucesso</status>
<total>${total}</total>
<mostrados>${items.slice(0, 5).length}</mostrados>
<produtos>${xmlProdutos}
</produtos>
</resposta>`;

    console.log('✅ Resposta montada (XML)');
    console.log('==================== FIM ====================\n');

    return res.status(200).send(xmlResposta);

  } catch (error) {
    console.log('💥 ERRO:', error.message);
    console.log('Stack:', error.stack);
    console.log('==================== FIM COM ERRO ====================\n');
    
    const xmlErro = `<resposta>
<status>erro</status>
<mensagem>${error.message}</mensagem>
</resposta>`;

    return res.status(500).send(xmlErro);
  }
}
