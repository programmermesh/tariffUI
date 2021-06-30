import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SharedService } from '../service/shared.service';

declare interface Tariff {
  name: string;
  cost: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: true })
  dtElement!: DataTableDirective;

  productForm!: FormGroup;
  invalid = false;
  products: Tariff[] = [];

  constructor(
    private _sharedService: SharedService,
    private _formBuilder: FormBuilder
  ) {}

  dtOptions: DataTables.Settings = { pagingType: 'simple', searching: false };
  dtTrigger: Subject<any> = new Subject();

  ngOnInit(): void {
    this.productForm = this._formBuilder.group({
      consumption: ['', Validators.pattern('^[0-9]*$')],
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  fetchTarrif() {
    if (this.productForm.invalid) {
      this.invalid = true;
      return;
    } else {
      let model = this.productForm.value.consumption;
      this._sharedService.fetchTarrif(model).subscribe((data) => {
        this.products = data;
        this.rerender();
        this.productForm.reset();
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
}
