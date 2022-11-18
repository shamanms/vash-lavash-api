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
export API_URL=...
export JWT_SECRET_NAME=...
export JWT_SECRET_VERSION=...
export ALLOWED_DOMAINS=http://localhost:xxxx
export PORT=....(8080 used by default)
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
  --set-env-vars "TELEGRAM_TOKEN=$TELEGRAM_TOKEN,GROUP_ID=$GROUP_ID,API_URL=$API_URL"
```

```sh
gcloud functions deploy api \
  --entry-point api \
  --allow-unauthenticated \
  --trigger-http \
  --runtime nodejs16 \
  --region europe-central2 \
  --set-env-vars "PROJECT_ID=$PROJECT_ID,ALLOWED_DOMAINS=$ALLOWED_DOMAINS,BUCKET_NAME=$BUCKET_NAME"\
  --set-secrets=JWT_SECRET=projects/$PROJECT_ID/secrets/$JWT_SECRET_NAME/versions/latest
```
