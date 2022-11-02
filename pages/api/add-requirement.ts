import prisma from "../../lib/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function requirementHandler(req: any, res: any) {
  const { body, method } = req;
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log(session);
  console.log(req.body);

  switch (method) {
    case "POST":
      // Update or create data in your database
      await prisma.requirement
        .create({
          data: {
            title: body.title,
            project: {
              connect: {
                id: body.projectId,
              },
            },
            time: {
              create: {
                time: body.time,
              },
            },
            // owner: {
            //   connect: {
            //     id: session.user.id,
            //     email: session.user.email,
            //   },
            // },
          },
        })
        .then((r) => console.log(r));
      res
        .status(200)
        .json({ message: `Successfully created requirement ${body.title}` });
      break;
    case "PUT":
      await prisma.requirement
        .upsert({
          where: {
            id: body.id,
          },
          update: {
            title: body.title,
            project: {
              connect: {
                id: body.projectId,
              },
            },
            time: {
              update: {
                time: body.time,
              },
            },
            // owner: {
            //   connect: {
            //     id: session.user.id,
            //     email: session.user.email,
            //   },
            // },
          },
          create: {
            title: body.title,
            project: {
              connect: {
                id: body.projectId,
              },
            },
            time: {
              create: {
                time: body.time,
              },
            },
          },
        })
        .then((r) => console.log(r));
      res
        .status(200)
        .json({ message: `Successfully updated requirement ${body.title}` });
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
