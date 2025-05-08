'use client'
import { Text, Button, Stack } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import {
  PasswordInput,
} from "@/components/ui/password-input"
import { InputGroup } from "@/components/ui/input-group"
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import React from 'react';
import { useState, useEffect } from "react";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation"; // Importa o roteador do Next.js


export default function LoginInput({ mandarDadosdofilho }) {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const content = { email: Email, password: Password };
  const router = useRouter();

  const mandarDados = async () => {
    if (!Password || !Email) {
      toaster.create({
        title: "Preencha todos os valores!",
        type: "error"
      })
      return;
    }
    mandarDadosdofilho(content);
  };

  const cadastrarDados = async () => {
    router.push("/cadastro")
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        mandarDados();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mandarDados]);


  return (
    <Stack>
      <InputGroup mt="7%" startElement={<FaUser color="white" opacity={0.8} />} w="100%" >
        <Input
          variant="outline"
          placeholder="Login"
          onChange={(e) => setEmail(e.target.value)}
        />
      </InputGroup>
      <InputGroup mt="2%" startElement={<FaLock color="white" opacity={0.8} />} w="100%" >
        <PasswordInput
          variant="outline"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />
      </InputGroup>
      <Text m="0" mt="1%" cursor="pointer" opacity={0.8} >Esqueceu a senha?</Text>
      <Button
        onClick={mandarDados}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            mandarDados();
          }
        }}
        mt="5%"
        borderRadius={5}
        _hover={{
          opacity: 0.9,
          transition: "0.3s",
        }}
        tabIndex={0}
      >Entrar
      </Button>
      <Text m="0" mt="1%" mb="1%" textAlign={"center"} >OU</Text>
      <Button
        onClick={cadastrarDados}
        mt="5%"
        borderRadius={5}
        _hover={{
          opacity: 0.9,
          transform: "scale(1.01)",
          transition: "0.3s",
        }}
      >Cadastrar
      </Button>
      <Toaster />
    </Stack>
  );
} 