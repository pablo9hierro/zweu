export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Apenas POST' });
  }

  try {
    const { method, endpoint, query, body } = req.body;

    if (!method || !endpoint) {
      return res.status(400).json({ error: 'method e endpoint obrigatórios' });
    }

    const BASE_URL = process.env.MAGAZORD_BASE_URL;
    const USER = process.env.MAGAZORD_USER;
    const PASS = process.env.MAGAZORD_PASS;

    if (!BASE_URL || !USER || !PASS) {
      return res.status(500).json({
        error: 'Variáveis de ambiente não configuradas',
        hasBaseUrl: !!BASE_URL,
        hasUser: !!USER,
        hasPass: !!PASS
      });
    }

    let fullUrl = BASE_URL + endpoint;
    if (query && Object.keys(query).length > 0) {
      const params = new URLSearchParams(query);
      fullUrl += '?' + params.toString();
    }

    const authToken = Buffer.from(USER + ':' + PASS).toString('base64');
    
    const fetchOptions = {
      method: method.toUpperCase(),
      headers: {
        'Authorization': 'Basic ' + authToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (body && !['GET', 'DELETE'].includes(method.toUpperCase())) {
      fetchOptions.body = JSON.stringify(body);
    }

    const apiResponse = await fetch(fullUrl, fetchOptions);
    const responseData = await apiResponse.json();

    return res.status(apiResponse.status).json({
      success: apiResponse.ok,
      status: apiResponse.status,
      data: responseData
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Erro no proxy',
      message: error.message
    });
  }
}
