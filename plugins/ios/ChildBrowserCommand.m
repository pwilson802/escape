//  Created by Jesse MacFadyen on 10-05-29.
//  Copyright 2010 Nitobi. All rights reserved.
//  Copyright 2012, Randy McMillan

#import "ChildBrowserCommand.h"
#import <Cordova/CDVViewController.h>



@implementation ChildBrowserCommand

@synthesize childBrowser;

- (void) showWebPage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options // args: url
{
#ifdef CORDOVA_FRAMEWORK
    CDVViewController* cont = (CDVViewController*)[ super viewController ];
    childBrowser.supportedOrientations = cont.supportedOrientations;
    childBrowser.modalTransitionStyle = UIModalTransitionStyleFlipHorizontal;
    @try {
        [ cont presentModalViewController:childBrowser animated:YES ];
    }@catch(NSException * e){
        NSLog(@"ALready visible");
    }
#endif
    if(childBrowser == NULL)
    {
	childBrowser = [[ ChildBrowserViewController alloc ] initWithScale:FALSE ];
	childBrowser.delegate = self;
    }

    /* // TODO: Work in progress
     NSString* strOrientations = [ options objectForKey:@"supportedOrientations"];
     NSArray* supportedOrientations = [strOrientations componentsSeparatedByString:@","];
     */

    CDVViewController* cont = (CDVViewController*)[ super viewController ];
    NSMutableArray* supportedOrientations =[[NSMutableArray alloc] init];
    
//    if ([cont supportsOrientation:UIInterfaceOrientationPortrait]) {
//        
//        [supportedOrientations addObject: [NSNumber numberWithInt:UIDeviceOrientationPortrait]];
//        
//    }
//    
//    if ([cont supportsOrientation:UIDeviceOrientationPortraitUpsideDown]) {
//        
//        [supportedOrientations addObject: [NSNumber numberWithInt:UIDeviceOrientationPortraitUpsideDown]];
//        
//    }
//    
//    if ([cont supportsOrientation:UIDeviceOrientationLandscapeLeft]) {
//        
//        [supportedOrientations addObject: [NSNumber numberWithInt:UIDeviceOrientationLandscapeLeft]];
//        
//    }
//    
//    if ([cont supportsOrientation:UIDeviceOrientationLandscapeRight]) {
//        
//        [supportedOrientations addObject: [NSNumber numberWithInt:UIDeviceOrientationLandscapeRight]];
//        
//    }
    
    childBrowser.supportedOrientations = supportedOrientations;
    [ cont presentModalViewController:childBrowser animated:YES ];

    NSString *url = (NSString*) [arguments objectAtIndex:0];

    [childBrowser loadURL:url  ];

}
- (void) getPage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    NSString *url = (NSString*) [arguments objectAtIndex:0];
    [childBrowser loadURL:url  ];
}

-(void) close:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options // args: url
{
    [ childBrowser closeBrowser];

}

-(void) onClose
{
    NSString* jsCallback = [NSString stringWithFormat:@"window.plugins.childBrowser.onClose();",@""];
    [self.webView stringByEvaluatingJavaScriptFromString:jsCallback];
}

-(void) onOpenInSafari
{
    NSString* jsCallback = [NSString stringWithFormat:@"window.plugins.childBrowser.onOpenExternal();", @""];
    [self.webView stringByEvaluatingJavaScriptFromString:jsCallback];
}


-(void) onChildLocationChange:(NSString*)newLoc
{

    NSString* tempLoc = [NSString stringWithFormat:@"%@",newLoc];
    NSString* encUrl = [tempLoc stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];

    NSString* jsCallback = [NSString stringWithFormat:@"window.plugins.childBrowser.onLocationChange('%@');",encUrl];
    [self.webView stringByEvaluatingJavaScriptFromString:jsCallback];

}
@end
