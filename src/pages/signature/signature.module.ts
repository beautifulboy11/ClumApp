import { IonicPageModule } from "ionic-angular";
import { NgModule } from "@angular/core";
import { SignaturePage } from "../pages";
import { SignaturePadModule } from "angular2-signaturepad";

@NgModule({
    declarations: [SignaturePage],
    imports: [
        SignaturePadModule,
        IonicPageModule.forChild(SignaturePage)
    ],
    exports: [SignaturePage]
})
export class SignaturePageModule { }
