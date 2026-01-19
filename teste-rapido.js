#!/usr/bin/env node

/**
 * Script de teste rápido para o endpoint /api/buscar-produto
 * 
 * Uso:
 *   node teste-rapido.js
 */

const ENDPOINT = 'https://zweu.vercel.app/api/buscar-produto';
// Para teste local: const ENDPOINT = 'http://localhost:3000/api/buscar-produto';

const testes = [
  {
    nome: 'Teste 1: Busca por nome (jaleco)',
    body: {
      nome: 'jaleco',
      limit: 5
    }
  },
  {
    nome: 'Teste 2: Busca por código',
    body: {
      codigo: '300-MC-049',
      limit: 1
    }
  },
  {
    nome: 'Teste 3: Busca genérica (gorro)',
    body: {
      produto: 'gorro',
      limit: 3
    }
  },
  {
    nome: 'Teste 4: Erro - SEM parâmetros (deve retornar 400)',
    body: {},
    esperaErro: true
  }
];

async function executarTeste(teste) {
  console.log('\n' + '═'.repeat(60));
  console.log(`🧪 ${teste.nome}`);
  console.log('═'.repeat(60));
  console.log('📤 Request:', JSON.stringify(teste.body, null, 2));

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(teste.body)
    });

    console.log('📥 Status:', response.status, response.statusText);

    const data = await response.json();

    if (teste.esperaErro) {
      if (!response.ok) {
        console.log('✅ PASSOU - Retornou erro como esperado');
        console.log('📦 Resposta:', JSON.stringify(data, null, 2));
      } else {
        console.log('❌ FALHOU - Deveria retornar erro mas retornou sucesso');
      }
    } else {
      if (response.ok) {
        console.log('✅ PASSOU - Retornou sucesso');
        console.log('📦 Total produtos:', data.total_produtos);
        console.log('📦 Produtos retornados:', data.produtos?.length || 0);
        
        if (data.produtos?.length > 0) {
          const primeiro = data.produtos[0];
          console.log('\n📋 Primeiro produto:');
          console.log('  - Nome:', primeiro.nome);
          console.log('  - Código:', primeiro.codigo);
          console.log('  - Preço:', primeiro.preco);
          console.log('  - Estoque:', primeiro.estoque_disponivel);
          console.log('  - Imagens:', primeiro.imagens?.length || 0);
          console.log('  - Derivações:', primeiro.derivacoes?.length || 0);
        }
      } else {
        console.log('❌ FALHOU - Retornou erro inesperado');
        console.log('📦 Resposta:', JSON.stringify(data, null, 2));
      }
    }

  } catch (error) {
    console.log('❌ ERRO:', error.message);
  }
}

async function executarTodos() {
  console.log('🚀 Iniciando testes do endpoint /api/buscar-produto');
  console.log('🌐 Endpoint:', ENDPOINT);

  for (const teste of testes) {
    await executarTeste(teste);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✅ Testes concluídos!');
  console.log('═'.repeat(60));
}

// Executa
executarTodos().catch(console.error);
