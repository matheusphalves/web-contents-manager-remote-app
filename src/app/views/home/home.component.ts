import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { WebContentModel } from 'src/app/models/WebContentModel';
import { WebContentStructureModel } from 'src/app/models/WebContentStructureModel';
import { WebContentSnackbarService } from 'src/app/services/web-content-snackbar.service';
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
    public webContentSnackBar: WebContentSnackbarService) {
    this.getWebContentStructures()
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getWebContentStructures() {

    this.webContentStructures = [];

    this.webContentStructureService.getWebContentStructures()
      .subscribe({
        next: (data: any) => {
          data.items.forEach((item: any) => {
            const webContentStructure: WebContentStructureModel = {
              id: item.id,
              name: item.name,
              contentStructureFields: item.contentStructureFields
            }

            this.webContentStructures.push(webContentStructure)
          })

          this.getStructuredWebContents(undefined, 1, this.dataSource.paginator?.pageSize)
        },
        error: (error) => this.webContentSnackBar.openSnackBarWithErrorStatus(error.error.title)
      });
  }

  getStructuredWebContents(search: string | undefined, pageNumber: number, pageSize: number | undefined) {

    this.webContentService.getStructuredWebContents(search, pageNumber, pageSize ?? 20)
      .subscribe({
        next: (data: any) => { this.processDataSource(data) },
        error: (errorResponse) => this.webContentSnackBar.openSnackBarWithErrorStatus(errorResponse.error.title)
      });
  }

  async openDialog(webContent: WebContentModel | null): Promise<void> {
    const dialogRef = this.dialog.open(WebContentDialogComponent, {
      disableClose: true,
      width: '1180px',
      height: '80%',
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

    dialogRef.componentInstance.dataSaved.subscribe((data) => {

      if (data != undefined) {

        if (this.dataSource.data.map(p => p.id).includes(data.id)) {

          this.webContentService.putStructuredWebContent(data).subscribe({
            next: (response: any) => {
              this.dataSource.data[data.position - 1] = data
              this.table.renderRows();
              this.getStructuredWebContents(undefined, this.paginator.pageIndex +1, this.paginator.pageSize);
              this.webContentSnackBar.openSnackBarWithSuccessStatus('The post has been updated.')
            },
            error: (errorResponse) => {
              this.webContentSnackBar.openSnackBarWithErrorStatus(errorResponse.error.title)
            }
          })

        } else {
          this.webContentService.postStructuredWebContent(data).subscribe({
            next: (response: any) => {
              this.webContentSnackBar.openSnackBarWithSuccessStatus('The post was created successfully.')
              this.getStructuredWebContents(undefined, this.paginator.pageIndex +1, this.paginator.pageSize);
            },
            error: (errorResponse) => this.webContentSnackBar.openSnackBarWithErrorStatus(errorResponse.error.title),
          });
        }
      }
    });
  }

  updateWebContent(webContent: WebContentModel | null): void {
    this.openDialog(webContent)
  }

  deleteWebContent(webContentId: number): void {
    this.webContentService.deleteStructuredWebContent(webContentId).subscribe({
      next: (response) => {
        this.webContentSnackBar.openSnackBarWithSuccessStatus('The post was deleted successfully.')
        this.getStructuredWebContents(undefined, this.paginator.pageIndex +1, this.paginator.pageSize);
      },
      error: (errorResponse) => this.webContentSnackBar.openSnackBarWithErrorStatus(errorResponse.error.title)
    }
      );
  }

  handleWebContentStructure(webContentStructureId: number): WebContentStructureModel | undefined {
    return this.webContentStructures
      .find(webContentStructure =>
        webContentStructure.id == webContentStructureId)
  }

  search() {
    this.getStructuredWebContents(this.searchTerm ? this.searchTerm : '', 1, 5)
  }

  onPageChange(event: PageEvent) {
    const pageNumber = event.pageIndex + 1;
    const pageSize = event.pageSize ?? 20;
    this.getStructuredWebContents(this.searchTerm, pageNumber, pageSize);
  }

  processDataSource(data: any) {

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

    this.dataSource = new MatTableDataSource(webContents)
    this.table.renderRows()
  }

}
