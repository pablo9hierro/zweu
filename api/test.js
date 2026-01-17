// Endpoint ULTRA SIMPLES para testar conexão Stevo → Vercel
// Aceita QUALQUER coisa e retorna sucesso
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Retorna sucesso para QUALQUER requisição
  return res.status(200).json({
    status: 'success',
    message: '✅ CONEXÃO FUNCIONANDO! Stevo conectou com Vercel!',
    received: {
      method: req.method,
      body: req.body || {},
      query: req.query || {},
      timestamp: new Date().toISOString()
    }
  });
}
