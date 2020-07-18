<p>
<img src="https://i.imgur.com/dsBUUav.png" width="300" alt="AlgoSearch logo image" />
</p>

[![Website algosearch.io](https://img.shields.io/website-up-down-green-red/https/algosearch.io.svg)](https://algosearch.io/)
[![License](https://img.shields.io/badge/License-Apache%202.0-yellowgreen.svg)](https://opensource.org/licenses/Apache-2.0)

# AlgoSearch ([live deployment](https://algosearch.io))
AlgoSearch enables you to explore and search the [Algorand blockchain](https://www.algorand.com/) for transactions, addresses, blocks, assets, statistics, and more, in real-time. It's a simple, easy-to-deploy, and open-source block explorer to be used alongside an Algorand archival node.

**Dependencies**
* [Node.js](https://nodejs.org/en/) 8+ for use with server and front-end.
* [Nginx](https://www.nginx.com/) for reverse proxy to Node server.
* [Let's Encrypt](https://letsencrypt.org/) or your own SSL certificate solution. Traffic on AlgoSearch must pass through HTTPS.
* [go-algorand](https://github.com/algorand/go-algorand) for Algorand `goal` node (must support archival indexing).
* [CouchDB](https://couchdb.apache.org/) as database solution.

Work on AlgoSearch is funded by the [Algorand Foundation](https://algorand.foundation) through a grant to [Anish Agnihotri](https://github.com/anish-agnihotri). The scope of work includes the development of an open-source block explorer (AlgoSearch) and a WIP analytics platform.

# Run locally

## Linux / OSX
The [go-algorand](https://github.com/algorand/go-algorand) node currently aims to support only Linux and OSX environments for development.

## Disclaimer
Simpler installation instructions, a hands-on guide, and a one-click deploy Docker image will be published upon final completion of AlgoSearch.

## Environment setup
1. Install Nginx, certbot, CouchDB, go-algorand, and setup SSL with Let's Encrypt.
2. You can use following sample Nginx configuration:

```
server {
    server_name YOUR_WEBSITE_DOMAIN;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
    }
    location /v1 {
        proxy_pass http://localhost:8080/v1;
        proxy_http_version 1.1;
    }

    # Certbot configuration automatically here

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "origin";
}

server {
    if ($host = YOUR_WEBSITE_DOMAIN) {
        return 301 https://$host$request_uri;
    }

    listen 80 default_server;
    listen [::]:80 default_server;

    server_name algosearch.io;
    return 404;
}
```

## AlgoSearch setup
**install**
```
# Run in folder root directory
npm install
```

**configure**
1. Enter your sitename in `src/constants.js`.
2. Copy `service/global.sample.js` to `service/global.js` and enter your go-algorand node details.

**build**
```
# Run in folder root directory
npm run build
```

# Documentation
The [Wiki](https://github.com/Anish-Agnihotri/algosearch/wiki) is currently under construction.

# License
[![License](https://img.shields.io/badge/License-Apache%202.0-yellowgreen.svg)](https://opensource.org/licenses/Apache-2.0)

Copyright (C) 2020, Anish Agnihotri.