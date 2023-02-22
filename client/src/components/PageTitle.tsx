import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import { BsBorderRight, BsCheck } from "react-icons/bs";

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  const shadow = useColorModeValue("2px 2px 2px  black", "2px 2px 2px  black");
  const bg = useColorModeValue("facebook.400", "facebook.600");

  return (
    <Box w="100%" h="min" px="16" py="6" bg={bg} opacity={1}>
      <Heading textShadow={shadow} fontSize="4xl" fontWeight="semibold" as="h1">
        {title}
      </Heading>
    </Box>
  );
};
export default PageTitle;
