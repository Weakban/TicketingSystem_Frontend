import { Toaster as ChakraToaster, createToaster, Toast } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => (
  <ChakraToaster toaster={toaster}>
    {(toast) => (
      <Toast.Root>
        <Toast.Title>{toast.title}</Toast.Title>
        <Toast.Description>{toast.description}</Toast.Description>
        <Toast.CloseTrigger />
      </Toast.Root>
    )}
  </ChakraToaster>
);
