'use client';
import { Link as ChakraLink, Box, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import { verificarToken } from "@/middleware/verificarToken";
import { useRouter } from 'next/navigation';



export default function MenuPage() {
    const pages = [
        { href: "/usuario", label: "Crud Usuários" },
        { href: "/cargo", label: "Crud Cargos" },
        { href: "/filme", label: "Crud Filmes" },
        { href: "/sala", label: "Crud Salas" },
        { href: "/sessao", label: "Crud Sessões" },
        { href: "/padraoLugares", label: "Crud Padrões de Lugares" },
      ];

    const router = useRouter();

    useEffect(() => {
        const validarToken = async () => {
        const valido = await verificarToken();
        if (!valido) {
            router.push('/');
        } else {
            await buscarFilme();
        }
        };

    validarToken();
  }, []);

  return (
        <Box 
              w="100%" h="80vh" display="flex" justifyContent="center" alignItems="center" 
              filter="contrast(95%)"
            >
          <VStack align="center" >
            {pages
              .filter((page) => page.href)
              .map((page) => (
                <ChakraLink
                  key={page.href}
                  as={NextLink}
                  href={page.href}
                  borderRadius="md"
                  background="white"
                  color="black"
                  padding="10px 20px"
                  textAlign="center"
                  boxShadow="md"
                  textDecoration="none"
                  _hover={{
                    background: "gray",
                    textDecoration: "none"
                  }}
                >
                  {page.label}
                </ChakraLink>
            ))}


          </VStack>
          
        </Box>
  );
}