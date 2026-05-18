import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api, type ContactLink } from '../../lib/api';

export function useContactLinks() {
  return useQuery({
    queryKey: ['contact-links'],
    queryFn: api.getContactLinks,
  });
}

export function useAdminContactLinks() {
  return useQuery({
    queryKey: ['admin-contact-links'],
    queryFn: api.listAdminContactLinks,
  });
}

export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: api.listMessages,
  });
}

export function useCreateContactLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ContactLink>) => api.createContactLink(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-links'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contact-links'] });
    },
  });
}

export function useUpdateContactLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ContactLink> }) =>
      api.updateContactLink(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-links'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contact-links'] });
    },
  });
}

export function useDeleteContactLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteContactLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-links'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contact-links'] });
    },
  });
}

export function useMarkMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_read }: { id: number; is_read: boolean }) => api.updateMessage(id, is_read),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });
}

