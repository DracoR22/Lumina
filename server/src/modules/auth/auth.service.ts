import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { PrismaService } from "src/common/db/prisma.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import bcrypt from "bcrypt"

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    //---------------------------------------//REFRESH TOKEN//---------------------------------------//
    async refreshToken(req: Request, res: Response): Promise<string>{
        const refreshToken = req.cookies('refresh_token')

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found')
        }

        let payload

        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
            })
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token')
        }

        const userExists = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        })

        if (!userExists) {
            throw new BadRequestException('User does not exist')
        }

        const expiresIn = 15000

        const expiration = Math.floor(Date.now() / 100) + expiresIn

        const accessToken = this.jwtService.sign({
            ...payload, exp: expiration
        }, {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET')
        })

        res.cookie('access_token', accessToken, { httpOnly: true })

        return accessToken
    }

    //---------------------------------------//SEND TOKEN//---------------------------------------//
    private async issueToken(user: User, res: Response) {
        const payload = { username: user.fullname, sub: user.id }

        const accessToken = this.jwtService.sign({
            ...payload
        }, {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: '150sec'
        })

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            expiresIn: '7d'
        })

        res.cookie('access_token', accessToken, { httpOnly: true })
        res.cookie('refresh_token', refreshToken, { httpOnly: true })

        return { user }
    }

    //-----------------------------------//COMPARE PASSWORD AND VALIDATE USER//------------------------//
    async validateUser(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: loginDto.email
            }
        })

        // if (user && (await bcrypt.compare(loginDto.password, user.password))) {
        //     return user
        // }

        if (user && loginDto.password === user.password) {
            return user
        }

        return null
    }

    //--------------------------------------------//SIGN UP//----------------------------------------//
    async register(registerDto: RegisterDto, res: Response) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                email: registerDto.email
            }
        })

         if (existingUser) {
            throw new BadRequestException({ email: 'Email already in use' })
         }

         // Hash password
        //  const hashedPassword = bcrypt.hash(registerDto.password, 10)

         // Create user
         const user = await this.prisma.user.create({
            data: {
                fullname: registerDto.fullname,
                password: registerDto.password,
                email: registerDto.email,
            }
         })

         if (!user) {
            throw new BadRequestException({ user: 'Could not create user' })
         }

         return this.issueToken(user, res)
    }

    //------------------------------------------//LOGIN//------------------------------------------//
    async login(loginDto: LoginDto, res: Response) {
        const user = await this.validateUser(loginDto)

        if (!user) {
            throw new BadRequestException({ invalidCredentials: 'Invalid credentials' })
        }

        return this.issueToken(user, res)
    }

    //------------------------------------------//LOGOUT//------------------------------------------//
    async logout(res: Response) {
        res.clearCookie('access_token')
        res.clearCookie('refresh_token')

        return 'Succesfully logged out'
    }
}