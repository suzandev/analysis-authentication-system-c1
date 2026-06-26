import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.types";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const isPassWordMatched = await bcrypt.compare(password, user.password);

  if (!isPassWordMatched) {
    throw new Error("Password is incorrect");
  }

  // for accessToken and refreshToken
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // accessToken
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  // refreshToken
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  loginUser,
};
