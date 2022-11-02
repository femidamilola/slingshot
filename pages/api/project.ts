import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prisma";

export default async (req: any, res: any) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    const projects = await prisma.project.findMany();
    console.log(projects);
    res.send({
      content: projects,
    });
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
};
