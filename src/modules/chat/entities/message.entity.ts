import { BaseEntity } from "../../../common/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { ChatRoom } from "./chat-room.entity";
import { User } from './../../users/entities/user.entity';

@Entity()
export class Message extends BaseEntity{
    @Column()
    content: string

    @ManyToOne(()=>ChatRoom, chatRoom=>chatRoom.messages)
    chatRoom: ChatRoom
    
    @ManyToOne(()=> User, user=>user.message)
    sender: User
}
