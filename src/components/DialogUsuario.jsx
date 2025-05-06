import { Button, CloseButton, Dialog, Portal, Input, Flex, VStack, RadioGroup, Text, HStack } from "@chakra-ui/react"
import { MdCheck, MdAdd } from 'react-icons/md'
import { withMask } from "use-mask-input"
import { PasswordInput } from "@/components/ui/password-input"

export default function DialogCreate ({
    headers,
    input,
    setInput,
    senha,
    setSenha,
    email,
    setEmail,
    cpf,
    setCpf,
    idCargo,
    setIdCargo,
    submit,
    editingIndex,
    isOpen,
    onClose,
    loadingSave,
    isEstudante,
    setIsEstudante,
    items
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
                  placeholder="Digite o nome de um Usuario!"
                  variant="subtle"
                  mr={2}
                  value={input}
                  onChange={(valor) => setInput(valor.target.value)}
                />
                <PasswordInput
                  placeholder="Digite a senha de um Usuario!"
                  variant="subtle"
                  mr={2}
                  value={senha}
                  onChange={(valor) => setSenha(valor.target.value)}
                />
                <Input
                  placeholder="Digite o email de um Usuario!"
                  variant="subtle"
                  mr={2}
                  value={email}
                  onChange={(valor) => setEmail(valor.target.value)}
                />
                <Input
                  placeholder="Digite o CPF de um Usuario!"
                  ref={withMask("999.999.999-99")}
                  variant="subtle"
                  mr={2}
                  value={cpf}
                  onChange={(valor) => setCpf(valor.target.value)}
                />
                <Input
                  placeholder="Digite o ID do Cargo de um Usuario!"
                  variant="subtle"
                  mr={2}
                  value={idCargo}
                  onChange={(valor) => setIdCargo(valor.target.value)}
                />
                <VStack align="start">
                  <Text>É estudante?</Text>
                  <RadioGroup.Root 
                    value={isEstudante ? true : false}
                    onValueChange={(valor) => setIsEstudante(valor === true)}
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
                </VStack>
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

const items = [
  { label: "Sim", value: true },
  { label: "Não", value: false },
]


