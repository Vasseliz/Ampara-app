# language: pt
Funcionalidade: Humor

  Cenário: Paciente registra o humor do dia
    Dado um paciente autenticado
    Quando ele registra seu humor do dia
    Então o humor aparece no histórico

  Cenário: Paciente vê o histórico de humor
    Dado um paciente com registros de humor
    Quando ele abre o histórico
    Então os registros anteriores são exibidos

  Cenário: Profissional acompanha o humor do paciente
    Dado um profissional vinculado a um paciente
    Quando ele abre o humor do paciente
    Então ele vê os registros do paciente
