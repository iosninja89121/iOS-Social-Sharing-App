//
//  RecorderViewController.m
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
#define IOS7  ([[[[[UIDevice currentDevice] systemVersion]componentsSeparatedByString:@"."] objectAtIndex:0] intValue] >= 7)
#import "RecorderViewController.h"

@implementation RecorderViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    if (IOS7)
    {
        self.edgesForExtendedLayout = UIRectEdgeNone;
    }
    
    //Create CameraView
	self.cam = [[KZCameraView alloc]initWithFrame:CGRectMake(0.0, 0.0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height) withVideoPreviewFrame:CGRectMake(0.0, 0.0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.width)];
    self.cam.maxDuration = 10.0;
    self.cam.showCameraSwitch = YES; //Say YES to button to switch between front and back cameras
    //Create "save" button
    self.navigationController.navigationBar.barTintColor = [UIColor colorWithRed:0.1 green:0.1 blue:0.1 alpha:1];
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc]initWithTitle:NSLocalizedString(@"Publish", nil) style:UIBarButtonItemStyleBordered target:self action:@selector(saveVideo:)];
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:NSLocalizedString(@"Cancel", nil) style:UIBarButtonItemStyleBordered target:self action:@selector(cancelButtonAction:)];
    
    [self.view addSubview:self.cam];
}
- (void)cancelButtonAction:(id)sender {
    [self.parentViewController dismissViewControllerAnimated:YES completion:nil];
}
-(IBAction)saveVideo:(id)sender
{
    
    [self.cam saveVideoWithCompletionBlock:^(BOOL success) {
        if (success)
        {
            NSLog(@"WILL PUSH NEW CONTROLLER HERE");
            [self dismissViewControllerAnimated:YES completion:nil];
            [[NSNotificationCenter defaultCenter] postNotificationName:@"videoUploadBegins" object:nil];

        }
    }];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
