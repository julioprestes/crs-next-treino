import { Button, CloseButton, Dialog, Portal, Flex, VStack, HStack, Box, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";

const ROWS = 10;
const COLS = 10;

function GridSelector({ onSelect }) {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const handleMouseDown = (row, col) => setStart({ row, col });
  const handleMouseOver = (row, col) => start && setEnd({ row, col });
  const handleMouseUp = () => {
    if (start && end) {
      const selected = [];
      let lugar = 1;
      for (let r = Math.min(start.row, end.row); r <= Math.max(start.row, end.row); r++) {
        for (let c = Math.min(start.col, end.col); c <= Math.max(start.col, end.col); c++) {
          selected.push({ lugar: lugar++, linha: r + 1, coluna: c + 1, alocado: false });
        }
      }
      onSelect(selected);
    }
    setStart(null);
    setEnd(null);
  };

  const isSelected = (row, col) => {
    if (!start || !end) return false;
    const rMin = Math.min(start.row, end.row);
    const rMax = Math.max(start.row, end.row);
    const cMin = Math.min(start.col, end.col);
    const cMax = Math.max(start.col, end.col);
    return row >= rMin && row <= rMax && col >= cMin && col <= cMax;
  };

  return (
    <SimpleGrid columns={COLS} spacing={1} userSelect="none" onMouseUp={handleMouseUp}>
      {[...Array(ROWS * COLS)].map((_, i) => {
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        return (
          <Box
            key={i}
            w="28px"
            h="28px"
            border="1px solid #ccc"
            bg={isSelected(row, col) ? "blue.300" : "gray.100"}
            onMouseDown={() => handleMouseDown(row, col)}
            onMouseOver={() => handleMouseOver(row, col)}
            cursor="pointer"
          />
        );
      })}
    </SimpleGrid>
  );
}

export default function DialogPadrao({
  headers,
  input,
  setInput,
  submit,
  editingIndex,
  isOpen,
  onClose,
  loadingSave,
}) {
  return (
    <Dialog.Root open={isOpen} onClose={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              {headers.map((header) => (
                <Dialog.Title key={header}>{header}</Dialog.Title>
              ))}
            </Dialog.Header>
            <Dialog.Body>
              <VStack spacing={4} mb={4}>
                <Box fontWeight="bold">Selecione os lugares na grade:</Box>
                <GridSelector onSelect={setInput} />
                {input && input.length > 0 && (
                  <Box fontSize="sm" color="gray.600">
                    {input.length} lugares selecionados
                  </Box>
                )}
                {input && input.length > 0 && (
                  <SimpleGrid columns={3} spacing={1} fontSize="xs" mt={2}>
                    {input.map((lugar, idx) => (
                      <Box key={idx} p={1} border="1px solid #eee">
                        Lugar {lugar.lugar}: Linha {lugar.linha}, Coluna {lugar.coluna}
                      </Box>
                    ))}
                  </SimpleGrid>
                )}
              </VStack>
              <Flex justify="flex-end">
                <Button
                  onClick={() => {
                    if (!input || input.length === 0) {
                      alert("Selecione pelo menos um lugar na grade.");
                      return;
                    }
                    submit();
                    onClose();
                  }}
                  background="green"
                  color="white"
                  isLoading={loadingSave}
                  loadingText="Salvando..."
                >
                  {editingIndex !== null ? "Editar" : "Criar"}
                </Button>
              </Flex>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}