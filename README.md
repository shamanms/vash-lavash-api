Before start setup env vars:

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
export BUCKET_NAME=...
```

## Deploying

1. Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install)
2. Authorize with `gcloud` and select the project:

```sh
gcloud auth login
gcloud config set project PROJECTNAME

gcloud compute project-info add-metadata \
    --metadata google-compute-default-region=europe-central2,google-compute-default-zone=europe-central2-b

gcloud auth application-default login // to save auth creds for the app
```

3. Use one of the deploy commands from the `package.json` file
