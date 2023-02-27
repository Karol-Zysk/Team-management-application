import { Box, Flex } from "@chakra-ui/react";

type CircleProps = {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  backgroundColor?: string;
  width?: string;
  height?: string;
};

const Circle: React.FC<CircleProps> = ({
  top,
  left,
  bottom,
  right,
  backgroundColor,
  width,
  height,
}) => {
  return (
    <div
      style={{
        top,
        left,
        bottom,
        right,
        backgroundColor,
        width,
        height,
        borderRadius: "100%",
        opacity: 1,
        position: "absolute",
        zIndex: 1000,
        margin: "auto",
      }}
    />
  );
};

export default Circle;
