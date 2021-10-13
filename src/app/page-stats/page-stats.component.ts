import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-stats',
  templateUrl: './page-stats.component.html',
  styleUrls: ['./page-stats.component.scss']
})
export class PageStatsComponent implements OnInit {
  pageId: string;
  rowNum = 2
  colNum = 0
  rows = []
  number = 10
  dates = [
    {date: "Oct 13, 2021", submitted: 3, unfinished: 2, cancelled: 1, visited: 0 },
    {date: "Oct 13, 2021", submitted: 0, unfinished: 0, cancelled: 0, visited: 0 },
    {date: "Oct 13, 2021", submitted: 6, unfinished: 0, cancelled: 1, visited: 0 },
    {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
    {date: "Oct 13, 2021", submitted: 4, unfinished: 2, cancelled: 1, visited: 7 },
    {date: "Oct 13, 2021", submitted: 5, unfinished: 2, cancelled: 1, visited: 0 },
    {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
    {date: "Oct 13, 2021", submitted: 6, unfinished: 0, cancelled: 1, visited: 0 },
    {date: "Oct 13, 2021", submitted: 1, unfinished: 2, cancelled: 1, visited: 0 },
    {date: "Oct 13, 2021", submitted: 4, unfinished: 2, cancelled: 1, visited: 7 },
    {date: "Oct 13, 2021", submitted: 5, unfinished: 2, cancelled: 1, visited: 0 },
    {date: "Oct 13, 2021", submitted: 0, unfinished: 0, cancelled: 0, visited: 0 },
    {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
    // {date: "Oct 13, 2021", submitted: 0, unfinished: 0, cancelled: 0, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
    // {date: "Oct 13, 2021", submitted: 0, unfinished: 2, cancelled: 0, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 6, unfinished: 0, cancelled: 1, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
    // {date: "Oct 13, 2021", submitted: 0, unfinished: 0, cancelled: 0, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 5, unfinished: 2, cancelled: 1, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
    // {date: "Oct 13, 2021", submitted: 0, unfinished: 0, cancelled: 0, visited: 0 },
    // {date: "Week 1", submitted: 0, unfinished: 0, cancelled: 0, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 5, unfinished: 2, cancelled: 1, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
    // {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
    // {date: "Oct 13, 2021", submitted: 0, unfinished: 2, cancelled: 0, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 6, unfinished: 0, cancelled: 1, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
    // {date: "Oct 13, 2021", submitted: 0, unfinished: 0, cancelled: 0, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 5, unfinished: 2, cancelled: 1, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
    // {date: "Oct 13, 2021", submitted: 0, unfinished: 0, cancelled: 0, visited: 0 },
    // {date: "Week 1", submitted: 0, unfinished: 0, cancelled: 0, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 5, unfinished: 2, cancelled: 1, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },

  ]
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const nums = new Array(this.number)



    for (let i = 0; i < nums.length; i++) { this.rows.push(i) }
    this.showRows()
    this.pageId = this.route.snapshot.paramMap.get('pageId');
  }

  addRow() {
    const nums = new Array(this.number += 5)
    this.rows = []
    for (let i = 0; i < nums.length; i++) { this.rows.push(i) }
    this.showRows()
  }

  minusRow() {
    const nums = new Array(this.number -= 5)
    this.rows = []
    for (let i = 0; i < nums.length; i++) { this.rows.push(i) }
    this.showRows()
  }

  showRows() {
    if (this.rows.length > 20) this.rowNum = 5 
    if (this.rows.length > 40) this.rowNum = 10 
    if (this.rows.length > 100) {
      let n = this.rows.length
      while (n > 100) {
        this.rowNum += 10
        n -= 100
      }
    }

    if (this.dates.length > 10) this.colNum = 2
  }

}
