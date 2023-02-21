import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  Box,
  Grid,
  useToast,
  Flex,
  Spinner,
  transition,
} from "@chakra-ui/react";
import { AccountContext, UserData } from "../context/AccountContext";
import { BsTools, BsCheck2, BsCheck2Circle } from "react-icons/bs";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { Link } from "react-router-dom";
import ProjectReportsHistory from "../components/Reports/ProjectReportsHistory";
import ProjectReportCard from "../components/Reports/ProjectReportCard";
import { baseUrl } from "../utils/origin";
import Layout from "../components/Layout";

interface Project {
  id: string;
  name: string;
  archived: boolean;
  clientName: string;
}

const Projects = () => {
  const toast = useToast();
  const { error, setError, user, projectReport, setProjectReport } =
    useContext(AccountContext);
  const activeUser = user as UserData;
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    return () => {
      fetchData();
    };
  }, []);

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

  if (error) {
    return (
      <Text fontSize="xl" color="red.500">
        Something went wrong: {error}
      </Text>
    );
  }

  return (
    <Layout title={`${activeUser.companyName} Projects`}>
      <Flex justifyContent="space-around">
        <Flex direction="column" w="40%">
          <Flex>
            <HiBuildingOffice2 />
            <Text
              fontWeight="semibold"
              fontSize={{ base: "lg", md: "2xl" }}
              mb="6"
            >
              <span style={{ fontWeight: "bold" }}>Company:</span>{" "}
              {activeUser.companyName}
            </Text>
          </Flex>
          <Text
            fontWeight="semibold"
            fontSize={{ base: "lg", md: "2xl" }}
            mb="6"
          >
            <span style={{ fontWeight: "bold" }}>Owner:</span> {activeUser.name}
          </Text>
          <Text fontSize={{ base: "lg", md: "2xl" }} mb="6">
            <span style={{ fontWeight: "bold" }}>Number of projects:</span>{" "}
            {projects.length}
          </Text>
          <Text fontSize={{ base: "sm", md: "larger" }} mb="6">
            <span style={{ fontWeight: "bold" }}>Tip:</span> If you're creating
            a report for the current project, simply click "generate report" and
            leave the default settings. If you want to generate a report for a
            project that took place some time ago, use the option to add salary
            history for the user <Link to="/salaryHistory">here</Link>. This
            will ensure that the report is generated with the hourly rates that
            were in effect at that time.
          </Text>
          <Text fontSize={{ base: "2xl", md: "2xl" }} mb="6" fontWeight="bold">
            Report History
          </Text>
          <ProjectReportsHistory />
        </Flex>
        {projectReport && <ProjectReportCard projectReport={projectReport} />}

        <Flex justify="center" h="80vh" w={{ base: "full", md: "50%" }} p="4">
          {!projects ? (
            <Spinner />
          ) : (
            <Grid
              m="4"
              w={"min-content"}
              templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(3, 1fr)" }}
              gap={4}
            >
              {projects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`}>
                  <Flex
                    bg="white"
                    border="2px"
                    color="blackAlpha.900"
                    boxShadow="md"
                    minH={170}
                    maxW={150}
                    minW={150}
                    transition="ease-in-out 300ms"
                    position="relative"
                    borderTopLeftRadius="2xl"
                    key={project.id}
                    _hover={{
                      transform: "scale(1.1)",
                      zIndex: 10,
                      transition: "ease 300ms",
                    }}
                    p={{ base: "4", md: "4" }}
                    flexDirection="column"
                    h="full"
                  >
                    <Text
                      w="full"
                      display="flex"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "sm" }}
                      my="4"
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
                      Project: {project.name}
                    </Text>
                    <Text
                      fontWeight="bold"
                      mb="4"
                      fontSize={{ base: "smaller", md: "smaller" }}
                      justifyContent="center"
                      position="relative"
                    >
                      Client: {project.clientName}
                    </Text>
                    <Box
                      position="absolute"
                      right="-5px"
                      bottom="-5px"
                      color="yellow.400"
                      zIndex="3"
                    >
                      {project.archived ? (
                        <BsCheck2Circle color={"green"} fontSize="45" />
                      ) : (
                        <BsTools color={"orange"} fontSize="35" />
                      )}
                    </Box>
                  </Flex>
                </Link>
              ))}
            </Grid>
          )}
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Projects;
