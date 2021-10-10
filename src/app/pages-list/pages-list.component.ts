import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../service/admin.service';

export interface Creator {
  firstName: string
  fullName: string
  lastName: string
  profile: string
  _id: string
}

export interface PageComponent {
  data: any
  default: boolean
  styles: string[]
  type: string
  _id: string
}

export interface Page {
  bookingInfo: any[]
  components: PageComponent[]
  createdAt: string
  creator: Creator
  hidePage: false
  hostTouristSpot: Page
  initialStatus: string
  otherServices: any[]
  pageType: string
  services: any[]
  status: string
  updatedAt: string
  _id: string
}

export interface Location {
  barangay: string
  municipality: string
  city: string
}

export interface PageColumnData {
  creator: Creator
  title: string
  bannerPhoto: string
  location: Location
  category: string
  createdAt: string
  pageType: string
}


interface SelectValue {
  value: string;
  viewValue: string;
}



@Component({
  selector: 'app-pages-list',
  templateUrl: './pages-list.component.html',
  styleUrls: ['./pages-list.component.css']
})


export class PagesListComponent implements OnInit {
  pages: PageColumnData[]

  constructor(public router: Router, public adminService: AdminService) { }

  ngOnInit(): void {
    this.getPages()
  }

  filters: SelectValue[] = [
    {value: 'type', viewValue: 'Type'},
    {value: 'category', viewValue: 'Category'},
    {value: 'dateRange', viewValue: 'Date Range'},
    {value: 'location', viewValue: 'Location'}
  ];

  sortTypes: SelectValue[] = [
    {value: 'bookings', viewValue: 'Total Bookings'},
    {value: 'cancelled', viewValue: 'Cancelled Bookings Total'},
    {value: 'visits', viewValue: 'Total Visits'}
  ];

  getPages() {
    this.adminService.getAllPendingNotifications("Online").subscribe((data: Page[]) => {
      this.pages = data.map(page => {
        let pageColData: PageColumnData = {bannerPhoto: page.components[0].data[0].url,creator: page.creator ,title: "",location: {barangay: "",municipality: "",city: ""},category: "",createdAt: page.createdAt,pageType: page.pageType}
        page.components.forEach(component => {
          const data = component.data
          if (data.defaultName == "pageName") { pageColData.title = data.text }
          if (data.defaultName == "barangay") { pageColData.location.barangay = data.text }
          if (data.defaultName == "municipality") { pageColData.location.municipality = data.text }
          if (data.defaultName == "province") { pageColData.location.city = data.text }
          if (data.defaultName == "category") { pageColData.category = data.text }
        });
        return pageColData
      })
      console.log("pages: ", this.pages)
    })
  }
}
