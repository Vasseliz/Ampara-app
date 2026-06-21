# language: pt
Funcionalidade: Cenários cross-platform (web ↔ app)

  @cross
  Cenário: Medicamento prescrito no web e tomado no app reflete a adesão
    Dado um profissional vinculado a um paciente
    Quando o profissional prescreve "Sertralina 50mg" no web
    E o paciente marca a tomada no app
    Então o profissional vê a adesão atualizada no web

  @cross
  Cenário: Convite criado no web e aceito por deep link no app
    Dado um profissional autenticado no web
    Quando ele convida o paciente por e-mail no web
    E o paciente abre o deep link do convite no app e aceita
    Então o vínculo aparece para os dois

  @cross
  Cenário: Humor registrado no app aparece para o profissional no web
    Dado um profissional vinculado a um paciente
    Quando o paciente registra o humor no app
    Então o profissional vê o registro no web

  @cross
  Cenário: Mensagem enviada no web é recebida e respondida no app
    Dado um profissional vinculado a um paciente
    Quando o profissional envia uma mensagem no web
    E o paciente responde no app
    Então o profissional vê a resposta no web
