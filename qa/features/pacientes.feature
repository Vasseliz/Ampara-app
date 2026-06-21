# language: pt
Funcionalidade: Pacientes

  Contexto:
    Dado um profissional vinculado a um paciente

  Cenário: Listar pacientes
    Quando o profissional abre a lista de pacientes
    Então o paciente vinculado aparece

  Cenário: Visão geral do paciente
    Quando o profissional abre a visão geral do paciente
    Então os dados resumidos do paciente são exibidos

  Cenário: Ver e editar informações clínicas
    Quando o profissional edita as informações clínicas do paciente
    Então as alterações são salvas
