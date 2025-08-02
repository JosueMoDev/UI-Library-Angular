import { Component } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'book-skeleton',
  imports: [Skeleton],
  template: ` <div
    class="group overflow-hidden transition-all duration-300 bg-[var(--gradient-card)] border-0 my-4 px-4 rounded-xl"
  >
    <div class="flex flex-col md:flex-row relative">
      <div
        class="relative w-full md:w-48 h-80 md:h-72 flex-shrink-0 overflow-hidden"
      >
        <p-skeleton
          width="100%"
          height="100%"
          borderRadius="0.5rem"
        ></p-skeleton>
      </div>

      <div class="flex-1 p-4 space-y-3">
        <div class="flex flex-col lg:flex-row lg:justify-between gap-4 h-full">
          <div class="flex-1 flex flex-col space-y-3">
            <p-skeleton height="2.5rem" width="60%"></p-skeleton>
            <p-skeleton height="1.25rem" width="40%"></p-skeleton>

            <div class="space-y-1">
              <p-skeleton height="1rem" width="90%"></p-skeleton>
              <p-skeleton height="1rem" width="85%"></p-skeleton>
              <p-skeleton height="1rem" width="80%"></p-skeleton>
              <p-skeleton height="1rem" width="75%"></p-skeleton>
            </div>

            <div class="space-y-2">
              <p-skeleton height="1rem" width="30%"></p-skeleton>
              <div class="flex flex-wrap gap-2">
                <p-skeleton
                  width="80px"
                  height="32px"
                  shape="rectangle"
                  styleClass="rounded-full"
                ></p-skeleton>
                <p-skeleton
                  width="80px"
                  height="32px"
                  shape="rectangle"
                  styleClass="rounded-full"
                ></p-skeleton>
                <p-skeleton
                  width="80px"
                  height="32px"
                  shape="rectangle"
                  styleClass="rounded-full"
                ></p-skeleton>
              </div>
            </div>
          </div>

          <div
            class="flex flex-col justify-between items-end space-y-3 min-w-fit h-full"
          >
            <div class="flex flex-wrap gap-2 justify-end items-center">
              <p-skeleton
                width="100px"
                height="30px"
                styleClass="rounded-full"
              ></p-skeleton>
              <p-skeleton
                width="100px"
                height="30px"
                styleClass="rounded-full"
              ></p-skeleton>
              <p-skeleton
                width="100px"
                height="30px"
                styleClass="rounded-full"
              ></p-skeleton>
              <p-skeleton
                width="40px"
                height="40px"
                shape="circle"
              ></p-skeleton>
            </div>

            <div class="text-2xl font-bold text-primary mt-auto">
              <p-skeleton width="80px" height="2rem"></p-skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
})
export class SkeletonBook {}
