import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { DatabaseModule } from '../../../common/config/database/database.module';
import { AlreadyExistEmailException } from '../../../common/exceptions/already-exist-email.exception';
import { UserModule } from '../../user/user.module';
import { UserRepository } from '../../user/user.repository';
import { getUser } from '../../user/__test__/user.fixture';
import { AuthService } from '../auth.service';
import { HashService } from '../hash.service';

describe('Auth Service Test', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let dataSource: DataSource;
  let hashService: HashService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule, UserModule],
      providers: [AuthService, HashService],
    }).compile();

    authService = module.get(AuthService);
    userRepository = module.get(UserRepository);
    dataSource = module.get(DataSource);
    hashService = module.get(HashService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  describe('signup', () => {
    test('유저 정보가 정상적으로 생성되는가', async () => {
      // given
      const email = 'test@test.com';
      const password = 'test';

      // when
      const result = authService.signup({ email, password });

      // then
      await expect(result).resolves.toMatchObject({
        id: expect.any(Number),
        email: 'test@test.com',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      await expect(hashService.compare(password, (await result).password)).resolves.toEqual(true);
    });
    test('이메일이 존재하는 경우 AlreadyExistEmailException이 발생하는가', async () => {
      // given
      const user = getUser();
      await userRepository.save(user);

      // when
      const result = authService.signup({ email: user.email, password: 'test' });

      // then
      await expect(result).rejects.toThrow(AlreadyExistEmailException);
    });
  });
});
