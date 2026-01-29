
import { app, prisma } from '../src/server';

async function runTests() {
  console.log('🟣 FASE 6 — Testes Manuais Automatizados');
  console.log('--------------------------------------------------');

  try {
    // 0. Limpar banco de dados (Opcional, mas bom para testes repetíveis)
    // Cuidado: isso apaga dados. Em dev tudo bem.
    console.log('🧹 Limpando banco de dados para teste...');
    await prisma.chamado.deleteMany();
    await prisma.user.deleteMany();

    // 1. Criar Usuário ADMIN
    console.log('\n📝 1. Criando Usuário ADMIN...');
    const adminRes = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        nome: 'Admin User',
        email: 'admin@test.com',
        senha: 'password123',
        role: 'ADMIN'
      }
    });
    console.log(`Status: ${adminRes.statusCode} (Esperado: 201)`);
    if (adminRes.statusCode !== 201) console.error(adminRes.json());

    // 2. Login ADMIN
    console.log('\n🔑 2. Login ADMIN...');
    const loginAdminRes = await app.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: 'admin@test.com',
        senha: 'password123'
      }
    });
    console.log(`Status: ${loginAdminRes.statusCode} (Esperado: 200)`);
    const adminToken = loginAdminRes.json().token;
    console.log('Token Admin obtido.');

    // 3. Criar Usuário COMUM
    console.log('\n📝 3. Criando Usuário COMUM...');
    const userRes = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        nome: 'Common User',
        email: 'user@test.com',
        senha: 'password123',
        role: 'USER'
      }
    });
    console.log(`Status: ${userRes.statusCode} (Esperado: 201)`);

    // 4. Login USER
    console.log('\n🔑 4. Login USER...');
    const loginUserRes = await app.inject({
      method: 'POST',
      url: '/users/login',
      payload: {
        email: 'user@test.com',
        senha: 'password123'
      }
    });
    const userToken = loginUserRes.json().token;
    console.log('Token User obtido.');

    // 5. Criar Chamado (USER)
    console.log('\n🎫 5. Criando Chamado (como USER)...');
    const chamadoRes = await app.inject({
      method: 'POST',
      url: '/chamados',
      headers: { Authorization: `Bearer ${userToken}` },
      payload: {
        titulo: 'Meu computador não liga',
        descricao: 'Aperto o botão e nada acontece.',
        prioridade: 'ALTA'
      }
    });
    console.log(`Status: ${chamadoRes.statusCode} (Esperado: 201)`);
    const chamadoId = chamadoRes.json().id;
    console.log(`Chamado criado com ID: ${chamadoId}`);

    // 6. Listar Chamados (USER)
    console.log('\n📋 6. Listar Chamados (como USER)...');
    const listUserRes = await app.inject({
      method: 'GET',
      url: '/chamados',
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log(`Status: ${listUserRes.statusCode} (Esperado: 200)`);
    console.log(`Quantidade encontrada: ${listUserRes.json().length}`);

    // 7. Listar Chamados (ADMIN)
    console.log('\n📋 7. Listar Chamados (como ADMIN)...');
    const listAdminRes = await app.inject({
      method: 'GET',
      url: '/chamados',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`Status: ${listAdminRes.statusCode} (Esperado: 200)`);
    console.log(`Quantidade encontrada: ${listAdminRes.json().length}`);

    // 8. Atualizar Chamado (ADMIN muda status)
    console.log('\n✏️  8. Atualizar Chamado (ADMIN muda status para EM_ANDAMENTO)...');
    const updateRes = await app.inject({
      method: 'PATCH',
      url: `/chamados/${chamadoId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      payload: {
        status: 'EM_ANDAMENTO'
      }
    });
    console.log(`Status: ${updateRes.statusCode} (Esperado: 200)`);
    console.log(`Novo Status: ${updateRes.json().status}`);

    // 9. Deletar Chamado (ADMIN)
    console.log('\n🗑️  9. Deletar Chamado (ADMIN)...');
    const deleteRes = await app.inject({
      method: 'DELETE',
      url: `/chamados/${chamadoId}`,
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`Status: ${deleteRes.statusCode} (Esperado: 204)`);

    // 10. Verificar Deleção
    console.log('\n🔍 10. Verificar se foi deletado...');
    const checkRes = await app.inject({
      method: 'GET',
      url: `/chamados/${chamadoId}`,
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`Status: ${checkRes.statusCode} (Esperado: 404)`);

    // 11. Teste de Erro (Acesso sem token)
    console.log('\n🚫 11. Teste de Acesso Negado (Sem Token)...');
    const errorRes = await app.inject({
      method: 'GET',
      url: '/chamados'
    });
    console.log(`Status: ${errorRes.statusCode} (Esperado: 401)`);

    // 12. Teste de Validação (Zod)
    console.log('\n🛡️ 12. Teste de Validação (Senha curta)...');
    const validationRes = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        nome: 'Invalid User',
        email: 'invalid@test.com',
        senha: '123' // Muito curta (min 6)
      }
    });
    console.log(`Status: ${validationRes.statusCode} (Esperado: 400)`);
    console.log(`Mensagem: ${validationRes.json().message}`);

    console.log('\n--------------------------------------------------');
    console.log('✅ Todos os testes manuais automatizados concluídos!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
