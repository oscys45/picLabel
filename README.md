# picLabel
Prerequisites:
- Local instance of MongoDB running on TCP port 27017
- Node.js, minimum version 6.11.3 LTS
- Postman Chrome plugin to make REST calls.

Clone the repo from https://github.com/oscys45/picLabel.git

There are 2 directories:
- picLabelAPI:  This is the API instance
- picLabel:  This is the UI instance.

Within the directory picLabelAPI, run the following at prompt:

npm install

then

npm start

Within the directory picLabel, run the following at prompt:

npm install

then

ng serve 

------

To provision a user, open Postman and make a POST request to http://localhost:3000/authenticate/register.  Add two key/value pairs under body with x-www-form-urlencoded selected:

username <the username you wish to use>
password <the password you wish to use>

This operation calls the user creation API directly, and you should receive a response showing success with a token.

------

To use the application, point your browser to http://localhost:4200

------

TODO:

Housekeeping:
- Class naming is a bit schizophrenic.  Fix that.
- Clean up UI.

Functionality:
- Add GPS tags, integrate with Google Maps for user to pin a location on a map for lat/lon tag.
- Add infinite scroll for thumbnail images in gallery.
- Within the gallery, enable search (especially by tags).
- Add Facebook integration to post images directly to social media.

Defects:
- Hash password in user maintenance. 