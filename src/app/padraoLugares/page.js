'use client';
import InputPesquisa from "@/components/InputPesquisa";
import TabelaCrud from "@/components/TabelaCrud";
import PaginationTabela from "@/components/PaginationTabela";
import DialogPadrao from "@/components/DialogPadrao";
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
  const [input, setInput] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingSave, SetLoadingSave] = useState(false);
  
  const buscarPadrao = async () => {
      try {
        const response = await api.get('/padrao')
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
        await buscarPadrao();
      }
    };

    validarToken();
  }, []);
  
  const filteredTasks = tasks.filter(task =>
    task.id.toString().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const tasksAtuais = filteredTasks.slice(indexPrimeiroItem, indexUltimoItem)

  const criarTask = async () => {
    try {
      SetLoadingSave(true);
      if (!input.length) return;
  
      if (editingIndex !== null) {
        await api.patch(`/padrao/${editingIndex}`, {
          lugares: input,
        });
        toaster.create({
          title: "Padrão atualizado com sucesso.",
          type: "success",
        });
      } else {
        await api.post("/padrao", {
          lugares: input,
        });
        toaster.create({
          title: "Padrão criado com sucesso.",
          type: "success",
        });
      }
  
      await buscarPadrao();
      setIsDialogOpen(false);
      setInput([]);
      SetLoadingSave(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toaster.create({
        title: error.response?.data?.message || "Erro ao salvar padrão.",
        type: "error",
      });
      SetLoadingSave(false);
    }
  };

  const editarTask = (taskEditar) => {
    if (!taskEditar) {
      console.error("Task não encontrada ou inválida.");
      return;
    }
  
    setInput(Array.isArray(taskEditar.lugares) ? taskEditar.lugares : []); // Garante que seja um array
    setEditingIndex(taskEditar.id || null);
    setIsDialogOpen(true);
  };

  const excluirTask = async (id) => {
    try {
        if (confirm("Deseja excluir o padrao?")) {
        const taskDeletar = tasks.find((task) => task.id === id);
        await api.delete(`/padrao/${taskDeletar.id}`); 
        const taskExcluido = tasks.filter(padrao => padrao.id !== taskDeletar.id);
        if (tasksAtuais.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        toaster.create({
            title: 'Padrao excluido com sucesso.',
            type: 'success'
        })
        setTasks(taskExcluido);
        }
    } catch (error) {
      toaster.create({
        title: 'Erro ao excluir padrao.',
        type: 'error'
      })
    }
  }

  return (
    <>
      <TrocaCrud currentPage="/padraoLugares" />
      <Box p={8}>
        <Heading mb={4}> CRUD Padrão Lugares </Heading>
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
                Criar padrao
            </Button>
            <DialogPadrao
                headers={[editingIndex !== null ? 'Editar padrao' : 'Criar padrao']}
                buttonName={[editingIndex !== null ? 'Editar padrao' : 'Criar padrao']}
                input={input}
                setInput={setInput}
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
              items={tasksAtuais.map(task => ({
                  ...task,
                  lugares: task.lugares.map(l => `Lugar: ${l.lugar}, Linha: ${l.linha}, Coluna: ${l.coluna}`).join("; "),
              }))}
              onEdit={editarTask}
              onDelete={excluirTask}
              acoes={true}
              headers={[
                  { name: "ID", value: "id" },
                  { name: "Lugares", value: "lugares" },
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