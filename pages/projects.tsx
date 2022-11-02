import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

export default function Projects({ projects }: { projects: any[] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [projectList, setProjectList] = React.useState([] as any);

  React.useEffect(() => {
    fetchData();
  }, []);
  const toast = useToast();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const fetchData = async () => {
    await fetch("/api/project")
      .then((r) => r.json())
      .then((data) => {
        const re = data?.content ? data : { content: [] };
        setProjectList([...re?.content]);
      });
  };

  const handleSubmit = async (data: any) => {
    console.log(data);
    setLoading(true);
    await fetch("/api/add-project", {
      method: "POST", // *GET, POST, PUT, DELETE, etc. // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
      .then((r) => {
        console.log(r);
        onClose();
        // alert("Complete");
        toast({
          title: "Project created.",
          description: "We've created your project for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        fetchData();
        setLoading(false);
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: "An error occurred.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
      });
  };
  return (
    <>
      <div className="bg-white">
        <div className="mt-3 flex justify-end mx-8">
          <Button
            leftIcon={<AddIcon />}
            onClick={onOpen}
            colorScheme="teal"
            variant="solid"
          >
            Add Project
          </Button>
        </div>
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Projects
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {projectList.length > 0 &&
              projectList.map((product: any) => (
                <Link
                  key={product.id}
                  href={"#"}
                  className="group bg-gray-200 rounded-lg py-5 px-5"
                >
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg xl:aspect-w-7 xl:aspect-h-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                      {product.title}
                    </h2>
                  </div>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {product.description}
                  </p>
                </Link>
              ))}
            {!(projectList.length > 0) && <div>You have no projects</div>}
          </div>
        </div>
      </div>

      <>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create a Project</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  rows={3}
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={loading}
                colorScheme="blue"
                mr={3}
                spinner={<BeatLoader size={8} color="white" />}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit({
                    title,
                    description,
                  });
                }}
              >
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
}

export const getServerSideProps = async ({ req }: any) => {
  const token = req.headers.AUTHORIZATION;
  const session = await getSession({ req });
  let projects: any[];
  if (session && session.user) {
    projects = await prisma.project.findMany({
      where: {
        owner: { email: session!.user!.email! },
      },
    });
  } else {
    projects = [];
  }
  return { props: { projects } };
};
