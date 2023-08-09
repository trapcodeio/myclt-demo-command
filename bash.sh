#!/bin/bash

options=("all" "client" "server")

PS3="Which Repo would you like to update? "

select option in "${options[@]}"; do
  case $option in
  "all")
    echo "You chose all!"
    # Place your guest-related code here
    cd /var/repo/client/
    git pull origin main && yarn && yarn run build-dev

      cd /var/repo/server/
    git pull origin main && npx xjs dbc:migrate && yarn && yarn run build && pm2 restart all
    break
    ;;
  "client")
    echo "You chose client!"

    # Place your client-related code here
    cd /var/patch/client/
    git pull origin main && yarn && yarn run build
    break
    ;;
  "server")
    echo "You chose server!"
    # Place your server-related code here
    cd /var/patch/server/
    git pull origin main && npx xjs dbc:migrate && yarn && yarn run build && pm2 restart all
    break
    ;;
  *)
    echo "Invalid choice. Please select a valid option."
    ;;
  esac
done