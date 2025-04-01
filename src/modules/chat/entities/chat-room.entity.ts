import { BaseEntity } from "../../../common/entities/base.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { User } from '../../users/entities/user.entity';
import { Message } from "./message.entity";

@Entity()
export class ChatRoom extends BaseEntity {
    @Column()
    name: string

    @ManyToMany(()=>User, user=>user.chatRooms)
    @JoinTable()
    participants: User[]

    @OneToMany(()=>Message, message=>message.chatRoom)
    messages: Message[]
}
