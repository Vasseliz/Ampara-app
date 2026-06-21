# language: pt
Funcionalidade: Convites

  Cenário: Profissional convida um paciente
    Dado um profissional autenticado
    Quando ele convida um paciente por e-mail
    Então o convite fica pendente de aceite

  Cenário: Paciente lista convites recebidos
    Dado um paciente com um convite pendente
    Quando ele abre a tela de convites
    Então o convite do profissional aparece

  Cenário: Paciente aceita convite
    Dado um paciente com um convite pendente
    Quando ele aceita o convite
    Então o vínculo com o profissional é criado

  Cenário: Convite via deep link abre a tela de aceite
    Dado um paciente com um convite pendente
    Quando ele abre o deep link do convite no app
    Então a tela de aceite é exibida
