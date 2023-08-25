import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebContentModel } from 'src/app/models/WebContentModel';
import { DataTypeHandlerService } from 'src/app/services/data-handlers/data-type-handler.service';
import { imageTypeValidator } from '../validators/file-type.validator';
import { Lightbox } from 'ngx-lightbox';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-web-content-dialog',
  templateUrl: './web-content-dialog.component.html',
  styleUrls: ['./web-content-dialog.component.scss']
})
export class WebContentDialogComponent implements OnInit {

  @Output() dataSaved: EventEmitter<any> = new EventEmitter();
  isChange!: boolean
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: WebContentModel,
    public dialogRef: MatDialogRef<WebContentDialogComponent>,
    private formBuilder: FormBuilder,
    private dataTypeHandlerService: DataTypeHandlerService,
    private ligthBox: Lightbox) {

    this.form = this.formBuilder.group({
      title: [this.isChange ?? this.data.title, [Validators.required]],
      contentFields: this.formBuilder.array([])
    })
  }

  ngOnInit(): void {
    this.isChange = this.data.id != null;
    this.createFormGroupForContentFields()
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  createFormGroupForContentFields() {

    const formFields = this.contentFieldsFormArray;

    this.data.webContentStructure?.contentStructureFields?.forEach((
      (contentStructureField: any) => {
        formFields.push(this.createFormGroup(contentStructureField));
      }))

  }

  createFormGroup(contentStructureField: any): FormGroup {

    const contentFieldValue: any = this.findContentFieldValueByName(contentStructureField.name)?.contentFieldValue;

    return this.formBuilder.group({
      inputControl: [
        this.dataTypeHandlerService.handleDataToBeDisplayed(
          contentFieldValue?.data?? '',
          contentStructureField.dataType
        ),
        contentStructureField.required == true ? [Validators.required] : null
      ],
      info: {
        name: contentStructureField.name,
        dataType: contentStructureField.dataType,
        label: contentStructureField.label,
        disabled: true,
        required: contentStructureField.required,
        inputControl: contentStructureField.inputControl,
        image: {
          id: contentFieldValue?.image?.id,
          sizeInBytes: contentFieldValue?.image?.sizeInBytes,
          contentType: contentFieldValue?.image?.contentType,
          contentUrl: contentFieldValue?.image?.contentUrl,
          description: contentFieldValue?.image?.description,
          encodingFormat: contentFieldValue?.image?.encodingFormat,
          fileExtension: contentFieldValue?.image?.fileExtension,
          title: contentFieldValue?.image?.title
        }
      }
    })

  }

  findContentFieldValueByName(fieldName: string): any {
    return this.data.contentFields?.find((contentField: any) => contentField?.name == fieldName);
  }

  async saveData(): Promise<any> {

    if (!this.form.valid) return;

    try {

      this.data.title = this.form.value.title;

      for (const updatedContentField of this.form.value.contentFields) {
        await this.handleDataProcessing(updatedContentField).then(() => { })
      }

      this.dataSaved.emit(this.data);

    } catch (error) {
      console.log(error);
    }

  }

  get contentFieldsFormArray(): FormArray {
    return this.form.get('contentFields') as FormArray;
  }

  handleFileInput(event: any, inputName: string) {

    const formData: FormData = new FormData();
    const files = event.target.files;
    const description = event.target.value;

    this.form.value.contentFields.forEach((formControl: any) => {

      if (formControl.info.dataType == 'image' && formControl.info.name == inputName) {

        if (files != null) {
          if (!imageTypeValidator(files[0]))
            throw Error('Invalid file type')

          let renamedFile: File = this.dataTypeHandlerService.renameFileWithTimestamp(files[0]);

          formData.append('file', renamedFile);
          formControl.info.inputControl = formData;
          formControl.info.image.title = renamedFile.name;

        } else {
          formControl.info.image['description'] = description;
        }
      }
    });

  }

  async handleDataProcessing(updatedContentField: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const dataType = updatedContentField.info.dataType

      let data = await this.dataTypeHandlerService.handleDataType(updatedContentField, dataType)

      let name = updatedContentField.info.name
      let contentFieldToUpdate = this.findContentFieldValueByName(name)

      const contentFieldObject = this.dataTypeHandlerService
        .handleContentFieldValueFormat(this.isChange, dataType, name, data, contentFieldToUpdate)

      if (this.isChange) {
        contentFieldToUpdate = contentFieldObject
      } else {
        this.data.contentFields.push(contentFieldObject);
      }

      resolve();
    })
  }

  clearImageInput(inputName: string){
    this.form.value.contentFields.forEach((formControl: any) => {
      if (formControl.info.dataType == 'image' && formControl.info.name == inputName) {
        formControl.info.image = {}
        formControl.info.inputControl = undefined;
      }
    });
  }

  openImage(image: any):void{
    image = {
      src: `${environment.hostUrl}/${image.contentUrl}`,
      caption: image.description
    }

    this.ligthBox.open([image], 0);  
  }

}