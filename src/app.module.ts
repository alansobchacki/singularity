import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './infrastructure/data-source';
import { AuthenticationUserModule } from './scopes/authenticationUser/authenticationUser.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions), 
    AuthenticationUserModule, AuthModule
  ],
  controllers: [AppController],
})

export class AppModule {}
