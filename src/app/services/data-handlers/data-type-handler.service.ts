import { Injectable } from '@angular/core';
import { DateHandlerService } from './date-handler.service';
import { WebContentDocumentService } from '../web-content-document.service';
import { WebContentImageModel } from '../../models/WebContentImageModel';
import { WebContentSnackbarService } from '../web-content-snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class DataTypeHandlerService {

  constructor(
    private dateHandlerService: DateHandlerService,
    private webContentDocumentService: WebContentDocumentService,
    private webContentSnackBar: WebContentSnackbarService) { }

  async handleDataType(updatedContentField: any, dataType: string) {

    switch (dataType) {
      case 'date':
        return this.dateHandlerService.dateToIsoString(updatedContentField.inputControl);

      case 'image':

        if (!updatedContentField.info.inputControl)
          return updatedContentField.info.image;

        return this.uploadImage(
          updatedContentField.info.inputControl,
          updatedContentField.info.image.description)
          .then((image) => { return image; });

      default:
        return updatedContentField.inputControl;
    }
  }

  handleDataToBeDisplayed(data: string, dataType: string) {

    switch (dataType) {
      case 'date':
        return this.dateHandlerService.dateToUTCFormat(data);

      default:
        return data;
    }
  }

  handleContentFieldValueFormat(isChange: boolean, dataType: string, name: string, data: any, contentFieldToUpdate: any) {

    if (isChange) {
      if (dataType == 'image') {
        contentFieldToUpdate['contentFieldValue'] = { 'image': data }
      } else {
        contentFieldToUpdate['contentFieldValue'] = { 'data': data }
      }
    } else {
      if (dataType == 'image') {
        return { name: name, contentFieldValue: { image: data } };
      } else {
        return { name: name, contentFieldValue: { data: data } };
      }
    }

    return contentFieldToUpdate;

  }

  async uploadImage(formData: any, description: string) {

    let documentFolderId = -1;

    await this.webContentDocumentService.getWebContentParentFolder().then(
      (response: any) => {
        try {
          documentFolderId = response.items[0].id;
        } catch (error) {
          console.log(error)
        }
      }
    )

    return this.webContentDocumentService.postWebContentDocument(formData, documentFolderId).then((response) => {

      return  {
        id: response.id,
        sizeInBytes: response.sizeInBytes,
        contentType: 'Document',
        contentUrl: response.contentUrl,
        description: description,
        encodingFormat: response.encodingFormat,
        fileExtension: response.fileExtension,
        title: response.title
      }
    }, (error) => {
      this.webContentSnackBar.openSnackBarWithErrorStatus(error.error.title)
      return undefined;
    });
  }

  renameFileWithTimestamp(file: File): File {
    const fileParts = file.name.split('.');
    const fileExtension = fileParts.pop();
    const originalFileName = fileParts.join('.');

    const timestamp = Date.now();
    const newFileName = `${originalFileName}_${timestamp}.${fileExtension}`;

    const renamedFile = new File([file], newFileName, { type: file.type });

    return renamedFile;
  }

  copyOfContentField(contentFieldValue: any): any {
    return {
      'name': contentFieldValue.name,
      'label': contentFieldValue.label,
      'dataType': contentFieldValue.dataType,
      'nestedContentFields': contentFieldValue.nestedContentFields,
      'repeatable': contentFieldValue.repeatable,
      'contentFieldValue': {}
    }
  }
}
