import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prisma";

export default async (req: any, res: any) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    const requirements = await prisma.requirement.findMany({
      include: {
        notes: true,
      },
    });
    console.log(requirements);
    res.send({
      content: requirements,
    });
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
};
