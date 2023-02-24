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

const ProjectGrid: React.FC<GridProjectInterface> = ({ projects }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const shadow = useColorModeValue("3px 3px 4px black", "3px 3px 3px white");
  const bg = useColorModeValue("facebook.200", "facebook.500");
  const iconColor = useColorModeValue("green", "lightgreen");

  const projectsPerPage = 12;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  return (
    <Flex
      direction="column"
      m={[-4, -4, -4, 0]}
      mt={[8, 0, 0, 0]}
      transform={["none", "none", "none", "translate(60px , -60px)"]}
    >
      <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
        <Grid
          templateColumns={[
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
            "repeat(4, 1fr)",
            "repeat(3, 1fr)",
          ]}
          gap={{ base: 2, md: 3 }}
        >
          {currentProjects.map((project) => {
            return (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Flex
                  border="1px"
                  rounded="md"
                  boxShadow={shadow}
                  bg={bg}
                  maxH={[160, 200]}
                  minH={[160, 200]}
                  maxW={["auto", 140]}
                  minW={["auto", 140]}
                  transition="ease-in-out 300ms"
                  position="relative"
                  key={project.id}
                  _hover={{
                    transform: "scale(1.05)",
                    zIndex: 10,
                    transition: "ease 200ms",
                  }}
                  p={{ base: "4", md: "4" }}
                  flexDirection={["column"]}
                >
                  <Text
                    fontWeight="bold"
                    style={{ fontSize: "12px" }}
                    justifyContent="center"
                    position="relative"
                  >
                    Project:
                  </Text>
                  <Text
                    style={{ fontSize: "13px" }}
                    mb="2"
                    fontWeight="semibold"
                  >
                    {project.name}
                  </Text>
                  <Text
                    fontWeight="bold"
                    style={{ fontSize: "13px" }}
                    justifyContent="center"
                    position="relative"
                  >
                    Client:{" "}
                  </Text>
                  <Text style={{ fontSize: "14px" }} fontWeight="semibold">
                    {project.clientName}
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
