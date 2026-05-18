import { useMutation } from '@tanstack/react-query';

import { api } from '../../lib/api';
import { setToken } from '../../lib/auth';

export function useLogin() {
  return useMutation({
    mutationFn: api.login,
    onSuccess: (response) => setToken(response.access_token),
  });
}

