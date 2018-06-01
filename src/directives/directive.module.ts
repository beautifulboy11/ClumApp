import { NgModule } from '@angular/core';
import { ParallaxHeaderDirective } from './parallax-header/parallax-header';
import { ParallaxProfileDirective } from './parallax-profile/parallax-profile';
@NgModule({
    declarations: [ParallaxHeaderDirective, ParallaxProfileDirective],
    imports: [],
    exports: [ParallaxHeaderDirective, ParallaxProfileDirective]
})
export class DirectivesModule { }
