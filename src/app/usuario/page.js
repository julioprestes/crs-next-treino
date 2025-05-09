'use client';
import InputPesquisa from "@/components/InputPesquisa";
import TabelaCrud from "@/components/TabelaCrud";
import PaginationTabela from "@/components/PaginationTabela";
import DialogUsuario from "@/components/DialogUsuario";
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
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [idCargo, setIdCargo] = useState('');
  const [senha, setSenha] = useState('');
  const [isEstudante, setIsEstudante] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingSave, SetLoadingSave] = useState(false);
  
  const buscarUsuario = async () => {
      try {
        const response = await api.get('/usuario')
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
        await buscarUsuario();
      }
    };

    validarToken();
  }, []);
  
  const filteredTasks = tasks.filter(task =>
    task.nome.toLowerCase().includes(searchTerm.toLowerCase())
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
        const response = await api.patch(`/usuario/${editingIndex}`, {
            nome: input,
            email: email,
            cpf: cpf,
            idCargo: idCargo,
            password: senha,
            estudante: isEstudante,
        });
        console.log("Valor de isEstudante enviado:", isEstudante);
        await buscarUsuario();
        setInput('');
        setEmail('');
        setCpf('');
        setIdCargo('');
        setIsEstudante(false);
        setSenha('');
      } else {
        const response = await api.post('/usuario', {
            nome: input,
            email: email,
            cpf: cpf,
            idCargo: idCargo,
            password: senha,
            estudante: isEstudante,
        });
        toaster.create({
          title: 'Usuario criado com sucesso.',
          type: 'success'
        })
        await buscarUsuario();
      }
      setIsDialogOpen(false)
      setInput('');
      setEmail('');
      setCpf('');
      setIdCargo('');
      setSenha('');
      SetLoadingSave(false)
    } catch (error) {
      console.log(error.response?.data || error.message);
      toaster.create({
        title: error.response?.data?.message || 'Erro ao criar usuario.',
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
  
    setInput(taskEditar.nome || '');
    setSenha(taskEditar.senha || '');
    setEmail(taskEditar.email || '');
    setCpf(taskEditar.cpf || '');
    setIdCargo(taskEditar.idCargo || '');
    setEditingIndex(taskEditar.id || null);
    setIsDialogOpen(true);
  };

  const excluirTask = async (id) => {
    try {
        if (confirm("Deseja excluir o usuario?")) {
        const taskDeletar = tasks.find((task) => task.id === id);
        await api.delete(`/usuario/${taskDeletar.id}`); 
        const taskExcluido = tasks.filter(usuario => usuario.id !== taskDeletar.id);
        if (tasksAtuais.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        toaster.create({
            title: 'Usuario excluido com sucesso.',
            type: 'success'
        })
        setTasks(taskExcluido);
        }
    } catch (error) {
      toaster.create({
        title: 'Erro ao excluir usuario.',
        type: 'error'
      })
    }
  }

  return (
    <>
      <TrocaCrud currentPage="/usuario" />
      <Box p={8}>  
        <Heading mb={4}> CRUD usuarios </Heading>
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
                Criar usuario
            </Button>
            <DialogUsuario
                headers={[editingIndex !== null ? 'Editar usuario' : 'Criar usuario']}
                buttonName={[editingIndex !== null ? 'Editar usuario' : 'Criar usuario']}
                input={input}
                setInput={setInput}
                senha={senha}
                setSenha={setSenha}
                email={email}
                setEmail={setEmail}
                cpf={cpf}
                setCpf={setCpf}
                isEstudante={isEstudante}
                setIsEstudante={setIsEstudante}
                idCargo={idCargo}
                setIdCargo={setIdCargo}
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
      estudante: task.estudante ? 'Sim' : 'Não',
    }))}
            onEdit={editarTask}
            onDelete={excluirTask}
            acoes={true}
            headers={[
              {name: 'ID', value: 'id'},
              {name: 'Nome', value: 'nome'},
              {name: 'Email', value: 'email'},
              {name: 'CPF', value: 'cpf'},
              {name: 'Estudante', value: 'estudante'},
              {name: 'ID Cargo', value: 'idCargo'}
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