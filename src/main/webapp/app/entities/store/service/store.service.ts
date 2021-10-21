import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStore, getStoreIdentifier } from '../store.model';

export type EntityResponseType = HttpResponse<IStore>;
export type EntityArrayResponseType = HttpResponse<IStore[]>;

@Injectable({ providedIn: 'root' })
export class StoreService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/stores');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(store: IStore): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(store);
    return this.http
      .post<IStore>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(store: IStore): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(store);
    return this.http
      .put<IStore>(`${this.resourceUrl}/${getStoreIdentifier(store) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(store: IStore): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(store);
    return this.http
      .patch<IStore>(`${this.resourceUrl}/${getStoreIdentifier(store) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IStore>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IStore[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStoreToCollectionIfMissing(storeCollection: IStore[], ...storesToCheck: (IStore | null | undefined)[]): IStore[] {
    const stores: IStore[] = storesToCheck.filter(isPresent);
    if (stores.length > 0) {
      const storeCollectionIdentifiers = storeCollection.map(storeItem => getStoreIdentifier(storeItem)!);
      const storesToAdd = stores.filter(storeItem => {
        const storeIdentifier = getStoreIdentifier(storeItem);
        if (storeIdentifier == null || storeCollectionIdentifiers.includes(storeIdentifier)) {
          return false;
        }
        storeCollectionIdentifiers.push(storeIdentifier);
        return true;
      });
      return [...storesToAdd, ...storeCollection];
    }
    return storeCollection;
  }

  protected convertDateFromClient(store: IStore): IStore {
    return Object.assign({}, store, {
      dateAdded: store.dateAdded?.isValid() ? store.dateAdded.format(DATE_FORMAT) : undefined,
      dateModified: store.dateModified?.isValid() ? store.dateModified.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateAdded = res.body.dateAdded ? dayjs(res.body.dateAdded) : undefined;
      res.body.dateModified = res.body.dateModified ? dayjs(res.body.dateModified) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((store: IStore) => {
        store.dateAdded = store.dateAdded ? dayjs(store.dateAdded) : undefined;
        store.dateModified = store.dateModified ? dayjs(store.dateModified) : undefined;
      });
    }
    return res;
  }
}
