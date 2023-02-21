import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsCheck2Circle, BsTools } from "react-icons/bs";
import { Link } from "react-router-dom";
import { UserData } from "../../context/AccountContext";
import { motion } from "framer-motion";
import { Project } from "../../interfaces/ProjectReportInterface";

interface GridProjectInterface {
  projects: Project[];
  activeUser: UserData;
}

const ProjectGrid: React.FC<GridProjectInterface> = ({
  projects,
  activeUser,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const shadow = useColorModeValue("2px 2px 4px black", "2px 2px 2px white");
  const bg = useColorModeValue("facebook.100", "facebook.600");
  const iconColor = useColorModeValue("green", "lightgreen");

  const projectsPerPage = 9;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  return (
    <Flex direction="column" transform={["none", "translate(60px , -60px)"]}>
      <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
          }}
          gap={{ base: 4, md: 3 }}
        >
          {currentProjects.map((project) => {
            return (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Flex
                  border="2px"
                  boxShadow={shadow}
                  borderRadius="lg"
                  bg={bg}
                  maxH={210}
                  minH={210}
                  maxW={180}
                  minW={180}
                  transition="ease-in-out 300ms"
                  position="relative"
                  opacity="0.8"
                  key={project.id}
                  _hover={{
                    transform: "scale(1.05)",
                    zIndex: 10,
                    transition: "ease 200ms",
                    opacity: 1,
                  }}
                  p={{ base: "4", md: "4" }}
                  flexDirection="column"
                >
                  <Text
                    w="full"
                    display="flex"
                    fontWeight="bold"
                    fontSize={{ base: "sm", md: "md" }}
                    mb="4"
                    justifyContent="center"
                  >
                    {activeUser.companyName}
                  </Text>
                  <Text
                    fontWeight="bold"
                    fontSize={{ base: "smaller", md: "smaller" }}
                    mb="6"
                    justifyContent="center"
                    position="relative"
                  >
                    Project:{" "}
                    <Text as="span" ml="1" fontWeight="normal">
                      {project.name}
                    </Text>
                  </Text>
                  <Text
                    fontWeight="bold"
                    mb="4"
                    fontSize={{ base: "smaller", md: "smaller" }}
                    justifyContent="center"
                    position="relative"
                  >
                    Client:{" "}
                    <Text as="span" ml="1" fontWeight="normal">
                      {project.clientName}
                    </Text>
                  </Text>
                  <Box
                    position="absolute"
                    right="-5px"
                    bottom="-5px"
                    color="yellow.400"
                    zIndex="3"
                  >
                    {project.archived ? (
                      <BsCheck2Circle color={iconColor} fontSize="45" />
                    ) : (
                      <BsTools color={"orange"} fontSize="35" />
                    )}
                  </Box>
                </Flex>
              </Link>
            );
          })}
        </Grid>
      </motion.div>
      <Flex justifyContent="center" alignItems="center" mt="4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            variant={i + 1 === currentPage ? "solid" : "ghost"}
            colorScheme="blue"
            mx="1"
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};
export default ProjectGrid;
