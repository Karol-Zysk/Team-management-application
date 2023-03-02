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
import ApiClient from "../utils/ApiClient";

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
    const apiClient = new ApiClient();
    try {
      const response = await apiClient.get<Project[]>("/projects");
      setProjects(response);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${error}`,
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
    <Layout
      title={`${
        activeUser.companyName ? activeUser.companyName : "Your"
      } Projects`}
    >
      {projects.length >= 0 ? (
        <Flex
          direction={[
            "column-reverse",
            "column-reverse",
            "column-reverse",
            "row",
          ]}
        >
          <Flex
            mt={[12, 12, 0]}
            direction="column"
            w={["100%", "100%", "100%", "60%"]}
          >
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
            <Text
              fontSize={{ base: "2xl", md: "2xl" }}
              mb="6"
              fontWeight="bold"
            >
              Report History
            </Text>
            <ProjectReportsHistory />
          </Flex>
          <Flex
            justify="center"
            p={["0", "4"]}
            w={["100%", "100%", "100%", "50%"]}
          >
            {!projects ? (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.300"
                color="facebook.400"
                size="xl"
              />
            ) : (
              <ProjectGrid projects={projects} activeUser={activeUser} />
            )}
          </Flex>
        </Flex>
      ) : (
        <Flex minH="50vh" w="full" justify="center" align="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.300"
            color="facebook.400"
            size="xl"
          />
        </Flex>
      )}
    </Layout>
  );
};

export default Projects;
