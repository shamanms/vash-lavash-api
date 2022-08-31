Tiny sample demonstrating Google Cloud Functions with TypeScript.

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
```

Then you can deploy with:

```sh
npm run build && npm run deploy
```
