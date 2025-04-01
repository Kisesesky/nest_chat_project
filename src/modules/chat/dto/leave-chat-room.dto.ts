import { IsString } from "class-validator"

export class LeaveChatRoomDto {
    @IsString()
    chatRoomId: string

    @IsString()
    participantId: string
}