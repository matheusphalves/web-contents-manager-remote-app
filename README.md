# POC Client Extension - Web Contents Manager

This project contains a minimal version of how to manage web content from client extensions perspective. Therefore, some of the OOTB features may not be fully implemented in the headless layer.

 **Table of content:**
 - [Angular CLI basics](#topic-01)
 - [List of Supported Liferay Content Fields](#topic-02)
 - [Configuring app as a Liferay Client Extensions](#topic-03)
 
 <a id="topic-01"></a>

 ##  Angular CLI basics

 This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Build for Production

Run `npm run build:prod` to build the project ready for production. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

 <a id="topic-02"></a>

## List of Supported Liferay Content Fields
The app have supports these content fields types, if you wish, the **repeatable** flag can be check as **true** as well. 
- Text
- Date
- Boolean
- Image
- Rich text


 <a id="topic-03"></a>
## Configuring app as a Liferay Client Extensions

### Step 01: Build the project
```
npm run build:prod
```

Some files will be generated in the following path ```/dist/web-contents-manager```. All the ```.js```, ```.css``` are necessary.

You can build the project for dev purposes, but keep in mind that you will be running an unoptimized version.

### Step 02: Upload the builded files to Documents and Media

Upload the files to you preferred location inside the documents and media (the file names above are just an example, can be changed after your local build.)

```
- runtime.02aa6c35e392b8e6.js
- polyfills.1f73ea0792c41129.js
- main.45564d6ce0e4429b.js
- quill.fc6e8de4d22a5ef3.js
- styles.9b82a77683dc4a13.css
```

After uploading these files, copy the WebDAV URL. 

### Step 03: Create a folder to store the uploaded images
Create a folder ```web-content-images``` in the root path of the D&M. You can change the folder name setting the webContentImagesFolderName variable located on ```/enviroments/enviroment.development.ts```.

### Step 04: Create a custom element
For futher more informations about this step, please  [follow the official documentation](https://learn.liferay.com/w/dxp/building-applications/client-extensions/front-end-client-extensions/tutorials/creating-a-basic-custom-element).

HTML Element Name: app-root

```Please add the URL following the order as described on the previous step, otherwise you can experience problems during Angular bootstrapping!```

### Step 05: Create a new Liferay page and add the created remote app.

### Step 06: Add the page on your site (don't forget to publish before testing!)

Enjoy your app!


