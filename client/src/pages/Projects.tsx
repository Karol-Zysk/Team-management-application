import React, { useState, useEffect, useContext } from "react";
import { Text, Box, Grid, Link, useToast, Flex } from "@chakra-ui/react";
import { AccountContext } from "../context/AccountContext";
import { TbFileReport } from "react-icons/tb";

interface Project {
  id: string;
  name: string;
}

const Projects = () => {
  const toast = useToast();
  const { error, setError } = useContext(AccountContext);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("You're not logged in!");
        return;
      }
      try {
        const response = await fetch("http://127.0.0.1:4000/api/v1/projects", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: `${err.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <Text fontSize="xl" color="red.500">
        Something went wrong: {error}
      </Text>
    );
  }

  return (
    <Grid px="24" py="24" w="3/4" templateColumns="repeat(3, 1fr)" gap={6}>
      {projects.map((project) => (
        <Link key={project.id} _hover={{ bg: "blue.400" }} p={6}>
          <Flex
            my="12"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontWeight="bold" mb="6" fontSize="2xl">
              {project.name}
            </Text>
            <Flex align="center">
              <Text mr="4" fontSize="md">
                Generate Project Report
              </Text>
              <TbFileReport size="20" />
            </Flex>
          </Flex>
        </Link>
      ))}
    </Grid>
  );
};

export default Projects;
