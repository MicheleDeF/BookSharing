## Application Installation Guide
View the guide in Italian &#x1F1EE;&#x1F1F9; [README-it.md](https://github.com/MicheleDeF/BookSharing/blob/main/README-it.md)

### System Requirements
* ```Node.js``` version 22.21.1 or higher
* ```Apache``` version 2.4.52 or higher
* ```MySQL``` version 8.4.3 or higher
* ```Git``` version 2.47 or higher

## Cloning the Repository
### Run the following command from the CMD
```
git clone https://github.com/MicheleDeF/BookSharing.git 
```
this command creates a folder named **BookSharing**. Run the following command to enter the created folder:
```
cd BookSharing
```
Open the BookSharing folder with any IDE (such as Visual Studio Code), rename the file ```.env_example``` to ```.env```, and define the environment variables _JWT_SECRET_ and _SESSION_SECRET_ for the JWT web token and sessions, respectively.

## Creating the Database
Before proceeding with the other operations, create a database named **books_sharing** as configured in the _config/config.json_ file, with the _username_ **root** and a **null** _password_. You can change these values as long as you modify the _development_ section in the _config/config.json_ file.

## Installing Required npm Packages
Next, install all the npm packages listed in the **package.json** file. Run the following command in the root folder of the project (which is BookSharing in this case):
```
npm install
```
## Creating Tables
To create the tables, run the following command in the project root folder (BookSharing):
```
npx sequelize-cli db:migrate
```
If the operation is successful, the tables **books**, **messages**, **sequelizemeta**, **statistics**, and **users** will be created.

## Generating Test Data
To generate the test data, run the following command in the project root folder (BookSharing):
```
npx sequelize-cli db:seed:all
```
this command will populate the previously created tables with sample data. Specifically, it creates two users whose email addresses can be found in the _email_ column of the **users** table. The password is the same for both: ```a1s2d3F4```. Use the email and password of one of these users to log in.

## Starting the Application
You can start the application using one of the following commands:
```
npm run start
```
or
```
node index.js
```
## Note on Using Test Data
To test the application, test data is inserted via seeders. Specifically, fixed coordinates ```latitude = 40.949282740897054``` and ```longitude = 14.523030645794485``` are used to generate two users located close to each other, allowing you to simulate all features.
If you want to test the application with real ```latitude``` and ```longitude``` values, follow these steps:

* Open the file ```public\js\script.js```;
* Un-comment lines 51 and 52 to get the exact location;
* Comment out lines 54 and 55 to disable the test data;
* Clear your browser cache.

Regarding the test data, to correctly use the ```postman/BookSharing.postman_collection.json``` file, use the password ```a1s2d3F4``` and one of the two emails stored in the ```email``` column of the ```users``` table. The same credentials apply for logging into the application.

## Note on Using the Sass Compiler to Compile style.css
To add additional styles to the ```public/css/style.css``` file, run the following command in the project root folder (BookSharing):
```
sass --watch public/scss/style.scss public/css/style.css  --style compressed
```
Add your custom styles to ```public/scss/style.scss```, and they will be automatically compiled into ```public/css/style.css```. The ```public/scss/style.scss``` file contains comments regarding the styles used, while the ```public/css/style.css``` file is in a compressed format.