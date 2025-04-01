import { Injectable } from '@nestjs/common';
import { JoinChatRoomDto } from './dto/join-chat-room.dto';
import { createMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Repository } from 'typeorm';
import { User } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { Message } from './entities/message.entity';
import { LeaveChatRoomDto } from './dto/leave-chat-room.dto';
import { exist } from 'joi';
import { EditMessageDto } from './dto/edit-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private usersService: UsersService
    ) {}
  async joinChatRoom(joinChatRoomDto: JoinChatRoomDto) {
    const { chatRoomId, name, participantId} = joinChatRoomDto
    const user = await this.usersService.findUserById(participantId);
    if (!user) {
      throw new Error('User Not Found');
    }

    let chatRoom = chatRoomId ? await this.findChatRoomById(chatRoomId) : null
    if (!chatRoom) {
      chatRoom = await this.createChatRoom(name || 'new chatRoom', user);
    } else {
      if(!chatRoom.participants.some((participant) => participant.id === user.id)) {
        chatRoom = await this.appendParticipant(chatRoom, user)}
    }
    return chatRoom
  }

  async createMessage (createMessageDto: createMessageDto) {
    const chatRoom = await this.findChatRoomById(createMessageDto.chatRoomId)
    const user = await this.usersService.findUserById(createMessageDto.senderId)

    if(!chatRoom || !user) {
      throw new Error('No Matching chatRoom or user Found')
    }

    const message = this.messageRepository.create({
      chatRoom,
      sender: user,
      content: createMessageDto.content
    })
    return await this.messageRepository.save(message)
  }

  async updateMessage(editMessageDto: EditMessageDto) {
    const { messageId, content, userId } = editMessageDto
    const message = await this.messageRepository.findOne({
      where : { id: messageId },
      relations: ['sender']
    })

    if(!message) {
      throw new Error('No Matching Message Found')
    }
    if(!(message.sender.id === userId)) {
      throw new Error('You can Only delete your own Message')
    }
    message.content = content
    return await this.messageRepository.save(message)
  }

  async deleteMessage(deleteMessageDto: DeleteMessageDto) {
    const { messageId, userId } = deleteMessageDto
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['sender']
    })
    if(!message) {
      throw new Error('No Matching Message Found')
    }
    if(!(message.sender.id === userId)) {
      throw new Error('You can Only delete your own Message')
    }

    await this.messageRepository.remove(message)
    return messageId
  }

  async leaveChatRoom(leaveChatRoomDto:LeaveChatRoomDto) {
    const { chatRoomId, participantId } = leaveChatRoomDto
    const chatRoom = await this.findChatRoomById(chatRoomId)
    if(!chatRoom) { 
      throw new Error('ChatRoom does not exist')
    }
    const user = await this.usersService.findUserById(participantId)
    if(!user) {
      throw new Error('User does not exist')
    }

    const idx = chatRoom.participants.findIndex(participant=>participant.id === user.id)
    if(idx === -1){
      throw new Error('The User has not Joined the ChatRoom')
    }
    chatRoom.participants.splice(idx, 1)

    if(chatRoom.participants.length === 0) {
      chatRoom.isActive = false;
    }
    return await this.chatRoomRepository.save(chatRoom)
  }


  findChatRoomById(id:string) {
    return this.chatRoomRepository.findOne({
      where: { id },
      relations: ['participants']
    })
  }

  createChatRoom(name: string, participant: User) {
    const chatRoom = this.chatRoomRepository.create({
      name,
      participants: [participant]
    })
    return this.chatRoomRepository.save(chatRoom)
  }
  
  appendParticipant(chatRoom: ChatRoom, participant: User) {
    chatRoom.participants.push(participant)
    return this.chatRoomRepository.save(chatRoom)
  }
}
