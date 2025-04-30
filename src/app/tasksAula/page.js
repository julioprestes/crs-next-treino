'use client';
import { 
  Box,
  Heading,
  Flex,
  Input,
  Button,
  Stack,
  Table,
  Pagination,
  ButtonGroup,
  IconButton
} from "@chakra-ui/react"
import { useState } from "react";
import { MdAdd, MdDelete, MdMode, MdCheck, MdChevronRight, MdChevronLeft   } from "react-icons/md";

export default function TasksAula() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const tasksAtuais = tasks.slice(indexPrimeiroItem, indexUltimoItem)

  const criarTask = () => {
    if (!input.trim()) return;
    if (editingIndex !== null) {
      const tasksAtualizadas = [...tasks]
      tasksAtualizadas[editingIndex] = input
      setTasks(tasksAtualizadas)
      setEditingIndex(null)
    } else {
      setTasks([...tasks, input]);
    }
    setInput('');
  }

  const editarTask = (index) => {
    setInput(tasks[index]);
    setEditingIndex(index);
  };

  const excluirTask = (index) => {
    const taskExluido = tasks.filter((_, i) => i != index);
    setTasks(taskExluido)
  }

  return (
    <Box p={8}>
      <Heading mb={4}> Lista de Tarefas </Heading>
      <Flex mb={4}>
        <Input
          placeholder="Digite o nome de uma terefa!"
          variant="subtle"
          mr={2}
          value={input}
          onChange={(valor) => setInput(valor.target.value)}
        />
        <Button 
          onClick={criarTask}
          background="green"
          color="white"
        > {editingIndex !== null ? <MdCheck /> : <MdAdd /> }</Button>
      </Flex>
      <Stack style={{display: 'flex', alignItems: 'center'}}>
        <Table.Root width="50%" size="sm" striped variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Tarefa</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center"></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tasksAtuais.map((task, i) => (
              <Table.Row key={i}>
                <Table.Cell>{task}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Stack direction="row">
                    <Button
                      background="Blue"
                      color="white"
                      variant="subtle"
                      size="xs"
                      onClick={() => editarTask(i)}
                    >
                      <MdMode />
                    </Button>
                    <Button
                      background="red"
                      color="white"
                      variant="subtle"
                      size="xs"
                      onClick={() => excluirTask(i)}
                    >
                      <MdDelete />
                    </Button>
                  </Stack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        <Pagination.Root 
          count={tasks.length} 
          pageSize={itemsPerPage} 
          defaultPage={1}
          page={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        >
          <ButtonGroup variant="ghost" size="sm">
            <Pagination.PrevTrigger asChild>
              <IconButton
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <MdChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(page) => (
                <IconButton 
                  onClick={() => setCurrentPage(page.value)} 
                  variant={{ base: "ghost", _selected: "outline" }}
                >
                  {page.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild>
              <IconButton
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <MdChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Stack>
    </Box>
  )
}