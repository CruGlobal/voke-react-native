#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
// Voke: Notifications
// https://github.com/react-native-community/push-notification-ios#update-appdelegateh
#import <UserNotifications/UNUserNotificationCenter.h>

// @interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
