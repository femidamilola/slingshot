import prisma from "../../lib/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function noteHandler(req: any, res: any) {
  const { body, method } = req;
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log(session);
  console.log(req.body);

  switch (method) {
    case "POST":
      // Update or create data in your database
      await prisma.note
        .create({
          data: {
            content: body.content,
            requirement: {
              connect: {
                id: body.requirementId,
              },
            },

            owner: {
              connect: {
                email: session!.user!.email!,
              },
            },
          },
        })
        .then((r) => console.log(r));
      res.status(200).json({ message: "Success" });
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
