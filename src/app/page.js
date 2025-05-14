'use client'
import { Box, Image, Heading, Text, VStack } from "@chakra-ui/react";
import React from 'react';
import LoginInput from "@/components/loginInput";
import { Toaster, toaster } from "@/components/ui/toaster"
import axios from "@/utils/axios";
import { useRouter } from 'next/navigation';

export default function LoginPc() {
  const router = useRouter();


  const loginUsuario = async (content) => {
    router.push('/cargo');
    try {
      const response = await axios.post(`/usuario/login`, { ...content });
      if (response.status == 200) {
        toaster.create({
          description: "Login realizado com sucesso! Redirecionando...",
          type: "success",
        });
        
        localStorage.setItem('token', response.data.response);
        router.push('/menu');
      } else {
        toaster.create({
          description: "Erro ao fazer login!",
          type: "error",
        })
      }
    } catch (error) {
      toaster.create({
        description: "ERROR!",
        type: "error",
      })
    }
  }

  const receberDadosdoFilho = async (content) => {
    await loginUsuario(content)
  };


  return (
    <Box
      w="100%" h="100vh" display="flex" justifyContent="center" alignItems="center" 
      filter="contrast(95%)"
      bgImage={"url(/blawhi.jpg)"}
      bgSize="100% 115%"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Box w="50%" display="flex" justifyContent="center" alignItems="center">
      </Box>
        <Image
          boxSize="950px"
          src="/pipoca.png"
          alt="Loading..."
        />
      <Box
        w="60%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <VStack align="left" >
          <Heading color="white" textAlign="center" as="h1" fontSize={40} fontWeight={600} >
            Bem-Vindo
            <span style={{ fontFamily: "monospace", fontSize: "1.2em", color: "white" }} >!</span>
          </Heading>
          <Text m="0" fontSize="lg" color="white" textAlign="center" opacity={0.8} >
            Seja bem-vindo ao SITE
          </Text>
          <LoginInput mandarDadosdofilho={receberDadosdoFilho} />
        </VStack>
      </Box>
      <Toaster />
    </Box>
  );
} 