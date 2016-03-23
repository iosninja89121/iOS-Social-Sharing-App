//
//  RecorderViewController.h
//  NewVideoRecorder
//
//  Created by Kseniya Kalyuk Zito on 10/23/13.

//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

#import "KZCameraView.h"
#import "MBProgressHUD.h"

@interface RecorderViewController : UIViewController
/**
 *  CameraViewController, implemented by the KZCameraView.
 */
@property (nonatomic, strong) KZCameraView *cam;
/**
 *  User has cancelled the video, we dismiss the controller.
 */
- (void)cancelButtonAction:(id)sender;
/**
 *  User has finished and wants to save the video. We save it with the save method with completion block implemented in the KZCameraView.m file.
 */
-(IBAction)saveVideo:(id)sender;
@end
