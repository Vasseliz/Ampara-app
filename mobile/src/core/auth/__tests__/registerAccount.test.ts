import { registerAccount, type RegisterInput } from '../authService';
import { ApiError } from '../../api/errors';
import type { ApiClient } from '../../api/client';

const input: RegisterInput = {
  role: 'patient',
  firstName: 'Ana',
  lastName: 'Silva',
  email: 'ana@b.com',
  password: '12345678',
  registrationId: null,
};

describe('registerAccount', () => {
  it('faz POST /auth/register com o payload completo', async () => {
    const request = jest.fn().mockResolvedValue({ message: 'ok' });
    const client = { request } as unknown as ApiClient;

    await registerAccount(client, input);

    expect(request).toHaveBeenCalledWith('/auth/register', { method: 'POST', body: input });
  });

  it('propaga o ApiError do client (ex.: 409 e-mail duplicado)', async () => {
    const err = new ApiError('conflict', 409, 'dup');
    const client = { request: jest.fn().mockRejectedValue(err) } as unknown as ApiClient;

    await expect(registerAccount(client, input)).rejects.toBe(err);
  });
});
