import { Injectable } from "@nestjs/common";
import {
  firstValueFrom,
  toArray,
  from,
  map,
  mergeAll,
  take,
  Observable,
} from "rxjs";
import axios from "axios";

@Injectable()
export class RxjsService {
  private readonly githubURL = "https://api.github.com/search/repositories?q=";
  private readonly gitlabURL = 'https://gitlab.com/api/v4/projects?search=';

  private getGithub(text: string, count: number): Observable<any> {
    return from(axios.get(`${this.githubURL}${text}`))
      .pipe(
        map((res: any) => res.data.items),
        mergeAll(),
      )
      .pipe(take(count));
  }

  private getGitLab(text:string,count:number): Observable<any>{
    return from(axios.get(`${this.gitlabURL}${text}`))
    .pipe(
      map((res:any) => res.data),
      mergeAll()
    ).pipe(take(count))
  }


  async searchRepositories(text: string, hub: string): Promise<any> {
    console.log("hub = ",hub);
    let result
    hub.toLocaleLowerCase()

    if (hub == "github"){
      const data$ = this.getGithub(text, 10).pipe(toArray());
      data$.subscribe(() => {});
      let result = await firstValueFrom(data$)
      return result
    }

    if (hub == 'gitlab'){
      const data$ = this.getGitLab(text, 10).pipe(toArray());
      data$.subscribe(() => {});
      let result = await firstValueFrom(data$)
      return result
    }
   
    return result;
  }
}
