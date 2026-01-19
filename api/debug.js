// Endpoint DEBUG - mostra TUDO que Stevo envia
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('=== DEBUG COMPLETO ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('=====================');

  return res.status(200).json({
    message: '✅ DEBUG - Recebi sua requisição!',
    what_i_received: {
      method: req.method,
      headers: req.headers,
      body: req.body,
      query: req.query,
      url: req.url
    }
  });
}
