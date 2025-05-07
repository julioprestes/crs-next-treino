import { Button, CloseButton, Dialog, Portal, Input, Flex, VStack } from "@chakra-ui/react"
import { MdCheck, MdAdd } from 'react-icons/md'

export default function DialogSala ({
  headers,
  input,
  setInput,
  submit,
  idPadraoLugares,
  setIdPadraoLugares,
  editingIndex,
  isOpen,
  onClose,
  loadingSave
}) {
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
                        placeholder="Digite o nome da Sala!"
                        variant="subtle"
                        mr={2}
                        value={input}
                        onChange={(valor) => setInput(valor.target.value)}
                    />
                    <Input
                        placeholder="Digite o ID do Padrão dos Lugares da Sala!"
                        variant="subtle"
                        mr={2}
                        value={idPadraoLugares}
                        onChange={(valor) => setIdPadraoLugares(valor.target.value)}
                    />
                </VStack>
              
              <Flex mb={4}>
                <Button 
                  onClick={() => {
                    submit();
                    onClose();
                  }}
                  background="green"
                  color="white"
                  loading ={loadingSave}
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


