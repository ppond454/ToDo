import { DeleteIcon } from "@chakra-ui/icons"
import {
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  TableCaption,
  Tfoot,
  Box,
  Input,
  Flex,
  Button,
  InputGroup,
  InputLeftElement,
  Spinner,
  Modal,
  useDisclosure,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  TableContainer,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  HStack,
  VStack,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { startOfDay, endOfDay } from "date-fns"
import { formatCurrency, formatDate, formatTime, now } from "../utils"
import { db } from "../configs/firebase"
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import { uuidv4 } from "@firebase/util"
import { Select } from "chakra-react-select"

type TResult = {
  id: string
  amount: number
  timestamp: number
  menu: string
  quantity: number
  sum: number
}
export default function Breverage() {
  const [data, setData] = useState<TResult[]>([])
  const [amount, setAmount] = useState("")
  const [deleteAmount, setDeleteAmount] = useState("")

  const [loading, setLoading] = useState(false)

  const [start, setStart] = useState(now())
  const [end, setEnd] = useState(now())
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [quantity, setQuantity] = useState<number>()
  const [menu, setMenu] = useState<{ label: string; value: string } | null>(
    null
  )

  const COLECTTION = "breverage"

  const header = ["รายการ", "เวลา", "เมนู", "ราคา", "จำนวน", "ราคารวม", ""]

  useEffect(() => {
    getData()
  }, [start, end])

  const option = [
    {
      label: "ชาเย็น",
      value: "ชาเย็น",
    },
    {
      label: "กาแฟ",
      value: "กาแฟ",
    },
    {
      label: "อื่นๆ",
      value: "อื่นๆ",
    },
  ]

  const getData = async () => {
    setLoading(true)

    const querySnapshot = await getDocs(
      query(
        collection(db, COLECTTION),
        where("timestamp", ">=", startOfDay(new Date(start)).getTime()),
        where("timestamp", "<=", endOfDay(new Date(end)).getTime()),
        orderBy("timestamp", "desc")
      )
    )
    const d: TResult[] = []
    querySnapshot.forEach((doc) => {
      d.push({
        id: doc.id,
        ...doc.data(),
      } as TResult)
    })
    setData(d)
    setLoading(false)
  }

  const submitData = async () => {
    if (!amount || +amount == 0 || !menu || !quantity) return

    const data = {
      amount,
      timestamp: Date.now(),
      quantity,
      menu: menu.value,
      sum: +quantity * +amount,
    }
    await setDoc(doc(db, COLECTTION, uuidv4()), data)
    await getData()

    setAmount("")
    setMenu(null)
    setQuantity(undefined)
  }

  const deleteData = async () => {
    await deleteDoc(doc(db, COLECTTION, deleteAmount))
    await getData()
  }

  const calSummary = () => {
    if (data.length <= 0) return "0.00"
    return formatCurrency(
      data.reduce((acc, b) => {
        return acc + +b.amount
      }, 0)
    )
  }

  const Loading = () => {
    return (
      <Tr>
        <Td colSpan={7} textAlign="center">
          <Spinner />
        </Td>
      </Tr>
    )
  }

  const validate = () => {
    console.log(
      amount,
      menu,
      quantity,
      !amount || +amount == 0 || !menu || !quantity
    )

    return !amount || +amount == 0 || !menu || !quantity
  }

  const dataAlready = () => {
    return data.length > 0 ? (
      data.map((v, i) => (
        <Tr key={i}>
          <Td textAlign="center">{i + 1}</Td>
          <Td>
            <Box textAlign="center">
              <p>{`${formatTime(+v.timestamp)}`}</p>
              <p>{`(${formatDate(+v.timestamp)})`}</p>
            </Box>
          </Td>
          <Td textAlign="center">{v.menu}</Td>
          <Td textAlign="right">{formatCurrency(+v.amount)}</Td>
          <Td textAlign="center">{v.quantity}</Td>
          <Td textAlign="right">{formatCurrency(+v.sum)}</Td>
          <Td>
            <Button
              colorScheme="red"
              onClick={(e) => {
                e.preventDefault()
                setDeleteAmount(v.id)
                onOpen()
              }}
            >
              <DeleteIcon />
            </Button>
          </Td>
        </Tr>
      ))
    ) : (
      <Tr>
        <Td colSpan={7} textAlign="center">
          ไม่พบข้อมูล
        </Td>
      </Tr>
    )
  }

  return (
    <>
      <Box width={1000}>
        <Box width={600} margin="auto">
          <Flex>
            <Input
              placeholder="โปรดเลือกวันและเวลา"
              size="md"
              type="date"
              lang="th"
              value={start}
              max={now()}
              onChange={(e) => {
                setStart(e.currentTarget.value)
              }}
            />
            <Input
              placeholder="โปรดเลือกวันและเวลา"
              size="md"
              type="date"
              lang="th"
              value={end}
              min={start}
              max={now()}
              onChange={(e) => {
                setEnd(e.currentTarget.value)
              }}
            />
          </Flex>
          <HStack spacing="0">
            <Flex w={200}>
              <Select
                id="select"
                size="md"
                value={menu}
                onChange={(e) => setMenu(e)}
                options={option}
                placeholder="เลือกเมนู"
                selectedOptionStyle="check"
              />
            </Flex>
            <InputGroup w={400}>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                fontSize="1.2em"
                children="฿"
              />
              <Input
                placeholder="ราคา"
                type="number"
                onChange={(e) => {
                  setAmount(e.currentTarget.value)
                }}
                onKeyPress={(e) => {
                  if (e.key !== "Enter") return
                  submitData()
                }}
                value={amount}
              />
              <NumberInput
                min={1}
                max={100}
                value={quantity}
                onChange={(n) => setQuantity(Number(n))}
              >
                <NumberInputField placeholder="จำนวน" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Button
                colorScheme="whatsapp"
                isDisabled={validate()}
                onClick={submitData}
                isLoading={loading}
              >
                บันทึก
              </Button>
            </InputGroup>
          </HStack>
        </Box>

        <TableContainer
          margin="auto"
          boxShadow="2xl"
          borderRadius="10px"
          maxH={550}
          style={{
            overflowY: "auto",
          }}
        >
          <Table pos="relative" variant="striped">
            <Thead
              insetBlockStart={0}
              pos="sticky"
              top={0}
              bg="white"
              boxShadow="md"
              // zIndex={10}
            >
              <Tr>
                {header.map((h, i) => (
                  <Td key={i} textAlign="center">
                    {h}
                  </Td>
                ))}
              </Tr>
            </Thead>
            <Tbody>{loading ? Loading() : dataAlready()}</Tbody>
            <Tfoot
              insetBlockEnd={0}
              pos="sticky"
              bottom="0"
              bg="telegram.900"
              color="white"
            >
              <Tr h={20}>
                <Td colSpan={5} textAlign="center">
                  รวม
                </Td>
                <Td colSpan={1} textAlign="right">
                  {calSummary()}
                </Td>
                <Td></Td>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>โปรดยืนยัน</ModalHeader>
          <ModalCloseButton />
          <ModalBody>จะลบจริงป่ะจ๊ะ?</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              หยอกจ๊ะ
            </Button>
            <Button
              colorScheme="red"
              onClick={async (e) => {
                e.preventDefault()
                await deleteData()
                onClose()
              }}
            >
              จริงจ้า
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

// const option = [
//   {
//     label: "ชาเย็น",
//     value: "ชาเย็น",
//   },
//   {
//     label: "กาแฟ",
//     value: "กาแฟ",
//   },
// ]

{
  /* <Select
        size="lg"
        options={option}
        placeholder="เลือกเมนู"
        selectedOptionStyle="check"
      />
      <Select
        size="lg"
        options={option}
        placeholder="เลือกเมนู"
        selectedOptionStyle="check"
      /> */
}
