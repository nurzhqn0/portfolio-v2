import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api, type Profile } from '../../lib/api';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: api.getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Profile>) => api.updateProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}

