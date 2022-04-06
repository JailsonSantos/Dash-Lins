import { api } from "../api";
import { useQuery } from "react-query";

type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

type GetUserResponse = {
  totalCount: number;
  users: User[];
}

// Função de busca de usuarios na api
export async function getUsers(page: number): Promise<GetUserResponse> {
  const { data, headers } = await api.get('users', {
    params: {
      page,
    }
  })

  const totalCount = Number(headers['x-total-count'])

  // Formatando os dados de users
  const users = data.users.map(user => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: new Date(user.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })
  return {
    users,
    totalCount
  };
}

// Função de buscar ou atualizar usarios do React Query
export function useUsers(page: number) {
  return useQuery(['users', page], () => getUsers(page), {
    staleTime: 1000 * 60 * 10, // Define o tempo que vai estar em fresh por 10 minutos
  });
}