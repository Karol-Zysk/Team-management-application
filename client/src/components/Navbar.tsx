import {
  Box,
  Flex,
  Link,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  HStack,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import { motion } from "framer-motion";

type LinkType = {
  children: {
    link: string;
    href: string;
  };
};

const Links = [
  {
    link: "Main",
    href: "main",
  },
  {
    link: "Employees",
    href: "employees",
  },
  {
    link: "Projects",
    href: "projects",
  },
  {
    link: "Salaries",
    href: "salaries",
  },
];

const NavLink: React.FC<LinkType> = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={children.href}
  >
    {children.link}
  </Link>
);

export default function Nav({}) {
  const { isSync } = useContext(AccountContext);

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box fontSize="3xl" fontWeight="bold">
              Teamy
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {isSync &&
                Links.map((links) => (
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <NavLink key={links.link}>{links}</NavLink>
                  </motion.div>
                ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"} marginRight="2">
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Flex>
        </Flex>

        {isOpen ? (
          <>
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {Links.map((links) => (
                  <NavLink key={links.href}>{links}</NavLink>
                ))}
              </Stack>
            </Box>
          </>
        ) : null}
      </Box>
    </>
  );
}
