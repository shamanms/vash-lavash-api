#!/bin/bash
lambdas=("api" "order-notification")

case $1 in
        "--${lambdas[0]}")
                echo "Start ${lambdas[0]} lambda deployment..."
                gcloud functions deploy api \
                  --entry-point api \
                  --allow-unauthenticated \
                  --trigger-http \
                  --runtime nodejs16 \
                  --region europe-central2 \
                  --set-env-vars PROJECT_ID=$PROJECT_ID,ALLOWED_DOMAINS=$ALLOWED_DOMAINS,BUCKET_NAME=$BUCKET_NAME\
                  --set-secrets=JWT_SECRET=projects/$PROJECT_ID/secrets/$JWT_SECRET_NAME/versions/latest
                ;;
        "--${lambdas[1]}")
                echo "Start ${lambdas[1]} lambda deployment..."
                gcloud functions deploy order-notification \
                  --entry-point orderNotification \
                  --runtime nodejs16 \
                  --trigger-event "providers/cloud.firestore/eventTypes/document.create" \
                  --trigger-resource "projects/vash-lavash/databases/(default)/documents/orders/{order}" \
                  --region "europe-central2" \
                  --set-env-vars TELEGRAM_TOKEN=$TELEGRAM_TOKEN,GROUP_ID=$GROUP_ID,API_URL=$API_URL
                ;;
        *)
                echo "Passed incorrect parameter: '$1'"
                echo "Please pass one of the following lambda names:"
                for i in "${lambdas[@]}"
                do
                	echo "  --$i"
                done
                ;;
esac