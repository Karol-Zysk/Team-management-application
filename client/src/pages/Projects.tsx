import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  Box,
  Grid,
  Link,
  useToast,
  Flex,
  Heading,
  Textarea,
} from "@chakra-ui/react";
import { AccountContext, UserData } from "../context/AccountContext";
import { TbFileReport } from "react-icons/tb";

interface Project {
  id: string;
  name: string;
}

const Projects = () => {
  const toast = useToast();
  const { error, setError, user } = useContext(AccountContext);
  const activeUser = user as UserData;
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
    <Flex justify="space-between" px="24" py="24" w="3/4">
      <Box>
        <Heading mb="6">{activeUser.companyName}</Heading>
        <Text fontSize="larger" mb="6">
          Number of projects {projects.length}
        </Text>
        <Text fontSize="larger" mb="6">
          Select Project to create Report
        </Text>
      </Box>

      <Grid p="4" border="2px" templateColumns="repeat(3, 1fr)" gap={6}>
        {projects.map((project) => (
          <Link
            boxShadow="2xl"
            borderBottom="1px"
            borderRight="1px"
            opacity="0.7"
            key={project.id}
            _hover={{ opacity: "1" }}
            p={6}
          >
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontWeight="bold" mb="6" fontSize="2xl">
                {project.name}
              </Text>
              <Flex align="center">
                <Text mr="4" fontSize="md"></Text>
                <TbFileReport size="25" />
              </Flex>
            </Flex>
          </Link>
        ))}
      </Grid>
    </Flex>
  );
};

export default Projects;
