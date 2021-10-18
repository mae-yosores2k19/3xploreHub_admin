import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectValue } from '../pages-list/pages-list.component';
import { AdminService } from '../service/admin.service';

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
  selectedTimeRange = 'daily'
  highestNum = 0
  dates = [
    // {date: "Oct 13, 2021", submitted: 3, unfinished: 2, cancelled: 1, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 0, unfinished: 0, cancelled: 0, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 6, unfinished: 0, cancelled: 1, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
    // {date: "Oct 13, 2021", submitted: 4, unfinished: 2, cancelled: 1, visited: 7 },
    // {date: "Oct 13, 2021", submitted: 5, unfinished: 2, cancelled: 1, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
    // {date: "Oct 13, 2021", submitted: 6, unfinished: 0, cancelled: 1, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 1, unfinished: 2, cancelled: 1, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 4, unfinished: 2, cancelled: 1, visited: 7 },
    // {date: "Oct 13, 2021", submitted: 5, unfinished: 2, cancelled: 1, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 0, unfinished: 0, cancelled: 0, visited: 0 },
    // {date: "Oct 13, 2021", submitted: 9, unfinished: 2, cancelled: 1, visited: 7 },
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

  timeRange: SelectValue[] = [
    { value: 'daily', viewValue: 'Daily' },
    { value: 'weekly', viewValue: 'Weekly' },
    { value: 'monthly', viewValue: 'Monthly' },
    { value: 'yearly', viewValue: 'Yearly' }
  ];

  constructor(private route: ActivatedRoute, public router: Router, public adminService: AdminService) { }

  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId');

    this.adminService.getPageBookings(this.pageId).subscribe(bookings => {
      console.log(bookings)
      this.groupByDate(bookings)
      const nums = new Array(this.highestNum + 1)
      for (let i = 0; i < nums.length; i++) { this.rows.push(i) }
      this.showRows()
    }, error => { console.log(error) })


  
  }
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  groupByDate(bookings) {
    let dates = []
    bookings = bookings.map(booking => {
      const date = new Date(booking.createdAt)
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDay()).toDateString().split(" ").join("_")
      if (!dates.includes(d)) dates.push(d)
      booking.createdAt = d
      return booking
    });
    let datesData = {}
    dates.forEach(date => { datesData[date] = { date: date.split("_").join(" "), submitted: 0, unfinished: 0, cancelled: 0, visited: 0 } })
    bookings.forEach(booking => {
      if (booking.status == "Unfinished") {
        datesData[booking.createdAt].unfinished += 1
        this.highestNum = datesData[booking.createdAt].unfinished > this.highestNum ? datesData[booking.createdAt].unfinished : this.highestNum
      }
      else if (booking.status == "Cancelled") {
        datesData[booking.createdAt].cancelled += 1
        this.highestNum = datesData[booking.createdAt].cancelled > this.highestNum ? datesData[booking.createdAt].cancelled : this.highestNum
      }
      else {
        datesData[booking.createdAt].submitted += 1
        this.highestNum = datesData[booking.createdAt].submitted > this.highestNum ? datesData[booking.createdAt].submitted : this.highestNum
      }
    });
    this.dates = Object.values(datesData)
    console.log(dates)
  }

  addRow() {
    const nums = new Array(this.highestNum += 5)
    this.rows = []
    for (let i = 0; i < nums.length; i++) { this.rows.push(i) }
    this.showRows()
  }

  minusRow() {
    const nums = new Array(this.highestNum -= 5)
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

  goBack() {
    this.router.navigate(["/admin/reports"])
  }

}
