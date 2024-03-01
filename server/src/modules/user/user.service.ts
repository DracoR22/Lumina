import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
    ) {}

//-------------------------------------------//GET ALL USERS//------------------------------------------//
    async getUsers() {
        return this.prisma.user.findMany({
            include: {
                posts: true
            }
        })
    }
}