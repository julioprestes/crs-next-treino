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
import { toaster } from "@/components/ui/toaster"
import { verificarToken } from "@/middleware/verificarToken";
import { useRouter } from 'next/navigation';
import TrocaCrud from "@/components/TrocaCrud";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingSave, SetLoadingSave] = useState(false);
  
  
  const buscarCargo = async () => {
      try {
        const response = await api.get('/cargo')
        setTasks(response.data.data)
      } catch (error) {
        
      }
  }

  const router = useRouter();
  
  useEffect(() => {
    const validarToken = async () => {
      const valido = await verificarToken();
      if (!valido) {
        router.push('/');
      } else {
        await buscarCargo();
      }
    };

    validarToken();
  }, []);
  
  const filteredTasks = tasks.filter(task =>
    task.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const tasksAtuais = filteredTasks.slice(indexPrimeiroItem, indexUltimoItem)

  const criarTask = async () => {
    try {
      SetLoadingSave(true)
      if (!input.trim()) return;
      if (editingIndex !== null) {
        const response = await api.patch(`/cargo/${editingIndex}`, {
          descricao: input,
        });
        await buscarCargo();
        setInput('');
      } else {
        const response = await api.post('/cargo', {
          descricao: input,
        });
        toaster.create({
          title: 'Cargo criado com sucesso.',
          type: 'success'
        })
        await buscarCargo();
      }
      setIsDialogOpen(false)
      setInput('');
      SetLoadingSave(false)
    } catch (error) {
      console.log(error.response?.data || error.message);
      toaster.create({
        title: error.response?.data?.message || 'Erro ao criar cargo.',
        type: 'error'
      });
      SetLoadingSave(false);
    }
  }

  const editarTask = (taskEditar) => {
    if (!taskEditar) {
      console.error("Task não encontrada ou inválida.");
      return;
    }
    
    setInput(Array.isArray(taskEditar.lugares) ? taskEditar.lugares : []); 
    setEditingIndex(taskEditar.id || null);
    setIsDialogOpen(true);
  };

  const excluirTask = async (id) => {
    try {
      if (confirm("Deseja excluir o cargo?")) {
      const taskDeletar = tasks.find((task) => task.id === id);
      await api.delete(`/cargo/${taskDeletar.id}`); 
      const taskExcluido = tasks.filter(cargo => cargo.id !== taskDeletar.id);
      if (tasksAtuais.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      toaster.create({
        title: 'Cargo excluido com sucesso.',
        type: 'success'
      })
      setTasks(taskExcluido);
      }
    } catch (error) {
      toaster.create({
        title: 'Erro ao excluir cargo.',
        type: 'error'
      })
    }
  }

  return (
    <>
      <TrocaCrud currentPage="/cargo" />
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
                Criar Cargo
            </Button>
            <DialogCreate
                headers={[editingIndex !== null ? 'Editar Cargo' : 'Criar Cargo']}
                buttonName={[editingIndex !== null ? 'Editar Cargo' : 'Criar Cargo']}
                input={input}
                setInput={setInput}
                submit={criarTask}
                editingIndex={editingIndex}
                isOpen={isDialogOpen}
                onClose={() => {
                  setIsDialogOpen(false);
                  setEditingIndex(null);
                  setInput('');
                }}
                loadingSave={loadingSave}
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
              {name: 'ID', value: 'id'},
              {name: 'Descrição', value: 'descricao'},
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
    </>
    
  )
}