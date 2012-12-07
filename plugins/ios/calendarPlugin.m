//
//  calendarPlugin.m
//  Author: Felix Montanez
//  Date: 01-17-2011
//  Notes: 


#import "calendarPlugin.h"
#import <EventKitUI/EventKitUI.h>
#import <EventKit/EventKit.h>

@implementation calendarPlugin
@synthesize eventStore;
@synthesize defaultCalendar;


- (CDVPlugin*) initWithWebView:(UIWebView*)theWebView
{
    self = (calendarPlugin*)[super initWithWebView:theWebView];
    if (self) {
		//[self setup];
    }
    return self;
}

-(void)createEvent:(NSMutableArray *)arguments withDict:(NSMutableDictionary *)options
{
    EKEventStore *eventStore = [[[EKEventStore alloc] init] autorelease];
    if([eventStore respondsToSelector:@selector(requestAccessToEntityType:completion:)]) {
        // iOS 6 and later
        NSLog(@"iOS 6 and later");
        [eventStore requestAccessToEntityType:EKEntityTypeEvent completion:^(BOOL granted, NSError *error) {
            if (granted){
                //---- codes here when user allow your app to access theirs' calendar.
                NSLog(@"allowed");
                [self performCalendarActivity:arguments];
                
            }else
            {
                //----- codes here when user NOT allow your app to access the calendar.
                NSLog(@"dsiallowed");
            }
        }];
    }
    else {
        //---- codes here for IOS < 6.0.
        NSLog(@"< iOS 6");
        [self performCalendarActivity:arguments];
    }
}

-(void)performCalendarActivity:(NSMutableArray *)arguments
{
    NSLog('performCalendarActivity');
    //Get the Event store object
    EKEvent *myEvent;
    EKEventStore *store;
    
    store = [[EKEventStore alloc] init];
    myEvent = [EKEvent eventWithEventStore: store];
    
    NSString* title         = [arguments objectAtIndex:1];
    NSString* location      = [arguments objectAtIndex:2];
    NSString* message       = [arguments objectAtIndex:3];
    NSString* startDate     = [arguments objectAtIndex:4];
    NSString* endDate       = [arguments objectAtIndex:5];
    NSString* calendarTitle = [arguments objectAtIndex:6];
    
    NSLog(title);
    
    EKCalendar* calendar = nil;
    if(calendarTitle == nil){
        calendar = store.defaultCalendarForNewEvents;
    } else {
        NSIndexSet* indexes = [store.calendars indexesOfObjectsPassingTest:^BOOL(id obj, NSUInteger idx, BOOL *stop) {
            *stop = false;
            EKCalendar* cal = (EKCalendar*)obj;
            if(cal.title == calendarTitle){
                *stop = true;
            }
            return *stop;
        }];
        if (indexes.count == 0) {
            calendar = store.defaultCalendarForNewEvents;
        } else {
            calendar = [store.calendars objectAtIndex:[indexes firstIndex]];
        }
    }
    
    //creating the dateformatter object
    NSDateFormatter *sDate = [[[NSDateFormatter alloc] init] autorelease];
    [sDate setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    NSDate *myStartDate = [sDate dateFromString:startDate];
    
    
    NSDateFormatter *eDate = [[[NSDateFormatter alloc] init] autorelease];
    [eDate setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    NSDate *myEndDate = [eDate dateFromString:endDate];
    
    
    myEvent.title = title;
    myEvent.location = location;
    myEvent.notes = message;
    myEvent.startDate = myStartDate;
    myEvent.endDate = myEndDate;
    myEvent.calendar = calendar;
    
    
    EKAlarm *reminder = [EKAlarm alarmWithRelativeOffset:-2*60*60];
    
    [myEvent addAlarm:reminder];
    
    NSError *error;
    BOOL saved = [store saveEvent:myEvent span:EKSpanThisEvent
                            error:&error];
    if (saved) {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title
                                                        message:@"Saved to Calendar" delegate:self
                                              cancelButtonTitle:@"Thank you!"
                                              otherButtonTitles:nil];
        [alert show];
        [alert release];
        
        
    }
}

/***** NOT YET IMPLEMENTED BELOW ************/

//-(void)deleteEvent:(NSMutableArray *)arguments withDict:(NSMutableDictionary *)options {}

/*
-(void)findEvent:(NSMutableArray *)arguments withDict:(NSMutableDictionary *)options {
 
 EKEventStore* store = [[EKEventStore alloc] init];
 EKEvent* myEvent = [EKEvent eventWithEventStore: store];
 
 NSString *startSearchDate  = [arguments objectAtIndex:1];
 NSString *endSearchDate    = [arguments objectAtIndex:2];
 
 
 //creating the dateformatter object
 NSDateFormatter *sDate = [[[NSDateFormatter alloc] init] autorelease];
 [sDate setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
 NSDate *myStartDate = [sDate dateFromString:startSearchDate];
 
 
 NSDateFormatter *eDate = [[[NSDateFormatter alloc] init] autorelease];
 [eDate setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
 NSDate *myEndDate = [eDate dateFromString:endSearchDate];
 
 
 // Create the predicate
 NSPredicate *predicate = [eventStore predicateForEventsWithStartDate:myStartDate endDate:myEndDate calendars:defaultCalendar]; 
 
 
 // eventStore is an instance variable.
 // Fetch all events that match the predicate.
 NSArray *events = [eventStore eventsMatchingPredicate:predicate];
 [self setEvents:events];
 
 
}
 */

-(void)getCalendarList:(NSMutableArray *)arguments withDict:(NSMutableDictionary *)options
{
    NSLog(@"In plugin method getCalendarList");
    NSString *callback = [arguments objectAtIndex:0];
    EKEventStore* store = [[EKEventStore alloc] init];
    NSString* js = nil;
    if (store != nil && store.calendars.count > 0) {
        NSMutableArray *titles = [[store.calendars valueForKey:@"title"] mutableCopy];
        NSLog(@"Found %i calendars", titles.count);
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:titles];
        js = [result toSuccessCallbackString:callback];
    } else {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"no calendars found"];
        js = [result toErrorCallbackString:callback];
    }
    [self writeJavascript:js];
}
 
 
/*-(void)modifyEvent:(NSMutableArray *)arguments withDict:(NSMutableDictionary *)options{
 EKEventViewController *eventViewController = [[EKEventViewController alloc] init];
 eventViewController.event = myEvent;
 eventViewController.allowsEditing = YES;
 navigationController we
= [[UINavigationController alloc]
 initWithRootViewController:eventViewController];
 [eventViewController release];
} */


//delegate method for EKEventEditViewDelegate
-(void)eventEditViewController:(EKEventEditViewController *)controller didCompleteWithAction:(EKEventEditViewAction)action {
    [(UIViewController*)self dismissModalViewControllerAnimated:YES];
    [self release];
}
@end
