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

type TResult = {
  id: string
  amount: number
  timestamp: number
  comm: number
}
export default function Transection() {
  const [data, setData] = useState<TResult[]>([])
  const [amount, setAmount] = useState("")
  const [deleteAmount, setDeleteAmount] = useState("")
  const [comm, setComm] = useState("")

  const [loading, setLoading] = useState(false)

  const [start, setStart] = useState(now())
  const [end, setEnd] = useState(now())
  const { isOpen, onOpen, onClose } = useDisclosure()

  const COLECTTION = "transection"

  const header = ["รายการ", "เวลา", "จำนวนเงิน", "ค่าธรรมเนียม", ""]

  useEffect(() => {
    getData()
  }, [start, end])

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
    if (!amount || +amount == 0) return
    if (!comm || +comm == 0) return

    const data = {
      amount,
      timestamp: Date.now(),
      comm,
    }
    await setDoc(doc(db, COLECTTION, uuidv4()), data)
    await getData()
    setAmount("")
    setComm("")
  }

  const deleteData = async () => {
    await deleteDoc(doc(db, "transection", deleteAmount))
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

  const calCommSummary = () => {
    if (data.length <= 0) return "0.00"
    return formatCurrency(
      data.reduce((acc, b) => {
        return acc + +b.comm
      }, 0)
    )
  }

  const Loading = () => {
    return (
      <Tr>
        <Td colSpan={5} textAlign="center">
          <Spinner />
        </Td>
      </Tr>
    )
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
          <Td textAlign="right">{formatCurrency(+v.amount)}</Td>
          <Td textAlign="right">{formatCurrency(+v.comm)}</Td>

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
        <Td colSpan={5} textAlign="center">
          ไม่พบข้อมูล
        </Td>
      </Tr>
    )
  }

  return (
    <>
      <Box width={700}>
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
        <Flex>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              color="gray.300"
              fontSize="1.2em"
              children="฿"
            />
            <Input
              placeholder="จำนวนเงิน"
              type="number"
              onChange={(e) => {
                setAmount(e.currentTarget.value)
              }}
              value={amount}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              color="gray.300"
              fontSize="1.2em"
              children="฿"
            />
            <Input
              placeholder="ค่าธรรมเนียม"
              type="number"
              onChange={(e) => {
                setComm(e.currentTarget.value)
              }}
              onKeyPress={(e) => {
                if (e.key !== "Enter") return
                submitData()
              }}
              value={comm}
            />
            <Button
              colorScheme="whatsapp"
              isDisabled={+amount <= 0}
              onClick={submitData}
              isLoading={loading}
            >
              บันทึก
            </Button>
          </InputGroup>
        </Flex>

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
              zIndex={10}
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
                <Td colSpan={2} textAlign="center">
                  รวม
                </Td>
                <Td colSpan={1} textAlign="right">
                  {calSummary()}
                </Td>
                <Td colSpan={1} textAlign="right">
                  {calCommSummary()}
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
