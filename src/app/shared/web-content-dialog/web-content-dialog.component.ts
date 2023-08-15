import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebContentModel } from 'src/app/models/WebContentModel';

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
    private formBuilder: FormBuilder) {
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
        this.findContentFieldValueByName(contentStructureField.name)?.contentFieldValue?.data,
        contentStructureField.required == true ? [Validators.required]: null
      ],
      info: {
        name: contentStructureField.name,
        dataType: contentStructureField.dataType,
        label: contentStructureField.label,
        disabled: true,
        required: contentStructureField.required
      }
    })

  }

  findContentFieldValueByName(fieldName: string): any {
    return this.data.contentFields?.find((contentField: any) => contentField?.name == fieldName);
  }

  saveData() {

    if(this.form.valid){
      this.data.title = this.form.value.title;
      this.form.value.contentFields.forEach((updatedContentField: any) => {
        let data = updatedContentField.inputControl
        let name = updatedContentField.info.name
        let contentFieldToUpdate = this.findContentFieldValueByName(name)
  
        if(this.isChange)
          contentFieldToUpdate['contentFieldValue']['data'] = data
        else
          this.data.contentFields.push({name: name, contentFieldValue: {data: data}})

        console.log(this.data.contentFields)
      })
    }else{
      this.onCancel();
    }

  }

  get contentFieldsFormArray(): FormArray {
    return this.form.get('contentFields') as FormArray;
  }

}