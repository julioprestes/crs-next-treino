'use client';
import { Box, Heading } from "@chakra-ui/react";
import CadastroInput from "@/components/cadastroInput";



export default function CadastroPage() {
  return (
    <Box p={8}>
      <Heading mb={4}>Cadastro de Usuário</Heading>
      <CadastroInput />
    </Box>
  );
}