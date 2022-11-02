import prisma from "../../lib/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function projectHandler(req: any, res: any) {
  const { body, method } = req;
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log(session);
  console.log(req.body);

  if (session && session.user) {
    switch (method) {
      case "POST":
        // Update or create data in your database
        await prisma.project
          .create({
            data: {
              title: body.title,
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
  } else {
    res.send({
      error: "You must be signed in to access this route.",
    });
  }
}
