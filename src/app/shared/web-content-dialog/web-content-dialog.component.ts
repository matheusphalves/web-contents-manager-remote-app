import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebContentModel } from 'src/app/models/WebContentModel';
import { DataTypeHandlerService } from 'src/app/services/data-handlers/data-type-handler.service';

@Component({
  selector: 'app-web-content-dialog',
  templateUrl: './web-content-dialog.component.html',
  styleUrls: ['./web-content-dialog.component.scss']
})
export class WebContentDialogComponent implements OnInit {

  isChange!: boolean
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: WebContentModel,
    public dialogRef: MatDialogRef<WebContentDialogComponent>,
    private formBuilder: FormBuilder,
    private dataTypeHandlerService: DataTypeHandlerService) {

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

    return this.formBuilder.group({
      inputControl: [
        this.dataTypeHandlerService.handleDataToBeDisplayed(
          this.findContentFieldValueByName(contentStructureField.name)?.contentFieldValue?.data,
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
        description: contentStructureField.description
      }
    })

  }

  findContentFieldValueByName(fieldName: string): any {
    return this.data.contentFields?.find((contentField: any) => contentField?.name == fieldName);
  }

  saveData() {

    if (!this.form.valid) {
      this.onCancel();
      return;
    }

    this.data.title = this.form.value.title;
    this.form.value.contentFields.forEach(
      async (updatedContentField: any) => {
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
      });

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
          formData.append('file', this.dataTypeHandlerService.renameFileWithTimestamp(files[0]));
          formControl.info.inputControl = formData;
        } else {
          formControl.info.description = description;
        }
      }
    });
  }

}