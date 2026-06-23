import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.types";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const isPassWordMatched = await bcrypt.compare(password, user.password);

  if (!isPassWordMatched) {
    throw new Error("Password is incorrect");
  }

  return user;
};

export const authService = {
  loginUser,
};
