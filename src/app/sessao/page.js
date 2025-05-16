'use client';
import InputPesquisa from "@/components/InputPesquisa";
import TabelaCrud from "@/components/TabelaCrud";
import PaginationTabela from "@/components/PaginationTabela";
import DialogSessao from "@/components/DialogSessao";
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
  const [idFilme, setIdFilme] = useState('');
  const [idSala, setIdSala] = useState('');
  const [dataInicio, setDataInicio] = useState(new Date()); 
  const [dataFim, setDataFim] = useState(new Date());
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingSave, SetLoadingSave] = useState(false);
  
  const buscarSessao = async () => {
      try {
        const response = await api.get('/sessao')
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
        await buscarSessao();
      }
    };

    validarToken();
  }, []);
  
  const filteredTasks = tasks.filter(task =>
    task.idFilme.toString().includes(searchTerm.toLowerCase())
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

    
      if (!String(input).trim()) {
        SetLoadingSave(false);
        return;
      } 

      const payload = {
        idFilme: idFilme,
        idSala: idSala,
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString(),
        preco: parseFloat(input),
      };

      console.log("Payload enviado:", payload);


      if (editingIndex !== null) {
        console.log("Editando sessão com ID:", editingIndex);
        await api.patch(`/sessao/${editingIndex}`, payload);
      } else {
        await api.post('/sessao', payload);
        toaster.create({
          title: 'Sessao criada com sucesso.',
          type: 'success',
        });
      }  
        
      await buscarSessao();
        
      setIsDialogOpen(false)
      setInput('');
      setIdFilme('');
      setIdSala('');
      SetLoadingSave(false)
    } catch (error) {
      console.log(error.response?.data || error.message);
      toaster.create({
        title: error.response?.data?.message || 'Erro ao criar sessao.',
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
  
    setInput(taskEditar.preco?.toString() || ''); 
    setIdFilme(taskEditar.idFilme?.toString() || ''); 
    setIdSala(taskEditar.idSala?.toString() || ''); 
    setDataInicio(new Date(taskEditar.dataInicio)); 
    setDataFim(new Date(taskEditar.dataFim)); 
    setEditingIndex(taskEditar.id || null);
    setIsDialogOpen(true); 
  };

  const excluirTask = async (id) => {
    try {
        if (confirm("Deseja excluir a sessao?")) {
        const taskDeletar = tasks.find((task) => task.id === id);
        await api.delete(`/sessao/${taskDeletar.id}`); 
        const taskExcluido = tasks.filter(sessao => sessao.id !== taskDeletar.id);
        if (tasksAtuais.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        toaster.create({
            title: 'Sessao excluida com sucesso.',
            type: 'success'
        })
        setTasks(taskExcluido);
        }
    } catch (error) {
      toaster.create({
        title: 'Erro ao excluir sessao.',
        type: 'error'
      })
    }
  }

  return (
    <>
      <TrocaCrud currentPage="/sessao" />
      <Box p={8}>  
        <Heading mb={4}> CRUD Sessões </Heading>
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
                Criar Sessão
            </Button>
            <DialogSessao
                headers={[editingIndex !== null ? 'Editar sessao' : 'Criar sessao']}
                buttonName={[editingIndex !== null ? 'Editar sessao' : 'Criar sessao']}
                idFilme={idFilme}
                setIdFilme={setIdFilme}
                idSala={idSala}
                setIdSala={setIdSala}
                dataInicio={dataInicio}
                setDataInicio={setDataInicio}
                dataFim={dataFim}
                setDataFim={setDataFim}
                input={input}
                setInput={setInput}
                submit={criarTask}
                editingIndex={editingIndex}
                isOpen={isDialogOpen}
                onClose={() => {
                  setIsDialogOpen(false);
                  setEditingIndex(null);
                  setInput('');
                  setIdFilme(null);
                  setIdSala(null);
                  setDataInicio(new Date());
                  setDataFim(new Date());
                }}
                loadingSave={loadingSave}
            />
          </GridItem>
        </Grid>
        <Stack style={{display: 'flex', alignItems: 'center', whiteSpace: 'pre-wrap'}}>
          <TabelaCrud
            items={tasksAtuais.map(task => ({
              ...task,
              lugares: task.lugares.map(l => `Lugar: ${l.lugar} - Alocado: ${l.alocado ? 'Sim' : 'Não'} ` ).join("\n"),
          }))}
            onEdit={editarTask}
            onDelete={excluirTask}
            acoes={true}
            headers={[
              {name: 'ID', value: 'id'},
              {name: 'ID do Filme', value: 'idFilme'},
              {name: 'ID da Sala', value: 'idSala'},
              {name: 'Data do Início', value: 'dataInicio'},
              {name: 'Data do Fim', value: 'dataFim'},
              {name: 'Preço', value: 'preco'},
              {name: 'Lugares', value: 'lugares'}
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