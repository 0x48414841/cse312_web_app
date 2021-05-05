# Statement of Purpose
The server - and all other files herein - has all of the standard functionality contained in any contemporary web app. It supports user authentication, web sockets, file uploads, DM's + notifications, and viewing all active users. Additionally, our web app contains
a two person shooting game with support for multiple CONCURRENT lobbies. The game itself is rudimentary; you click to shoot and depending on which player's health is depleted first loses. 

The sequence of events a user might undergo when using our web app is similar to the following:
1. User A authenticates to login
2. User A creates a lobby
3. User A messages the newly created lobby id to user B or posts the lobby id in the global chat
4. User A and User B joins the lobby
5. User A wins the game and goes back to the homepage
6. start from step 2.