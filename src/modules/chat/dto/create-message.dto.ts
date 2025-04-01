import { IsString } from "class-validator"

export class createMessageDto {
    @IsString()    
    chatRoomId: string

    @IsString()
    content: string

    @IsString()
    senderId: string
}