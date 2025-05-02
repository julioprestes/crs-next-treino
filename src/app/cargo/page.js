'use client';
import InputPesquisa from "@/components/InputPesquisa";
import TabelaCrud from "@/components/TabelaCrud";
import PaginationTabela from "@/components/PaginationTabela";
import DialogCreate from "@/components/DialogCreate";
import SelectPage from "@/components/SelectPage";
import { 
  Box,
  Heading,
  Stack,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react"
import { useState, useEffect } from "react";
import api from "@/utils/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  

  useEffect(() => {
    const buscarCargo = async () => {
      try {
        const response = await api.get('/cargo')
        setTasks(response.data.data)
      } catch (error) {
        
      }
    }
    buscarCargo();
  }, [])

  const filteredTasks = tasks.filter(task =>
    task.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const tasksAtuais = filteredTasks.slice(indexPrimeiroItem, indexUltimoItem)

  const closeDialog = () => {
    setOpenDialog(false)
  }

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
    closeDialog();
    setInput('');
  }

  const editarTask = (index) => {
    setInput(tasksAtuais[index]);
    setEditingIndex(tasks.indexOf(tasksAtuais[index]));
    setOpenDialog(true)
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
      <Heading mb={4}> CRUD Cargos </Heading>
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
          items={tasksAtuais}
          onEdit={editarTask}
          onDelete={excluirTask}
          acoes={true}
          headers={[
            'ID',
            'Descrição'
          ]}
        />
        <Grid templateColumns="repeat(4, 1fr)">
          <GridItem colSpan={3}>
            <PaginationTabela
              items={filteredTasks.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </GridItem>
          <GridItem ml={12} colSpan={1}>
            <SelectPage
              setItensPerPage={setItemsPerPage}
              items={[
                {name: 5, value: 5},
                {name: 10, value: 10},
                {name: 15, value: 15},
                {name: 20, value: 20},
                {name: 25, value: 25},
              ]}
            />
          </GridItem>
        </Grid>
      </Stack>
    </Box>
  )
}