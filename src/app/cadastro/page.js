'use client';
import { Stack, Input, Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster"
import api from "@/utils/axios";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleCadastro = () => {
    if (!nome || !email || !password) {
      alert("Preencha todos os campos!");
      return;
    }
    // Lógica para enviar os dados ao backend
    console.log({ nome, email, password });
  };

  return (
    <Stack spacing={4} p={8}>
      <Text fontSize="2xl" fontWeight="bold">Cadastro</Text>
      <Input
        placeholder="Nome"
        onChange={(e) => setNome(e.target.value)}
      />
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Senha"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleCadastro} colorScheme="blue">
        Cadastrar
      </Button>
    </Stack>
  );
}