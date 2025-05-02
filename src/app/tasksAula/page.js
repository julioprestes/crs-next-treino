'use client';
import InputPesquisa from "@/components/InputPesquisa";
import TabelaCrud from "@/components/TabelaCrud";
import PaginationTabela from "@/components/PaginationTabela";
import { 
  Box,
  Heading,
  Stack,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react"
import { useState, useEffect } from "react";
import DialogCreate from "@/components/DialogCreate";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const tasksAtuais = filteredTasks.slice(indexPrimeiroItem, indexUltimoItem)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const criarTask = () => {
    if (!input.trim()) return;
    if (editingIndex !== null) {
      const tasksAtualizadas = [...tasks];
      tasksAtualizadas[editingIndex] = input;
      setTasks(tasksAtualizadas);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, input]);
    }
    setInput('');
  };

  const editarTask = (index) => {
    setInput(tasksAtuais[index]);
    setEditingIndex(tasks.indexOf(tasksAtuais[index]));
    setIsDialogOpen(true);
  };

  const excluirTask = (index) => {
    const taskDeletar = tasksAtuais[index];
    const taskExcluido = tasks.filter(task => task !== taskDeletar);
    if (tasksAtuais.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    setTasks(taskExcluido);
  }

  return (
    <Box p={8}>
      <Heading mb={4}> Lista de Tarefas </Heading>
      <Grid templateColumns="repeat(4, 1fr)" gap={6} ml={10} mr={-12}>
        <GridItem colSpan={3} ml={9}>
                <InputPesquisa
                  searchTerm={searchTerm}
                  SetSeachTerm={setSearchTerm}
                />
              </GridItem>
              <GridItem>
              <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsDialogOpen(true)} 
                  mb={4}
                  l={2}
              > 
                  Criar
              </Button>
              <DialogCreate
                  headers={[editingIndex !== null ? 'Editar Tarefa' : 'Criar Tarefa']}
                  buttonName={[editingIndex !== null ? 'Editar Tarefa' : 'Criar Tarefa']}
                  input={input}
                  setInput={setInput}
                  submit={criarTask}
                  editingIndex={editingIndex}
                  isOpen={isDialogOpen}
                  onClose={() => {
                    setIsDialogOpen(false);
                    setEditingIndex(null);
                  }}
              />
              </GridItem>
        </Grid>
      <Stack style={{display: 'flex', alignItems: 'center'}}>
        <TabelaCrud
          data={tasksAtuais}
          onEdit={editarTask} 
          onDelete={excluirTask}
          acoes={true}
          headers={[
            'Tarefa'
          ]}
        />
        <PaginationTabela
          data={filteredTasks.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Stack>
    </Box>
  )
}

const pageSizes = createListCollection({
  items: [
    { label: "2 itens", value: "2" },
    { label: "5 itens", value: "5" },
    { label: "10 itens", value: "10" },
    { label: "20 itens", value: "20" },
  ],
});