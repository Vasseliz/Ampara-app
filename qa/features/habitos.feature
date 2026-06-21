# language: pt
Funcionalidade: Hábitos

  Cenário: Paciente marca um hábito do dia
    Dado um paciente autenticado
    Quando ele marca um hábito como concluído
    Então o hábito fica marcado no dia

  Cenário: Paciente desmarca um hábito
    Dado um hábito marcado no dia
    Quando o paciente o desmarca
    Então o hábito volta a ficar pendente

  Cenário: Paciente vê o histórico de hábitos
    Dado um paciente com histórico de hábitos
    Quando ele abre o histórico
    Então a sequência de dias é exibida
