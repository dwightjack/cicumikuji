all:
	pnpm firebase login
	pnpm firebase functions:config:get > ./packages/functions/cicumikuji-config.json
	@echo "\nNext step:"
	@echo "Please download your service key from https://console.firebase.google.com/project/cicumikuji/settings/serviceaccounts/adminsdk and store it as cicumikuji-firebase-adminsdk.json"