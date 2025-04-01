import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from '../../../common/entities/base.entity';
import { ChatRoom } from '../../chat/entities/chat-room.entity';
import { Message } from './../../chat/entities/message.entity';

@Entity()
export class User extends BaseEntity {
    @Column()
    name: string

    @Column({ nullable: false, unique: true })
    email: string

    @Column()
    password: string

    @ManyToMany(()=>ChatRoom, chatRoom=>chatRoom.participants)
    chatRooms: ChatRoom[]

    @OneToMany(()=>Message, message=>message.sender)
    message: Message[]
}
