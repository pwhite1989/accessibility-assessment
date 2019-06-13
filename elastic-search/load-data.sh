#!/bin/bash
curl -H 'Content-Type: application/x-ndjson' -XPOST 'localhost:9200/accessibility/violations/_bulk?pretty' --data-binary @test-upload.json
