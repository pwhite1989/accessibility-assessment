#!/bin/bash

curl -I "${ELS_HOST}/${ELS_INDEX}" | grep 200

if [ $? -eq 1 ]
then
  echo "Elastic Seearch Index not found. Creating Index: ${ELS_INDEX}"
  curl -X PUT "${ELS_HOST}/${ELS_INDEX}" \
  -H 'Content-Type: application/json' \
  -d '{"mappings": {"alerts": { "properties": {  "testRun":  {"type":   "date", "format": "date_time"}}}}}'
else
  echo "Elastic Seearch Index: ${ELS_INDEX} already exists. Skipping Index creation."
fi

curl -H 'Content-Type: application/x-ndjson' -X POST "${ELS_BULK_UPLOAD_API}" --data-binary @${1}