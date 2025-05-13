'use client';
import InputPesquisa from "@/components/InputPesquisa";
import TabelaCrud from "@/components/TabelaCrud";
import PaginationTabela from "@/components/PaginationTabela";
import DialogSala from "@/components/DialogSala";
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
import TrocaCrud from "@/components/TrocaCrud";
import { verificarToken } from "@/middleware/verificarToken";
import { useRouter } from 'next/navigation';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [idPadraoLugares, setIdPadraoLugares] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingSave, SetLoadingSave] = useState(false);
  
  const buscarSala = async () => {
      try {
        const response = await api.get('/sala')
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
        await buscarSala();
      }
    };

    validarToken();
  }, []);
  
  const filteredTasks = tasks.filter(task =>
    task.observacao.toLowerCase().includes(searchTerm.toLowerCase())
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
        const response = await api.patch(`/sala/${editingIndex}`, {
            observacao: input,
            idPadraoLugares: idPadraoLugares,

        });
        await buscarSala();
        setInput('');
        setIdPadraoLugares('');
      } else {
        const response = await api.post('/sala', {
            observacao: input,
            idPadraoLugares: idPadraoLugares,
        });
        toaster.create({
          title: 'Sala criada com sucesso.',
          type: 'success'
        })
        await buscarSala();
      }
      setIsDialogOpen(false)
      setInput('');
      setIdPadraoLugares('');
      SetLoadingSave(false)
    } catch (error) {
      console.log(error.response?.data || error.message);
      toaster.create({
        title: error.response?.data?.message || 'Erro ao criar sala.',
        type: 'error'
      });
      SetLoadingSave(false);
    }
  }

  const editarTask = (taskEditar) => {
    console.log("Task recebida:", taskEditar);
  
    if (!taskEditar) {
      console.error("Task não encontrada ou inválida.");
      return;
    }
  
    setInput(taskEditar.observacao || '');
    setIdPadraoLugares(taskEditar.idPadraoLugares || '');
    setEditingIndex(taskEditar.id || null);
    setIsDialogOpen(true);
  };

  const excluirTask = async (id) => {
    try {
        if (confirm("Deseja excluir a sala?")) {
        const taskDeletar = tasks.find((task) => task.id === id);
        await api.delete(`/sala/${taskDeletar.id}`); 
        const taskExcluido = tasks.filter(sala => sala.id !== taskDeletar.id);
        if (tasksAtuais.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        toaster.create({
            title: 'Sala excluida com sucesso.',
            type: 'success'
        })
        setTasks(taskExcluido);
        }
    } catch (error) {
      toaster.create({
        title: 'Erro ao excluir sala.',
        type: 'error'
      })
    }
  }

  return (
    <>
      <TrocaCrud currentPage="/sala" />
      <Box p={8}>
        <Heading mb={4}> CRUD Salas </Heading>
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
                Criar sala
            </Button>
            <DialogSala
                headers={[editingIndex !== null ? 'Editar sala' : 'Criar sala']}
                buttonName={[editingIndex !== null ? 'Editar sala' : 'Criar sala']}
                input={input}
                setInput={setInput}
                idPadraoLugares={idPadraoLugares}
                setIdPadraoLugares={setIdPadraoLugares}
                submit={criarTask}
                editingIndex={editingIndex}
                isOpen={isDialogOpen}
                onClose={() => {
                  setIsDialogOpen(false);
                  setEditingIndex(null);
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
              {name: 'Observação', value: 'observacao'},
              {name: 'ID Padrão Lugares', value: 'idPadraoLugares'},
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