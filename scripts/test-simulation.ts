
import { app, prisma } from '../src/server';

// --- Utilitários de Formatação para Terminal ---
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
};

const icons = {
  success: '✅',
  fail: '❌',
  info: 'ℹ️',
  step: '👉',
  warn: '⚠️',
  key: '🔑',
  db: '🗄️',
  lock: '🛡️'
};

const log = {
  title: (msg: string) => console.log(`\n${colors.bright}${colors.magenta}=== ${msg} ===${colors.reset}`),
  step: (msg: string) => console.log(`\n${colors.cyan}${icons.step} ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`   ${colors.gray}${msg}${colors.reset}`),
  success: (msg: string) => console.log(`   ${colors.green}${icons.success} ${msg}${colors.reset}`),
  fail: (msg: string) => console.log(`   ${colors.red}${icons.fail} ${msg}${colors.reset}`),
  json: (data: any) => console.log(`${colors.dim}${JSON.stringify(data, null, 2).split('\n').map(l => '     ' + l).join('\n')}${colors.reset}`),
  divider: () => console.log(`${colors.gray}--------------------------------------------------${colors.reset}`)
};

// Helper de Asserção
function assert(condition: boolean, msg: string, details?: any) {
  if (condition) {
    log.success(msg);
  } else {
    log.fail(msg);
    if (details) log.json(details);
  }
}

async function runTests() {
  console.clear();
  log.title('FASE 6 — TESTES MANUAIS AUTOMATIZADOS');
  log.info('Iniciando sequência de verificação da API...');
  log.divider();

  try {
    // 0. Preparação
    log.step('0. Preparação de Ambiente');
    log.info('Limpando banco de dados para garantir estado limpo...');
    await prisma.chamado.deleteMany();
    await prisma.user.deleteMany();
    log.success('Banco de dados limpo com sucesso.');

    // 1. Criar Usuário ADMIN
    log.step('1. Criar Usuário ADMIN');
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
    assert(adminRes.statusCode === 201, `Status Code: ${adminRes.statusCode} (Criado)`, adminRes.json());

    // 2. Login ADMIN
    log.step('2. Login ADMIN');
    const loginAdminRes = await app.inject({
      method: 'POST',
      url: '/users/login',
      payload: { email: 'admin@test.com', senha: 'password123' }
    });
    assert(loginAdminRes.statusCode === 200, `Login efetuado. Status: ${loginAdminRes.statusCode}`);
    const adminToken = loginAdminRes.json().token;
    assert(!!adminToken, 'Token JWT recebido');

    // 3. Criar Usuário COMUM
    log.step('3. Criar Usuário COMUM');
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
    assert(userRes.statusCode === 201, `Usuário Comum criado. Status: ${userRes.statusCode}`);

    // 4. Login USER
    log.step('4. Login USER');
    const loginUserRes = await app.inject({
      method: 'POST',
      url: '/users/login',
      payload: { email: 'user@test.com', senha: 'password123' }
    });
    const userToken = loginUserRes.json().token;
    assert(loginUserRes.statusCode === 200 && !!userToken, 'Login USER realizado com sucesso');

    // 5. Criar Chamado (USER)
    log.step('5. Criar Chamado (como USER)');
    const chamadoRes = await app.inject({
      method: 'POST',
      url: '/chamados',
      headers: { Authorization: `Bearer ${userToken}` },
      payload: {
        titulo: 'Meu computador não liga',
        descricao: 'Aperto o botão e nada acontece.',
        prioridade: 'ALTA' // Backend deve ignorar se a regra estiver ativa, ou aceitar
      }
    });
    assert(chamadoRes.statusCode === 201, `Chamado criado. Status: ${chamadoRes.statusCode}`);
    const chamadoId = chamadoRes.json().id;
    log.info(`ID do Chamado: ${chamadoId}`);

    // 6. Listar Chamados (USER)
    log.step('6. Listar Chamados (como USER)');
    const listUserRes = await app.inject({
      method: 'GET',
      url: '/chamados',
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const userCount = listUserRes.json().length;
    assert(listUserRes.statusCode === 200, `Listagem OK. Status: ${listUserRes.statusCode}`);
    assert(userCount === 1, `Quantidade correta encontrada: ${userCount}`);

    // 7. Listar Chamados (ADMIN)
    log.step('7. Listar Chamados (como ADMIN)');
    const listAdminRes = await app.inject({
      method: 'GET',
      url: '/chamados',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminCount = listAdminRes.json().length;
    assert(listAdminRes.statusCode === 200, `Listagem Admin OK. Status: ${listAdminRes.statusCode}`);
    assert(adminCount >= 1, `Admin vê todos os chamados. Encontrados: ${adminCount}`);

    // 8. Atualizar Chamado (ADMIN muda status)
    log.step('8. Atualizar Chamado (ADMIN muda status)');
    const updateRes = await app.inject({
      method: 'PATCH',
      url: `/chamados/${chamadoId}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      payload: { status: 'EM_ANDAMENTO' }
    });
    const updatedStatus = updateRes.json().status;
    assert(updateRes.statusCode === 200, `Atualização realizada. Status: ${updateRes.statusCode}`);
    assert(updatedStatus === 'EM_ANDAMENTO', `Novo Status confirmado: ${updatedStatus}`);

    // 9. Deletar Chamado (ADMIN)
    log.step('9. Deletar Chamado (ADMIN)');
    const deleteRes = await app.inject({
      method: 'DELETE',
      url: `/chamados/${chamadoId}`,
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(deleteRes.statusCode === 204, `Chamado deletado. Status: ${deleteRes.statusCode}`);

    // 10. Verificar Deleção
    log.step('10. Verificar Deleção');
    const checkRes = await app.inject({
      method: 'GET',
      url: `/chamados/${chamadoId}`,
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(checkRes.statusCode === 404, `Chamado não existe mais. Status: ${checkRes.statusCode}`);

    // 11. Teste de Acesso Negado
    log.step('11. Teste de Segurança (Sem Token)');
    const errorRes = await app.inject({
      method: 'GET',
      url: '/chamados'
    });
    assert(errorRes.statusCode === 401, `Acesso bloqueado corretamente. Status: ${errorRes.statusCode}`);

    // 12. Teste de Validação (Zod)
    log.step('12. Teste de Validação (Senha Curta)');
    const validationRes = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        nome: 'Invalid User',
        email: 'invalid@test.com',
        senha: '123'
      }
    });
    assert(validationRes.statusCode === 400, `Erro de validação capturado. Status: ${validationRes.statusCode}`);
    log.info(`Mensagem de erro: "${validationRes.json().message}"`);

    log.divider();
    console.log(`\n${colors.bright}${colors.green}🎉 SUCESSO! Todos os testes passaram sem erros.${colors.reset}\n`);

  } catch (error) {
    console.error(`\n${colors.bright}${colors.red}❌ FATAL ERROR: Ocorreu um erro inesperado.${colors.reset}`);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
