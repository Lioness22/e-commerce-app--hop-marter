
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../core/services/ai';


interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css'
})
export class AiChat {

  @ViewChild('chatBody') chatBody!: ElementRef;
  userMessage = '';
  isLoading = false;
  messages: ChatMessage[] = [
    {
      sender: 'bot',
      text: 'Hello! 👋 Welcome to ShopSmart. I am your AI shopping assistant. How can I help you today?'
    }
  ];

  constructor(private aiService: AiService) {}
  sendMessage(): void {
    const message = this.userMessage.trim();

    if (!message || this.isLoading) {
      return;
    }

    this.messages.push({
      sender: 'user',
      text: message
    });

    this.userMessage = '';
    this.isLoading = true;

    this.aiService.sendMessage(message).subscribe({
      next: (response: { data: { aiResponse: any; }; }) => {
        this.messages.push({
          sender: 'bot',
          text: response.data.aiResponse
        });

        this.isLoading = false;
      },

      error: (error: any) => {
        console.error('Chat API Error:', error);

        this.messages.push({
          sender: 'bot',
          text: 'Sorry, I am temporarily unavailable. Please try again later.'
        });

        this.isLoading = false;
      }
    });
  }
}

