import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic'; // Định nghĩa một khóa metadata để đánh dấu các route công khai để bỏ qua xác thực JWT
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); // Tạo một decorator tùy chỉnh @Public() để sử dụng trên các route công khai

export const RESPONSE_MESSAGE = 'ResponseMessage';
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message);