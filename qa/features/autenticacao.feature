# language: pt
Funcionalidade: Autenticação

  Cenário: Login com credenciais válidas
    Dado um usuário cadastrado
    Quando ele entra com e-mail e senha corretos
    Então ele acessa a área autenticada

  Cenário: Login com credenciais inválidas
    Quando o usuário entra com senha incorreta
    Então uma mensagem de erro é exibida

  Cenário: Cadastro de conta de paciente
    Quando um visitante preenche o cadastro como paciente
    Então a conta é criada e ele consegue entrar

  Cenário: Logout encerra a sessão
    Dado um usuário autenticado
    Quando ele faz logout
    Então ele é redirecionado para o login

  Cenário: Rota protegida redireciona sem sessão
    Dado um visitante sem sessão
    Quando ele acessa uma rota protegida
    Então ele é levado para o login
