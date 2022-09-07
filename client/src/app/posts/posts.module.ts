import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PostsRoutingModule} from './posts-routing.module';
import {PostCreateComponent} from './post-create/post-create.component';
import {PostListComponent} from './post-list/post-list.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    declarations: [
        PostCreateComponent, //
        PostListComponent,
    ],
    imports: [
        CommonModule, //
        PostsRoutingModule,
        SharedModule,
    ],
})
export class PostsModule {}
