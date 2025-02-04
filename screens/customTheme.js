import { extendTheme } from "native-base";

export const CustomTheme = extendTheme({
  fonts: {
    heading: "Poppins_700Bold", // For headings (bold)
    body: "Poppins_400Regular", // For body text (regular)
    mono: "Poppins_400Regular", // For monospace (if needed)
  },
  //   fontConfig: {
  //     Poppins: {
  //       400: {
  //         normal: "Poppins_400Regular",
  //       },
  //       700: {
  //         normal: "Poppins_700Bold",
  //       },
  //     },
  //   },
});
