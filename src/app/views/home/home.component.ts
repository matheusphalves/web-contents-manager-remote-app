import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { WebContentModel } from 'src/app/models/WebContentModel';
import { WebContentStructureModel } from 'src/app/models/WebContentStructureModel';
import { WebContentAuditorService } from 'src/app/services/auditors/web-content-auditor.service';
import { WebContentStructureService } from 'src/app/services/web-content-structure.service';
import { WebContentService } from 'src/app/services/web-content.service';
import { WebContentDialogComponent } from 'src/app/shared/web-content-dialog/web-content-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [WebContentService, WebContentStructureService]
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild(MatTable)
  table!: MatTable<any>
  @ViewChild('paginator')
  paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'title', 'contentStructureId', 'dateCreated', 'actions'];
  dataSource = new MatTableDataSource<WebContentModel>([]);

  webContentStructures!: WebContentStructureModel[]

  selectedStructure!: WebContentStructureModel;

  searchTerm!: string;

  totalCount = 0;

  ngOnInit(): void { }

  constructor(
    public dialog: MatDialog,
    public webContentService: WebContentService,
    public webContentStructureService: WebContentStructureService,
    public webContentAuditorService: WebContentAuditorService) {
    this.getWebContentStructures()
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getWebContentStructures() {

    this.webContentStructures = [];

    this.webContentStructureService.getWebContentStructures()
      .subscribe((data: any) => {
        data.items.forEach((item: any) => {
          const webContentStructure: WebContentStructureModel = {
            id: item.id,
            name: item.name,
            contentStructureFields: item.contentStructureFields
          }

          this.webContentStructures.push(webContentStructure)
        })

        this.getStructuredWebContents(undefined, 1, this.dataSource.paginator?.pageSize)
      });
  }

  getStructuredWebContents(search: string | undefined, pageNumber: number, pageSize: number | undefined) {
    this.dataSource.data = [];

    this.webContentService.getStructuredWebContents(search, pageNumber, pageSize?? 20)
      .subscribe((data: any) => {this.processDataSource(data)});
  }

  openDialog(webContent: WebContentModel | null): void {
    const dialogRef = this.dialog.open(WebContentDialogComponent, {
      width: '1180px',
      data: webContent === null ? {
        id: null,
        title: '',
        contentFields: [],
        contentStructureId: null,
        webContentStructure: this.selectedStructure
      } : {
        id: webContent.id,
        title: webContent.title,
        webContentStructure: webContent.webContentStructure,
        contentFields: webContent.contentFields
      },
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result != undefined) {

        if (this.dataSource.data.map(p => p.id).includes(result.id)) {

          this.webContentService.putStructuredWebContent(result)
            .subscribe((response: any) => {
              this.dataSource.data[result.position - 1] = result
              this.table.renderRows();
              this.webContentAuditorService.postWebContentHistory({ webContentId: response.id, change: response.contentFields });
            })

        } else {
          this.webContentService.postStructuredWebContent(result)
            .subscribe((response: any) => {
              this.getStructuredWebContents(undefined, 1, undefined)
              this.table.renderRows();
              this.webContentAuditorService.postWebContentHistory({ webContentId: response.id, change: response.contentFields });
            })
        }
      }

    });
  }

  updateWebContent(webContent: WebContentModel | null): void {
    this.openDialog(webContent)
  }

  saveWebContentAsDraft(webContent: WebContentModel | null): void {

  }

  publishWebContent(webContent: WebContentModel | null): void {

  }

  unpublishWebContent(webContent: WebContentModel | null): void {

  }

  handleWebContentStructure(webContentStructureId: number): WebContentStructureModel | undefined {
    return this.webContentStructures
      .find(webContentStructure =>
        webContentStructure.id == webContentStructureId)
  }

  search() {
    this.getStructuredWebContents(
      this.searchTerm.toLocaleLowerCase(),
      this.dataSource.paginator?.pageIndex ?? 1,
      undefined
    )
  }

  onPageChange(event: PageEvent) {
    const pageNumber = event.pageIndex + 1;
    const pageSize = event.pageSize?? 20;
    this.getStructuredWebContents(undefined, pageNumber, pageSize);
  }

  processDataSource(data: any){

    this.totalCount = data.totalCount;

    const webContents: WebContentModel[] = data.items.map((item: any) => {
      return {
        id: item.id,
        title: item.title,
        webContentStructure: this.handleWebContentStructure(item.contentStructureId),
        contentFields: item.contentFields,
        dateCreated: item.dateCreated
      }          
    });

    this.dataSource.data = webContents;
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource.data)
    console.log(this.totalCount)
  }

}
