'use client'
import {
    Box,
    Heading,
    Flex,
    Input,
    Button,
    Stack,
    Table,
    Checkbox,
    Popover,
    Portal,
    Text,
    Group
} from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { MdAdd, MdDelete, MdMode, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react"

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');
    const [editValue, setEditValue] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [editIndex, setEditIndex] = useState(null);
    const [ searchInput, setSearchInput] = useState();


    const tarefasFiltradas = searchInput ? tasks.filter(task => task.includes(searchInput.toLowerCase())) : tasks;
    const indexUltimoItem = currentPage * itemsPerPage;
    const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
    const tasksAtuais = tarefasFiltradas.slice(indexPrimeiroItem, indexUltimoItem);
    
    
    const criarTask = () => {
        if (!input.trim()) return;
        setTasks([...tasks, input]);
        setInput('');
        console.log(tasks);
    }

    const excluirTask = (index) => {
        const taskDeletar = tasksAtuais[index];
        const taskExcluido = tasks.filter(task => task !== taskDeletar);
        if (tasksAtuais.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        setTasks(taskExcluido);
        
    }

    const editarTask = () => {
        if (!editValue.trim()) return;
        const novaLista = [...tasks];
        novaLista[editIndex] = editValue; 
        setTasks(novaLista);
        setEditValue(''); 
        setEditIndex(null); 
    }

    const handleEditButtonClick = (i) => {
        const realIndex = indexPrimeiroItem + i;
        setEditIndex(realIndex);
        setEditValue(tasks[realIndex]);
    }

    const trocaPage = (i) => {
        if (tasksAtuais.length === 0 && currentPage > 1) {
            setCurrentPage (currentPage - 1)
        }
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [searchInput]);

    return (
        <Box p={8}>
            <Heading mb={4}> Lista de Tarefas </Heading>
            <Input
                    placeholder="Pesquise Tarefas..."
                    variant="flushed"
                    mr={2}
                    mb={4}
                    value={searchInput}
                    onChange={(valor) => setSearchInput(valor.target.value)}
                />
            <Flex mb={4}>
                <Input
                    placeholder="Digite o nome de uma tarefa"
                    variant= "subtle"
                    mr={2}
                    value={input}
                    onChange={(valor) => setInput(valor.target.value)}
                />
                <Button
                    onClick={criarTask} 
                    background="green"
                    color="white"
                > <MdAdd /> </Button>
            </Flex>
            <Stack style={{ display: 'flex', alignItems: 'center' }}>
                <Table.Root width="50%" size="sm" striped>
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
                        <Table.Cell textAlign="center" >
                            <Stack direction="row" alignSelf="end">
                                <Popover.Root>
                                    <Popover.Trigger asChild>
                                    <Button
                                        background="blue"
                                        color="white"
                                        variant="suble"
                                        size="xs"
                                        onClick={() => handleEditButtonClick(i)}
                                    >
                                        <MdMode />
                                        </Button>
                                    </Popover.Trigger>
                                    <Portal>
                                        <Popover.Positioner>
                                        <Popover.Content>
                                            <Popover.Arrow />
                                            <Popover.Body>
                                            <Popover.Title fontWeight="medium">Editar Tarefa</Popover.Title>
                                            </Popover.Body>
                                            <Popover.Footer>
                                                <Group>
                                                    <Input
                                                        placeholder="Nome da tarefa"
                                                        size="sm"
                                                        mt={2}
                                                        value={editValue}
                                                        onChange={(evento) => setEditValue(evento.target.value)}
                                                        
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={editarTask}
                                                    >
                                                        Confirmar
                                                    </Button>
                                                </Group>
                                                </Popover.Footer>
                                        </Popover.Content>
                                        </Popover.Positioner>
                                    </Portal>
                                </Popover.Root>
                                <Button
                                    background="red"
                                    color="white"
                                    variant="suble"
                                    size="xs"
                                    onClick={() => {
                                        excluirTask(indexPrimeiroItem + i);
                                    }}
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
                    count={tarefasFiltradas.length}
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
                            <IconButton onClick={() => setCurrentPage(page.value)}
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




{/* <Checkbox.Root variant="subtle">
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                        </Checkbox.Root> */}