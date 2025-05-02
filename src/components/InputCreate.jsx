
import { Flex, Input, Button } from "@chakra-ui/react"
import { MdCheck, MdAdd } from 'react-icons/md'

export default function InputCreate({input, setInput, submit, editingIndex}) {
  return (
    <Flex mb={4} >
      <Input
        placeholder="Digite o nome de uma terefa!"
        variant="subtle"
        mr={2}
        value={input}
        onChange={(valor) => setInput(valor.target.value)}
      />

      <Button 
        onClick={submit}
        background="green"
        color="white"
        > {editingIndex !== null ? <MdCheck /> : <MdAdd /> }</Button>
    </Flex>
  )
}