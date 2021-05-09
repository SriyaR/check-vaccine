import { Component } from '@angular/core';
import { VaccineService } from './vaccine.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]
})
export class AppComponent {
  title = 'vaccine-check';
  date: string | null;
  states: string[] = [];
  stateNameId: any = {};
  districts: string[] = [];
  districtNameId: any = {};
  minAge = [18, 45];
  vaccines = ['COVAXIN', 'COVISHIELD'];
  selectedState = '';
  selectedDistrict = '';
  selectedAge = this.minAge[0];
  selectedVaccine = this.vaccines[0];
  display: any = [];
  columnDefs = [
    { field: 'name', suppressMovable: true, resizable: true, sortable: true, filter: true },
    { field: 'date', suppressMovable: true, resizable: true, sortable: true, filter: true },
    { field: 'availableCapacity', suppressMovable: true, resizable: true, sortable: true, filter: true},  ];
  api: any;
  columnApi: any;
  getRowStyle: any;

  constructor(private vService: VaccineService, private datePipe: DatePipe) {
    this.date = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    this.getRowStyle = (params: any) => {
      if (params.data.availableCapacity === 0) {
          return { background: 'red' };
      }
      return;
    };
    this.vService.getStateDetails().subscribe((data) => {
      data['states'].forEach((item: any) => {
        this.states.push(item['state_name']);
        this.stateNameId[item['state_name']] = item['state_id'];
      });
      this.selectedState = this.states[0];
      this.updateDistricts();
    });
  }

  updateDistricts(): void {
    this.districts = [];
    this.vService.getDistrictDetails(this.stateNameId[this.selectedState]).subscribe((data) => {
      data['districts'].forEach((item: any) => {
        this.districts.push(item['district_name']);
        this.districtNameId[item['district_name']] = item['district_id'];
      });
      this.selectedDistrict = this.districts[0];
    });
  }
  search(): void {
    this.display = [];
    this.vService.getVaccineDetails(this.districtNameId[this.selectedDistrict], this.date).subscribe((data) => {
        data['centers'].forEach((item: any) => {
          item['sessions'].forEach((sessionItem: any) => {
            if (sessionItem['min_age_limit'] <= this.selectedAge && sessionItem['vaccine'] === this.selectedVaccine) {
              this.display.push({
                name: item['name'],
                date: sessionItem['date'],
                availableCapacity: sessionItem['available_capacity']
              });
            }
          });
        });
        this.columnApi.getColumn('availableCapacity').setSort('desc');
        this.api.setRowData(this.display);
        this.api.sizeColumnsToFit();
    });
  }

  onGridReady(params: any): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
  }
}
