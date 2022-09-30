## Deploying

Before deploying, need to authorize with `gcloud` and select the project:

```sh
gcloud auth login
gcloud config set project PROJECTNAME

gcloud compute project-info add-metadata \
    --metadata google-compute-default-region=europe-central2,google-compute-default-zone=europe-central2-b

gcloud auth application-default login // to save auth creds for the app
```

Setup env vars:

```sh
export PROJECT_ID=vash-lavash
export GCP_CREDENTIALS_FILE=$HOME/.config/gcloud/application_default_credentials.json
export GCP_SERVICE_ACCOUNT_FILE="../../.config/gcloud/{fileName}.json"
export TELEGRAM_TOKEN=...
export GROUP_ID=...
export JWT_SECRET_NAME=...
export JWT_SECRET_VERSION=...
```

Then you can deploy with:

```sh
npm run build && npm run deploy
```

```sh
gcloud functions deploy order-notification \
  --entry-point orderNotification \
  --runtime nodejs16 \
  --trigger-event "providers/cloud.firestore/eventTypes/document.create" \
  --trigger-resource "projects/vash-lavash/databases/(default)/documents/orders/{order}" \
  --region "europe-central2" \
  --set-env-vars "TELEGRAM_TOKEN=$TELEGRAM_TOKEN,GROUP_ID=$GROUP_ID"
```
