'use client'
import { Text, Button, Stack, HStack, RadioGroup } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import { PasswordInput } from "@/components/ui/password-input"
import { withMask } from "use-mask-input"


export default function CadastroInput() {
  const [Nome, setNome] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [isEstudante, setIsEstudante] = useState(false); 
  const router = useRouter();

  const mandarDados = async () => {
    if (!Nome || !Email || !Password || !cpf) {
      toaster.create({
        title: "Preencha todos os valores!",
        type: "error"
      });
      return;
    }

    try {
        const response = await api.post('/usuario', {
            nome: Nome,
            email: Email,
            password: Password,
            cpf: cpf,
            idCargo: 1, 
            estudante: isEstudante, 
            });

        if (response.status === 201) {
            toaster.create({
              title: "Cadastro feito com sucesso.",
              type: "success"
            });
            router.push('/'); 
          } else {
            toaster.create({
              title: response.data.message || "Erro ao realizar cadastro!",
              type: "error"
            });
          }
        } catch (error) {
          console.error(error); 
          toaster.create({
            title: error.response?.data?.message || "Erro ao conectar com o servidor!",
            type: "error"
          });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        mandarDados();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [Nome, Email, Password, cpf, isEstudante]);

  return (
    <Stack spacing={4}>
      <Input
        variant="outline"
        placeholder="Nome"
        value={Nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <Input
        variant="outline"
        placeholder="Email"
        value={Email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        placeholder="Senha"
        variant="outline"
        mr={2}
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        placeholder="CPF"
        ref={withMask("999.999.999-99")}
        variant="outline"
        mr={2}
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
      />
      <Stack justifyContent="center" alignItems="center">
        <Text>É estudante?</Text>
        <RadioGroup.Root 
            value={isEstudante ? "true" : "false"}
            onValueChange={(valor) => {
            const selectedValue = valor.value || valor;
            console.log("Valor selecionado:", selectedValue); 
            setIsEstudante(selectedValue === "true"); 
            }}
        >
            <HStack gap="6">
            {items.map((item) => (
                <RadioGroup.Item key={item.value} value={item.value}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                </RadioGroup.Item>
            ))}
            </HStack>
        </RadioGroup.Root>
      </Stack>
      <Button onClick={mandarDados} colorScheme="blue">
        Cadastrar
      </Button>
      <Toaster />
    </Stack>
  );
}

const items = [
    { label: "Sim", value: "true" },
    { label: "Não", value: "false" },
  ]