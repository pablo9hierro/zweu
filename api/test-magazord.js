// Endpoint para testar CONEXÃO COMPLETA: Stevo → Vercel → Magazord
// Faz uma busca FIXA (hardcoded) no Magazord para validar toda a cadeia
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // BUSCA FIXA: Buscar produtos "jaleco" (limit 3)
    const magazordUrl = `${process.env.MAGAZORD_BASE_URL}/v2/site/produto?nome=jaleco&limit=3`;
    
    const credentials = Buffer.from(
      `${process.env.MAGAZORD_USER}:${process.env.MAGAZORD_PASS}`
    ).toString('base64');

    console.log('🔍 Buscando no Magazord:', magazordUrl);

    const magazordResponse = await fetch(magazordUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    const magazordData = await magazordResponse.json();

    // Retorna resultado completo
    return res.status(200).json({
      status: 'success',
      message: '✅ CONEXÃO COMPLETA FUNCIONANDO! Stevo → Vercel → Magazord',
      flow: 'Stevo → Vercel → Magazord API → Vercel → Stevo',
      magazord_status: magazordResponse.status,
      produtos_encontrados: magazordData?.data?.total || 0,
      primeiros_produtos: magazordData?.data?.items?.slice(0, 3).map(p => ({
        id: p.id,
        nome: p.nome,
        codigo: p.codigo
      })) || [],
      busca_realizada: {
        url: magazordUrl,
        parametros: { nome: 'jaleco', limit: 3 }
      }
    });

  } catch (error) {
    console.error('❌ Erro ao conectar com Magazord:', error);
    return res.status(500).json({
      status: 'error',
      message: '❌ ERRO ao conectar com Magazord',
      error: error.message,
      flow: 'Stevo → Vercel → ❌ Magazord (FALHOU)'
    });
  }
}
