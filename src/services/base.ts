import { of, Observable, from, defer } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { request } from "umi";
import { getAccessToken } from "@/utils/authorith";

interface IBaseService<T> {
    query(params: any): Observable<any>;
    save(params: T): Observable<any>;
    remove(id: string): Observable<any>;
    update(id: string, params: Partial<T>): Observable<any>;
}

class BaseService<T> implements IBaseService<T>{
    protected uri: string;

    protected headers = {
        'X-Access-Token': getAccessToken()
    };

    constructor(uri: string) {
        this.uri = `/jetlinks/${uri}`
    }

    public list = (params: any) => defer(() => from(request(
        `${this.uri}/_query/`,
        {
            method: 'GET',
            params
        }
    ))).pipe(
        map(resp => resp.result),
    );

    public query = (params: any) => defer(() => from(request(`${this.uri}/_query/`, {
        method: 'GET',
        params
    }))).pipe(
        map(resp => resp.result),
        catchError(error => of(error))
    );

    public save = (params: Partial<T>) => defer(() => from(request(this.uri, {
        method: 'POST',
        data: params
    }))).pipe(
        map(resp => resp.result),
        catchError(error => of(error))
    );

    public remove = (id: string) => defer(() => request(`${this.uri}/${id}`, {
        method: 'DELETE',
    })).pipe(
        map(resp => resp.result),
        catchError(error => of(error))
    )

    public update = (id: string, params: Partial<T>) => defer(() => request(`${this.uri}/${id}`, {
        method: 'PUT',
        data: params
    })).pipe(
        map(resp => resp.result),
        catchError(error => of(error)));

}
export default BaseService;