import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import { BsBorderRight, BsCheck } from "react-icons/bs";

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  const shadow = useColorModeValue("1px 1px 1px  black", "1px 1px 1px  gray");
  const bg = useColorModeValue("facebook.400", "facebook.600");

  return (
    <Box
      textShadow={shadow}
      w="100%"
      h="min"
      px="16"
      py="8"
      bg={bg}
      opacity={1}
    >
      <Heading fontSize="4xl" as="h1">
        {title}
      </Heading>
    </Box>
  );
};
export default PageTitle;
