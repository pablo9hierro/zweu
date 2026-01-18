export default async function handler(req, res) {
  console.log('==================== 🚀 NOVA REQUISIÇÃO ====================');
  console.log('🕒 Timestamp:', new Date().toISOString());
  console.log('📡 Método HTTP:', req.method);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('📦 Body RAW:', JSON.stringify(req.body, null, 2));
  console.log('🔗 Query params:', JSON.stringify(req.query, null, 2));
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight OPTIONS - retornando 200');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('❌ Método inválido:', req.method);
    return res.status(405).json({ error: 'Apenas POST' });
  }

  try {
    console.log('🔍 Extraindo dados do body...');
    const { method, endpoint, query, body } = req.body;
    console.log('📝 method:', method);
    console.log('📝 endpoint:', endpoint);
    console.log('📝 query:', JSON.stringify(query, null, 2));
    console.log('📝 body:', JSON.stringify(body, null, 2));

    if (!method || !endpoint) {
      console.log('❌ ERRO: Campos obrigatórios faltando!');
      console.log('   - method:', method ? '✅' : '❌ FALTANDO');
      console.log('   - endpoint:', endpoint ? '✅' : '❌ FALTANDO');
      return res.status(400).json({ 
        error: 'method e endpoint obrigatórios',
        received: { method, endpoint }
      });
    }

    console.log('🔐 Verificando env vars...');
    const BASE_URL = process.env.MAGAZORD_BASE_URL;
    const USER = process.env.MAGAZORD_USER;
    const PASS = process.env.MAGAZORD_PASS;
    console.log('   - MAGAZORD_BASE_URL:', BASE_URL ? '✅' : '❌');
    console.log('   - MAGAZORD_USER:', USER ? '✅' : '❌');
    console.log('   - MAGAZORD_PASS:', PASS ? '✅' : '❌');

    if (!BASE_URL || !USER || !PASS) {
      console.log('❌ ERRO: Variáveis de ambiente faltando!');
      return res.status(500).json({
        error: 'Variáveis de ambiente não configuradas',
        hasBaseUrl: !!BASE_URL,
        hasUser: !!USER,
        hasPass: !!PASS
      });
    }

    console.log('🔧 Montando URL completa...');
    let fullUrl = BASE_URL + endpoint;
    if (query && Object.keys(query).length > 0) {
      const params = new URLSearchParams(query);
      fullUrl += '?' + params.toString();
    }
    console.log('🌐 URL final:', fullUrl);

    console.log('🔑 Gerando token Basic Auth...');
    const authToken = Buffer.from(USER + ':' + PASS).toString('base64');
    console.log('✅ Token gerado (primeiros 20 chars):', authToken.substring(0, 20) + '...');
    
    console.log('📤 Preparando requisição para Magazord...');
    const fetchOptions = {
      method: method.toUpperCase(),
      headers: {
        'Authorization': 'Basic ' + authToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    console.log('   - Método:', fetchOptions.method);
    console.log('   - Headers:', JSON.stringify(fetchOptions.headers, null, 2));

    if (body && !['GET', 'DELETE'].includes(method.toUpperCase())) {
      fetchOptions.body = JSON.stringify(body);
      console.log('   - Body:', fetchOptions.body);
    }

    console.log('🚀 Fazendo fetch para Magazord...');
    const apiResponse = await fetch(fullUrl, fetchOptions);
    console.log('📥 Resposta recebida!');
    console.log('   - Status:', apiResponse.status);
    console.log('   - Status Text:', apiResponse.statusText);
    console.log('   - OK?:', apiResponse.ok);
    
    const responseData = await apiResponse.json();
    console.log('📦 Dados parseados:', JSON.stringify(responseData, null, 2).substring(0, 500) + '...');

    const finalResponse = {
      success: apiResponse.ok,
      status: apiResponse.status,
      data: responseData
    };
    
    console.log('✅ Retornando resposta final para Stevo');
    console.log('==================== FIM DA REQUISIÇÃO ====================\n');
    
    return res.status(apiResponse.status).json(finalResponse);

  } catch (error) {
    console.log('💥 ERRO CAPTURADO!');
    console.log('   - Mensagem:', error.message);
    console.log('   - Stack:', error.stack);
    console.log('==================== FIM COM ERRO ====================\n');
    
    return res.status(500).json({
      error: 'Erro no proxy',
      message: error.message,
      stack: error.stack
    });
  }
}
