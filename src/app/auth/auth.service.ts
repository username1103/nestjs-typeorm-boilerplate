import { Injectable } from '@nestjs/common';
import { AlreadyExistEmailException } from '../../common/exceptions/already-exist-email.exception';
import { HashService } from './hash.service';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository, private readonly hashService: HashService) {}

  async signup({ email, password }: { email: string; password: string }) {
    if (await this.userRepository.isExistEamil(email)) {
      throw new AlreadyExistEmailException();
    }

    const user = new User();
    user.email = email;
    user.password = await this.hashService.hash(password);

    await this.userRepository.save(user);

    return user;
  }
}
