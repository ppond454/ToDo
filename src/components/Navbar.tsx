import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react"
import { useLocation, Link } from "react-router-dom"

export default function Nav() {
  const location = useLocation()
  const header = [
    {
      text: "โอนเงิน",
      path: "/transection",
    },
    {
      text: "เครื่องดื่ม",
      path: "/breverage",
    },
    {
      text: "อาหาร",
      path: "/food",
    },
    {
      text: "อื่นๆ",
      path: "#",
    },
  ]

  return (
    <>
      <Flex
        h="70px"
        pos="fixed"
        top={0}
        left={0}
        w="100%"
        bgColor="linkedin.700"
        boxShadow="xl"
        justify="center"
        color="white"
      >
        <HStack spacing="0px">
          {header.map((h) => (
            <Box
              borderRadius="5px"
              w="100px"
              h="70px"
              paddingY="20px"
              bgColor={h.path === location.pathname ? "linkedin.900" : ""}
            >
              <Link
                to={h.path}
                style={{
                  color: "white",
                }}
              >
                <Text textAlign="center" fontWeight="bold">
                  {h.text}
                </Text>
              </Link>
            </Box>
          ))}
        </HStack>
      </Flex>
    </>
  )
}
