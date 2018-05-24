# Valley Medical Center Foundation Silent Bidding Site &middot;

This is a silent bidding site for Valley Medical Center Foundation's fundraising auctions.

## Installing / Getting started

Create a directory titled VMC, clone the git repository into that folder, switch to the develop branch, and then install all dependencies.

```shell
mkdir VMC
cd VMC
git clone https://github.com/VMCAuctions/VMCAuction.git
git checkout -b develop origin/develop
cd server
npm install
```

Navigate to the secret-example.json file and follow the directions.

To run the project, open a new terminal window, navigate to the folder where you installed mongoDB, and run the following:

On Mac:
```shell
sudo mongod
```

On PC:
```shell
net start MongoDB
```

Navigate to where you cloned the git repository and run the following:

```shell
cd server
nodemon server.js
```

Then, navigate to localhost:8000 on Google Chrome.

## Developing

### Built With
Node.js, Express.js, MongoDB/Mongoose, Bootstrap, EJS

### Prerequisites

MongoDB

Installation instructions for mongoDB on Mac are included below.  (To download mongoDB on PC, follow the instructions on MongoDB's website: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

```shell
brew update
brew install mongodb
```

Node

To install Node, follow this link: https://nodejs.org/en/download/

### Deploying / Publishing

For demonstration and socket-testing purposes, you can download ngrok here: https://ngrok.com/download

Then, open a new terminal window and run the following:

```shell
ngrok http 8000
```

Navigate to the https url in your terminal, and then change "http://localhost:8000/" to that url in the following files (located in the wireframe directory):

1. packages.ejs
2. packageshow.ejs
3. userPage.ejs
4. admin.ejs
5. login.ejs

Please note that only two people can use this at a time without the ngrok terminal crashing.  If it does crash, wait one minute before refreshing the page you were currently on.

## Version Control

#### Master

This is the branch that every other branch is built off.  It should only ever be merged into when the code is at the next version level and ready for demonstration at a professional level.

#### Develop

Develop is built off of the master branch.  It should only be merged into when a feature is bug-free and ready for everyone on the project to use.  We recommend requesting that every team member, or at least a couple developers who did not directly work on the feature, review the feature branch before merging.  Never merge directly from terminal into develop (use GitHub instead).

#### Feature Branches

These branches should be created off of develop or another feature branch, NOT the master branch.  Feature branches should be modularized to one issue or topic.  Multiple files can be involved in order to prevent the project from crashing due to feature changes, but a minimal number of files should be affected to avoid conflicts.  If you are working on the same page as another developer, we strongly encourage pair programming to prevent merge conflicts.

Use the following code to push your feature branch up to GitHub.

```shell
git add .
git commit -m "<Detailed message explaining your feature and the changes you implemented to create it>"
git push origin <featureBranchName>
```

If the current feature branch was built off of another feature branch that has not yet been merged off of develop, create a pull request into its parent branch (your changes will be merged into develop when the parent branch has been merged).  Otherwise, create a pull request into develop.

## Configuration

If there is nothing currently in your database, the first time your server runs, a script will run that will automatically populate your database with categories and an organizer account, with username:"organizer" and password:"password".

## Style guide

All variables and file names are in camelcase (no underscores or dashes).  Try to modularize code when possible.

## Database

There are currently five models:

#### Auction

Every auction requires a name.  Each auction has a startClock and an endClock that are not required.  It currently has room for colors and a picture, although these have not yet been implemented.  It has a one-to-many relationship with items, packages, and users.  This model allows the organizer to create multiple auctions at the same time.

#### Categories

Every category requires a name.  Several categories are prepopulated.

#### Items

Every item has a name, description, donorFirst, donorLast, donorDisplay, value, and a packaged property that are required.  It also has restrictions and priority, which are not required.  It has many-to-one relationships with category, auctions, and packages.  It has a photo field that is currently empty.  Items will never be bid on directly, but items will be contained in packages, and thus will be bid upon indirectly.

#### Packages

Every package has a name, description, value, amount, priority, and a bid_increment which are required.  it has a required one-to-many relationship with items, a many-to-one relationship with categories, and a required many-to-one relationship with auction.  It also has a featured boolean, and a bids object.  It contains a photo field that is currently inactive.

A value is a prepopulated field that is the sum of all of the values of the items within that package.  The amount is the starting bid.  The bid increment is how the current bid has to be raised in order to be valid.

The bids object is an array of objects.  Each object is composed of a bidAmount, as well as the name of the bidder; for example, {bidAmount: 50, name: "Yarik"}.  The last object in the array contains the current/highest bid.

A package is featured when an organizer wants to emphasize it during an auction.  Which packages are featured can be changed throughout the auction.

Each package is tied to a particular auction.  Each package contains at least one item, and the only way the items are bid on is through their enveloping packages.

#### Users

Each user has a required userName, firstName, lastName, phone, email, streetAddress, city, state, zip, password.  It has a many-to-one relationship with auctions and packages.  It also contains a boolean describing admin status.

The packages property holds all of the packages that the user has decided to watch.  Packages in this property are not necessarily being won or even bid upon by the user.  If you want which packages are currently being won by a designated user, you must iterate through all of the packages and check the name in the last bid object.

Admins, clerks, and bidders are all considered users.

## Notes

The mongoose auto-increment module sometimes throws an error upon creation of the first item in the database.  It seems like this error is intrinsically related to the module, and it may eventually be fixed.  Although it has not yet been merged, here is a link to code that one may be able to use to fix it on their local machine: https://github.com/chevex-archived/mongoose-auto-increment/pull/83.


