import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DataService } from '../../providers/providers';
import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs";
import { merge } from 'rxjs/observable/merge';
import { take, switchMap, mergeMap, skip, mapTo, finalize } from 'rxjs/operators';

export interface article {
  author: string, description: string, publishedAt: string, source: { id: string, name: string }, title: string, url: string, urlToImage: string
}
@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage implements OnInit {
  showNotification$: Observable<boolean>;
  update$ = new Subject<void>(); 
  isLoading: boolean;
  articles$: Observable<Array<article>>;
  forceReload$ = new Subject<void>();
  constructor(public navCtrl: NavController, private data: DataService) {
  
  }

  ngOnInit() {
    this.isLoading = true;
    const initialArticles$ = this.getNewsOnce();    
    const updates$ = merge(this.update$, this.forceReload$).pipe(mergeMap(() => this.getNewsOnce()));
    this.articles$ = merge(initialArticles$, updates$).pipe(finalize(()=>this.isLoading = false));

    const reload$ = this.forceReload$.pipe(switchMap(() => this.getNotifications()));   
    const initialNotifications$ = this.getNotifications();   
    const show$ = merge(initialNotifications$, reload$).pipe(mapTo(true));
    const hide$ = this.update$.pipe(mapTo(false));
    this.showNotification$ = merge(show$, hide$); 
  }

  forceReload() {
    this.data.forceReload();
    this.forceReload$.next();
  }

  getNotifications() {
    return this.data.getGoogleNews.pipe(skip(1));
  }
  
  getNewsOnce(){   
    return this.articles$ = this.data.getGoogleNews.pipe(take(1));
  }


}
