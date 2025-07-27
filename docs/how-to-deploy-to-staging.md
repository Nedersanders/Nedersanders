# How to deploy to staging?

## Create a new branch

Create a new branch and do your developments. Publish the branch to the repository. Please follow the naming scheme as described in the main read-me.

## Check which staging server is free.

Go to the [Trello development board](https://trello.com/b/uSrcfdXu/development) (If you are not a member, check the Sander Developers group description for the invite link).
Scroll all the way to the right, you'll find 2 columns

- Staging - Free
- Staging - In Use

Move a card from Free to In Use and add your name/gh-handle. Remember the name on the card, that will be your staging server.

## Go back to github

In the repository, go to actions. On the left you see a menu with Actions, and see Deploy to Staging listed. Press "Run Workflow", select your branch, add the number from your trello card as the staging environment number.

Run the workflow, and wait about a minute or so. (Untill the circle turns green).

![GitHub Actions Deployment Status](../assets/images/staging-deployment.png)

## Visit your staging server

You can now visit your staging server at sander(your env number).imlostincode.nl
You will be asked for a username and password. If you do not know these, ask in the developers app.