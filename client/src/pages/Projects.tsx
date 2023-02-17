import React, { useState, useEffect, useContext } from "react";
import { Text, Box, Grid, useToast, Flex } from "@chakra-ui/react";
import { AccountContext, UserData } from "../context/AccountContext";
import { TbFileReport } from "react-icons/tb";
import { Link } from "react-router-dom";
import ProjectReportsHistory from "../components/Reports/ProjectReportsHistory";
import ProjectReportCard from "../components/Reports/ProjectReportCard";
import { baseUrl } from "../utils/origin";

interface Project {
  id: string;
  name: string;
}

const Projects = () => {
  const toast = useToast();
  const { error, setError, user, projectReport, setProjectReport } =
    useContext(AccountContext);
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
        const response = await fetch(`${baseUrl}/projects`, {
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
        setProjectReport(null);
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
    <Flex
      px={{ base: "4", md: "24" }}
      py={{ base: "4", md: "24" }}
      flexDirection={{ base: "column", md: "row" }}
      w="full"
      justify="space-between"
      borderWidth="2px"
    >
      <Box
        w={{ base: "full", md: "40%" }}
        px={{ base: "4", md: "8" }}
        mb={{ base: "8", md: "0" }}
      >
        <Text fontSize={{ base: "2xl", md: "3xl" }} mb="6" fontWeight="bold">
          Company Name: {activeUser.companyName}
        </Text>
        <Text fontSize={{ base: "md", md: "larger" }} mb="6">
          <span style={{ fontWeight: "bold" }}>Owner:</span> {activeUser.name}
        </Text>
        <Text fontSize={{ base: "md", md: "larger" }} mb="6">
          <span style={{ fontWeight: "bold" }}>Number of projects:</span>{" "}
          {projects.length}
        </Text>
        <Text fontSize={{ base: "sm", md: "larger" }} mb="6">
          <span style={{ fontWeight: "bold" }}>Tip:</span> If you're creating a
          report for the current project, simply click "generate report" and
          leave the default settings. If you want to generate a report for a
          project that took place some time ago, use the option to add salary
          history for the user <Link to="/salaryHistory">here</Link>. This will
          ensure that the report is generated with the hourly rates that were in
          effect at that time.
        </Text>
        <Text fontSize={{ base: "2xl", md: "2xl" }} mb="6" fontWeight="bold">
          Report History
        </Text>
        <ProjectReportsHistory />
        {projectReport && <ProjectReportCard projectReport={projectReport} />}
      </Box>
      <Flex justify="center" h="min" w={{ base: "full", md: "40%" }} p="4">
        <Grid
          templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(3, 1fr)" }}
          gap={2}
        >
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Flex
                boxShadow="xl"
                borderRadius="5"
                border="2px"
                opacity="0.7"
                key={project.id}
                _hover={{ opacity: "1" }}
                p={{ base: "4", md: "6" }}
                flexDirection="column"
                alignItems="center"
                justify="center"
                textAlign="center"
                h="full"
              >
                <Text
                  fontWeight="bold"
                  mb="6"
                  fontSize={{ base: "md", md: "md" }}
                  h="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {project.name}
                </Text>
                <Box
                  h="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <TbFileReport fontSize="25" />
                </Box>
              </Flex>
            </Link>
          ))}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default Projects;
