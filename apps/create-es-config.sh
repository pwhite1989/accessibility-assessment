#!/bin/bash

curl -XPUT "http://localhost:9200/_template/logstash_settings" -H 'Content-Type: application/json' -d'
{
"order": 1,
"index_patterns": [
"logstash*"
],
"settings": {
"index": {
"aliases": {},
"mapping": {
"total_fields": {
"limit": "1024"
},
"ignore_malformed": "true"
},
"refresh_interval": "5s",
"number_of_shards": "3",
"query": {
"default_field": "all"
}
}
}
}'

curl -XPUT "http://localhost:9200/_template/logstash_mappings" -H 'Content-Type: application/json' -d'
{
"order": 1,
"index_patterns": [
"logstash*"
],
"mappings": {
"doc": {
"dynamic_templates": [
{
"strings": {
"mapping": {
"copy_to": "all",
"norms": false,
"fields": {
"raw": {
"ignore_above": 256,
"type": "keyword"
}
},
"type": "text"
},
"match_mapping_type": "string"
}
}
],
"properties": {
"timestamp": {
"type": "date"
},
"time": {
"type": "date"
},
"pid": {
"type": "integer"
},
"@version": {
"type": "integer"
},
"request_time": {
"type": "float"
},
"duration": {
"type": "float"
},
"logEvent.url": {
"type": "text"
},
"thread": {
"type": "text"
},
"body_bytes_sent": {
"type": "long"
},
"bytes_sent": {
"type": "long"
},
"request_length": {
"type": "long"
},
"server_port": {
"type": "long"
},
"status": {
"type": "long"
},
"upstream_response_length": {
"type": "long"
},
"upstream_status": {
"type": "long"
},
"upstream_response_time": {
"type": "float"
},
"result": {
"copy_to": "all",
"type": "text",
"norms": false,
"fields": {
"raw": {
"type": "keyword",
"ignore_above": 256
}
}
},
"http_host": {
"copy_to": "all",
"type": "text",
"norms": false,
"fields": {
"raw": {
"ignore_above": 256,
"type": "keyword",
"eager_global_ordinals": true
}
}
},
"process": {
"copy_to": "all",
"type": "text",
"norms": false,
"fields": {
"raw": {
"type": "keyword",
"ignore_above": 256
}
}
},
"@fields": {
"properties": {
"thread": {
"type": "long"
},
"args": {
"type": "text",
"norms": false,
"fields": {
"raw": {
"type": "keyword",
"ignore_above": 256
}
}
}
}
}
}
}
}
}'


