import 'expo-dev-client';
import { Platform } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './App';
import { StreamChat } from 'stream-chat';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { CometChat } from '@cometchat-pro/react-native-chat'

let appID = "222037032be4fa6b";
let region = "us";
let appSetting = new CometChat.AppSettingsBuilder()
                        .subscribePresenceForAllUsers()
                        .setRegion(region)
                        .autoEstablishSocketConnection(true)
                        .build();
CometChat.init(appID, appSetting).then(
	() => {
		console.log("Initialization completed successfully");
	}, error => {
		console.log("Initialization failed with error:", error);
	}
);

messaging().setBackgroundMessageHandler(async remoteMessage => {
    const client = StreamChat.getInstance('449vt742ex2f');

    // You can also provide tokenProvider instead of static token
    // await client._setToken({ id: userId }, tokenProvider)
    client._setToken(
      {
        id: 'user_id',
      },
      'user_token',
    );
    // handle the message
    const message = await client.getMessage(remoteMessage.data.id);
  
    // create the android channel to send the notification to
    const channelId = await notifee.createChannel({
      id: 'chat-messages',
      name: 'Chat Messages',
    });
    // display the notification
  await notifee.displayNotification({
    title: 'New message from ' + message.message.user.name,
    body: message.message.text,
    data: remoteMessage.data,
    android: {
      channelId,
      // add a press action to open the app on press
      pressAction: {
        id: 'default',
      },
      actions:[
        {
            title: '<p style="color: purple">Reply</p>',
            pressAction: { id: 'reply' },
            input: {
              placeholder: 'Write your reply...',
            }, // enable free text input
        },
      ]
    },
  });
});
{
    Platform.OS == "ios" 
    ?
    messaging().getIsHeadless().then(isHeadless => {
        // do sth with isHeadless
        if (isHeadless) {
            // App has been launched in the background by iOS, ignore
            return null;
          }
        registerRootComponent(App)
    })
    :
    registerRootComponent(App)
}


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

