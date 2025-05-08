import { Link as ChakraLink, Flex } from "@chakra-ui/react";
import NextLink from "next/link";

export default function TrocaCrud({ currentPage }) {
  const pages = [
    { href: "/usuario", label: "Crud Usuario" },
    { href: "/cargo", label: "Crud Cargo" },
    { href: "/filme", label: "Crud Filme" },
    { href: "/sala", label: "Crud Sala" },
    { href: "/sessao", label: "Crud Sessão" },
    { href: "/padraoLugares", label: "Crud Padrão Lugares" },
  ];

  return (
    <Flex
      as="nav"
      bg="gray.800"
      color="white"
      p={4}
      justify="space-around"    
      align="center"
      borderRadius="md"
      boxShadow="md"
      mb={4}
    >
      {pages
        .filter((page) => page.href !== currentPage)
        .map((page) => (
          <ChakraLink
            key={page.href}
            as={NextLink}
            href={page.href}
            borderRadius="md"
          >
            {page.label}
          </ChakraLink>
        ))}
    </Flex>
  );
}