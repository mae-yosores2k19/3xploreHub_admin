import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-stats',
  templateUrl: './page-stats.component.html',
  styleUrls: ['./page-stats.component.css']
})
export class PageStatsComponent implements OnInit {
  pageId:string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId');
  }

}
