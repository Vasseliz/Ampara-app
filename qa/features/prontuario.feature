# language: pt
Funcionalidade: Prontuário

  Contexto:
    Dado um profissional vinculado a um paciente

  Cenário: Acesso ao prontuário
    Quando o profissional abre o prontuário do paciente
    Então as notas existentes são exibidas

  Cenário: CRUD de notas
    Quando o profissional cria, edita e exclui uma nota
    Então cada operação reflete na lista de notas

  Cenário: Filtros de pacientes
    Quando o profissional filtra a lista de pacientes
    Então apenas os pacientes correspondentes aparecem
