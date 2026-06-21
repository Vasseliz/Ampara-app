# language: pt
Funcionalidade: Cofre

  Cenário: Paciente cria item no cofre
    Dado um paciente autenticado
    Quando ele adiciona um item ao cofre
    Então o item aparece na lista do cofre

  Cenário: Paciente exclui item do cofre
    Dado um item no cofre
    Quando o paciente o exclui
    Então o item some da lista

  Cenário: Gate de biometria protege o acesso ao cofre
    Dado um paciente com biometria habilitada
    Quando ele abre o cofre no app
    Então a autenticação biométrica é solicitada
