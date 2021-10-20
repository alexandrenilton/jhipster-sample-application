import * as dayjs from 'dayjs';
import { CategoryStatus } from 'app/entities/enumerations/category-status.model';

export interface ICategory {
  id?: number;
  description?: string;
  dateAdded?: dayjs.Dayjs | null;
  dateModified?: dayjs.Dayjs | null;
  status?: CategoryStatus | null;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public description?: string,
    public dateAdded?: dayjs.Dayjs | null,
    public dateModified?: dayjs.Dayjs | null,
    public status?: CategoryStatus | null
  ) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
