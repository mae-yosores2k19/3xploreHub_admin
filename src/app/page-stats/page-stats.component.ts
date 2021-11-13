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
  dates = []
  allDates = []
  allMonths = []
  allYears = []

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
      if (bookings.length > 0) {

        this.groupByDate(bookings)
        this.setGraph()
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
    this.highestNum = 0
    this.rows = []
    if (this.selectedTimeRangeType == "daily") {
      if (!start && !end) {
        start = new Date(this.firstDate)
        end = new Date(this.firstDate)
        end.setDate(end.getDate() + 20)
        this.range.setValue({ start: start, end: end })
      }
      this.groupByDate(this.allBookings)
      this.initializeByDay(start, end)
    } else if (this.selectedTimeRangeType == "monthly") {
      if (!start && !end) {
        start = new Date(this.firstDate)
        end = new Date()
      }
      if (end - start > 28425600000) {
        end = new Date(this.firstDate)
        end.setDate(end.getDate() + 335)
      }
      this.range.setValue({ start: start, end: end })
      this.groupByMonth()
      this.initializeByMonth(start, end)
    }
    else if (this.selectedTimeRangeType = "yearly") {
      if (!start && !end) {
        start = new Date(this.firstDate)
        end = new Date()
      }
      this.range.setValue({ start: start, end: end })
      this.groupByYear()
      this.initializeByYear(start, end)
    }
    this.showRows()

  }

  groupByDate(bookings) {
    let dates = []
    let datesData = {}
    bookings = bookings.map(booking => {
      const date = new Date(booking.createdAt).toDateString()
      if (!this.firstDate) this.firstDate = date
      if (!dates.includes(date)) {
        dates.push(date)
        datesData[date] = { date: date, submitted: 0, unfinished: 0, cancelled: 0, visited: 0 }
      }
      booking.createdAt = date
      return booking
    });
    bookings.forEach(booking => {
      if (booking.status == "Unfinished") {
        datesData[booking.createdAt].unfinished += 1
        this.getHighestNum(datesData[booking.createdAt].unfinished)
      }
      else if (booking.status == "Cancelled") {
        datesData[booking.createdAt].cancelled += 1
        this.getHighestNum(datesData[booking.createdAt].cancelled)
      }
      else {
        datesData[booking.createdAt].submitted += 1
        this.getHighestNum(datesData[booking.createdAt].submitted)
      }
    });
    this.dates = Object.values(datesData)
    this.allDates = Object.values(datesData)
  }

  getHighestNum(num) {
    this.highestNum = num > this.highestNum ? num : this.highestNum
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
    let monthsData = {}
    this.allDates.forEach(date => {
      const d = new Date(date.date)
      const ym = this.months[d.getMonth()] + " " + d.getFullYear()
      if (!months.includes(ym)) {
        months.push(ym)
        monthsData[ym] = { date: ym, submitted: 0, unfinished: 0, cancelled: 0, visited: 0 }
      }
    })
    this.allDates.forEach(date => {
      const bd = new Date(date.date)
      const yearAndMonth = this.months[bd.getMonth()] + " " + bd.getFullYear()
      monthsData[yearAndMonth].submitted += date.submitted
      this.getHighestNum(monthsData[yearAndMonth].submitted)

      monthsData[yearAndMonth].cancelled += date.cancelled
      this.getHighestNum(monthsData[yearAndMonth].cancelled)

      monthsData[yearAndMonth].unfinished += date.unfinished
      this.getHighestNum(monthsData[yearAndMonth].unfinished)
    });
    console.log(monthsData)
    // this.dates = Object.values(monthsData)
    this.allMonths = Object.values(monthsData)

  }

  groupByYear() {
    let years = []
    let yearsData = {}
    Object.values(this.allDates).forEach((date: any) => {
      const d = new Date(date.date)
      const ym = d.getFullYear() + ""
      if (!years.includes(ym)) {
        years.push(ym)
        yearsData[ym] = { date: ym, submitted: 0, unfinished: 0, cancelled: 0, visited: 0 }
      }
    })
    Object.values(this.allDates).forEach((date: any) => {
      const bd = new Date(date.date)
      const yearAndMonth = bd.getFullYear() + ""
      yearsData[yearAndMonth].submitted += date.submitted
      this.getHighestNum(yearsData[yearAndMonth].submitted)

      yearsData[yearAndMonth].cancelled += date.cancelled
      this.getHighestNum(yearsData[yearAndMonth].cancelled)

      yearsData[yearAndMonth].unfinished += date.unfinished
      this.getHighestNum(yearsData[yearAndMonth].unfinished)
    });
    console.log(yearsData)
    // this.dates = Object.values(yearsData)
    this.allYears = Object.values(yearsData)

  }

  initializeByMonth(startDate, endDate) {
    console.log(startDate, endDate)
    let td = startDate
    let datesData = {}
    let ym = this.months[td.getMonth()] + " " + td.getFullYear()
    datesData[ym] = { date: ym, submitted: 0, unfinished: 0, cancelled: 0, visited: 0 }
    while (td < endDate) {
      td.setDate(td.getDate() + 1)
      let ym2 = this.months[td.getMonth()] + " " + td.getFullYear()
      datesData[ym2] = { date: ym2, submitted: 0, unfinished: 0, cancelled: 0, visited: 0 }
    }
    this.allMonths.forEach(date => {
      if (datesData[date.date]) {
        datesData[date.date] = date
      }
    })
    this.dates = Object.values(datesData)

  }

  initializeByYear(startDate, endDate) {
    console.log(startDate, endDate)
    let td = startDate
    let datesData = {}
    let ym = td.getFullYear()
    datesData[ym] = { date: ym, submitted: 0, unfinished: 0, cancelled: 0, visited: 0 }
    while (td < endDate) {
      td.setDate(td.getDate() + 1)
      let ym2 = td.getFullYear()
      datesData[ym2] = { date: ym2, submitted: 0, unfinished: 0, cancelled: 0, visited: 0 }
    }
    this.allYears.forEach(date => {
      if (datesData[date.date]) {
        datesData[date.date] = date
      }
    })
    this.dates = Object.values(datesData)

  }


  showRows() {
    this.rows = []
    const nums = new Array(this.highestNum + 1)
    for (let i = 0; i < nums.length; i++) { this.rows.push(i) }
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
