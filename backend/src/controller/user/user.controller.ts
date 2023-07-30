import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/user.schema';
import { UserService } from 'src/service/user/user.service';

@Controller('/api/v1/user')
export class UserController {
    constructor(private readonly userServerice: UserService,
        private jwtService: JwtService
    ) { }

    
    @Post('/signup')
    async Signup(@Res() response, @Body() user: User) {
        console.log(user)
        const newUSer = await this.userServerice.signup(user);
        return response.status(HttpStatus.CREATED).json({
            newUSer
        })
    }

    @Post('/signin')
    async SignIn(@Res() response, @Body() user: User) {
        const token = await this.userServerice.signin(user, this.jwtService);
        return response.status(HttpStatus.OK).json(token)
    }
}
