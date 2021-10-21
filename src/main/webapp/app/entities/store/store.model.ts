import * as dayjs from 'dayjs';
import { IProduct } from 'app/entities/product/product.model';

export interface IStore {
  id?: number;
  title?: string;
  info?: string;
  address?: string | null;
  dateAdded?: dayjs.Dayjs | null;
  dateModified?: dayjs.Dayjs | null;
  products?: IProduct[] | null;
}

export class Store implements IStore {
  constructor(
    public id?: number,
    public title?: string,
    public info?: string,
    public address?: string | null,
    public dateAdded?: dayjs.Dayjs | null,
    public dateModified?: dayjs.Dayjs | null,
    public products?: IProduct[] | null
  ) {}
}

export function getStoreIdentifier(store: IStore): number | undefined {
  return store.id;
}
