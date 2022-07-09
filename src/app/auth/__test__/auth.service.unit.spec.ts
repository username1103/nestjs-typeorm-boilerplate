import { anyString, anything, instance, mock, when } from 'ts-mockito';
import { AlreadyExistEmailException } from '../../../common/exceptions/already-exist-email.exception';
import { HashService } from '../hash.service';
import { User } from '../../user/user.entity';
import { UserRepository } from '../../user/user.repository';
import { AuthService } from '../auth.service';

describe('Auth Service Unit Test', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  const hashService: HashService = new HashService();

  describe('signup', () => {
    test('해당하는 이메일로 가입된 유저가 이미 존재하는 경우 AlreadyExistEmailException이 발생하는가', async () => {
      // given
      const email = 'test@test.com';
      const password = 'test';
      userRepository = mock(UserRepository);
      when(userRepository.isExistEamil(anyString())).thenResolve(true);

      authService = new AuthService(instance(userRepository), hashService);

      // when
      const result = authService.signup({ email, password });

      // then
      await expect(result).rejects.toThrow(AlreadyExistEmailException);
    });

    test('해당하는 이메일로 가입된 유저가 없는 경우 생성된 유저가 리턴되는가', async () => {
      // given
      const email = 'test@test.com';
      const password = 'test';
      userRepository = mock(UserRepository);
      when(userRepository.isExistEamil(anyString())).thenResolve(false);
      when(userRepository.save(anything())).thenCall((user: User) => {
        user.id = 1;
        user.createdAt = new Date();
        user.updatedAt = new Date();
        return user;
      });

      authService = new AuthService(instance(userRepository), hashService);

      // when
      const result = authService.signup({ email, password });

      // then
      await expect(result).resolves.toMatchObject({
        id: 1,
        email,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      await expect(hashService.compare(password, (await result).password)).resolves.toEqual(true);
    });
  });
});
