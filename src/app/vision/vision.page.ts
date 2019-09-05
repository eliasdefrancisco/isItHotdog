import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import { Platform, LoadingController } from '@ionic/angular';
// import { DomSanitizer } from '@angular/platform-browser';

import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

// function base64toBlob(base64Data, contentType) {
//   contentType = contentType || '';
//   const sliceSize = 1024;
//   const byteCharacters = window.atob(base64Data);
//   const bytesLength = byteCharacters.length;
//   const slicesCount = Math.ceil(bytesLength / sliceSize);
//   const byteArrays = new Array(slicesCount);

//   for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
//     const begin = sliceIndex * sliceSize;
//     const end = Math.min(begin + sliceSize, bytesLength);

//     const bytes = new Array(end - begin);
//     for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
//       bytes[i] = byteCharacters[offset].charCodeAt(0);
//     }
//     byteArrays[sliceIndex] = new Uint8Array(bytes);
//   }
//   return new Blob(byteArrays, { type: contentType });
// }

@Component({
  selector: 'app-vision',
  templateUrl: './vision.page.html',
  styleUrls: ['./vision.page.scss'],
})
export class VisionPage implements OnInit {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>

  usePicker = false
  imageFile: string

  task: AngularFireUploadTask
  result$: Observable<any>
  loading: Promise<any>

  constructor(
    // private camera: Camera,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private storage: AngularFireStorage,
    private afs: AngularFirestore
  ) { 
    this.loading = this.loadingCtrl.create({
      message: 'Running AI vision analysis...',
      duration: 2000
    })
  }

  ngOnInit() {
    this.checkIfUsingPicker()
  }
  
  checkIfUsingPicker() {
    if (
      (this.platform.is('mobile') && this.platform.is('hybrid')) ||
      (this.platform.is('desktop'))
    ) {
      this.usePicker = true
    }
  }

  getPicture() {
    if (this.usePicker) {
      this.filePickerRef.nativeElement.click()
      return
    }
    // this.getPictureFromCamera()
  }

  onFileChosen(event) {
    const pickedFile = (event.target as HTMLInputElement).files[0]
    if (!pickedFile) { 
      return
    }
    const fr = new FileReader()
    fr.onload = () => {
      this.imageFile = fr.result.toString()
      // this.startUpload()
    }
    fr.readAsDataURL(pickedFile)
  }

  startUpload(file: string) {
    file = file || this.imageFile
    this.loading.then( loadingEl => { 
      loadingEl.present() 
      const docId = this.afs.createId()
      const path = `${docId}.jpg`

      // Make a reference for the Firestore Document location, done by Cloud Function
      const photoRef = this.afs.collection('photos').doc(docId)

      // Wait for the Firestore Document is written
      this.result$ = photoRef.valueChanges().pipe(
        filter(data => !!data),
        tap(_ => loadingEl.dismiss())
      )

      // Save image in Firebase Storage
      this.task = this.storage.ref(path).putString(file, 'data_url')
    })
  }


  // TODO: Not implemented yet
  // getPictureFromCamera() {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   }
  //   this.camera.getPicture(options).then(
  //     (imageData) => {
  //       console.log('ImageData: ', imageData)
  //       // imageData is either a base64 encoded string or a file URI
  //       // If it's base64 (DATA_URL):
  //       let base64Image = 'data:image/jpeg;base64,' + imageData;
  //     }, 
  //     (err) => {
  //       // Handle error
  //       console.log('Error: ', err)
  //     }
  //   )
  // }



}

