import React, { useState, useEffect, useContext } from "react";
import { Text, useToast, Flex, Spinner } from "@chakra-ui/react";
import { AccountContext, UserData } from "../context/AccountContext";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { FaProjectDiagram, FaUserTie } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProjectReportsHistory from "../components/Projects/ProjectReportsHistory";
import { baseUrl } from "../utils/origin";
import Layout from "../components/Layout";
import ProjectGrid from "../components/Projects/ProjectGrid";
import { Project } from "../interfaces/ProjectReportInterface";

const Projects = () => {
  const toast = useToast();
  const { error, setError, user, setProjectReport } =
    useContext(AccountContext);
  const activeUser = user as UserData;
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchData();
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
  if (projects.length <= 0) {
    return <Spinner />;
  }

  return (
    <Layout title={`${activeUser.companyName} Projects`}>
      <Flex justifyContent="space-around">
        <Flex direction="column" w="50%">
          <Flex mb="6" align="center">
            <HiBuildingOffice2 fontSize={32} />
            <Text
              fontWeight="semibold"
              ml="2"
              fontSize={{ base: "lg", md: "xl" }}
            >
              <span style={{ fontWeight: "bold" }}>Company:</span>{" "}
              {activeUser.companyName}
            </Text>
          </Flex>
          <Flex mb="6" align="center">
            <FaUserTie fontSize={32} />
            <Text
              fontWeight="semibold"
              ml="2"
              fontSize={{ base: "lg", md: "xl" }}
            >
              <span style={{ fontWeight: "bold" }}>Owner:</span>{" "}
              {activeUser.name}
            </Text>
          </Flex>
          <Flex mb="6" align="center">
            <FaProjectDiagram fontSize={32} />
            <Text
              fontWeight="semibold"
              ml="2"
              fontSize={{ base: "lg", md: "xl" }}
            >
              <span style={{ fontWeight: "bold" }}>Number Of Projects:</span>{" "}
              {projects.length}
            </Text>
          </Flex>

          <Text fontSize={{ base: "md", md: "lg" }} mb="12">
            <span style={{ fontWeight: "bold" }}>Tip:</span> If you want to
            generate a report for a project that took place some time ago, use
            the option to add salary history for the user{" "}
            <Text decoration="underline" as="span">
              <Link to="/salaryHistory">here</Link>
            </Text>
            . This will ensure that the report is generated with the hourly
            rates that were in effect at that time.
          </Text>
          <Text fontSize={{ base: "2xl", md: "2xl" }} mb="6" fontWeight="bold">
            Report History
          </Text>
          <ProjectReportsHistory />
        </Flex>
        <Flex justify="center" p="4" w="50%">
          {!projects ? (
            <Spinner />
          ) : (
            <ProjectGrid projects={projects} activeUser={activeUser} />
          )}
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Projects;
