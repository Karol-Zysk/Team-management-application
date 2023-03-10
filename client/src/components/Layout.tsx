import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";
import PageTitle from "./PageTitle";
import { motion } from "framer-motion";
import Circle from "./Polygon/Circle";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const bg = useColorModeValue("gray.100", "gray.900");
  const bg2 = useColorModeValue("facebook.400", "facebook.600");
  return (
    <Flex>
      <Flex
        flexDirection={["column-reverse", "row"]}
        w="100%"
        minH="70vh"
        height="100%"
      >
        <Flex w="100%" direction={["column"]}>
          <PageTitle title={title} />
          <Box
            w="100%"
            h="100%"
            paddingX={[2, 8, 24]}
            bg={bg2}
            paddingY={[2, 8, 0]}
          >
            <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
              <Flex
                opacity={95}
                bg={bg}
                border="4px"
                mb={[6, 6]}
                paddingX={[8, 4, 12, 36]}
                paddingY={[12, 12, 24]}
              >
                {children}
              </Flex>
            </motion.div>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Layout;
