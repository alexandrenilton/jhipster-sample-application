import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'category',
        data: { pageTitle: 'jhipsterSampleApplicationApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'store',
        data: { pageTitle: 'jhipsterSampleApplicationApp.store.home.title' },
        loadChildren: () => import('./store/store.module').then(m => m.StoreModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'jhipsterSampleApplicationApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
