import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { WebContentHistoric } from 'src/app/models/WebContentHistoric';
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
export class HomeComponent implements OnInit {

  @ViewChild(MatTable)
  table!: MatTable<any>

  displayedColumns: string[] = ['id', 'title', 'contentStructureId', 'dateCreated', 'actions'];
  dataSource!: WebContentModel[];
  webContentStructures!: WebContentStructureModel[]

  selectedStructure!: WebContentStructureModel;

  searchTerm!: string;

  ngOnInit(): void {}

  constructor(
    public dialog: MatDialog, 
    public webContentService: WebContentService,
    public webContentStructureService: WebContentStructureService,
    public webContentAuditorService: WebContentAuditorService){
      this.getWebContentStructures()
  }

  getWebContentStructures(){

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

      this.getStructuredWebContents(undefined)
    })
  }

  getStructuredWebContents(search: string | undefined){
    this.dataSource = [];


    this.webContentService.getStructuredWebContents(search)
    .subscribe((data: any) =>{
      data.items.forEach((item: any) => {
        const webContent: WebContentModel = {
            id: item.id,
            title: item.title,
            webContentStructure: this.handleWebContentStructure(item.contentStructureId),
            contentFields: item.contentFields,
            dateCreated: item.dateCreated
        }
      
        this.dataSource.push(webContent);
        this.table.renderRows();
      });
      
    });
  }

  openDialog(webContent: WebContentModel| null): void{
    const dialogRef = this.dialog.open(WebContentDialogComponent, {
      width: '300px',
      data: webContent === null? {
        id: null,
        title: '',
        contentFields: [],
        contentStructureId: null,
        webContentStructure: this.selectedStructure
      }: {
        id: webContent.id,
        title: webContent.title,
        webContentStructure: webContent.webContentStructure,
        contentFields: webContent.contentFields
      },
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result != undefined){

        if(this.dataSource.map(p => p.id).includes(result.id)){
          
          this.webContentService.putStructuredWebContent(result)
          .subscribe((response: any) => {
            this.dataSource[result.position -1] = result
            this.table.renderRows();
            this.webContentAuditorService.postWebContentHistory({webContentId: response.id, change: response.contentFields});
          })
        
        }else{
          this.webContentService.postStructuredWebContent(result)
          .subscribe((response: any) => {
            this.getStructuredWebContents(undefined)
            this.table.renderRows();
            this.webContentAuditorService.postWebContentHistory({webContentId: response.id, change: response.contentFields});
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

  handleWebContentStructure(webContentStructureId: number): WebContentStructureModel | undefined{
    return this.webContentStructures
      .find(webContentStructure => 
        webContentStructure.id == webContentStructureId)
  }

  search(){
    this.getStructuredWebContents(this.searchTerm.toLocaleLowerCase())
  }

}
