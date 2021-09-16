import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medic',
  templateUrl: './medic.component.html',
  styles: [],
})
export class MedicComponent implements OnInit {
  public medicForm!: FormGroup;
  public hospitals: Hospital[] = [];
  public selectedMedic!: Medico;
  public selectedHospital!: Hospital;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.loadMedic(id));
    this.createForm();

    this.loadHospitals();

    this.medicForm.get('hospital')?.valueChanges.subscribe((hospitalID) => {
      this.selectedHospital = this.hospitals.find(
        (h) => h._id === hospitalID
      ) as Hospital;
    });
  }

  createForm() {
    this.medicForm = this.fb.group({
      name: ['', Validators.required],
      hospital: ['2', Validators.required],
    });
  }

  loadMedic(id: string) {
    if (id === 'new') return;

    this.medicService
      .getMedicById(id)
      .pipe(delay(100))
      .subscribe((medico) => {
        if (!medico) {
          return this.router.navigate(['dashboard', 'medics']);
        }

        const {
          name,
          hospital: { _id },
        } = medico;

        this.selectedMedic = medico;
        this.medicForm.setValue({ name, hospital: _id });
        return;
      });
  }

  loadHospitals() {
    this.hospitalService.loadHospitals().subscribe((hospitals: Hospital[]) => {
      this.hospitals = hospitals;
    });
  }

  saveMedic() {
    const { name } = this.medicForm.value;

    if (this.selectedMedic) {
      const data = {
        ...this.medicForm.value,
        _id: this.selectedMedic._id,
      };

      this.medicService.updateMedic(data).subscribe((res) => {
        Swal.fire('Médico creado', `Nombre del médico: ${name}`, 'success');
      });
    } else {
      this.medicService
        .createMedic(this.medicForm.value)
        .subscribe((res: any) => {
          Swal.fire('Médico creado', `Nombre del médico: ${name}`, 'success');
          this.router.navigate(['dashboard', 'medics', res.medico._id]);
        });
    }
  }
}
