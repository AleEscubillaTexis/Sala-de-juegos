import { ChatPreguntadosService } from '../../../services/chat-preguntados.service';
import { Component, Input, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from '../../../classes/message';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-chat-preguntados',
  templateUrl: './chat-preguntados.component.html',
  styleUrls: ['./chat-preguntados.component.css']
})
export class ChatPreguntadosComponent implements AfterViewInit, OnInit {
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  message: Message;
  item$: Observable<any[]>;
  token: any;
  d = new Date();
  private scrollContainer: any;


  constructor(private router: Router, public firestore: ChatPreguntadosService) {
    this.message = new Message();
    this.item$ = firestore.getAll().valueChanges();
    this.message.user = localStorage.getItem('token') || 'Anonimo';
    this.message.datetime = this.d.getHours() + ':' + this.d.getMinutes();
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    if (this.token == null) {
      this.router.navigateByUrl("login");
    }
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  sendMessage() {
    this.firestore.create(this.message).then(() => {
      this.message.message = '';
      console.log('mensaje enviado', this.token);
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl("login");
  }
}