import { Button, CloseButton, Dialog, Portal, Input, Flex, VStack, HStack } from "@chakra-ui/react";
import { MdAdd, MdDelete } from "react-icons/md";
import { useState } from "react";

export default function DialogPadrao({
  headers,
  input,
  setInput,
  submit,
  editingIndex,
  isOpen,
  onClose,
  loadingSave,
}) {
  const [nextLugar, setNextLugar] = useState(1); 

  const idLugar = () => {
    setInput([...input, { lugar: nextLugar, linha: "", coluna: "", alocado: false }]);
    setNextLugar(nextLugar + 1);
  };

  const UpdateLugar = (index, field, value) => {
    const updatedInput = [...input];
    updatedInput[index][field] = value;
    setInput(updatedInput);
  };

  const RemoveLugar = (index) => {
    const updatedInput = input.filter((_, i) => i !== index);
    setInput(updatedInput);


    const maxLugar = updatedInput.reduce((max, lugar) => Math.max(max, lugar.lugar), 0);
    setNextLugar(maxLugar + 1);
  };

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
                {console.log("Input recebido no DialogPadrao:", input)}
                {(Array.isArray(input) ? input : []).map((lugar, index) => (
                    <HStack key={index} spacing={2}>
                        <Input
                        placeholder="Lugar"
                        value={lugar.lugar}
                        isreadonly="true"
                        />
                        <Input
                        placeholder="Linha"
                        value={lugar.linha}
                        onChange={(e) => UpdateLugar(index, "linha", e.target.value)}
                        />
                        <Input
                        placeholder="Coluna"
                        value={lugar.coluna}
                        onChange={(e) => UpdateLugar(index, "coluna", e.target.value)}
                        />
                        <Button
                        background="red"
                        color="white"
                        onClick={() => RemoveLugar(index)}
                        >
                        <MdDelete />
                        </Button>
                    </HStack>
                ))}
                <Button
                  onClick={idLugar}
                  background="white"
                >
                  Adicionar Lugar <MdAdd />
                </Button>
              </VStack>
              <Flex justify="flex-end">
                <Button
                  onClick={() => {
                    const camposVazios = input.some((lugar) => !lugar.linha || !lugar.coluna);

                    if (camposVazios) {
                      alert("Preencha todos os campos de linha e coluna antes de salvar.");
                      return;
                    }
                
                    submit();
                    onClose();
                  }}
                  background="green"
                  color="white"
                  isLoading={loadingSave}
                  loadingText="Salvando..."
                >
                  {editingIndex !== null ? "Editar" : "Criar"}
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
  );
}