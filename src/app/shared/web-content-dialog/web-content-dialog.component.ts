import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  toppings = new FormControl('');

  toppingList: string[] = ['INACAP Arica',
    'INACAP Iquique',
    'INACAP Calama',
    'INACAP Antofagasta',
    'INACAP Copiapó'];

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
    const webContentStructureId = this.data.webContentStructure?.id ?? 0;
    let index = 0;

    if(this.isChange){
      this.data.contentFields.forEach(
        ((contentFieldValue: any) => {
          const contentStructureField = this.getWebContentStructureByName(contentFieldValue.name);
          formFields.push(this.createFormGroup(webContentStructureId, contentStructureField, index));
          index++;
      }));
    } else{
      this.data.webContentStructure?.contentStructureFields?.forEach((
        (contentStructureField: any) => {
          formFields.push(this.createFormGroup(webContentStructureId, contentStructureField, index));
          index++;
        }))
    }
  }

  createFormGroup(contentStructureId: number, contentStructureField: any, index: number): FormGroup {

    const contentFieldValue: any = this.findContentFieldValueByName(contentStructureField.name, index)?.contentFieldValue;

    return this.formBuilder.group({
      inputControl: [
        this.dataTypeHandlerService.handleDataToBeDisplayed(
          contentFieldValue?.data ?? '',
          contentStructureField.dataType
        ),
        contentStructureField.required == true ? [Validators.required] : null
      ],
      info: {
        contentStructureFieldId: contentStructureId,
        name: contentStructureField.name,
        dataType: contentStructureField.dataType,
        label: contentStructureField.label,
        disabled: true,
        required: contentStructureField.required,
        repeatable: contentStructureField.repeatable,
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

  findContentFieldValueByName(fieldName: string, targetIndex: number): any {

    let index = 0;
    let searchResult = {}; 

    this.data.contentFields.forEach((contentField: any) => {
      if (contentField?.name == fieldName && index == targetIndex) {
        searchResult = contentField;
      }
      index++;
    })

    return searchResult;
  }

  async saveData(): Promise<any> {

    if (!this.form.valid) return;

    try {

      this.data.title = this.form.value.title;
      let index = 0;
      let hasError = false;

      for (const updatedContentField of this.form.value.contentFields) {
        await this.handleDataProcessing(updatedContentField, index)
        .then(() => { })
        .catch(() => {hasError=true}) 
        index++;
      }

      this.dataSaved.emit(hasError? undefined: this.data);

    } catch (error) {
      console.log(error);
    }

  }

  get contentFieldsFormArray(): FormArray {
    return this.form.get('contentFields') as FormArray;
  }

  handleFileInput(event: any, inputName: string, searchIndex: number) {

    const formData: FormData = new FormData();
    const files = event.target.files;
    const description = event.target.value;
    let index=0;

    this.form.value.contentFields.forEach((formControl: any) => {
      if (formControl.info.dataType == 'image' && formControl.info.name == inputName && index == searchIndex) {
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
      index++;
    });

  }

  async handleDataProcessing(updatedContentField: any, index: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const dataType = updatedContentField.info.dataType

        let data = await this.dataTypeHandlerService.handleDataType(updatedContentField, dataType)
        let name = updatedContentField.info.name
        let contentFieldToUpdate = this.findContentFieldValueByName(name, index)

        if(data == undefined){
          reject()
        }
  
        const contentFieldObject = this.dataTypeHandlerService
          .handleContentFieldValueFormat(this.isChange, dataType, name, data, contentFieldToUpdate)
  
        if(!this.isChange){
          this.data.contentFields.push(contentFieldObject);
        }
  
        resolve();
      } catch (error) {
        reject()
      }

    })
  }

  clearImageInput(inputName: string, targetIndex: number) {
    let index=0;
    this.form.value.contentFields.forEach((formControl: any) => {
      if (formControl.info.dataType == 'image' && formControl.info.name == inputName && index == targetIndex) {
        formControl.info.image = {}
        formControl.info.inputControl = undefined;
      }
      index++;
    });
  }

  openImage(image: any): void {
    image = {
      src: `${environment.hostUrl}/${image.contentUrl}`,
      caption: image.description
    }

    this.ligthBox.open([image], 0);
  }

  copyFormControl(contentFieldInfo: any, index: number): void {

    let webContentStructure = this.getWebContentStructureByName(contentFieldInfo.name);

    if(this.isChange)
      this.data.contentFields.splice(index + 1, 0, this.dataTypeHandlerService.copyOfContentField(this.data.contentFields[index]))

    const copyOfFormGroup = this.createFormGroup(contentFieldInfo.contentStructureFieldId, webContentStructure, -1)
    this.contentFieldsFormArray.insert(index + 1, copyOfFormGroup)

  }

  getWebContentStructureByName(webContentStructureName: string): any{
    return this.data.webContentStructure?.contentStructureFields?.find((webContentStructure: any) => webContentStructure.name == webContentStructureName);
  }

  removeFormControl(inputName: string, index: number): void {

    let availableFields = 0;

    this.form.value.contentFields.forEach((formControl: any) => {
      if (formControl.info.name == inputName) {
        availableFields++;
      }
    });

    if (availableFields > 1) {
      this.contentFieldsFormArray.removeAt(index);
      this.data.contentFields.splice(index, 1);
    }
  }
}