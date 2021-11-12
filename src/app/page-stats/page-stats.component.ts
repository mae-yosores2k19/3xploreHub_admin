import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  firstDate = null
  start = null
  allBookings = []
  end = null
  hideDateText = false
  selectedTimeRangeType = 'monthly'
  highestNum = 0
  byDate = []
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

  allDates = []
  allMonths = []

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  timeRange: SelectValue[] = [
    { value: 'daily', viewValue: 'Daily' },
    { value: 'monthly', viewValue: 'Monthly' },
    { value: 'yearly', viewValue: 'Yearly' }
  ];

  constructor(private route: ActivatedRoute, public router: Router, public adminService: AdminService) { }

  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId');

    this.adminService.getPageBookings(this.pageId).subscribe((bookings: any[]) => {
      this.allBookings = bookings
      if (bookings.length > 0 ) {

        this.groupByDate(bookings)
        const nums = new Array(this.highestNum + 1)
        for (let i = 0; i < nums.length; i++) { this.rows.push(i) }
        this.showRows()
      }
    }, error => { console.log(error) })
  }

  selectDateRange() {
    if (this.range.value.start && this.range.value.end && (this.range.value.start <= this.range.value.end)) {
      this.setGraph(this.range.value.start, this.range.value.end)
    }
  }

  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  setGraph(start = null, end = null) {
    if (this.selectedTimeRangeType == "daily") {
      if (!start && !end) {
        start = new Date(this.firstDate)
        end = new Date(this.firstDate)
        end.setDate(end.getDate() + 20)
        this.range.setValue({ start: start, end: end })
      }
      this.initializeByDay(start, end)
    } else if (this.selectedTimeRangeType == "monthly") {
      if (!start && !end) {
        start = new Date(this.firstDate)
        end = new Date()        
        console.log(start.getDate() - end.getDate())
        this.range.setValue({ start: start, end: end })
      }
      this.groupByMonth()
      this.initializeByMonth(start, end)
    }
    this.showRows()
 
  }

  groupByDate(bookings) {
    let dates = []
    bookings = bookings.map(booking => {
      const date = new Date(booking.createdAt).toDateString()
      if (!this.firstDate) this.firstDate = date
      if (!dates.includes(date)) dates.push(date)
      booking.createdAt = date
      return booking
    });
    let datesData = {}
    dates.forEach(date => { datesData[date] = { date: date, submitted: 0, unfinished: 0, cancelled: 0, visited: 0 } })
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
    this.allDates = Object.values(datesData)
    this.setGraph()
  }

  initializeByDay(startDate, endDate) {
    let td = startDate
    let datesData = {}
    datesData[td.toDateString()] = { date: td.toDateString(), submitted: 0, unfinished: 0, cancelled: 0, visited: 0 }
    while (td < endDate) {
      td.setDate(td.getDate() + 1)
      datesData[td.toDateString()] = { date: td.toDateString(), submitted: 0, unfinished: 0, cancelled: 0, visited: 0 }
    }
    this.allDates.forEach(date => {
      if (datesData[date.date]) {
        datesData[date.date] = date
      }
    })
    this.dates = Object.values(datesData)
  }

  groupByMonth() {
    let months = []
    this.allDates.forEach(date => {
      const d = new Date(date.date)
      const ym = d.getFullYear() + " " + this.months[d.getMonth()]
      if (!months.includes(ym)) months.push(ym)

    })
    let monthsData = {}
    months.forEach(m => monthsData[m] = { date: m, submitted: 0, unfinished: 0, cancelled: 0, visited: 0 })
    this.allDates.forEach(date => {
      const bd = new Date(date.date)
      const yearAndMonth = bd.getFullYear() + " " + this.months[bd.getMonth()]
      monthsData[yearAndMonth].submitted += date.submitted
      monthsData[yearAndMonth].cancelled += date.cancelled
      monthsData[yearAndMonth].unfinished += date.unfinished
    });
    console.log(monthsData)
    // this.dates = Object.values(monthsData)
    this.allMonths = Object.values(monthsData)

  }

  initializeByMonth(startDate, endDate) {
    console.log(startDate, endDate)
    let td = startDate
    let datesData = {}
    let ym = td.getFullYear() + " " + this.months[td.getMonth()]
    datesData[ym] = { date: ym, submitted: 0, unfinished: 0, cancelled: 0, visited: 0 }
    while (td < endDate) {
      td.setDate(td.getDate() + 1)
      let ym2 = td.getFullYear() + " " + this.months[td.getMonth()]
      datesData[ym2] = { date: ym2, submitted: 0, unfinished: 0, cancelled: 0, visited: 0 }
    }
    this.allMonths.forEach(date => {
      if (datesData[date.date]) {
        datesData[date.date] = date
        console.log("----------", datesData[date.date])
      } else {
        console.log('not matched: ', date)
      }
    })
    this.dates = Object.values(datesData)
    console.log(datesData)
    console.log("all months: ", this.allMonths)
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
    else this.colNum = 0
    if (this.dates.length > 31) this.hideDateText = true
    else this.hideDateText = false
  }

  goBack() {
    this.router.navigate(["/admin/reports"])
  }

}
