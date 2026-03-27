import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChatMessage } from './models/chat-message.model';
import { ChatActions } from './store/chat.actions';
import { selectAllMessages, selectChatError, selectChatLoading } from './store/chat.selectors';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewChecked {
  private readonly store = inject(Store);

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;

  readonly messages$: Observable<ChatMessage[]> = this.store.select(selectAllMessages);
  readonly isLoading$: Observable<boolean>      = this.store.select(selectChatLoading);
  readonly error$: Observable<string | null>    = this.store.select(selectChatError);

  readonly messageControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(2000)]
  });

  private shouldScrollToBottom = false;

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
      this.shouldScrollToBottom = false;
    }
  }

  sendMessage(): void {
    const content = this.messageControl.value.trim();
    if (!content) return;

    this.store.dispatch(ChatActions.sendMessage({ content, messageId: crypto.randomUUID() }));
    this.messageControl.setValue('');
    this.shouldScrollToBottom = true;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearError(): void {
    this.store.dispatch(ChatActions.clearError());
  }

  trackByMessageId(_: number, message: ChatMessage): string {
    return message.id;
  }
}
