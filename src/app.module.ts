import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './infrastructure/data-source';
import { AuthenticationUserModule } from './scopes/authenticationUser/authenticationUser.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions), 
    AuthenticationUserModule,
  ],
})

export class AppModule {}
