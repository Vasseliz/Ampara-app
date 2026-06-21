# language: pt
Funcionalidade: Medicamentos do paciente

  Contexto:
    Dado um profissional vinculado a um paciente

  Cenário: Profissional prescreve medicamento
    Quando o profissional cadastra "Sertralina 50mg" para o paciente
    Então o medicamento aparece na lista do paciente

  Cenário: Profissional edita medicamento
    Dado um medicamento prescrito
    Quando o profissional altera a dose
    Então a nova dose é refletida na lista do paciente

  Cenário: Profissional exclui medicamento
    Dado um medicamento prescrito
    Quando o profissional o exclui
    Então ele some da lista do paciente

  Cenário: Paciente marca a tomada
    Dado um medicamento prescrito
    Quando o paciente marca a tomada
    Então a adesão do dia é atualizada
