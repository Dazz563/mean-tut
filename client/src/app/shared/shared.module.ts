import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// Angular Material
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
    declarations: [],
    imports: [
        CommonModule, //
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatSnackBarModule,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule, //
        MatFormFieldModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatSnackBarModule,
    ],
})
export class SharedModule {}
