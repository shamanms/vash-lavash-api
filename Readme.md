Tiny sample demonstrating Google Cloud Functions with TypeScript.

## Deploying

Before deploying, need to authorize with `gcloud` and select the project:

```sh
gcloud auth login
gcloud config set project PROJECTNAME

gcloud auth application-default login
```

Setup env vars:
```sh
export PROJECT_ID=vash-lavash
export GCP_CREDENTIALS_FILE=$HOME/.config/gcloud/application_default_credentials.json
```

Then you can deploy with:

```sh
npm run deploy
```
