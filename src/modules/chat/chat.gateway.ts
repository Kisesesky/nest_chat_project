import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JoinChatRoomDto } from './dto/join-chat-room.dto';
import { LeaveChatRoomDto } from './dto/leave-chat-room.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';

@WebSocketGateway(8080)
export class ChatGateway {
  @WebSocketServer()
  server: Server
  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client ${client.id} registered`)
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom (
    @MessageBody() data: JoinChatRoomDto , @ConnectedSocket() client: Socket 
  ) {
    try{
      const chatRoom = await this.chatService.joinChatRoom(data)
      await client.join(chatRoom.id)
      client.emit('joinedChatRoom', {name: chatRoom.name, id: chatRoom.id, userId: data.participantId})
    } catch(error) {
      client.emit('error', { message: error.message })
    }
    
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage (
    @MessageBody() data: { chatRoomId: string, content: string, senderId: string}, @ConnectedSocket() client: Socket
  ) {
    try{
      const message = await this.chatService.createMessage(data)

      this.server.to(data.chatRoomId).emit('receiveMessage', message.content)
    } catch (e) {
      this.server.to(data.chatRoomId).emit('error',(e as Error).message)
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: LeaveChatRoomDto, @ConnectedSocket() client: Socket
  ) {
    try{
      const chatRoom = await this.chatService.leaveChatRoom(data)
      await client.leave(chatRoom.id)

      client.emit('leftRoom', { isActive: chatRoom.isActive, message: 'You have left the chatRoom' })
      console.log(`${client.id}is ${chatRoom.id}to`)
    } catch (e) {
      client.emit('error', {
        message: (e as Error).message
      })
    }
  }

  @SubscribeMessage('editMessage')
  async handleEditMessage(
    @MessageBody() data: EditMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const message = await this.chatService.updateMessage(data)
      client.emit('updatedMessage', { message: message.content })
    } catch(e) {
      client.emit('error', { message:(e as Error).message })

    }
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody() data: DeleteMessageDto,
    @ConnectedSocket() client : Socket
  ) {
    try{
      const deletedMessage = await this.chatService.deleteMessage(data)
      client.emit('deltedMessage', { messageId: deletedMessage })
      console.log(`${deletedMessage} deleted Message`)
    } catch(e) {
      client.emit('error', { message: (e as Error).message})
    }

  }
}
