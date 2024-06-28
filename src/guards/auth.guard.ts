import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  mixin,
} from '@nestjs/common';
import { Action } from 'src/enums/actions.enum';
import { Role } from 'src/enums/role.enum';
import { User } from 'src/modules/users/schemas/user.schema';

export const AuthorizationGuard = (action: Action) => {
  class AuthorizationGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const user = context.switchToHttp().getRequest().user as User;
      if (user.role === Role.ADMIN) return true;

      if (
        user.role === Role.GUEST &&
        user.permissions.some((permission) => permission === action)
      ) {
        return true;
      }
      throw new ForbiddenException('FORBIDDEN');
    }
  }
  const guard = mixin(AuthorizationGuardMixin);
  return guard;
};
