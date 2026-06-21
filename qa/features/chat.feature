# language: pt
Funcionalidade: Chat

  Cenário: Listar conversas
    Dado um usuário com conversas
    Quando ele abre o chat
    Então a lista de conversas é exibida

  Cenário: Enviar mensagem
    Dado uma conversa aberta
    Quando o usuário envia uma mensagem
    Então a mensagem aparece na conversa
