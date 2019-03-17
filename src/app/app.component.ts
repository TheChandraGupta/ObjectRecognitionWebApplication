import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OSMOSIS-2019';
  // test_img: string;
  @ViewChild('test_img') test_img;
  error: string;
  url = '';
  isImgSelected: boolean;
  isImgRecognized: boolean;
  data: any;
  objectName: string;

  constructor(private http: HttpClient) {
    this.isImgSelected = false;
    this.isImgRecognized = false;
    this.data = null;
    this.objectName = '';
  }

  onSelectImage(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target['result'];
        // console.log(this.url);
        this.isImgSelected = true;
        this.isImgRecognized = false;
      };
    }
  }

  parseTable(files: any): Observable<Object> {
    const formData: FormData = new FormData();
    formData.append('test_img', files[0], files[0].name);
    return this.http.post('http://127.0.0.1/upload', formData);
  }

  recognizeObject() {
    // if (this.test_img == null || this.test_img.length <= 0) {
    //   this.error = 'Please select an Image.';
    //   console.log(this.error);
    //   return;
    // }

    console.log(this.test_img);

    const files: FileList = this.test_img.nativeElement.files;
    if (files.length === 0) {
      return;
    }
    this.parseTable(files).subscribe(
      (response) => {
        console.log(response);
        console.log(response['prediction']);
        this.data = response['prediction'];
        this.objectName = this.data[0]['category'];
        this.isImgRecognized = true;
      },
      (error) => {
        console.log(error);
        this.isImgRecognized = false;
      }
    );
  }


}
