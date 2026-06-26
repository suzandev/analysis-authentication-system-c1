import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, profilePhoto } = payload;
  // Check if user already exists
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  // Hash the password before saving to the database
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  // Create the user in the database
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      // Create the user's profile in the database
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });

  // Fetch the created user along with the profile to return in the response
  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: {
      profile: true,
    },
  });

  return user;
};

export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
};
