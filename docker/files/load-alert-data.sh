#!/bin/bash

curl -H 'Content-Type: application/x-ndjson' -XPOST "${ELS_BULK_UPLOAD_API}" --data-binary @${1}
