import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import { Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-vision',
  templateUrl: './vision.page.html',
  styleUrls: ['./vision.page.scss'],
})
export class VisionPage implements OnInit {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>

  usePicker = false
  imageFile: any

  constructor(
    // private camera: Camera,
    private platform: Platform
  ) { }

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
      this.imageFile = fr.result
    }
    fr.readAsDataURL(pickedFile)
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

