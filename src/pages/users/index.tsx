import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue
} from "@chakra-ui/react";

import NextLink from "next/link";
import { useState } from "react";

import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { Pagination } from "../../components/Pagination";

import { useUsers } from "../../services/hooks/useUsers";

import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { queryClient } from "../../services/queryClient";
import { api } from "../../services/api";

export default function UserList() {

  const [page, setPage] = useState(1)

  // Buscando dados do Hoock Users
  const { data, isLoading, isFetching, error } = useUsers(page);

  // Breckpoint responsivel na tela large
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(['user', userId], async () => {
      const response = await api.get(`users/${userId}`)

      return response.data;
    }, {
      staleTime: 1000 * 60 * 10, // 10 minutos in fresh no react-query
    });
  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1330} mx="auto" px={["2", "4", "6"]}>
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p={["4", "4", "8"]}>
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
              {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
            </Heading>

            <NextLink href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="small"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar novo
              </Button>
            </NextLink>
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          )
            : error ?
              (
                <Flex justify="center">
                  <Text>Falha ao obter dados dos usuários.</Text>
                </Flex>
              ) :
              (
                <>
                  <Table colorScheme="whiteAlpha">
                    <Thead>
                      <Tr>
                        <Th px={["2", "4", "6"]} color="gray.300" width="8">
                          <Checkbox colorScheme="pink" />
                        </Th>
                        <Th px={["2", "4", "6"]}>Usuários</Th>
                        {isWideVersion && (<Th>Dada de cadastro</Th>)}
                        <Th width="4"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>

                      {data.users.map((user) => (
                        <Tr key={user.id}>
                          <Td px={["2", "4", "6"]}>
                            <Checkbox colorScheme="pink" />
                          </Td>
                          <Td px={["2", "4", "6"]}>
                            <Box>
                              <Link color="purple.400" onMouseEnter={() => handlePrefetchUser(user.id)}>
                                <Text fontWeight="bold">{user.name}</Text>
                              </Link>
                              <Text fontSize="sm" color="gray.300">{user.email}</Text>
                            </Box>
                          </Td>
                          {isWideVersion && (<Td>{user.created_at}</Td>)}
                          <Td>
                            <Button
                              as="a"
                              size="sm"
                              fontSize="small"
                              colorScheme="purple"
                              leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                            >
                              Editar
                            </Button>
                          </Td>
                        </Tr>
                      )
                      )}
                    </Tbody>
                  </Table>
                  <Pagination
                    totalCountOfRegisters={data.totalCount}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                </>
              )
          }
        </Box>
      </Flex >
    </Box >
  )
}