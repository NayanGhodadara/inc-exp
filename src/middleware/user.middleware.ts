import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDto } from "../api/user/dto/user.dto";

export const DeviceContext = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserDto => {
        const req = ctx.switchToHttp().getRequest();
        return req.user
    }
)