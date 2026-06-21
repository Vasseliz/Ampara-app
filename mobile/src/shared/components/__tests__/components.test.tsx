import { fireEvent, render } from '@testing-library/react-native';
import { Button } from '../Button';
import { TextField } from '../TextField';
import { PasswordField } from '../PasswordField';
import { testIDs } from '../../testing/testIDs';

describe('Button', () => {
  it('repassa testID e dispara onPress', async () => {
    const onPress = jest.fn();
    const { getByTestId } = await render(<Button label="Entrar" onPress={onPress} testID="btn" />);

    await fireEvent.press(getByTestId('btn'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não dispara onPress quando disabled ou loading', async () => {
    const onPress = jest.fn();
    const { getByTestId, rerender } = await render(
      <Button label="Entrar" onPress={onPress} disabled testID="btn" />,
    );
    await fireEvent.press(getByTestId('btn'));

    await rerender(<Button label="Entrar" onPress={onPress} loading testID="btn" />);
    await fireEvent.press(getByTestId('btn'));

    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('TextField', () => {
  it('repassa accessibilityLabel e valor controlado', async () => {
    const onChangeText = jest.fn();
    const { getByTestId } = await render(
      <TextField
        label="E-mail"
        value="a@b.com"
        onChangeText={onChangeText}
        testID="email"
        accessibilityLabel="E-mail"
      />,
    );

    const input = getByTestId('email');
    expect(input.props.value).toBe('a@b.com');

    await fireEvent.changeText(input, 'novo@b.com');
    expect(onChangeText).toHaveBeenCalledWith('novo@b.com');
  });
});

describe('PasswordField', () => {
  it('inicia oculto e alterna a visibilidade do texto', async () => {
    const { getByTestId } = await render(
      <PasswordField label="Senha" value="segredo" onChangeText={jest.fn()} testID="pwd" />,
    );

    expect(getByTestId('pwd').props.secureTextEntry).toBe(true);

    await fireEvent.press(getByTestId(testIDs.components.passwordToggle));
    expect(getByTestId('pwd').props.secureTextEntry).toBe(false);
  });
});
