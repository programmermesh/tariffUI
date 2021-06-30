import { Component, OnInit, ViewChild } from '@angular/core';
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
export class ProductsComponent implements OnInit {
  productForm!: FormGroup;
  invalid = false;
  products: Tariff[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  isloading = false;

  dtOptions: DataTables.Settings = {};
  constructor(
    private _sharedService: SharedService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productForm = this._formBuilder.group({
      consumption: ['', Validators.pattern('^[0-9]*$')],
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
        this.isloading = true;
        this.productForm.reset();
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
