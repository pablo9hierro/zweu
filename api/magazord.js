/**
 * Proxy HTTP para API do Magazord
 * Endpoint: POST /api/magazord
 * CORS ULTRA ROBUSTO
 */

export default async function handler(req, res) {
  // FUNÇÃO AUXILIAR: Adicionar headers CORS em TODAS as respostas
  const setCorsHeaders = (response) => {
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    response.setHeader('Access-Control-Expose-Headers', '*');
    response.setHeader('Access-Control-Max-Age', '86400');
    return response;
  };

  // Aplicar CORS em TODAS as respostas
  setCorsHeaders(res);

  // Responder imediatamente ao preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Permitir apenas POST (além de OPTIONS)
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Método não permitido',
      allowedMethods: ['POST', 'OPTIONS'] 
    });
  }

  try {
    // Extrair dados do body
    const { method, endpoint, query, body } = req.body;

    // Validar campos obrigatórios
    if (!method || !endpoint) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes',
        required: ['method', 'endpoint']
      });
    }

    // Validar método HTTP
    const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    if (!allowedMethods.includes(method.toUpperCase())) {
      return res.status(400).json({
        error: 'Método HTTP inválido',
        allowedMethods
      });
    }

    // Credenciais da API (via variáveis de ambiente)
    const BASE_URL = process.env.MAGAZORD_BASE_URL;
    const USER = process.env.MAGAZORD_USER;
    const PASS = process.env.MAGAZORD_PASS;

    // Verificar se as credenciais estão configuradas
    if (!BASE_URL || !USER || !PASS) {
      return res.status(500).json({
        error: 'Configuração do servidor incompleta',
        message: 'Variáveis de ambiente não configuradas'
      });
    }

    // Montar URL com query params
    let fullUrl = ${BASE_URL};
    if (query && Object.keys(query).length > 0) {
      const params = new URLSearchParams(query);
      fullUrl += ?;
    }

    // Preparar headers
    const authToken = Buffer.from(${USER}:).toString('base64');
    const headers = {
      'Authorization': Basic ,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Preparar opções do fetch
    const fetchOptions = {
      method: method.toUpperCase(),
      headers
    };

    // Adicionar body se não for GET ou DELETE
    if (body && !['GET', 'DELETE'].includes(method.toUpperCase())) {
      fetchOptions.body = JSON.stringify(body);
    }

    // Fazer requisição para API Magazord
    const apiResponse = await fetch(fullUrl, fetchOptions);
    
    // Pegar resposta como JSON
    let responseData;
    const contentType = apiResponse.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await apiResponse.json();
    } else {
      const text = await apiResponse.text();
      responseData = { response: text };
    }

    // Garantir CORS novamente antes de retornar
    setCorsHeaders(res);

    // Retornar resposta com mesmo status da API
    return res.status(apiResponse.status).json({
      success: apiResponse.ok,
      status: apiResponse.status,
      data: responseData
    });

  } catch (error) {
    console.error('Erro no proxy:', error);
    
    // Garantir CORS mesmo em erro
    setCorsHeaders(res);
    
    return res.status(500).json({
      error: 'Erro ao processar requisição',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
