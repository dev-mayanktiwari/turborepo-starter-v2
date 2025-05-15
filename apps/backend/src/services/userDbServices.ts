import { prisma } from "@repo/db";

export default {
  createUser: (walletAddress: string) => {
    return prisma.user.upsert({
      where: { walletAddress },
      update: {},
      create: {
        walletAddress,
      },
    });
  },
};
