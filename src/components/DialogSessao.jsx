import { Button, CloseButton, Dialog, Portal, Input, Flex, VStack } from "@chakra-ui/react"
import { MdCheck, MdAdd } from 'react-icons/md'
import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function DialogSessao ({
  headers,
  input,
  setInput,
  submit,
  idFilme,
  setIdFilme,
  idSala,
  setIdSala,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  editingIndex,
  isOpen,
  onClose,
  loadingSave
}) {
    console.log("Valores recebidos no DialogSessao:", {
        input,
        idFilme,
        idSala,
        dataInicio,
        dataFim,
        editingIndex,
        isOpen,
      });
  return (
    <Dialog.Root open={isOpen} onClose={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              {headers.map((header) => (
                <Dialog.Title key={header}>{header}</Dialog.Title>
              ))}
            </Dialog.Header>
            <Dialog.Body>
                <VStack spacing={4} mb={4}>
                    <Input
                        placeholder="Digite o ID do Filme da Sessão!"
                        variant="subtle"
                        mr={2}
                        value={idFilme}
                        onChange={(valor) => setIdFilme(valor.target.value)}
                    />
                    <Input
                        placeholder="Digite o ID da Sala da Sessão!"
                        variant="subtle"
                        mr={2}
                        value={idSala}
                        onChange={(valor) => setIdSala(valor.target.value)}
                    />
                    <Input
                        placeholder="Digite o preço da Sessão!"
                        variant="subtle"
                        mr={2}
                        value={input}
                        onChange={(valor) => setInput(valor.target.value)}
                    />
                    <DatePicker selected={dataInicio} onChange={(date) => setDataInicio(date)} />
                    <DatePicker selected={dataFim} onChange={(date) => setDataFim(date)} />
                </VStack>
              
              <Flex mb={4}>
                <Button 
                  onClick={async () => {
                    await submit(); 
                    onClose(); 
                  }}
                  background="green"
                  color="white"
                  isLoading ={loadingSave}
                  loadingText="Salvando..."
                >
                  {editingIndex !== null ? <MdCheck /> : <MdAdd />}
                </Button>
              </Flex>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" onClick={onClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}


