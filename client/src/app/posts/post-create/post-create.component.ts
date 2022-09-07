import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {Post, PostsService} from '../../services/posts.service';
import {mimeType} from './mime-type.validator';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
    enteredTitle = '';
    enteredContent = '';
    private mode = 'create';
    private postId: string;
    post: Post;
    isLoading = false;
    form: FormGroup;
    imagePreview: string;
    private authStatusSub: Subscription;

    constructor(
        public postService: PostsService, //
        public router: ActivatedRoute,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
            this.isLoading = false;
        });
        // FormGroup
        this.form = new FormGroup({
            title: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)],
            }),
            content: new FormControl(null, {
                validators: [Validators.required],
            }),
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType],
            }),
        });
        this.router.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                // Loader start
                this.isLoading = true;
                this.postService.getPost(this.postId).subscribe((postData) => {
                    // Loader end
                    this.isLoading = false;
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content,
                        imagePath: postData.imagePath,
                        creator: postData.creator,
                    };
                    this.form.setValue({
                        'title': this.post.title,
                        'content': this.post.content,
                        'image': this.post.imagePath,
                    });
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({
            'image': file,
        });
        this.form.get('image').updateValueAndValidity();

        // Convert image to url
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    onSavePost() {
        // Loader start no need for loader end as we navigate away
        this.isLoading = true;
        if (this.mode === 'create') {
            this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
        } else {
            this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
        }
        this.form.reset();
    }

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
}
