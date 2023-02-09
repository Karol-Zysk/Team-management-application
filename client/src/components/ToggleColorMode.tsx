import { Button } from "@chakra-ui/button";
import { useColorMode } from "@chakra-ui/color-mode";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

interface ColorMode {
  colorMode: "light" | "dark";
  toggleColorMode: () => void;
}

const ToggleColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode() as ColorMode;

  return (
    <Button
      onClick={() => toggleColorMode()}
      pos="absolute"
      top="0"
      right="0"
      m="1rem"
      zIndex="20"
    >
      {colorMode === "dark" ? (
        <SunIcon color="yellow.100" />
      ) : (
        <MoonIcon color="blue.700" />
      )}
    </Button>
  );
};

export default ToggleColorMode;
