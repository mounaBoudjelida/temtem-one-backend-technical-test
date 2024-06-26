import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  mixin,
} from '@nestjs/common';
import { PredefinedPermissions } from 'src/enums/predefined-permissions.enum';
import { Resource } from 'src/enums/resource.enum';
import { Role } from 'src/enums/role.enum';
import { User } from 'src/modules/users/schemas/user.schema';

export const AuthorizationGuard = (
  resource: Resource,
  action: PredefinedPermissions,
) => {
  class AuthorizationGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const user = context.switchToHttp().getRequest().user as User;
      if (user.role === Role.ADMIN) return true;

      if (
        user.role === Role.GUEST &&
        resource === Resource.PRODUCTS &&
        action === PredefinedPermissions.READ
      ) {
        return true;
      }
      throw new ForbiddenException('FORBIDDEN');
    }
  }
  const guard = mixin(AuthorizationGuardMixin);
  return guard;
};
