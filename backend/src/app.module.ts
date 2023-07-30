import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './service/user/user.service';
import { VideoService } from './service/video/video.service';
import { UserController } from './controller/user/user.controller';
import { VideoController } from './controller/video/video.controller';
import { User, UserSchema } from './model/user.schema';
import { Video, VideoSchema } from './model/video.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { JwtModule } from '@nestjs/jwt';
import { secret } from './utils/constants';
import { join } from 'path/posix';
import { ServeStaticModule } from '@nestjs/serve-static';
import { isAuthenticated } from './app.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/testDb'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]), 
    MulterModule.register({
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const ext = file.mimetype.split('/')[1];
          cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
        },
      })
    }),
    JwtModule.register({
     secret,
     signOptions: { expiresIn: '2h' },
   }),
   ServeStaticModule.forRoot({
     rootPath: join(__dirname, '..', 'public'),
   }),
  ],
  controllers: [AppController, UserController, VideoController],
  providers: [AppService, UserService, VideoService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: 'api/v1/video/:id', method: RequestMethod.GET }
      )
      .forRoutes(VideoController);
  }
}
