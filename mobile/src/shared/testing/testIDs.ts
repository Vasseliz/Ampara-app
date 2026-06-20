/**
 * Mapa central de testIDs. Convenção: `feature.tela.elemento`.
 * As tracks A/B/C estendem este objeto com seus próprios namespaces.
 * Usar sempre a constante (nunca string literal) ao marcar componentes.
 */
export const testIDs = {
  auth: {
    login: {
      email: 'auth.login.email',
      password: 'auth.login.password',
      submit: 'auth.login.submit',
      error: 'auth.login.error',
    },
    register: {
      email: 'auth.register.email',
      password: 'auth.register.password',
      submit: 'auth.register.submit',
    },
  },
  components: {
    button: 'components.button',
    textField: 'components.textField',
    passwordField: 'components.passwordField',
    passwordToggle: 'components.passwordField.toggle',
    toast: 'components.toast',
  },
} as const;
