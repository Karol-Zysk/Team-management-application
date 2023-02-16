import React, { useState, useEffect, useContext } from "react";
import { Text, Box, Grid, useToast, Flex } from "@chakra-ui/react";
import { AccountContext, UserData } from "../context/AccountContext";
import { TbFileReport } from "react-icons/tb";
import { Link } from "react-router-dom";
import ProjectReportsHistory from "../components/Reports/ProjectReportsHistory";
import ProjectReportCard from "../components/Reports/ProjectReportCard";

interface Project {
  id: string;
  name: string;
}

const Projects = () => {
  const toast = useToast();
  const { error, setError, user, projectReport } = useContext(AccountContext);
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
    <Flex px="24" py="24" w="3/4" justify="space-between">
      <Box w="50%" px="8">
        <Text fontSize="3xl" mb="6">
          <span style={{ fontWeight: "bold" }}>Company Name: </span>
          {activeUser.companyName}
        </Text>
        <Text fontSize="larger" mb="6">
          <span style={{ fontWeight: "bold" }}>Owner:</span> {activeUser.name}
        </Text>
        <Text fontSize="larger" mb="6">
          <span style={{ fontWeight: "bold" }}>Number of projects:</span>{" "}
          {projects.length}
        </Text>
        <Text fontSize="larger" mb="6">
          <span style={{ fontWeight: "bold" }}>Tip:</span> If you're creating a
          report for the current project, simply click "generate report" and
          leave the default settings. If you want to generate a report for a
          project that took place some time ago, use the option to add salary
          history for the user <Link to="/salaryHistory">here</Link>. This will
          ensure that the report is generated with the hourly rates that were in
          effect at that time.
        </Text>
        <Text fontWeight="bold" fontSize="2xl" mb="6">
          Report History
        </Text>
        <ProjectReportsHistory />
        {projectReport && <ProjectReportCard projectReport={projectReport} />}
      </Box>
      <Flex justify="center" h="min" w="40%" p="4">
        <Grid w="full" templateColumns="repeat(2, 1fr)" gap={2}>
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Flex
                boxShadow="dark-lg"
                borderRadius="5"
                opacity="0.7"
                key={project.id}
                _hover={{ opacity: "1" }}
                p={6}
                flexDirection="column"
                alignItems="center"
                justify="center"
              >
                <Text fontWeight="bold" mb="6" fontSize="md">
                  {project.name}
                </Text>
                <TbFileReport size="25" />
              </Flex>
            </Link>
          ))}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default Projects;
