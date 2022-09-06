import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {Subscription} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Post, PostsService} from '../services/posts.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
    private authStatusSub: Subscription;
    public userIsAuthenticated = false;
    userId: string;

    posts: Post[] = [];
    private postsSub!: Subscription;
    isLoading = false;
    // Pagination
    totalPosts = 0;
    postsPerPage = 3;
    currentPage = 1;
    pageSizeOptions = [3, 5, 10, 25, 100];

    constructor(
        public postService: PostsService, //
        private authService: AuthService
    ) {}

    ngOnInit() {
        // Loader start
        this.isLoading = true;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.postsSub = this.postService.getPostUpdateListener().subscribe((postData: {posts: Post[]; postCount: number}) => {
            this.posts = postData.posts;
            this.totalPosts = postData.postCount;
            // Loader end
            this.isLoading = false;
        });

        this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        });
    }

    onChangedPage(pageData: PageEvent) {
        // Loader start
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
    }

    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

    onDelete(id: string | null) {
        // Loader start
        this.isLoading = true;
        this.postService.deletePost(id).subscribe({
            next: () => {
                this.postService.getPosts(this.postsPerPage, this.currentPage);
            },
            error: () => {
                this.isLoading = false;
            },
        });
    }
}
